"use client";

import * as React from "react";
import { Search, Sparkles } from "lucide-react";
import { LawArticleCard, type LawArticle } from "./law-article-card";
import { cn } from "@/lib/utils";

type LawAskProps = {
  /** Law names from the catalog, used to populate the filter dropdown. */
  lawNames: string[];
};

const sampleQuestions = [
  "보험업법에서 보험사 설립요건에 대한 규정",
  "상법상 재보험의 법적 지위",
  "교통사고처리 특례법의 공소제기 예외",
  "민법 제3편 채권 중 손해배상 산정",
];

export function LawAsk({ lawNames }: LawAskProps) {
  const [query, setQuery] = React.useState("");
  const [lawFilter, setLawFilter] = React.useState<string>("");
  const [submitted, setSubmitted] = React.useState<{
    q: string;
    law: string;
  } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<LawArticle[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!submitted) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/ai/laws-search", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            query: submitted.q,
            top_k: 15,
            ...(submitted.law ? { law_name: submitted.law } : {}),
          }),
        });

        // Some failure modes return an empty body or HTML error page
        // (function crash, 504 timeout). Read as text first so we can
        // surface a usable message instead of a parser stack trace.
        const text = await res.text();
        let data: { results?: LawArticle[]; error?: string } = {};
        if (text) {
          try {
            data = JSON.parse(text);
          } catch {
            data = {
              error: res.ok
                ? "서버 응답을 해석할 수 없습니다."
                : `${res.status} ${res.statusText || ""}`.trim(),
            };
          }
        } else if (!res.ok) {
          data = { error: `${res.status} ${res.statusText || ""}`.trim() };
        }

        if (cancelled) return;
        if (!res.ok || data.error) {
          setError(data.error ?? "검색 중 오류가 발생했습니다.");
          setResults([]);
        } else {
          setResults((data.results ?? []) as LawArticle[]);
        }
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "네트워크 오류");
        setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [submitted]);

  const submit = (q: string, law = lawFilter) => {
    if (!q.trim()) return;
    setQuery(q);
    setSubmitted({ q: q.trim(), law });
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
      >
        <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <div className="relative">
            <Search
              size={18}
              aria-hidden
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="조문에 대해 묻기 — 예: 보험업법 보험사 설립요건"
              className={cn(
                "w-full pl-12 pr-4 py-4",
                "bg-paper border border-paper-3 rounded-sm",
                "font-serif-ko text-body-lg text-ink placeholder:text-ink-mute",
                "focus:border-ink focus:outline-none"
              )}
            />
          </div>

          <select
            value={lawFilter}
            onChange={(e) => setLawFilter(e.target.value)}
            aria-label="법령 필터"
            className={cn(
              "py-4 px-3",
              "bg-paper border border-paper-3 rounded-sm",
              "font-serif-ko text-body text-ink",
              "focus:border-ink focus:outline-none"
            )}
          >
            <option value="">법령 전체</option>
            {lawNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className={cn(
              "inline-flex items-center justify-center gap-1.5 px-6 py-4",
              "bg-gold-deep text-paper rounded-sm",
              "font-sans-ko text-[14px] font-medium tracking-wide",
              "hover:bg-gold transition-colors"
            )}
          >
            <Sparkles size={14} /> 조문 찾기
          </button>
        </div>
      </form>

      {/* Sample questions */}
      <div className="mt-4 flex flex-wrap items-baseline gap-2">
        <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
          샘플:
        </span>
        {sampleQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => submit(q, "")}
            className="font-serif-ko text-[13.5px] text-ink-soft border-b border-paper-3 hover:text-ink hover:border-ink transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && (
        <p className="mt-10 font-serif-ko text-body-lg text-ink-soft">
          관련 조문을 찾는 중…
        </p>
      )}

      {error && !loading && (
        <p className="mt-10 font-mono text-[12px] uppercase tracking-label text-rust">
          {error}
        </p>
      )}

      {!loading && !error && submitted && results.length === 0 && (
        <div className="mt-10 border border-dashed border-paper-3 rounded-md p-10 text-center">
          <p className="font-serif-ko text-h3 text-ink-soft">
            관련 조문을 찾지 못했습니다.
          </p>
          <p className="mt-3 font-serif-ko text-body text-ink-mute">
            다른 표현으로 질문하거나, 법령 필터를 변경해 보세요.
          </p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="mt-10">
          <div className="flex items-baseline justify-between border-b border-paper-3 pb-3">
            <p className="font-mono text-[11px] uppercase tracking-label text-forest">
              ARTICLES · 관련 조문
            </p>
            <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
              {results.length}건 {submitted?.law && `· ${submitted.law}`}
            </span>
          </div>

          <ul className="mt-6 space-y-5">
            {results.map((r) => (
              <li key={r.id}>
                <LawArticleCard article={r} />
              </li>
            ))}
          </ul>

          <p className="mt-6 font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
            출처 · 국가법령정보센터 (law.go.kr)
          </p>
        </div>
      )}
    </div>
  );
}
