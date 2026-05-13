#!/usr/bin/env tsx
/**
 * Generate OpenAI embeddings for published cases and columns and store them
 * in the `embedding` vector(1536) column. Idempotent — re-run any time;
 * rows that already have an embedding are skipped unless --force.
 *
 *   $ npm run embeddings           # missing only
 *   $ npm run embeddings -- --force   # all rows
 */
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("[embed] Missing Supabase env vars.");
  process.exit(1);
}
if (!OPENAI_KEY) {
  console.error("[embed] Missing OPENAI_API_KEY.");
  process.exit(1);
}

const force = process.argv.includes("--force");
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const openai = new OpenAI({ apiKey: OPENAI_KEY });

const MODEL = "text-embedding-3-small";

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({
    model: MODEL,
    input: texts,
    encoding_format: "float",
  });
  return res.data.map((d) => d.embedding);
}

async function processTable(
  table: "cases" | "columns",
  selectCols: string,
  buildText: (row: Record<string, unknown>) => string
) {
  let query = supabase.from(table).select(selectCols).eq("is_published", true);
  if (!force) query = query.is("embedding", null);
  const { data, error } = await query;
  if (error) throw new Error(`${table} fetch: ${error.message}`);
  // Dynamic .select(string) returns a loose type; coerce explicitly.
  const rows = (data ?? []) as unknown as Array<Record<string, unknown>>;
  if (rows.length === 0) {
    console.log(`[embed] ${table}: nothing to do`);
    return;
  }
  console.log(`[embed] ${table}: ${rows.length} rows to embed`);

  for (const batch of chunk(rows, 20)) {
    const texts = batch.map(buildText);
    const vectors = await embedBatch(texts);
    for (let i = 0; i < batch.length; i++) {
      const { error } = await supabase
        .from(table)
        .update({ embedding: vectors[i] as unknown as string })
        .eq("id", batch[i].id as string);
      if (error) {
        console.error(`[embed] ${table} update ${String(batch[i].slug)}:`, error.message);
      } else {
        process.stdout.write(`  ✓ ${String(batch[i].slug)}\n`);
      }
    }
  }
}

async function main() {
  console.log("[embed] model:", MODEL, force ? "(force)" : "(missing only)");

  await processTable(
    "cases",
    "id, slug, title, issue, conclusion, insight, embedding",
    (r) => [r.title, r.issue, r.conclusion, r.insight].filter(Boolean).join("\n\n")
  );
  await processTable(
    "columns",
    "id, slug, title, excerpt, embedding",
    (r) => [r.title, r.excerpt].filter(Boolean).join("\n\n")
  );

  console.log("[embed] ✓ done");
}

main().catch((e) => {
  console.error("[embed] FAILED:", e);
  process.exit(1);
});
