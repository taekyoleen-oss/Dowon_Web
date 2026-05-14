import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import { LawAsk } from "@/components/library/law-ask";
import {
  LawCatalogCard,
  type LawCatalogEntry,
} from "@/components/library/law-catalog-card";

export const metadata = {
  title: "법령 카탈로그",
  description:
    "도원이 검색에 사용하는 국가법령정보 코퍼스 — 보험·의료·교통·민사·형사 등 핵심 법령 20여 종.",
};

// Re-fetch every 6h. The corpus changes only when we re-run the ingest
// script, so frequent revalidation is wasteful.
export const revalidate = 60 * 60 * 6;

async function getLawCatalog(): Promise<LawCatalogEntry[]> {
  if (!hasSupabaseConfig()) return [];
  const supabase = getServerSupabase();
  // No native group-by in supabase-js v2 — we pull all rows once and
  // aggregate in code. With ~5,000 articles across 20 laws this is
  // sub-100ms and the response is cached.
  const { data, error } = await supabase
    .from("legal_provisions")
    .select("law_id, law_name, enforcement_date");
  if (error || !data) {
    console.error("[laws] catalog fetch:", error?.message);
    return [];
  }

  const grouped = new Map<string, LawCatalogEntry>();
  for (const row of data as Array<{
    law_id: string;
    law_name: string;
    enforcement_date: string | null;
  }>) {
    const existing = grouped.get(row.law_id);
    if (existing) {
      existing.article_count += 1;
      if (
        row.enforcement_date &&
        (!existing.latest_enforcement ||
          row.enforcement_date > existing.latest_enforcement)
      ) {
        existing.latest_enforcement = row.enforcement_date;
      }
    } else {
      grouped.set(row.law_id, {
        law_id: row.law_id,
        law_name: row.law_name,
        article_count: 1,
        latest_enforcement: row.enforcement_date,
      });
    }
  }
  return Array.from(grouped.values()).sort(
    (a, b) => b.article_count - a.article_count
  );
}

export default async function LawsPage() {
  const laws = await getLawCatalog();
  const lawNames = laws.map((l) => l.law_name);
  const totalArticles = laws.reduce((s, l) => s + l.article_count, 0);

  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>LAWS · 법령</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Statute corpus.
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">법령 카탈로그</p>
        <p className="mt-8 max-w-[42em] font-serif-ko text-body-lg text-ink-soft leading-base">
          도원이 검색·자문에 활용하는 국가법령정보 코퍼스입니다. 보험·의료·교통·민사·형사
          핵심 법령 <strong className="text-ink">{laws.length}종</strong> ·{" "}
          <strong className="text-ink">{totalArticles.toLocaleString("ko-KR")}개</strong>{" "}
          조문이 임베딩되어 있어, 자연어로 질문하면 관련 조문을 찾아드립니다.
        </p>

        {/* Q&A — natural language → relevant articles */}
        <div className="mt-14">
          <div className="mb-5 flex items-baseline gap-3">
            <Eyebrow>ASK · 자연어 질의</Eyebrow>
            <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
              OpenAI 임베딩 + Supabase pgvector
            </span>
          </div>
          <LawAsk lawNames={lawNames} />
        </div>

        {/* Catalog grid */}
        <div className="mt-20" id="catalog">
          <div className="flex items-baseline justify-between border-b border-paper-3 pb-3">
            <p className="label-mono text-gold">CATALOG · 적재된 법령</p>
            <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
              {laws.length}종
            </span>
          </div>

          {laws.length === 0 ? (
            <div className="mt-10 border border-dashed border-paper-3 rounded-md p-12 text-center">
              <p className="font-serif-ko text-h3 text-ink-soft">
                적재된 법령이 없습니다.
              </p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                Supabase 환경변수 + npm run ingest:nlic 후 자동으로 채워집니다.
              </p>
            </div>
          ) : (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {laws.map((l) => (
                <li key={l.law_id} className="h-full">
                  <LawCatalogCard law={l} />
                </li>
              ))}
            </ul>
          )}

          <p className="mt-8 font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
            출처 · 국가법령정보센터 (law.go.kr) · 카드 클릭 시 원문 페이지로 이동
          </p>
        </div>
      </Container>
    </section>
  );
}
