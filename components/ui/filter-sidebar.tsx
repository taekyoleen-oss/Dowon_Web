"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type FilterGroup = {
  id: string;
  label: string;
  options: Array<{ value: string; label: string; count?: number }>;
};

export function FilterSidebar({
  groups,
  values,
  onChange,
  onClear,
  className,
}: {
  groups: FilterGroup[];
  values: Record<string, string[]>;
  onChange: (groupId: string, value: string, checked: boolean) => void;
  onClear?: () => void;
  className?: string;
}) {
  const totalActive = Object.values(values).reduce((a, v) => a + v.length, 0);

  return (
    <aside className={cn("w-full lg:max-w-[260px]", className)}>
      <div className="flex items-center justify-between border-b border-paper-3 pb-3">
        <p className="label-mono">필터</p>
        {totalActive > 0 && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="font-mono text-[11px] uppercase tracking-label text-ink-mute hover:text-ink"
          >
            초기화 ({totalActive})
          </button>
        )}
      </div>

      <div className="mt-5 space-y-7">
        {groups.map((group) => (
          <fieldset key={group.id}>
            <legend className="label-mono mb-3">{group.label}</legend>
            <ul className="space-y-2">
              {group.options.map((opt) => {
                const active = values[group.id]?.includes(opt.value) ?? false;
                return (
                  <li key={opt.value}>
                    <label className="flex cursor-pointer items-center justify-between gap-3 py-1 group">
                      <span className="inline-flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={(e) => onChange(group.id, opt.value, e.target.checked)}
                          className="h-4 w-4 accent-ink"
                        />
                        <span
                          className={cn(
                            "font-serif-ko text-[14.5px]",
                            active ? "text-ink font-semibold" : "text-ink-soft"
                          )}
                        >
                          {opt.label}
                        </span>
                      </span>
                      {opt.count !== undefined && (
                        <span className="font-mono text-[11px] text-ink-mute">{opt.count}</span>
                      )}
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </div>
    </aside>
  );
}
