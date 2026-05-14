import { Scale, ExternalLink } from "lucide-react";

/**
 * Search-result card for a single law article — returned by the
 * legal_provisions match RPC and rendered by LibrarySemanticSearch.
 *
 * Visually distinct from LibraryCard (which is for cases/columns):
 * blue-ish "법령" badge, monospace law name, body snippet, and a
 * deep link to the law.go.kr source for citation.
 */
export type LawResult = {
  id: string;
  type: "law";
  law_name: string;
  article_number: string;
  article_title: string;
  snippet: string;
  enforcement_date: string | null;
  similarity: number;
  source_url: string | null;
};

export function LawResultCard({ law }: { law: LawResult }) {
  const articleLabel = `제${law.article_number.replace("-", "조의 ")}조`;
  return (
    <article className="group h-full flex flex-col bg-paper border border-paper-3 hover:border-ink transition-colors p-5 lg:p-6">
      <div className="flex items-baseline justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-label text-forest">
          <Scale size={11} aria-hidden /> 법령
        </span>
        <span className="font-mono text-[10px] uppercase tracking-label text-ink-mute">
          유사도 {Math.round(law.similarity * 100)}%
        </span>
      </div>

      <h3 className="mt-4 font-serif-ko text-h3 font-semibold text-ink leading-tight">
        {law.law_name}{" "}
        <span className="text-ink-soft text-[15px] font-normal">
          {articleLabel}
        </span>
      </h3>

      {law.article_title && (
        <p className="mt-1 font-serif-ko text-[13.5px] text-ink-mute">
          ({law.article_title})
        </p>
      )}

      <p className="mt-4 flex-1 font-serif-ko text-[14px] text-ink-soft leading-relaxed">
        {law.snippet}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-paper-3 pt-3">
        {law.enforcement_date && (
          <span className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
            시행 {law.enforcement_date}
          </span>
        )}
        {law.source_url && (
          <a
            href={law.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-label text-ink-soft hover:text-ink"
          >
            원문 <ExternalLink size={11} aria-hidden />
          </a>
        )}
      </div>
    </article>
  );
}
