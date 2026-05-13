"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  className?: string;
};

export function Field({
  id, name, label, hint, required, error, className,
  type = "text",
  ...rest
}: FieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label-mono block">
        {label}{required && <span className="text-rust ml-1">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={hint || error ? `${id}-hint` : undefined}
        className={cn(
          "mt-2 w-full px-4 py-3",
          "bg-paper border rounded-sm",
          "font-serif-ko text-body text-ink placeholder:text-ink-mute",
          "focus:outline-none focus:border-ink",
          error ? "border-rust" : "border-paper-3"
        )}
        {...rest}
      />
      {(error || hint) && (
        <p
          id={`${id}-hint`}
          className={cn(
            "mt-2 font-sans-ko text-[12.5px]",
            error ? "text-rust" : "text-ink-mute"
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export function Textarea({
  id, name, label, hint, required, error, className, ...rest
}: FieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label-mono block">
        {label}{required && <span className="text-rust ml-1">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={6}
        aria-invalid={!!error}
        aria-describedby={hint || error ? `${id}-hint` : undefined}
        className={cn(
          "mt-2 w-full px-4 py-3",
          "bg-paper border rounded-sm",
          "font-serif-ko text-body text-ink placeholder:text-ink-mute leading-base",
          "focus:outline-none focus:border-ink",
          error ? "border-rust" : "border-paper-3"
        )}
        {...rest}
      />
      {(error || hint) && (
        <p
          id={`${id}-hint`}
          className={cn(
            "mt-2 font-sans-ko text-[12.5px]",
            error ? "text-rust" : "text-ink-mute"
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export function Select({
  id, name, label, hint, required, error, className, options, ...rest
}: FieldProps & {
  options: Array<{ value: string; label: string }>;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children">) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label-mono block">
        {label}{required && <span className="text-rust ml-1">*</span>}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        aria-invalid={!!error}
        className={cn(
          "mt-2 w-full px-4 py-3",
          "bg-paper border rounded-sm",
          "font-serif-ko text-body text-ink",
          "focus:outline-none focus:border-ink",
          error ? "border-rust" : "border-paper-3"
        )}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {(error || hint) && (
        <p className={cn("mt-2 font-sans-ko text-[12.5px]", error ? "text-rust" : "text-ink-mute")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export function AgreementCheckbox({ persona }: { persona: string }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        name="agreement"
        value="on"
        required
        className="mt-1 h-4 w-4 accent-ink"
      />
      <span className="font-serif-ko text-[14px] text-ink-soft leading-base">
        개인정보 수집·이용에 동의합니다. (수집 항목: 위 입력 정보 · 이용 목적: 상담 진행 ·
        보유 기간: 상담 종료 후 3년 또는 법령상 보존 기간){persona === "medical" && " · 의료 민감정보 별도 격리 저장에 동의합니다."}
      </span>
    </label>
  );
}

export function FormStatus({ result }: { result: { ok: boolean; message: string } | null }) {
  if (!result) return null;
  return (
    <div
      role={result.ok ? "status" : "alert"}
      className={cn(
        "rounded-sm border p-5",
        result.ok ? "border-forest bg-paper-2 text-forest" : "border-rust bg-paper-2 text-rust"
      )}
    >
      <p className="font-serif-ko text-body-lg font-semibold">
        {result.ok ? "✓ 접수 완료" : "⚠ 전송 실패"}
      </p>
      <p className="mt-2 font-serif-ko text-body leading-base">{result.message}</p>
    </div>
  );
}

export function SubmitButton({ children, pending }: { children: React.ReactNode; pending?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center px-8 py-4",
        "bg-gold-deep text-paper rounded-sm",
        "font-sans-ko text-[15.5px] font-medium tracking-wide",
        "transition-colors duration-fast hover:bg-gold",
        "disabled:opacity-60 disabled:cursor-not-allowed"
      )}
    >
      {pending ? "전송 중..." : children}
    </button>
  );
}
