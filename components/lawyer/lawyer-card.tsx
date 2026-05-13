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
        "group block bg-paper border border-paper-3 rounded-md overflow-hidden",
        "transition-all duration-base ease-out-curve",
        "hover:border-ink hover:shadow-paper",
        featured && "lg:col-span-2"
      )}
    >
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
