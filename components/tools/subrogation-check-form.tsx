"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Field, Textarea, Select, SubmitButton, FormStatus } from "@/components/contact/form-primitives";
import { LegalDisclaimer } from "@/components/ai/legal-disclaimer";
import { cn } from "@/lib/utils";

type Result = {
  recovery_possibility: "high" | "medium" | "low" | "none";
  recovery_rate_estimate: { min: number; max: number };
  key_factors: string[];
  recommended_actions: string[];
  similar_cases: Array<{ summary: string; result: string }>;
  stub?: boolean;
};

const possibilityLabel: Record<Result["recovery_possibility"], string> = {
  high:   "높음",
  medium: "중간",
  low:    "낮음",
  none:   "어려움",
};

export function SubrogationCheckForm() {
  const [result, setResult] = React.useState<Result | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const form = e.currentTarget;
      const fd = new FormData(form);
      const body = {
        accident_type: String(fd.get("accident_type")),
        parties: [
          { role: "가해자",   info: String(fd.get("perpetrator") ?? "") },
          { role: "피해자",   info: String(fd.get("victim") ?? "") },
        ],
        damages: {
          amount: Number(fd.get("damages_amount") || 0),
          type: String(fd.get("damages_type") ?? "재산").split(",").map((s) => s.trim()).filter(Boolean),
        },
        insurance_paid: Number(fd.get("insurance_paid") || 0),
        fault_ratio: String(fd.get("fault_ratio") ?? ""),
        additional_facts: String(fd.get("additional_facts") ?? ""),
      };
      const res = await fetch("/api/ai/subrogation-check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("API error");
      const data: Result = await res.json();
      setResult(data);
    } catch (e) {
      setError("진단 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
      <form onSubmit={onSubmit} className="space-y-6">
        <Field
          id="sc-accident"
          name="accident_type"
          label="사고 유형"
          required
          placeholder="예: 교통사고 (자동차 대 자동차)"
        />
        <div className="grid gap-6 md:grid-cols-2">
          <Field id="sc-perp" name="perpetrator" label="가해자 정보" placeholder="개인/법인, 보험 가입 여부" />
          <Field id="sc-victim" name="victim" label="피해자 정보" placeholder="개인/법인" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            id="sc-damages"
            name="damages_amount"
            label="총 손해액 (원)"
            type="number"
            min={0}
            required
            placeholder="예: 30000000"
          />
          <Field
            id="sc-paid"
            name="insurance_paid"
            label="지급 보험금 (원)"
            type="number"
            min={0}
            required
            placeholder="예: 22000000"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            id="sc-damages-type"
            name="damages_type"
            label="손해 유형"
            placeholder="예: 재산, 인적, 영업"
            hint="쉼표로 구분"
          />
          <Select
            id="sc-fault"
            name="fault_ratio"
            label="과실 비율 (피해자:가해자)"
            options={[
              { value: "0:100", label: "0 : 100" },
              { value: "20:80", label: "20 : 80" },
              { value: "30:70", label: "30 : 70" },
              { value: "50:50", label: "50 : 50" },
              { value: "unknown", label: "확정 전" },
            ]}
          />
        </div>
        <Textarea
          id="sc-facts"
          name="additional_facts"
          label="추가 사실"
          hint="공동불법행위·SIU 의심·시효 등 특이 사항"
        />

        <SubmitButton pending={loading}>구상 가능성 진단</SubmitButton>

        {error && <p role="alert" className="text-rust font-serif-ko text-body">{error}</p>}
      </form>

      <aside className="space-y-4">
        {result && (
          <div className="bg-paper border border-paper-3 rounded-md p-6">
            <p className="label-mono text-gold">진단 결과</p>
            <p
              className={cn(
                "mt-3 font-serif-ko text-h1 font-semibold",
                result.recovery_possibility === "high" && "text-forest",
                result.recovery_possibility === "medium" && "text-gold-deep",
                result.recovery_possibility === "low" && "text-ink-soft",
                result.recovery_possibility === "none" && "text-rust"
              )}
            >
              {possibilityLabel[result.recovery_possibility]}
            </p>
            <p className="mt-2 font-mono text-[12px] text-ink-mute">
              예상 회수율 {result.recovery_rate_estimate.min}–{result.recovery_rate_estimate.max}%
            </p>

            <p className="mt-6 label-mono">핵심 요인</p>
            <ul className="mt-3 space-y-2">
              {result.key_factors.map((f) => (
                <li key={f} className="font-serif-ko text-[14px] text-ink-soft leading-base flex gap-2">
                  <span aria-hidden className="mt-2 h-px w-2.5 bg-gold shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 label-mono">권장 액션</p>
            <ul className="mt-3 space-y-2">
              {result.recommended_actions.map((a) => (
                <li key={a} className="font-serif-ko text-[14px] text-ink-soft leading-base flex gap-2">
                  <span aria-hidden className="mt-2 h-px w-2.5 bg-gold shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>

            {result.similar_cases.length > 0 && (
              <>
                <p className="mt-6 label-mono">유사 사례</p>
                <ul className="mt-3 space-y-3">
                  {result.similar_cases.map((c, i) => (
                    <li key={i} className="font-serif-ko text-[14px] text-ink-soft leading-base">
                      <p className="font-semibold text-ink">{c.summary}</p>
                      <p className="mt-1 text-ink-mute">{c.result}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <Link
              href="/contact/insurer"
              className="mt-7 inline-flex items-center gap-1.5 px-5 py-3 bg-gold-deep text-paper rounded-sm font-sans-ko text-[14px] font-medium hover:bg-gold transition-colors"
            >
              <Sparkles size={14} /> 구상 위임 상담으로 이동 →
            </Link>

            {result.stub && (
              <p className="mt-4 font-mono text-[10px] uppercase tracking-label text-ink-mute">
                ⓘ API key 미설정 — 휴리스틱 stub 응답
              </p>
            )}
          </div>
        )}

        <LegalDisclaimer />
      </aside>
    </div>
  );
}
