"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { submitConsultation, type ConsultationResult } from "@/app/(marketing)/contact/actions";
import { Field, Textarea, Select, AgreementCheckbox, FormStatus, SubmitButton } from "./form-primitives";

function Submit() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>무료 1차 상담 신청</SubmitButton>;
}

export function PersonalForm() {
  const [state, formAction] = useFormState<ConsultationResult | null, FormData>(
    submitConsultation,
    null
  );
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="persona" value="personal" />

      <Link
        href="/tools/triage"
        className="block rounded-sm bg-paper-2 border border-paper-3 p-5 hover:border-ink transition-colors"
      >
        <p className="font-mono text-[11px] uppercase tracking-label text-gold mb-2 inline-flex items-center gap-1.5">
          <Sparkles size={12} /> AI 사건 유형 진단
        </p>
        <p className="font-serif-ko text-body-lg text-ink leading-base">
          상황을 자연어로 설명하면 사건 유형·필요 자료·예상 절차를 안내해드립니다. (선택)
        </p>
      </Link>

      <Select
        id="per-matterType"
        name="matterType"
        label="사건 유형"
        required
        error={errors.matterType}
        options={[
          { value: "자동차", label: "자동차보험·교통사고" },
          { value: "생명보험금", label: "생명보험금" },
          { value: "배상책임", label: "배상책임" },
          { value: "기타", label: "기타" },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="per-applicantName" name="applicantName" label="성함" required error={errors.applicantName} />
        <Field id="per-phone" name="phone" label="연락처" type="tel" required error={errors.phone} />
      </div>

      <Textarea
        id="per-caseSummary"
        name="caseSummary"
        label="사건 개요"
        required
        error={errors.caseSummary}
        hint="언제·어디서·무엇이 있었는지, 보유한 자료가 있다면 함께 적어 주세요."
      />

      <Select
        id="per-preferredMethod"
        name="preferredMethod"
        label="희망 상담 방식"
        error={errors.preferredMethod}
        options={[
          { value: "전화", label: "전화" },
          { value: "방문", label: "방문" },
          { value: "온라인", label: "온라인 (영상)" },
        ]}
      />

      <AgreementCheckbox persona="personal" />
      {errors.agreement && (
        <p className="font-sans-ko text-[12.5px] text-rust -mt-4">{errors.agreement}</p>
      )}

      <FormStatus result={state} />
      <Submit />
    </form>
  );
}
