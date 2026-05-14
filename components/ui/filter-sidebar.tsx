"use client";

import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterGroup = {
  id: string;
  label: string;
  options: Array<{ value: string; label: string; count?: number }>;
};

/**
 * Filter sidebar.
 *
 * - Desktop (lg+): renders inline as a 260px aside — unchanged behaviour.
 * - Mobile (<lg): renders a compact trigger button that opens a bottom-sheet
 *   drawer with the same fieldsets. Keeps the page above-the-fold short
 *   instead of pushing content past a tall checkbox column.
 *
 * Filters apply immediately on each change (same as desktop); the drawer's
 * primary CTA simply closes it, optionally showing the live result count.
 */
export function FilterSidebar({
  groups,
  values,
  onChange,
  onClear,
  resultCount,
  className,
}: {
  groups: FilterGroup[];
  values: Record<string, string[]>;
  onChange: (groupId: string, value: string, checked: boolean) => void;
  onClear?: () => void;
  resultCount?: number;
  className?: string;
}) {
  const totalActive = Object.values(values).reduce((a, v) => a + v.length, 0);
  const [open, setOpen] = React.useState(false);

  // Lock body scroll while the drawer is open
  React.useEffect(() => {
    if (typeof document === "undefined" || !open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close drawer on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const filterBody = (
    <div className="space-y-7">
      {groups.map((group) => (
        <fieldset key={group.id}>
          <legend className="label-mono mb-3">{group.label}</legend>
          <ul className="space-y-2">
            {group.options.map((opt) => {
              const active = values[group.id]?.includes(opt.value) ?? false;
              return (
                <li key={opt.value}>
                  <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5 group">
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
  );

  return (
    <div className={cn("w-full lg:max-w-[260px]", className)}>
      {/* ── Mobile trigger ───────────────────────────────────────────── */}
      <div className="lg:hidden flex items-stretch border border-ink bg-paper rounded-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex-1 inline-flex items-center gap-2.5 px-4 py-3 text-left hover:bg-paper-2 transition-colors"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <SlidersHorizontal size={15} aria-hidden className="text-ink" />
          <span className="font-mono text-[12px] uppercase tracking-label text-ink">
            필터
          </span>
          {totalActive > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-ink text-paper rounded-full font-mono text-[10px]">
              {totalActive}
            </span>
          )}
          {typeof resultCount === "number" && (
            <span className="ml-auto font-mono text-[11px] text-ink-mute">
              {resultCount}건
            </span>
          )}
        </button>
        {totalActive > 0 && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="px-3 border-l border-paper-3 font-mono text-[11px] uppercase tracking-label text-ink-mute hover:text-ink hover:bg-paper-2 transition-colors"
            aria-label="필터 초기화"
          >
            초기화
          </button>
        )}
      </div>

      {/* ── Desktop sidebar ──────────────────────────────────────────── */}
      <aside className="hidden lg:block">
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
        <div className="mt-5">{filterBody}</div>
      </aside>

      {/* ── Mobile drawer (bottom sheet) ─────────────────────────────── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="필터"
        >
          {/* Backdrop — separate from sheet so taps outside close it */}
          <button
            type="button"
            aria-label="필터 닫기"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-night/60"
            tabIndex={-1}
          />

          {/* Sheet */}
          <div className="relative mt-auto flex max-h-[85vh] flex-col bg-paper border-t-2 border-ink rounded-t-md shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.25)]">
            {/* Drag handle hint */}
            <div className="pt-3 pb-1 flex justify-center">
              <span aria-hidden className="h-1 w-10 bg-paper-3 rounded-full" />
            </div>

            <div className="flex items-center justify-between border-b border-paper-3 px-5 py-3">
              <div className="inline-flex items-center gap-2">
                <SlidersHorizontal size={15} aria-hidden className="text-ink" />
                <p className="font-mono text-[12px] uppercase tracking-label text-ink">
                  필터
                </p>
                {totalActive > 0 && (
                  <span className="font-mono text-[11px] text-ink-mute">
                    {totalActive} 선택됨
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="필터 닫기"
                className="text-ink-mute hover:text-ink p-1"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">{filterBody}</div>

            <div className="flex gap-3 border-t border-paper-3 bg-paper px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
              <button
                type="button"
                disabled={totalActive === 0}
                onClick={onClear}
                className={cn(
                  "flex-1 border border-ink py-3 rounded-sm",
                  "font-mono text-[12px] uppercase tracking-label text-ink",
                  "hover:bg-paper-2 transition-colors",
                  "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-paper"
                )}
              >
                초기화
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-[1.6] bg-ink text-paper py-3 rounded-sm font-sans-ko text-[14px] font-medium hover:bg-night transition-colors"
              >
                {typeof resultCount === "number"
                  ? `결과 보기 (${resultCount})`
                  : "닫기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
