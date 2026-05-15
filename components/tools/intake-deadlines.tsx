"use client";

import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { daysUntil, formatDday } from "@/lib/utils/date";

type Deadline = {
  label: string;
  date: string;       // YYYY-MM-DD
  source?: string;
};

export function IntakeDeadlines({ deadlines }: { deadlines: Deadline[] }) {
  if (!deadlines || deadlines.length === 0) return null;

  const sorted = [...deadlines].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-paper border border-paper-3 rounded-md p-6">
      <p className="label-mono text-gold inline-flex items-center gap-1.5">
        <CalendarClock size={12} aria-hidden /> 확인된 일정
      </p>
      <ul className="mt-4 space-y-3">
        {sorted.map((d, i) => {
          const days = daysUntil(d.date);
          const urgent = days !== null && days <= 7 && days >= 0;
          const overdue = days !== null && days < 0;
          return (
            <li key={`${d.label}-${d.date}-${i}`} className="flex items-start gap-3">
              <span
                className={cn(
                  "shrink-0 inline-flex items-center justify-center min-w-[64px] px-2 py-1 rounded-sm",
                  "font-mono text-[11px] font-semibold tracking-label",
                  overdue
                    ? "bg-rust text-paper"
                    : urgent
                      ? "bg-gold-deep text-paper"
                      : "bg-paper-2 text-ink-soft"
                )}
              >
                {formatDday(days)}
              </span>
              <div className="min-w-0">
                <p className="font-serif-ko text-[14.5px] font-semibold text-ink leading-snug">
                  {d.label}
                </p>
                <p className="mt-0.5 font-mono text-[11px] tracking-label text-ink-mute">
                  {d.date}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 font-serif-ko text-[12.5px] text-ink-mute leading-base">
        시효·기간 적용 여부는 변호사 확인이 필요합니다. 본 카드는 사용자가 말씀하신
        날짜를 정리한 것이며 법적 자문이 아닙니다.
      </p>
    </div>
  );
}
