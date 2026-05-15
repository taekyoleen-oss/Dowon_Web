"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Suggested = {
  id: string;        // lawyer slug
  name: string;
  match_reason: string;
  match_score: number;
};

export function IntakeLawyerSuggest({
  lawyers,
  selectedSlug,
  onSelect,
}: {
  lawyers: Suggested[];
  selectedSlug?: string | null;
  onSelect?: (slug: string | null) => void;
}) {
  if (!lawyers || lawyers.length === 0) return null;

  return (
    <div className="bg-paper border border-paper-3 rounded-md p-6">
      <p className="label-mono text-gold inline-flex items-center gap-1.5">
        <Users size={12} aria-hidden /> 추천 변호사
      </p>
      <p className="mt-2 font-serif-ko text-[12.5px] text-ink-mute leading-base">
        사건 유형과 일치하는 변호사 후보입니다. 실제 배정은 변호사 검수 후 확정됩니다.
      </p>
      <ul className="mt-4 space-y-3">
        {lawyers.map((l) => {
          const selected = selectedSlug === l.id;
          return (
            <li
              key={l.id}
              className={cn(
                "rounded-sm border p-3 transition-colors",
                selected ? "border-ink bg-paper-2" : "border-paper-3 bg-paper hover:bg-paper-2"
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-serif-ko text-[15px] font-semibold text-ink">{l.name}</p>
                <Link
                  href={`/people/lawyers/${l.id}`}
                  target="_blank"
                  className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute hover:text-ink"
                >
                  소개 →
                </Link>
              </div>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
                {l.match_reason}
              </p>
              {onSelect && (
                <button
                  type="button"
                  onClick={() => onSelect(selected ? null : l.id)}
                  className={cn(
                    "mt-3 inline-flex items-center justify-center px-3 py-1.5 rounded-sm",
                    "font-sans-ko text-[12px] font-medium tracking-wide transition-colors",
                    selected
                      ? "bg-ink text-paper hover:bg-ink-soft"
                      : "border border-ink text-ink hover:bg-paper-2"
                  )}
                >
                  {selected ? "선택됨 — 해제" : "이 변호사로 신청"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
