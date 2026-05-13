/**
 * Client-side consumer for the NDJSON wire emitted by lib/ai/stream.ts.
 *
 * Reads chunks from a fetch Response body, splits on newlines, parses each
 * line as JSON, and dispatches to the provided callbacks.
 *
 *   await consumeNdjsonStream(res, {
 *     onToken: (text) => appendToAssistantMessage(text),
 *     onState: (payload) => applyState(payload),
 *     onError: (err) => showError(err),
 *   });
 */

export type StreamHandlers = {
  onToken?: (text: string) => void;
  onState?: (payload: Record<string, unknown>) => void;
  onError?: (message: string) => void;
};

export async function consumeNdjsonStream(
  res: Response,
  handlers: StreamHandlers
): Promise<void> {
  if (!res.ok || !res.body) {
    handlers.onError?.(`HTTP ${res.status}`);
    return;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (value) {
        buf += decoder.decode(value, { stream: !done });
        // Process complete lines
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line) continue;
          try {
            const obj = JSON.parse(line) as { type?: string } & Record<string, unknown>;
            if (obj.type === "token" && typeof obj.text === "string") {
              handlers.onToken?.(obj.text);
            } else if (obj.type === "state") {
              const { type: _t, ...rest } = obj;
              void _t;
              handlers.onState?.(rest);
            } else if (obj.type === "error" && typeof obj.message === "string") {
              handlers.onError?.(obj.message);
            }
          } catch {
            // Tolerate malformed lines silently — the next valid one will recover.
          }
        }
      }
      if (done) break;
    }
    // Flush any trailing buffered content (rare — server always newline-terminates).
    if (buf.trim()) {
      try {
        const obj = JSON.parse(buf.trim()) as { type?: string } & Record<string, unknown>;
        if (obj.type === "state") {
          const { type: _t, ...rest } = obj;
          void _t;
          handlers.onState?.(rest);
        }
      } catch {
        /* ignore */
      }
    }
  } catch (e) {
    handlers.onError?.(e instanceof Error ? e.message : "Stream read failed");
  }
}
