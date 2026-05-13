"use client";

import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { matterTypeLabels, type IntakeState } from "@/lib/ai/intake-slots";

const slotLabels: Array<{ key: string; label: string; check: (s: IntakeState) => boolean }> = [
  { key: "matter_type", label: "사건 유형", check: (s) => !!s.matter_type },
  { key: "when",        label: "발생 시점", check: (s) => !!(s.when.date || s.when.notes) },
  { key: "where",       label: "발생 장소", check: (s) => !!(s.where.location || s.where.notes) },
  { key: "parties",     label: "당사자",   check: (s) => !!s.parties.user_role },
  { key: "narrative",   label: "사건 경위", check: (s) => !!s.narrative && s.narrative.length > 20 },
  { key: "damages",     label: "손해",     check: (s) =>
      !!(s.damages.physical || s.damages.property || s.damages.financial || s.damages.psychological) },
  { key: "evidence",    label: "보유 자료", check: (s) => s.evidence.items.length > 0 },
  { key: "outcome",     label: "원하는 결과", check: (s) =>
      !!(s.desired_outcome.options?.length || s.desired_outcome.notes) },
  { key: "prior",       label: "사전 시도", check: (s) =>
      s.prior_actions.police_report !== null ||
      s.prior_actions.insurance_claim !== null ||
      s.prior_actions.settlement_attempt !== null ||
      !!s.prior_actions.notes },
];

export function IntakeProgress({ state }: { state: IntakeState }) {
  const pct = Math.round(state.completeness * 100);
  return (
    <div className="bg-paper border border-paper-3 rounded-md p-6">
      <div className="flex items-baseline justify-between">
        <p className="label-mono text-gold">INTAKE PROGRESS</p>
        <p className="font-mono text-[12px] text-ink">{pct}%</p>
      </div>

      <div className="mt-4 h-1 bg-paper-3 rounded-pill overflow-hidden">
        <div
          className="h-full bg-gold-deep transition-[width] duration-base"
          style={{ width: `${pct}%` }}
        />
      </div>

      {state.matter_type && (
        <p className="mt-5 font-serif-ko text-[14px] text-ink-soft">
          유형: <span className="font-semibold text-ink">{matterTypeLabels[state.matter_type]}</span>
        </p>
      )}

      <ul className="mt-5 space-y-2.5">
        {slotLabels.map(({ key, label, check }) => {
          const filled = check(state);
          return (
            <li key={key} className="flex items-center gap-2.5">
              {filled ? (
                <Check size={14} className="text-forest shrink-0" aria-hidden />
              ) : (
                <Circle size={14} className="text-ink-mute shrink-0" aria-hidden />
              )}
              <span
                className={cn(
                  "font-serif-ko text-[14px]",
                  filled ? "text-ink font-semibold" : "text-ink-mute"
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>

      {state.ready_for_summary && (
        <div className="mt-5 rounded-sm bg-paper-2 border border-paper-3 p-3">
          <p className="font-serif-ko text-[13.5px] text-ink leading-base">
            요약 카드 작성 준비 완료 — 우측 하단 <strong>“정리해서 확인하기”</strong> 버튼을 눌러주세요.
          </p>
        </div>
      )}
    </div>
  );
}
