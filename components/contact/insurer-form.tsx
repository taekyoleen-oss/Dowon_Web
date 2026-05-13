"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitConsultation, type ConsultationResult } from "@/app/(marketing)/contact/actions";
import {
  Field,
  Textarea,
  Select,
  AgreementCheckbox,
  FormStatus,
  SubmitButton,
} from "./form-primitives";

function Submit() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>상담 요청 보내기</SubmitButton>;
}

export function InsurerForm() {
  const [state, formAction] = useFormState<ConsultationResult | null, FormData>(
    submitConsultation,
    null
  );
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="persona" value="insurer" />

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="ins-company" name="company" label="회사명" required error={errors.company} />
        <Field id="ins-department" name="department" label="부서" hint="선택 항목" error={errors.department} />
        <Field id="ins-contactName" name="contactName" label="담당자명" required error={errors.contactName} />
        <Field id="ins-phone" name="phone" label="연락처" type="tel" required error={errors.phone} placeholder="02-XXXX-XXXX" />
        <Field id="ins-email" name="email" label="이메일" type="email" required error={errors.email} className="md:col-span-2" />
      </div>

      <Select
        id="ins-requestType"
        name="requestType"
        label="의뢰 유형"
        required
        error={errors.requestType}
        options={[
          { value: "자문계약", label: "자문계약" },
          { value: "개별 사건", label: "개별 사건" },
          { value: "SIU 협업", label: "SIU 협업" },
          { value: "구상 위임", label: "구상 위임" },
        ]}
      />

      <Textarea
        id="ins-caseSummary"
        name="caseSummary"
        label="사건 개요"
        required
        error={errors.caseSummary}
        hint="가능한 범위에서 사건의 사실 관계·쟁점·관련 자료 보유 여부를 적어주세요."
      />

      <div className="rounded-sm bg-paper-2 border border-paper-3 p-5">
        <p className="font-mono text-[11px] uppercase tracking-label text-gold mb-2">SECURITY</p>
        <p className="font-serif-ko text-body text-ink-soft leading-base">
          제출 정보는 도원 내부 변호사·운영진만 열람할 수 있도록 처리됩니다.
          업로드 파일이 필요한 경우 회신 메일에서 보안 링크가 발급됩니다.
        </p>
      </div>

      <AgreementCheckbox persona="insurer" />
      {errors.agreement && (
        <p className="font-sans-ko text-[12.5px] text-rust -mt-4">{errors.agreement}</p>
      )}

      <FormStatus result={state} />
      <Submit />
    </form>
  );
}
