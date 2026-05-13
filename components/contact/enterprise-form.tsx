"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitConsultation, type ConsultationResult } from "@/app/(marketing)/contact/actions";
import { Field, Textarea, AgreementCheckbox, FormStatus, SubmitButton } from "./form-primitives";

function Submit() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>자문 문의 보내기</SubmitButton>;
}

export function EnterpriseForm() {
  const [state, formAction] = useFormState<ConsultationResult | null, FormData>(
    submitConsultation,
    null
  );
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="persona" value="enterprise" />

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="ent-company" name="company" label="회사명" required error={errors.company} />
        <Field id="ent-industry" name="industry" label="산업 분야" hint="선택 항목" error={errors.industry} />
        <Field id="ent-contactName" name="contactName" label="담당자명" required error={errors.contactName} />
        <Field id="ent-phone" name="phone" label="연락처" type="tel" required error={errors.phone} />
        <Field id="ent-email" name="email" label="이메일" type="email" required error={errors.email} className="md:col-span-2" />
      </div>

      <Textarea
        id="ent-caseSummary"
        name="caseSummary"
        label="문의 내용"
        required
        error={errors.caseSummary}
        hint="자문 범위·기대 시점·기존 자문 구조가 있다면 함께 적어 주세요."
      />

      <AgreementCheckbox persona="enterprise" />
      {errors.agreement && (
        <p className="font-sans-ko text-[12.5px] text-rust -mt-4">{errors.agreement}</p>
      )}

      <FormStatus result={state} />
      <Submit />
    </form>
  );
}
