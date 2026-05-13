"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitConsultation, type ConsultationResult } from "@/app/(marketing)/contact/actions";
import { Field, Textarea, Select, AgreementCheckbox, FormStatus, SubmitButton } from "./form-primitives";

function Submit() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>의료분쟁 상담 신청</SubmitButton>;
}

export function MedicalForm() {
  const [state, formAction] = useFormState<ConsultationResult | null, FormData>(
    submitConsultation,
    null
  );
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="persona" value="medical" />

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="med-patientName" name="patientName" label="성함" required error={errors.patientName} />
        <Field id="med-phone" name="phone" label="연락처" type="tel" required error={errors.phone} />
        <Field id="med-email" name="email" label="이메일" type="email" error={errors.email} hint="선택 — 결과 회신용" />
        <Field id="med-hospital" name="hospital" label="진료 기관" error={errors.hospital} hint="아는 범위에서" />
        <Field id="med-visitDate" name="visitDate" label="진료 시점" type="date" error={errors.visitDate} />
        <Select
          id="med-hasRecords"
          name="hasRecords"
          label="의무기록 보유 여부"
          required
          error={errors.hasRecords}
          options={[
            { value: "unknown", label: "잘 모르겠음" },
            { value: "yes", label: "보유 중" },
            { value: "no", label: "미보유 (확보 절차 안내 요청)" },
          ]}
        />
      </div>

      <Textarea
        id="med-caseSummary"
        name="caseSummary"
        label="사건 개요"
        required
        error={errors.caseSummary}
        hint="진료 경위·증상·이상이 의심된 시점 등 가능한 범위에서 적어 주세요."
      />

      <Field
        id="med-preferredDate"
        name="preferredDate"
        label="1차 상담 희망 일시"
        type="datetime-local"
        error={errors.preferredDate}
        hint="선택 — 일정에 맞춰 조율합니다"
      />

      <div className="rounded-sm bg-paper-2 border border-paper-3 p-5">
        <p className="font-mono text-[11px] uppercase tracking-label text-gold mb-2">의료 민감정보 처리 안내</p>
        <p className="font-serif-ko text-body text-ink-soft leading-base">
          의료분쟁 상담 정보는 일반 상담과 분리된 환경에서 처리됩니다. 의무기록은 별도 보안
          링크를 통해서만 업로드받으며, 동의 없이 외부 AI API로 전송하지 않습니다.
        </p>
      </div>

      <AgreementCheckbox persona="medical" />
      {errors.agreement && (
        <p className="font-sans-ko text-[12.5px] text-rust -mt-4">{errors.agreement}</p>
      )}

      <FormStatus result={state} />
      <Submit />
    </form>
  );
}
