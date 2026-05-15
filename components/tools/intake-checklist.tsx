"use client";

import { Check, Circle, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

type ChecklistEntry = {
  id: string;
  label: string;
  required: boolean;
  matched: boolean;
};

export function IntakeChecklist({ items }: { items: ChecklistEntry[] }) {
  if (!items || items.length === 0) return null;

  const required = items.filter((i) => i.required);
  const optional = items.filter((i) => !i.required);
  const matchedRequired = required.filter((i) => i.matched).length;
  const pct = required.length > 0 ? Math.round((matchedRequired / required.length) * 100) : 0;

  return (
    <div className="bg-paper border border-paper-3 rounded-md p-6">
      <div className="flex items-baseline justify-between">
        <p className="label-mono text-gold inline-flex items-center gap-1.5">
          <ListChecks size={12} aria-hidden /> 필요 자료
        </p>
        <p className="font-mono text-[12px] text-ink">{pct}%</p>
      </div>

      <div className="mt-4 h-1 bg-paper-3 rounded-pill overflow-hidden">
        <div
          className="h-full bg-gold-deep transition-[width] duration-base"
          style={{ width: `${pct}%` }}
        />
      </div>

      {required.length > 0 && (
        <div className="mt-5">
          <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
            필수
          </p>
          <ul className="mt-2 space-y-2">
            {required.map((it) => (
              <ChecklistRow key={it.id} entry={it} />
            ))}
          </ul>
        </div>
      )}

      {optional.length > 0 && (
        <div className="mt-5">
          <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
            권장
          </p>
          <ul className="mt-2 space-y-2">
            {optional.map((it) => (
              <ChecklistRow key={it.id} entry={it} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ChecklistRow({ entry }: { entry: ChecklistEntry }) {
  return (
    <li className="flex items-center gap-2.5">
      {entry.matched ? (
        <Check size={14} className="text-forest shrink-0" aria-hidden />
      ) : (
        <Circle size={14} className="text-ink-mute shrink-0" aria-hidden />
      )}
      <span
        className={cn(
          "font-serif-ko text-[13.5px] leading-base",
          entry.matched ? "text-ink font-semibold" : "text-ink-soft"
        )}
      >
        {entry.label}
      </span>
    </li>
  );
}
