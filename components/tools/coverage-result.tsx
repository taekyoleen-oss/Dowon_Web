"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldQuestion,
  FileText,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Possibility = "high" | "medium" | "low" | "unclear";

export type CoverageResult = {
  matter_type?: string;
  possibility?: Possibility;
  possibility_label?: string;
  coverage_clauses?: Array<{ clause: string; relevance: string }>;
  exclusion_candidates?: Array<{ clause: string; concern: string }>;
  missing_info?: string[];
  recommended_actions?: string[];
  related_library?: Array<{
    id: string;
    type: string;
    title: string;
    excerpt: string;
    practice_areas: string[];
    url: string;
  }>;
  stub?: boolean;
};

const possibilityConfig: Record<
  Possibility,
  { label: string; color: string; bg: string; border: string }
> = {
  high:    { label: "높음",         color: "text-forest",   bg: "bg-forest/5",   border: "border-forest/40" },
  medium:  { label: "중간",         color: "text-gold-deep",bg: "bg-gold/5",     border: "border-gold/40" },
  low:     { label: "낮음",         color: "text-ink-soft", bg: "bg-paper-2",    border: "border-paper-3" },
  unclear: { label: "판단 어려움",  color: "text-ink-soft", bg: "bg-paper-2",    border: "border-paper-3" },
};

export function CoverageResultPanel({
  reply,
  result,
  loading,
}: {
  reply: string;
  result: CoverageResult | null;
  loading: boolean;
}) {
  const possibility = result?.possibility ?? "unclear";
  const cfg = possibilityConfig[possibility];

  return (
    <div className="space-y-6">
      {/* Always-on disclaimer at top — strongest framing */}
      <div className="rounded-md border-2 border-rust/40 bg-rust/5 p-5 lg:p-6">
        <p className="font-mono text-[11px] uppercase tracking-label text-rust">
          ⚠ 중요 안내 — Important
        </p>
        <p className="mt-3 font-serif-ko text-body-lg text-ink leading-base">
          본 결과는 약관 텍스트와 사고 정보를 매칭한 <strong>일반 정보 안내</strong>입니다.
          법률 자문이나 보험 상담이 아니며, 실제 보험금 지급 여부는 보험사·변호사와의
          상담을 통해 확정해야 합니다. (변호사법 §23 / 보험업법 준수)
        </p>
      </div>

      {/* AI's natural-language summary (streams in) */}
      <div className="rounded-md border border-paper-3 bg-paper p-6 lg:p-7">
        <p className="label-mono text-gold">SUMMARY · 검토 요약</p>
        <p className="mt-4 font-serif-ko text-body-lg text-ink leading-base whitespace-pre-wrap min-h-[3em]">
          {reply || (loading ? "분석 중입니다..." : "")}
          {loading && reply && (
            <span className="inline-block w-2 h-5 bg-ink-mute animate-pulse ml-1 align-middle" />
          )}
        </p>
      </div>

      {/* Possibility card */}
      {result && (
        <div className={cn("rounded-md border p-6 lg:p-7", cfg.border, cfg.bg)}>
          <div className="flex items-start gap-4">
            <ShieldQuestion size={24} aria-hidden className={cn("shrink-0", cfg.color)} />
            <div>
              <p className="label-mono text-gold">CARD 01 · 지급 가능성 검토</p>
              <p className={cn("mt-3 font-serif-ko text-h2 font-semibold", cfg.color)}>
                {result.possibility_label ?? cfg.label}
              </p>
              <p className="mt-3 font-serif-ko text-body text-ink-soft leading-base">
                * 본 평가는 입력된 약관·정보 기반의 *후보* 검토 결과이며,
                실제 결과는 약관 전문·증거·진단·과실 비율 등에 따라 달라집니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Coverage clauses */}
      {result?.coverage_clauses && result.coverage_clauses.length > 0 && (
        <div className="rounded-md border border-paper-3 bg-paper p-6 lg:p-7">
          <div className="flex items-baseline justify-between">
            <p className="label-mono text-gold">CARD 02 · 관련 보장 조항</p>
            <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
              {result.coverage_clauses.length}건
            </span>
          </div>
          <ul className="mt-5 space-y-5">
            {result.coverage_clauses.map((c, i) => (
              <li key={i} className="border-l-2 border-forest pl-4">
                <p className="font-serif-ko text-body text-ink font-semibold">
                  <CheckCircle2 size={14} aria-hidden className="inline mr-1 text-forest" />
                  {c.clause}
                </p>
                <p className="mt-2 font-serif-ko text-[14.5px] text-ink-soft leading-base">
                  {c.relevance}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Exclusion candidates */}
      {result?.exclusion_candidates && result.exclusion_candidates.length > 0 && (
        <div className="rounded-md border border-paper-3 bg-paper p-6 lg:p-7">
          <div className="flex items-baseline justify-between">
            <p className="label-mono text-gold">CARD 03 · 면책 검토 대상</p>
            <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
              {result.exclusion_candidates.length}건
            </span>
          </div>
          <p className="mt-3 font-serif-ko text-body text-ink-soft leading-base">
            아래는 본 사안에서 검토가 필요한 면책 *후보* 조항입니다. 실제 적용 여부는
            전문가 검토가 필요합니다.
          </p>
          <ul className="mt-5 space-y-5">
            {result.exclusion_candidates.map((e, i) => (
              <li key={i} className="border-l-2 border-rust pl-4">
                <p className="font-serif-ko text-body text-ink font-semibold">
                  <AlertTriangle size={14} aria-hidden className="inline mr-1 text-rust" />
                  {e.clause}
                </p>
                <p className="mt-2 font-serif-ko text-[14.5px] text-ink-soft leading-base">
                  {e.concern}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related library — auto-matched cases/columns */}
      {result?.related_library && result.related_library.length > 0 && (
        <div className="rounded-md border border-paper-3 bg-paper p-6 lg:p-7">
          <div className="flex items-baseline justify-between">
            <p className="label-mono text-gold">CARD 04 · 관련 판례·칼럼</p>
            <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
              {result.related_library.length}건
            </span>
          </div>
          <ul className="mt-5 space-y-4">
            {result.related_library.map((r) => (
              <li key={r.id}>
                <Link
                  href={r.url}
                  target="_blank"
                  className="block p-4 -m-1 rounded-sm border border-paper-3 hover:border-ink hover:bg-paper-2 transition-colors group"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-label text-gold">
                      {r.type === "case" ? "판례" : r.type === "column" ? "칼럼" : "강의"}
                    </span>
                    <FileText size={12} aria-hidden className="text-ink-mute" />
                  </div>
                  <p className="mt-2 font-serif-ko text-body font-semibold text-ink group-hover:text-gold-deep transition-colors">
                    {r.title}
                  </p>
                  <p className="mt-2 font-serif-ko text-[13.5px] text-ink-soft leading-base">
                    {r.excerpt}
                  </p>
                  {r.practice_areas.length > 0 && (
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-label text-ink-mute">
                      {r.practice_areas.join(" · ")}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing info */}
      {result?.missing_info && result.missing_info.length > 0 && (
        <div className="rounded-md border border-paper-3 bg-paper-2 p-6 lg:p-7">
          <p className="label-mono text-gold">추가 확인이 필요한 자료</p>
          <ul className="mt-4 space-y-2">
            {result.missing_info.map((m) => (
              <li
                key={m}
                className="flex gap-3 font-serif-ko text-[14.5px] text-ink-soft leading-base"
              >
                <span aria-hidden className="mt-2.5 h-px w-3 bg-gold shrink-0" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended actions / CTA */}
      {result?.recommended_actions && result.recommended_actions.length > 0 && (
        <div className="rounded-md border border-paper-3 bg-paper p-6 lg:p-7">
          <p className="label-mono text-gold">CARD 05 · 권장 다음 단계</p>
          <ul className="mt-5 space-y-2">
            {result.recommended_actions.map((a) => (
              <li
                key={a}
                className="flex gap-3 font-serif-ko text-body text-ink leading-base"
              >
                <ArrowRight size={14} className="mt-1 text-gold shrink-0" aria-hidden />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA — always present after analysis */}
      {result && !loading && (
        <div className="rounded-md bg-night text-paper p-7 lg:p-8 text-center">
          <p className="label-mono text-gold-bright">NEXT STEP</p>
          <h3 className="mt-3 font-display italic text-[clamp(28px,4vw,40px)] leading-tight">
            정확한 판단은 변호사 상담을 통해
          </h3>
          <p className="mt-4 font-serif-ko text-body-lg text-paper-3 max-w-xl mx-auto leading-base">
            본 분석을 바탕으로 1차 무료 상담을 신청하시거나, AI 인테이크 도구로
            사건 정보를 더 자세히 정리해 변호사에게 전달할 수 있습니다.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/personal"
              className="inline-flex items-center px-6 py-3 bg-gold-deep text-paper rounded-sm font-sans-ko text-[14px] font-medium hover:bg-gold transition-colors"
            >
              1:1 상담 신청
            </Link>
            <Link
              href="/tools/intake"
              className="inline-flex items-center px-6 py-3 border border-paper-3 text-paper rounded-sm font-sans-ko text-[14px] font-medium hover:bg-night-2 transition-colors"
            >
              AI와 사건 정보 정리하기
            </Link>
          </div>
        </div>
      )}

      {result?.stub && (
        <p className="font-mono text-[10px] uppercase tracking-label text-ink-mute text-center">
          ⓘ ANTHROPIC_API_KEY 미설정 — stub 응답입니다.
        </p>
      )}
    </div>
  );
}
