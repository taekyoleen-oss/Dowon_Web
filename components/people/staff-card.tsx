import Image from "next/image";
import { User } from "lucide-react";
import type { StaffMember } from "@/lib/data/staff";

/**
 * Editorial card for non-lawyer staff (fellows / recovery / management).
 * Mirrors the visual rhythm of LawyerCard but without the practice-area
 * tags and link-out — these profiles don't have detail pages.
 */
export function StaffCard({ member }: { member: StaffMember }) {
  return (
    <article className="group flex h-full flex-col bg-paper border border-paper-3 hover:border-ink transition-colors">
      <div className="relative aspect-[3/4] bg-paper-2 overflow-hidden">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={`${member.nameKo} ${member.role}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top transition-transform duration-slow ease-out-curve group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-mute">
            <User size={48} aria-hidden />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <p className="font-mono text-[10.5px] uppercase tracking-label text-gold">
          {member.affiliation ?? member.role}
        </p>
        <h3 className="mt-3 font-serif-ko text-h3 font-semibold text-ink leading-tight">
          {member.nameKo}{" "}
          <span className="text-ink-soft text-[16px] font-normal">
            {member.role}
          </span>
        </h3>
        {member.bio.length > 0 && (
          <ul className="mt-4 space-y-1.5 font-serif-ko text-[13.5px] text-ink-soft leading-relaxed">
            {member.bio.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="mt-2 h-px w-2.5 shrink-0 bg-gold" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
