"use client";

import * as React from "react";
import { Search, Sparkles } from "lucide-react";
import { libraryItems } from "@/lib/data/library";
import { LibraryCard } from "./library-card";
import { LawResultCard, type LawResult } from "./law-result-card";
import { cn } from "@/lib/utils";

const sampleQueries = [
  "무보험차상해 약관이 면책되는 경우",
  "구상권 행사 가능 시점",
  "의무기록 위·변조 판단",
  "장기보험 진단 확정 시점",
];

/**
 * Keyword-based MVP. Phase 2 will POST to /api/ai/library-search and rerank
 * via Claude. The UI shape is identical so the swap is non-breaking.
 */
function scoreItem(it: (typeof libraryItems)[number], q: string) {
  if (!q) return 0;
  const text = (it.title + " " + it.excerpt + " " + (it.issue ?? "") + " " + (it.insight ?? "")).toLowerCase();
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  let score = 0;
  for (const t of terms) {
    const idx = text.indexOf(t);
    if (idx >= 0) score += 1 + (idx < 60 ? 0.5 : 0);
  }
  return score;
}

export function LibrarySemanticSearch() {
  const [query, setQuery] = React.useState("");
  const [submitted, setSubmitted] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [apiResults, setApiResults] = React.useState<typeof libraryItems>([]);
  const [lawResults, setLawResults] = React.useState<LawResult[]>([]);

  React.useEffect(() => {
    if (!submitted) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/ai/library-search", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ query: submitted, top_k: 10 }),
        });
        if (!res.ok) throw new Error("api");
        const data = await res.json();
        if (cancelled) return;
        // Map library results back to LibraryItem by slug.
        const bySlug = new Map(libraryItems.map((it) => [it.slug, it]));
        const items = (data.results ?? [])
          .map((r: { id: string }) => bySlug.get(r.id))
          .filter((x: unknown): x is (typeof libraryItems)[number] => !!x);
        setApiResults(items);
        // Law articles from match_legal_provisions — no local mapping needed.
        setLawResults((data.laws ?? []) as LawResult[]);
      } catch {
        // Fall back to local keyword scoring (laws unavailable offline).
        if (cancelled) return;
        setApiResults(
          libraryItems
            .map((it) => ({ it, s: scoreItem(it, submitted) }))
            .filter(({ s }) => s > 0)
            .sort((a, b) => b.s - a.s)
            .slice(0, 10)
            .map(({ it }) => it)
        );
        setLawResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [submitted]);

  const results = apiResults;

  const submit = (q: string) => {
    setQuery(q);
    setSubmitted(q);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
      >
        <div className="relative">
          <Search size={18} aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="자연어로 질문해보세요 — 예: '무보험차상해 면책이 인정되는 경우'"
            className={cn(
              "w-full pl-12 pr-32 py-5",
              "bg-paper border border-paper-3 rounded-sm",
              "font-serif-ko text-body-lg text-ink placeholder:text-ink-mute",
              "focus:border-ink focus:outline-none"
            )}
          />
          <button
            type="submit"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "inline-flex items-center gap-1.5 px-5 py-2.5",
              "bg-gold-deep text-paper rounded-sm font-sans-ko text-[13.5px] font-medium tracking-wide",
              "hover:bg-gold transition-colors duration-fast"
            )}
          >
            <Sparkles size={14} /> 검색
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">샘플:</span>
        {sampleQueries.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => submit(q)}
            className="font-serif-ko text-[13.5px] text-ink-soft border-b border-paper-3 hover:text-ink hover:border-ink transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-label text-gold-deep">
        ⓘ AI 시맨틱 검색 — 칼럼·판례 + 국가법령정보(법령 조문)을 함께 매칭합니다.
      </p>

      {loading && (
        <p className="mt-12 font-serif-ko text-body-lg text-ink-soft">검색 중...</p>
      )}

      {!loading && submitted && results.length === 0 && lawResults.length === 0 && (
        <div className="mt-12 border border-dashed border-paper-3 rounded-md p-12 text-center">
          <p className="font-serif-ko text-h3 text-ink-soft">검색 결과가 없습니다.</p>
          <p className="mt-3 font-serif-ko text-body text-ink-mute">
            다른 키워드로 시도해보거나, 위 샘플 질문을 클릭해보세요.
          </p>
        </div>
      )}

      {!loading && submitted && lawResults.length > 0 && (
        <section className="mt-12">
          <div className="flex items-baseline justify-between border-b border-paper-3 pb-3">
            <p className="font-mono text-[11px] uppercase tracking-label text-forest">
              LAWS · 관련 법령 조문
            </p>
            <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
              {lawResults.length}건
            </span>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {lawResults.map((law) => (
              <li key={law.id}>
                <LawResultCard law={law} />
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
            출처 · 국가법령정보센터 (law.go.kr)
          </p>
        </section>
      )}

      {!loading && submitted && results.length > 0 && (
        <section className="mt-14">
          <div className="flex items-baseline justify-between border-b border-paper-3 pb-3">
            <p className="font-mono text-[11px] uppercase tracking-label text-gold-deep">
              LIBRARY · 도원 라이브러리
            </p>
            <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
              {results.length}건
            </span>
          </div>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {results.map((it) => (
              <li key={it.slug}>
                <LibraryCard item={it} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
