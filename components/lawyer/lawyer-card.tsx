import Link from "next/link";
import type { Lawyer } from "@/lib/data/lawyers";
import { practiceAreaLabels } from "@/lib/data/lawyers";
import { Tag } from "@/components/ui";
import { LawyerPhoto } from "./lawyer-photo";
import { cn } from "@/lib/utils";

export function LawyerCard({ lawyer, featured }: { lawyer: Lawyer; featured?: boolean }) {
  const showSpecial =
    lawyer.specialQualifications && lawyer.specialQualifications.length > 0;

  return (
    <Link
      href={`/people/lawyers/${lawyer.slug}`}
      className={cn(
        "group relative block bg-paper border rounded-md overflow-hidden",
        "transition-all duration-base ease-out-curve",
        // Special qualifications get a gold border to draw the eye in the
        // grid (윤은희 변호사 의사 자격 강조).
        showSpecial
          ? "border-gold/60 hover:border-gold-deep"
          : "border-paper-3 hover:border-ink",
        "hover:shadow-paper hover:-translate-y-0.5",
        featured && "lg:col-span-2"
      )}
    >
      {/* Top decorative gold line — slides in from left on hover, gives the
          card the "section header" feel from the design system. */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-0 h-[2px] bg-gold transition-[width] duration-base",
          showSpecial ? "w-[40px]" : "w-0 group-hover:w-[40px]"
        )}
      />

      <div className="relative aspect-[4/5] bg-paper-3 overflow-hidden">
        <LawyerPhoto lawyer={lawyer} />
        {showSpecial && (
          <div className="absolute top-4 left-4 z-10">
            <Tag variant="accent">{lawyer.specialQualifications!.join(" · ")}</Tag>
          </div>
        )}
      </div>

      <div className="p-6 lg:p-7">
        <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
          {lawyer.role}
        </p>
        <h3 className="mt-2 font-serif-ko text-h3 font-semibold text-ink group-hover:text-gold-deep transition-colors">
          {lawyer.nameKo}
        </h3>
        <p className="mt-1 font-display italic text-[14px] text-ink-soft">
          {lawyer.nameEn}
        </p>

        <p className="mt-5 font-serif-ko text-[14.5px] text-ink-soft leading-base line-clamp-3">
          {lawyer.bioShort}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {lawyer.practiceAreas.slice(0, 4).map((pa) => (
            <li key={pa}>
              <Tag variant="default">{practiceAreaLabels[pa]}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
