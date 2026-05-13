/**
 * Robust JSON extraction from LLM responses.
 *
 * Models occasionally wrap JSON in ```json fences, prepend prose, or output
 * extra trailing tokens. This helper attempts increasingly aggressive
 * recoveries before giving up.
 */
export function extractJson<T = unknown>(raw: string): T {
  if (!raw || typeof raw !== "string") throw new Error("Empty LLM response");

  // 1) Plain parse
  try { return JSON.parse(raw) as T; } catch { /* fall through */ }

  // 2) Strip markdown code fences (```json ... ``` or ``` ... ```)
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()) as T; } catch { /* fall through */ }
  }

  // 3) Brace-balanced extraction starting at the first '{'
  const start = raw.indexOf("{");
  if (start < 0) throw new Error("No JSON object found in LLM response");
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < raw.length; i++) {
    const ch = raw[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const candidate = raw.slice(start, i + 1);
        try { return JSON.parse(candidate) as T; } catch { break; }
      }
    }
  }

  // 4) Last-resort: greedy from first '{' to last '}'
  const end = raw.lastIndexOf("}");
  if (end > start) {
    try { return JSON.parse(raw.slice(start, end + 1)) as T; } catch { /* fall through */ }
  }

  console.error("[extractJson] raw response was:", raw.slice(0, 500));
  throw new Error("Could not parse JSON from LLM response");
}

/** Concatenate text content blocks from an Anthropic response. */
export function textOf(content: Array<{ type: string } & Record<string, unknown>>): string {
  return content
    .filter((c) => c.type === "text")
    .map((c) => (typeof c.text === "string" ? c.text : ""))
    .join("");
}
