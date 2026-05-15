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
  searchAdmrul,
  fetchAdmrulBody,
  flattenAdmrulArticles,
  type NlicLawHit,
  type NlicAdmrulHit,
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
 * Law list — picked for direct relevance to 도원's practice areas.
 * Grouped by domain so we can prune or extend by section in future
 * passes. The script is idempotent, so adding a new entry only
 * embeds that new law on the next run.
 *
 * Sections include both the parent 법률 and its 시행령·시행규칙 where
 * available — the 시행령 carries the operational detail (e.g. 자본금
 * 기준, 등록요건의 구체 항목, 보고서식) that the parent law delegates
 * via "대통령령으로 정한다" clauses, so omitting them would leave the
 * search results half-answered.
 */
const LAW_LIST = [
  // ── Phase 1 — civil & criminal foundations ───────────────────────
  "민법",
  "민사소송법",
  "민사집행법",
  "상법",                        // 제4편 보험 등 핵심
  "형법",
  "형사소송법",

  // ── Phase 1 — insurance & auto core (parent + 시행령 + 시행규칙) ──
  "보험업법",
  "보험업법 시행령",
  "보험업법 시행규칙",
  "자동차손해배상 보장법",
  "자동차손해배상 보장법 시행령",
  "자동차손해배상 보장법 시행규칙",

  // ── Phase 1 — medical core ───────────────────────────────────────
  "의료법",
  "의료법 시행령",
  "의료법 시행규칙",
  "의료사고 피해구제 및 의료분쟁 조정 등에 관한 법률",
  "의료사고 피해구제 및 의료분쟁 조정 등에 관한 법률 시행령",
  "의료사고 피해구제 및 의료분쟁 조정 등에 관한 법률 시행규칙",

  // ── Phase 2 — auto / traffic liability ───────────────────────────
  "교통사고처리 특례법",          // 형사 과실 처리의 출발점
  "교통사고처리 특례법 시행령",
  "도로교통법",                    // 사고 책임·과실 비율 근거
  "도로교통법 시행령",
  "도로교통법 시행규칙",
  "자동차관리법",                  // 차량 결함·관리 분쟁
  "자동차관리법 시행령",
  "자동차관리법 시행규칙",

  // ── Phase 2 — insurance adjacency ────────────────────────────────
  "보험사기방지 특별법",          // SIU 협업의 핵심 근거 법
  "보험사기방지 특별법 시행령",
  "국민건강보험법",                // 의료비·구상 분쟁
  "국민건강보험법 시행령",
  "국민건강보험법 시행규칙",
  "산업재해보상보험법",            // 산재 보상·구상
  "산업재해보상보험법 시행령",
  "산업재해보상보험법 시행규칙",

  // ── Phase 2 — medical adjacency ──────────────────────────────────
  "응급의료에 관한 법률",
  "응급의료에 관한 법률 시행령",
  "응급의료에 관한 법률 시행규칙",
  "약사법",                        // 의약품 관련 의료분쟁
  "약사법 시행령",
  "약사법 시행규칙",

  // ── Phase 2 — recovery & restructuring ───────────────────────────
  "채무자 회생 및 파산에 관한 법률",
  "채무자 회생 및 파산에 관한 법률 시행령",
  "신용정보의 이용 및 보호에 관한 법률",
  "신용정보의 이용 및 보호에 관한 법률 시행령",
  "신용정보의 이용 및 보호에 관한 법률 시행규칙",
];

/**
 * 행정규칙 list — 금융위·금감원·복지부 등의 고시·세칙·예규.
 * 법률·시행령 위임에 따라 실제 운영 기준이 여기에 적혀 있어, 자문 자리에서
 * "법령 어디에서 정해놓았느냐"는 질문이 사실은 이 묶음에서 답이 나옵니다.
 */
/**
 * Names below are the exact NLIC `행정규칙명` strings — verified against
 * the search index. Whitespace / 조사 matter (e.g. "조정기준" not "조정
 * 기준") because resolveAdmrulHit fails closed on ambiguity. If you add
 * more here, search the portal first to confirm the canonical name.
 */
const ADMRUL_LIST = [
  // 보험·금융
  "보험업감독규정",                // 금융위 고시 — 보험업법의 운영기준 본체
  // 의료·건보
  "행위 치료재료 등의 결정 및 조정기준",      // 복지부 — 신의료기술 평가 (NLIC: "조정기준" 띄어쓰기 없음)
  // 자동차·도로
  "자동차보험진료수가에 관한 기준",           // 국토부·복지부 — 진료수가 기준 (NLIC: "자동차보험진료수가" 붙여 쓰기)
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

/** Strip every whitespace char so "자동차손해배상 보장법" == "자동차손해배상보장법". */
function normalize(s: string): string {
  return (s ?? "").replace(/\s+/g, "");
}

/**
 * Resolve a law name to a single NLIC hit. Fails closed — returns null
 * if no high-confidence match. We refuse to silently fall back to a
 * random top hit, which is what produced the wrong-law ingest (유료
 * 도로법 etc.) on the first run.
 *
 * Match priority:
 *   1. Whitespace-insensitive exact name match
 *   2. 법령명한글 starts with target (handles "민법" → "민법 / 시행령" etc.)
 *   3. Give up and log the top candidates so the operator can fix LAW_LIST.
 */
async function resolveLawHit(name: string): Promise<NlicLawHit | null> {
  const json = await searchLaws(name, 100);
  const raw = json?.LawSearch?.law ?? json?.LawSearch?.Law ?? [];
  const hits: NlicLawHit[] = Array.isArray(raw) ? raw : [raw];

  if (hits.length === 0) {
    console.warn(`[nlic]   no NLIC results for "${name}"`);
    return null;
  }

  const target = normalize(name);

  // 1. Exact (whitespace-insensitive) name match
  const exact = hits.find((h) => normalize(h.법령명한글) === target);
  if (exact) return exact;

  // 2. Prefix match — prefer 법률 over 시행령·시행규칙
  const prefixed = hits
    .filter((h) => normalize(h.법령명한글).startsWith(target))
    .sort((a, b) => {
      const aIsAct = (a.법령구분명 ?? "").includes("법률") ? 0 : 1;
      const bIsAct = (b.법령구분명 ?? "").includes("법률") ? 0 : 1;
      return aIsAct - bIsAct;
    })[0];
  if (prefixed) return prefixed;

  // 3. Fail closed — log top candidates so we can adjust LAW_LIST
  const top = hits
    .slice(0, 5)
    .map((h) => `${h.법령명한글} [${h.법령구분명 ?? "—"}]`)
    .join(", ");
  console.warn(`[nlic]   no confident match for "${name}". Top: ${top}`);
  return null;
}

/**
 * Resolve an admrul name to a single NLIC hit. Same fail-closed posture
 * as resolveLawHit. Match priority:
 *   1. Whitespace-insensitive exact name match
 *   2. Prefix match (preferring 고시/예규 over older 훈령)
 *   3. Fail and log top candidates
 */
async function resolveAdmrulHit(name: string): Promise<NlicAdmrulHit | null> {
  const json = await searchAdmrul(name, 50);
  const raw =
    json?.AdmRulSearch?.admrul ??
    json?.AdmRulSearch?.AdmRul ??
    [];
  const hits: NlicAdmrulHit[] = Array.isArray(raw) ? raw : [raw];

  if (hits.length === 0) {
    console.warn(`[admrul]   no NLIC results for "${name}"`);
    return null;
  }

  const target = normalize(name);
  const exact = hits.find((h) => normalize(h.행정규칙명) === target);
  if (exact) return exact;

  const prefixed = hits
    .filter((h) => normalize(h.행정규칙명).startsWith(target))[0];
  if (prefixed) return prefixed;

  const top = hits
    .slice(0, 5)
    .map((h) => `${h.행정규칙명} [${h.행정규칙종류 ?? "—"}]`)
    .join(", ");
  console.warn(`[admrul]   no confident match for "${name}". Top: ${top}`);
  return null;
}

async function ingestAdmrul(name: string) {
  console.log(`\n[admrul] ── ${name}`);
  const hit = await resolveAdmrulHit(name);
  if (!hit) {
    console.warn(`[admrul]   no hit — skipping`);
    return;
  }
  const ruleId = hit.행정규칙일련번호;
  console.log(
    `[admrul]   matched → ${hit.행정규칙명} (${hit.행정규칙종류 ?? "?"}, ID=${ruleId})`
  );

  const body = await fetchAdmrulBody({ ID: ruleId });
  const articles = flattenAdmrulArticles(body, ruleId);
  console.log(`[admrul]   ${hit.행정규칙명} — ${articles.length} articles`);
  if (articles.length === 0) {
    console.warn(`[admrul]   empty body (no 조문내용) — skipping`);
    return;
  }

  let existing: Set<string> = new Set();
  if (!force) {
    const { data } = await supabase
      .from("legal_provisions")
      .select("article_number")
      .eq("law_id", ruleId)
      .not("embedding", "is", null);
    existing = new Set((data ?? []).map((r) => r.article_number));
  }

  const toEmbed = articles.filter((a) => !existing.has(a.articleNumber));
  if (toEmbed.length === 0) {
    console.log(`[admrul]   all ${articles.length} articles already embedded`);
    return;
  }
  console.log(`[admrul]   embedding ${toEmbed.length} article(s)`);

  for (const batch of chunk(toEmbed, CHUNK)) {
    const inputs = batch.map(
      (a) => `${a.lawName} 제${a.articleNumber}조 ${a.articleTitle}\n${a.articleBody}`
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
      // Admrul detail page lives under /행정규칙/ on law.go.kr
      source_url: `https://www.law.go.kr/행정규칙/${encodeURIComponent(a.lawName)}`,
    }));

    const { error } = await supabase
      .from("legal_provisions")
      .upsert(rows, { onConflict: "law_id,article_number" });
    if (error) {
      console.error(`[admrul]   upsert error:`, error.message);
      throw error;
    }
  }
  console.log(`[admrul]   ✓ ingested ${toEmbed.length}`);
}

async function ingestLaw(name: string) {
  console.log(`\n[nlic] ── ${name}`);
  const hit = await resolveLawHit(name);
  if (!hit) {
    console.warn(`[nlic]   no hit — skipping`);
    return;
  }
  console.log(
    `[nlic]   matched → ${hit.법령명한글} (${hit.법령구분명 ?? "?"}, ID=${hit.법령ID})`
  );
  // ⚠ Pass `법령ID` as ID, not MST — they're different identifiers in NLIC.
  // Using MST=hit.법령ID returns a completely different law (whose MST
  // happens to share the same numeric value), which is what produced the
  // wrong-name ingest earlier.
  const body = await fetchLawBody({ ID: hit.법령ID });
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
      source_url: `http://www.law.go.kr/DRF/lawService.do?OC=${process.env.NLIC_API_KEY}&target=law&type=HTML&ID=${a.lawId}`,
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
  console.log(
    `[nlic] target: ${LAW_LIST.length} laws + ${ADMRUL_LIST.length} admrul · force=${force}`
  );
  for (const name of LAW_LIST) {
    try {
      await ingestLaw(name);
    } catch (e) {
      console.error(`[nlic] ${name} failed:`, e instanceof Error ? e.message : e);
    }
  }
  for (const name of ADMRUL_LIST) {
    try {
      await ingestAdmrul(name);
    } catch (e) {
      console.error(`[admrul] ${name} failed:`, e instanceof Error ? e.message : e);
    }
  }
  console.log(`\n[nlic] done.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
