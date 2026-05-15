"use client";

import * as React from "react";
import { FileText, Loader2, AlertCircle, Download, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BriefSkill, BriefField } from "@/lib/legal-briefs/skills";
import { computeCivilComplaint } from "@/lib/legal-briefs/calc";

type Stage = "form" | "followup" | "generating" | "result";

type GenerateResult = {
  stub: boolean;
  documentTitle: string;
  sections: { title: string; body: string }[];
  flags: { label: string; detail: string }[];
  calculations: { label: string; value: string; note?: string }[];
  message?: string;
};

export function BriefComposer({ skill }: { skill: BriefSkill }) {
  const [stage, setStage] = React.useState<Stage>("form");
  const [inputs, setInputs] = React.useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of skill.fields) init[f.name] = "";
    return init;
  });
  const [followUpAnswers, setFollowUpAnswers] = React.useState<string[]>(
    () => skill.followUpQuestions.map(() => "")
  );
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<GenerateResult | null>(null);
  const [downloading, setDownloading] = React.useState(false);

  const groupedFields = React.useMemo(() => {
    const map = new Map<string, BriefField[]>();
    for (const f of skill.fields) {
      const g = f.group ?? "기본";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(f);
    }
    return Array.from(map.entries());
  }, [skill]);

  const civilCalc = React.useMemo(() => {
    if (skill.slug !== "korean-civil-complaint-skill") return null;
    if (!inputs.principal) return null;
    try {
      return computeCivilComplaint({
        principal: Number(inputs.principal) || 0,
        partialRepayment: Number(inputs.partialRepayment) || 0,
        loanDate: inputs.loanDate || undefined,
        dueDate: inputs.dueDate || undefined,
        interestRatePct: Number(inputs.interestRate) || 0,
      });
    } catch {
      return null;
    }
  }, [inputs, skill.slug]);

  const missing = skill.fields
    .filter((f) => f.required && !inputs[f.name]?.trim())
    .map((f) => f.label);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (missing.length > 0) {
      setError(`필수 항목 미입력: ${missing.join(", ")}`);
      return;
    }
    setError(null);
    setStage("followup");
  };

  const handleGenerate = async () => {
    setError(null);
    setStage("generating");
    try {
      const res = await fetch("/api/admin/briefs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillSlug: skill.slug,
          inputs,
          followUpAnswers,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setResult(body as GenerateResult);
      setStage("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "생성 실패");
      setStage("followup");
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/admin/briefs/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillSlug: skill.slug,
          documentTitle: result.documentTitle,
          sections: result.sections,
          flags: result.flags,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${skill.name}_${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "다운로드 실패");
    } finally {
      setDownloading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setStage("form");
  };

  /* ─────────────────────────────────────────────── */

  if (stage === "form") {
    return (
      <form onSubmit={handleSubmitForm} className="space-y-10">
        <header>
          <p className="font-mono text-[11px] uppercase tracking-label text-gold">
            STEP 1 / 3 · 사실관계 입력
          </p>
          <h2 className="mt-2 font-serif-ko text-h2 text-ink font-semibold">
            사건 정보를 채워 주세요
          </h2>
          <p className="mt-2 font-serif-ko text-[14.5px] text-ink-soft">
            필수 항목을 채우면 스킬이 자동으로 체크리스트를 검증하고 추가 질문 단계로 넘어갑니다.
          </p>
        </header>

        {groupedFields.map(([group, fields]) => (
          <fieldset key={group} className="border border-paper-3 rounded-sm p-5 lg:p-6">
            <legend className="px-2 font-mono text-[11px] uppercase tracking-label text-ink">
              {group}
            </legend>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((f) => (
                <FieldInput
                  key={f.name}
                  field={f}
                  value={inputs[f.name]}
                  onChange={(v) =>
                    setInputs((s) => ({ ...s, [f.name]: v }))
                  }
                />
              ))}
            </div>
          </fieldset>
        ))}

        {civilCalc && civilCalc.estimatedSoga > 0 && (
          <div className="border border-gold-deep/30 bg-gold-deep/5 rounded-sm p-5">
            <p className="font-mono text-[11px] uppercase tracking-label text-gold-deep">
              자동 계산 — 인지대 · 송달료
            </p>
            <ul className="mt-3 space-y-1.5">
              {civilCalc.notes.map((n, i) => (
                <li key={i} className="font-serif-ko text-[14px] text-ink-soft">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-sm border border-rust/40 bg-rust/5 p-3">
            <AlertCircle size={15} className="text-rust mt-0.5" />
            <p className="font-serif-ko text-[14px] text-rust">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-paper-3 pt-6">
          <p className="font-mono text-[10px] uppercase tracking-label text-ink-mute">
            필수 항목 {skill.fields.filter((f) => f.required).length}개 · 자동 검증 후 다음 단계로
          </p>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm bg-ink text-paper font-sans-ko text-[14px] font-medium hover:bg-night"
          >
            추가 질문 단계 <ChevronRight size={15} />
          </button>
        </div>
      </form>
    );
  }

  /* ─────────────────────────────────────────────── */

  if (stage === "followup") {
    return (
      <div className="space-y-8">
        <header>
          <p className="font-mono text-[11px] uppercase tracking-label text-gold">
            STEP 2 / 3 · 추가 질문
          </p>
          <h2 className="mt-2 font-serif-ko text-h2 text-ink font-semibold">
            스킬이 확인하고 싶은 정보
          </h2>
          <p className="mt-2 font-serif-ko text-[14.5px] text-ink-soft">
            아래 질문에 답하지 않아도 생성은 가능합니다. 답이 있을수록 초안 품질이 올라갑니다.
          </p>
        </header>

        <div className="space-y-5">
          {skill.followUpQuestions.map((q, i) => (
            <div key={i}>
              <label className="block font-serif-ko text-[14.5px] text-ink font-semibold">
                Q{i + 1}. {q}
              </label>
              <textarea
                rows={2}
                value={followUpAnswers[i]}
                onChange={(e) => {
                  const next = [...followUpAnswers];
                  next[i] = e.target.value;
                  setFollowUpAnswers(next);
                }}
                className="mt-2 w-full rounded-sm border border-paper-3 bg-paper p-3 font-serif-ko text-[14px] text-ink focus:border-ink focus:outline-none"
                placeholder="(선택) 자유롭게 답변"
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-sm border border-rust/40 bg-rust/5 p-3">
            <AlertCircle size={15} className="text-rust mt-0.5" />
            <p className="font-serif-ko text-[14px] text-rust">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-paper-3 pt-6">
          <button
            type="button"
            onClick={() => setStage("form")}
            className="font-mono text-[11px] uppercase tracking-label text-ink-mute hover:text-ink"
          >
            ← 이전 단계
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm bg-gold-deep text-paper font-sans-ko text-[14px] font-medium hover:bg-gold"
          >
            <Sparkles size={14} /> 서면 초안 생성
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────── */

  if (stage === "generating") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <Loader2 size={28} className="animate-spin text-ink" />
        <p className="font-serif-ko text-h3 text-ink font-semibold">
          {skill.name} 초안을 생성하고 있습니다…
        </p>
        <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute max-w-md">
          체크리스트 검증 → 사실관계 정리 → 청구취지·청구원인 작성 → 입증방법 정리
        </p>
      </div>
    );
  }

  /* ─────────────────────────────────────────────── */

  if (stage === "result" && result) {
    return (
      <div className="space-y-8">
        <header>
          <p className="font-mono text-[11px] uppercase tracking-label text-gold">
            STEP 3 / 3 · 결과 · {result.stub ? "예시 데이터" : "AI 생성"}
          </p>
          <h2 className="mt-2 font-serif-ko text-h2 text-ink font-semibold">
            {result.documentTitle}
          </h2>
          {result.stub && result.message && (
            <p className="mt-2 font-mono text-[11px] uppercase tracking-label text-ink-mute">
              ⓘ {result.message}
            </p>
          )}
        </header>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-ink text-paper font-sans-ko text-[14px] font-medium hover:bg-night disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            .docx 다운로드 (함초롬바탕)
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm border border-paper-3 font-sans-ko text-[13.5px] text-ink hover:bg-paper-2"
          >
            <RotateCcw size={13} /> 다시 작성
          </button>
        </div>

        {result.flags.length > 0 && (
          <section className="rounded-sm border border-gold-deep/40 bg-gold-deep/5 p-5">
            <p className="font-mono text-[11px] uppercase tracking-label text-gold-deep">
              변호사 확인 필요 사항
            </p>
            <ul className="mt-3 space-y-3">
              {result.flags.map((f, i) => (
                <li key={i}>
                  <p className="font-serif-ko text-[14.5px] text-ink font-semibold">
                    • {f.label}
                  </p>
                  <p className="mt-1 ml-4 font-serif-ko text-[13.5px] text-ink-soft">
                    {f.detail}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {result.calculations.length > 0 && (
          <section className="rounded-sm border border-paper-3 p-5">
            <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
              계산 내역
            </p>
            <table className="mt-3 w-full">
              <tbody>
                {result.calculations.map((c, i) => (
                  <tr key={i} className="border-b border-paper-3 last:border-0">
                    <td className="py-2 pr-4 font-serif-ko text-[13.5px] text-ink-soft align-top">
                      {c.label}
                    </td>
                    <td className="py-2 pr-4 font-serif-ko text-[13.5px] text-ink font-semibold whitespace-nowrap">
                      {c.value}
                    </td>
                    <td className="py-2 font-mono text-[11px] text-ink-mute">
                      {c.note ?? ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section className="space-y-6">
          {result.sections.map((s, i) => (
            <div key={i} className="border border-paper-3 rounded-sm p-5 lg:p-6">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-ink-mute" />
                <h3 className="font-serif-ko text-h3 text-ink font-semibold">
                  {s.title}
                </h3>
              </div>
              <pre className="mt-4 whitespace-pre-wrap font-serif-ko text-[14.5px] text-ink leading-base">
                {s.body}
              </pre>
            </div>
          ))}
        </section>

        {error && (
          <div className="flex items-start gap-2 rounded-sm border border-rust/40 bg-rust/5 p-3">
            <AlertCircle size={15} className="text-rust mt-0.5" />
            <p className="font-serif-ko text-[14px] text-rust">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

/* ──────────────────────────────────────────────────────────────── */

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: BriefField;
  value: string;
  onChange: (v: string) => void;
}) {
  const className = cn(
    "w-full rounded-sm border border-paper-3 bg-paper px-3 py-2",
    "font-serif-ko text-[14px] text-ink placeholder:text-ink-mute",
    "focus:border-ink focus:outline-none"
  );
  const labelClass = "block font-mono text-[11px] uppercase tracking-label text-ink-mute mb-1.5";
  const wrap =
    field.type === "textarea" ? "md:col-span-2" : "";

  return (
    <div className={wrap}>
      <label htmlFor={field.name} className={labelClass}>
        {field.label}
        {field.required && <span className="ml-1 text-rust">*</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea
          id={field.name}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
          placeholder={field.placeholder}
        />
      ) : field.type === "select" ? (
        <select
          id={field.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        >
          <option value="">선택…</option>
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={field.name}
          type={
            field.type === "date"
              ? "date"
              : field.type === "money"
                ? "number"
                : field.type === "tel"
                  ? "tel"
                  : "text"
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
          placeholder={field.placeholder}
          inputMode={field.type === "money" ? "numeric" : undefined}
        />
      )}
      {field.hint && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-label text-ink-mute">
          {field.hint}
        </p>
      )}
    </div>
  );
}
