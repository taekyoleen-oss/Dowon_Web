"use client";

import { useFormState, useFormStatus } from "react-dom";
import { adminLogin, type AdminLoginResult } from "./actions";
import { Field, SubmitButton, FormStatus } from "@/components/contact/form-primitives";

function Submit() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending}>로그인</SubmitButton>;
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState<AdminLoginResult | null, FormData>(
    adminLogin,
    null
  );
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-6">
      <div className="w-full max-w-md">
        <p className="font-mono text-[11px] uppercase tracking-label text-gold">DOWON ADMIN</p>
        <h1 className="mt-3 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-tight">
          Sign in
        </h1>
        <p className="mt-3 font-serif-ko text-body-lg text-ink-soft">
          변호사 화이트리스트에 등록된 이메일로만 접근할 수 있습니다.
        </p>

        <form action={formAction} className="mt-10 space-y-5">
          <Field
            id="adm-email"
            name="email"
            label="이메일"
            type="email"
            required
            error={state?.error}
            placeholder="you@dowonlaw.com"
          />
          <FormStatus result={state ? { ok: state.ok, message: state.message ?? "" } : null} />
          <Submit />
          <p className="font-mono text-[10px] uppercase tracking-label text-ink-mute">
            ⓘ ADMIN_EMAIL_WHITELIST env 의 값과 일치해야 합니다. 2FA는 Phase 3 Week 10에 추가됩니다.
          </p>
        </form>
      </div>
    </div>
  );
}
