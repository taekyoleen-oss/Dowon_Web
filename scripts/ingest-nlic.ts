#!/usr/bin/env tsx
/**
 * Ingest 국가법령정보 OPEN API content into Supabase, embedding each
 * article so library-search can union it with cases/columns.
 *
 *   $ npm run ingest:nlic            # default 법령 list, missing only
 *   $ npm run ingest:nlic -- --force # re-embed even if already present
 *
 * Targets two corpora:
 *   1. Statute articles for the LAW_LIST below (대상 법령 ~10개)
 *   2. Skipped here — precedents ingest will be a follow-up script when
 *      we pick the keyword set
 *
 * Idempotent: rows are upserted on (law_id, article_number) and embeddings
 * are skipped when present unless --force is passed.
 */
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import {
  searchLaws,
  fetchLawBody,
  flattenLawArticles,
  type NlicLawHit,
} from "../lib/data-sources/nlic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const NLIC_KEY = process.env.NLIC_API_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("[nlic] Missing Supabase env vars.");
  process.exit(1);
}
if (!OPENAI_KEY) {
  console.error("[nlic] Missing OPENAI_API_KEY.");
  process.exit(1);
}
if (!NLIC_KEY) {
  console.error(
    "[nlic] Missing NLIC_API_KEY — set the OC value you registered at open.law.go.kr."
  );
  process.exit(1);
}

const force = process.argv.includes("--force");
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const openai = new OpenAI({ apiKey: OPENAI_KEY });

const EMBED_MODEL = "text-embedding-3-small";

/**
 * Starter law list — chosen for direct relevance to 도원's practice areas
 * (보험, 의료, 자동차, 채권추심, 형사). Add or trim freely; each run only
 * touches the laws in this array.
 */
const LAW_LIST = [
  "자동차손해배상 보장법",
  "보험업법",
  "상법",                 // 제4편 보험 등
  "민법",
  "민사집행법",
  "민사소송법",
  "의료법",
  "의료사고 피해구제 및 의료분쟁 조정 등에 관한 법률",
  "형법",
  "형사소송법",
];

const CHUNK = 20;
function chunk<T>(a: T[], n: number) {
  const out: T[][] = [];
  for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n));
  return out;
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: texts,
    encoding_format: "float",
  });
  return res.data.map((d) => d.embedding);
}

async function resolveLawHit(name: string): Promise<NlicLawHit | null> {
  const json = await searchLaws(name, 5);
  // NLIC wraps the array under LawSearch.law[]
  const hits: NlicLawHit[] = json?.LawSearch?.law ?? json?.LawSearch?.Law ?? [];
  // Pick the exact name match if present, else the first current 법률
  const exact = hits.find((h) => h.법령명한글?.trim() === name);
  return exact ?? hits[0] ?? null;
}

async function ingestLaw(name: string) {
  console.log(`\n[nlic] ── ${name}`);
  const hit = await resolveLawHit(name);
  if (!hit) {
    console.warn(`[nlic]   no hit — skipping`);
    return;
  }
  const body = await fetchLawBody({ MST: hit.법령ID });
  const articles = flattenLawArticles(body);
  console.log(`[nlic]   ${hit.법령명한글} — ${articles.length} articles`);

  // Filter out articles already embedded unless --force
  const lawId = articles[0]?.lawId;
  if (!lawId) return;

  let existing: Set<string> = new Set();
  if (!force) {
    const { data } = await supabase
      .from("legal_provisions")
      .select("article_number")
      .eq("law_id", lawId)
      .not("embedding", "is", null);
    existing = new Set((data ?? []).map((r) => r.article_number));
  }

  const toEmbed = articles.filter((a) => !existing.has(a.articleNumber));
  if (toEmbed.length === 0) {
    console.log(`[nlic]   all ${articles.length} articles already embedded`);
    return;
  }
  console.log(`[nlic]   embedding ${toEmbed.length} article(s)`);

  for (const batch of chunk(toEmbed, CHUNK)) {
    const inputs = batch.map(
      (a) => `${a.lawName} ${a.articleNumber} ${a.articleTitle}\n${a.articleBody}`
    );
    const embeddings = await embedBatch(inputs);

    const rows = batch.map((a, i) => ({
      law_id: a.lawId,
      law_name: a.lawName,
      article_number: a.articleNumber,
      article_title: a.articleTitle || null,
      article_body: a.articleBody,
      promulgation_date: parseDate(a.promulgationDate),
      enforcement_date: parseDate(a.enforcementDate),
      embedding: embeddings[i],
      source_url: `http://www.law.go.kr/DRF/lawService.do?OC=${process.env.NLIC_API_KEY}&target=law&type=HTML&MST=${a.lawId}`,
    }));

    const { error } = await supabase
      .from("legal_provisions")
      .upsert(rows, { onConflict: "law_id,article_number" });
    if (error) {
      console.error(`[nlic]   upsert error:`, error.message);
      throw error;
    }
  }
  console.log(`[nlic]   ✓ ingested ${toEmbed.length}`);
}

/** NLIC dates are usually "YYYYMMDD" strings; convert to ISO for Postgres. */
function parseDate(v?: string): string | null {
  if (!v || v.length !== 8) return null;
  return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
}

async function main() {
  console.log(`[nlic] target: ${LAW_LIST.length} laws · force=${force}`);
  for (const name of LAW_LIST) {
    try {
      await ingestLaw(name);
    } catch (e) {
      console.error(`[nlic] ${name} failed:`, e instanceof Error ? e.message : e);
    }
  }
  console.log(`\n[nlic] done.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
