import Link from "next/link";
import type { LibraryItem } from "@/lib/data/library";
import { practiceAreaLabels } from "@/lib/data/lawyers";
import { getLawyerBySlug } from "@/lib/data/lawyers";
import { Tag } from "@/components/ui";
import { cn } from "@/lib/utils";

const typeLabels: Record<LibraryItem["type"], string> = {
  case:   "CASE · 판례",
  column: "COLUMN · 칼럼",
  media:  "MEDIA · 강의·미디어",
};

export function LibraryCard({ item, compact }: { item: LibraryItem; compact?: boolean }) {
  const author = item.authorSlug ? getLawyerBySlug(item.authorSlug) : null;
  const lawyers = item.lawyerSlugs?.map((s) => getLawyerBySlug(s)).filter(Boolean) ?? [];

  const href =
    item.type === "case"
      ? `/library/cases/${item.slug}`
      : item.type === "column"
      ? `/library/columns/${item.slug}`
      : `/library/media#${item.slug}`;

  return (
    <Link
      href={href}
      className={cn(
        "block bg-paper border border-paper-3 rounded-md p-7 lg:p-8 h-full group",
        "transition-all duration-base ease-out-curve",
        "hover:border-ink hover:shadow-paper"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-label text-gold">
          {typeLabels[item.type]}{item.caseNumber ? ` · ${item.caseNumber}` : ""}
        </span>
        <time
          dateTime={item.publishedAt}
          className="font-mono text-[11px] uppercase tracking-label text-ink-mute"
        >
          {item.publishedAt.replace(/-/g, ".")}
        </time>
      </div>

      <h3 className="mt-5 font-serif-ko text-h3 font-semibold text-ink leading-tight group-hover:text-gold-deep transition-colors">
        {item.title}
      </h3>

      {!compact && (
        <>
          {item.type === "case" && item.issue && (
            <>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-label text-ink-mute">쟁점</p>
              <p className="mt-2 font-serif-ko text-body text-ink-soft leading-base line-clamp-3">
                {item.issue}
              </p>
            </>
          )}
          {item.type === "case" && item.conclusion && (
            <>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-label text-ink-mute">결론</p>
              <p className="mt-2 font-serif-ko text-body text-ink-soft leading-base line-clamp-2">
                {item.conclusion}
              </p>
            </>
          )}
          {item.type !== "case" && (
            <p className="mt-5 font-serif-ko text-body text-ink-soft leading-base line-clamp-3">
              {item.excerpt}
            </p>
          )}
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-1.5">
        {item.practiceAreas.slice(0, 3).map((pa) => (
          <Tag key={pa} variant="default">{practiceAreaLabels[pa]}</Tag>
        ))}
      </div>

      {(author || lawyers.length > 0) && (
        <p className="mt-5 font-mono text-[11px] uppercase tracking-label text-ink-mute">
          {author ? `Author · ${author.nameKo}` : `Lawyer · ${lawyers.map((l) => l!.nameKo).join(", ")}`}
        </p>
      )}
    </Link>
  );
}
