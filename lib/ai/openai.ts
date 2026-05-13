/**
 * OpenAI client — used for embeddings only (text-embedding-3-small).
 * Reasoning/chat goes to Anthropic per PRD §7.1.
 */
import OpenAI from "openai";

let _cached: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (_cached) return _cached;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set. Configure in .env.local.");
  _cached = new OpenAI({ apiKey });
  return _cached;
}

export function hasOpenAIConfig() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIMS = 1536;

/** Generate an embedding for a single text. Returns 1536-dim float array. */
export async function embed(text: string): Promise<number[]> {
  const openai = getOpenAI();
  const res = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
    encoding_format: "float",
  });
  return res.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const openai = getOpenAI();
  const res = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
    encoding_format: "float",
  });
  return res.data.map((d) => d.embedding);
}
