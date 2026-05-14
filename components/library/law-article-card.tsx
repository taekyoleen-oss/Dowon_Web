import { Scale, ExternalLink } from "lucide-react";

/**
 * Full-article card for the /library/laws Q&A flow.
 *
 * Differs from LawResultCard (used in /library/search):
 *   - Renders the FULL article body, not a 160-char snippet
 *   - 항/호 lines come back as "\n"-joined plain text from the
 *     ingest, so whitespace-pre-wrap preserves the structure
 *   - More vertical room since users came here to actually read
 */
export type LawArticle = {
  id: string;
  law_name: string;
  article_number: string;
  article_title: string;
  article_body: string;
  enforcement_date: string | null;
  similarity: number;
  source_url: string | null;
};

export function LawArticleCard({ article }: { article: LawArticle }) {
  // article_number "12-2" → "제12조의 2", plain "12" → "제12조"
  const articleLabel = `제${article.article_number.replace("-", "조의 ")}조`;

  return (
    <article className="rounded-sm border border-paper-3 bg-paper p-6 lg:p-7 hover:border-ink transition-colors">
      <div className="flex items-baseline justify-between gap-4">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-label text-forest">
            <Scale size={12} aria-hidden /> 법령
          </span>
          <span className="font-mono text-[10px] uppercase tracking-label text-ink-mute">
            유사도 {Math.round(article.similarity * 100)}%
          </span>
        </div>
        {article.source_url && (
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-label text-ink-soft hover:text-ink"
          >
            원문 <ExternalLink size={11} aria-hidden />
          </a>
        )}
      </div>

      <h3 className="mt-4 font-serif-ko text-h3 font-semibold text-ink leading-tight">
        {article.law_name}{" "}
        <span className="text-ink-soft text-[16px] font-normal">
          {articleLabel}
        </span>
        {article.article_title && (
          <span className="block mt-1 text-[15px] font-normal text-ink-mute">
            ({article.article_title})
          </span>
        )}
      </h3>

      <pre className="mt-5 whitespace-pre-wrap break-words font-serif-ko text-[14.5px] text-ink leading-loose">
        {article.article_body}
      </pre>

      {article.enforcement_date && (
        <p className="mt-5 pt-4 border-t border-paper-3 font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
          시행 · {article.enforcement_date}
        </p>
      )}
    </article>
  );
}
