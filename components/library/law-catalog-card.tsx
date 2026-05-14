import { Scale, ExternalLink } from "lucide-react";

export type LawCatalogEntry = {
  law_id: string;
  law_name: string;
  article_count: number;
  latest_enforcement: string | null;
};

export function LawCatalogCard({ law }: { law: LawCatalogEntry }) {
  // Friendly law.go.kr URL — the "법령" path takes the law name directly
  // and opens the modern law-detail page, which is nicer than DRF HTML.
  const externalUrl = `https://www.law.go.kr/법령/${encodeURIComponent(
    law.law_name
  )}`;

  return (
    <a
      href={externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col rounded-sm border border-paper-3 bg-paper p-5 lg:p-6 hover:border-ink transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-label text-forest">
          <Scale size={12} aria-hidden /> 법령
        </span>
        <ExternalLink
          size={12}
          aria-hidden
          className="text-ink-mute group-hover:text-ink transition-colors"
        />
      </div>

      <h3 className="mt-4 font-serif-ko text-h3 font-semibold text-ink leading-tight">
        {law.law_name}
      </h3>

      <div className="mt-auto pt-5 flex items-baseline justify-between gap-3 border-t border-paper-3 mt-5">
        <span className="font-display italic text-[clamp(24px,3vw,32px)] text-ink leading-none">
          {law.article_count}
          <span className="ml-1 font-serif-ko text-body text-ink-soft not-italic">
            조문
          </span>
        </span>
        {law.latest_enforcement && (
          <span className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
            시행 {law.latest_enforcement}
          </span>
        )}
      </div>
    </a>
  );
}
