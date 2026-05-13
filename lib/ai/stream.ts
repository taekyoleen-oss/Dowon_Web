/**
 * Streaming helpers for AI chat endpoints.
 *
 * Wire format: NDJSON (newline-delimited JSON), text/plain content-type.
 *
 * Server emits one event per line:
 *   { "type": "token", "text": "..." }    — user-facing reply token
 *   { "type": "state", ...payload }       — final structured state (last line)
 *   { "type": "error", "message": "..." } — fatal error (terminates stream)
 *
 * The model is instructed to output reply text first, then a literal
 * "\n%%STATE%%\n" marker, then a single JSON object with the structured
 * state. The server streams everything before the marker as `token` events
 * and emits a single `state` event after parsing the JSON tail.
 */

import type Anthropic from "@anthropic-ai/sdk";

export const STATE_MARKER = "%%STATE%%";

export const SHARED_STREAM_INSTRUCTIONS = `[OUTPUT FORMAT — required]
Reply with the user-facing answer first as plain Korean text. Then on its own line emit the exact marker:
${STATE_MARKER}
Then emit a single JSON object on the following lines with the structured state. Do not wrap the JSON in code fences. The marker line must appear exactly once and only after the reply text.`;

type StateLike = Record<string, unknown>;

/**
 * Consume an Anthropic streaming Message and return a Web ReadableStream
 * of NDJSON events. Reply tokens are emitted live; the JSON tail is parsed
 * and emitted as a single `state` event at the end.
 *
 * `enrich` lets the caller add server-derived fields (e.g. merged state,
 * computed completeness, sessionId) to the final state event.
 */
export function ndjsonFromAnthropicStream<TState extends StateLike>(
  source: AsyncIterable<Anthropic.Messages.RawMessageStreamEvent>,
  opts: {
    enrich?: (parsedState: TState | null, fullReply: string) => Record<string, unknown> | Promise<Record<string, unknown>>;
    onFinal?: (parsedState: TState | null, fullReply: string) => void | Promise<void>;
  } = {}
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      };

      let buf = "";
      let beforeMarker = "";
      let afterMarker = "";
      let pastMarker = false;
      let lastFlushed = 0; // index of how much of beforeMarker has been emitted

      // Heuristic: don't emit a tail that might be part of the marker.
      // We hold back the trailing portion equal to the marker length.
      const HOLDBACK = STATE_MARKER.length + 2; // include surrounding newlines

      const flushTokens = () => {
        if (pastMarker) return;
        const safeEnd = Math.max(0, beforeMarker.length - HOLDBACK);
        if (safeEnd > lastFlushed) {
          const slice = beforeMarker.slice(lastFlushed, safeEnd);
          if (slice) send({ type: "token", text: slice });
          lastFlushed = safeEnd;
        }
      };

      try {
        for await (const event of source) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const token = event.delta.text;
            buf += token;

            if (!pastMarker) {
              const idx = buf.indexOf(STATE_MARKER);
              if (idx >= 0) {
                beforeMarker = buf.slice(0, idx).replace(/\n+$/, "");
                // emit everything that hasn't been flushed yet
                if (beforeMarker.length > lastFlushed) {
                  send({
                    type: "token",
                    text: beforeMarker.slice(lastFlushed),
                  });
                  lastFlushed = beforeMarker.length;
                }
                afterMarker = buf.slice(idx + STATE_MARKER.length);
                pastMarker = true;
              } else {
                beforeMarker = buf;
                flushTokens();
              }
            } else {
              afterMarker += token;
            }
          }
        }

        // Stream ended. Flush any remaining held-back text.
        if (!pastMarker && beforeMarker.length > lastFlushed) {
          send({ type: "token", text: beforeMarker.slice(lastFlushed) });
        }

        // Parse the JSON tail. Best effort — never throws to the client.
        let parsedState: TState | null = null;
        if (pastMarker) {
          const jsonText = afterMarker.trim();
          try {
            const start = jsonText.indexOf("{");
            const end = jsonText.lastIndexOf("}");
            if (start >= 0 && end > start) {
              parsedState = JSON.parse(jsonText.slice(start, end + 1));
            }
          } catch (e) {
            console.warn("[stream] failed to parse state JSON:", e);
          }
        }

        const enriched = opts.enrich
          ? await opts.enrich(parsedState, beforeMarker)
          : {};
        send({ type: "state", ...enriched });

        if (opts.onFinal) {
          try {
            await opts.onFinal(parsedState, beforeMarker);
          } catch (e) {
            console.warn("[stream] onFinal hook error:", e);
          }
        }
      } catch (e) {
        send({
          type: "error",
          message: e instanceof Error ? e.message : "Stream failed",
        });
      } finally {
        controller.close();
      }
    },
  });
}

export function ndjsonResponse(stream: ReadableStream<Uint8Array>): Response {
  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}

/** Helper for non-streaming stub fallbacks. */
export function ndjsonStubResponse(events: Array<Record<string, unknown>>): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const e of events) {
        controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));
      }
      controller.close();
    },
  });
  return ndjsonResponse(stream);
}
