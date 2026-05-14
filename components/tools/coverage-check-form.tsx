"use client";

import * as React from "react";
import { Upload, Sparkles, FileText } from "lucide-react";
import { Field, Textarea, Select } from "@/components/contact/form-primitives";
import { LegalDisclaimer } from "@/components/ai/legal-disclaimer";
import { consumeNdjsonStream } from "@/lib/ai/stream-client";
import { CoverageResultPanel, type CoverageResult } from "./coverage-result";
import { cn } from "@/lib/utils";

const categories = [
  { value: "auto",      label: "자동차보험 (사고)" },
  { value: "long-term", label: "장기보험 (실손·암·후유장해)" },
  { value: "fire",      label: "화재보험" },
  { value: "liability", label: "배상책임보험" },
  { value: "life",      label: "생명보험 (사망·재해)" },
  { value: "medical",   label: "의료분쟁 (진료·수술·시술)" },
  { value: "other",     label: "기타" },
];

type Step = 1 | 2 | 3;

export function CoverageCheckForm() {
  const [step, setStep] = React.useState<Step>(1);

  // Step 1
  const [policyMode, setPolicyMode] = React.useState<"pdf" | "text">("text");
  const [policyText, setPolicyText] = React.useState("");
  const [policyFile, setPolicyFile] = React.useState<File | null>(null);

  // Step 2
  const [category, setCategory] = React.useState("auto");
  const [occurredAt, setOccurredAt] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);

  // Step 3 (result)
  const [submitting, setSubmitting] = React.useState(false);
  const [reply, setReply] = React.useState("");
  const [result, setResult] = React.useState<CoverageResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const resultRef = React.useRef<HTMLDivElement | null>(null);

  const canProceedStep1 =
    (policyMode === "pdf" && policyFile) || (policyMode === "text" && policyText.trim().length > 30);
  const canProceedStep2 =
    description.trim().length >= 20 && agreed;

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setReply("");
    setResult(null);
    setStep(3);

    // Scroll result panel into view (page scroll OK here — single section)
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    try {
      const incident = {
        category,
        occurred_at: occurredAt || undefined,
        amount_estimate: amount || undefined,
        description,
      };

      let res: Response;
      if (policyMode === "pdf" && policyFile) {
        const fd = new FormData();
        fd.append("policy", policyFile);
        fd.append(
          "body",
          JSON.stringify({
            incident,
            acknowledged_disclaimer: true,
            policy_text: "",
          })
        );
        res = await fetch("/api/ai/coverage-check", { method: "POST", body: fd });
      } else {
        res = await fetch("/api/ai/coverage-check", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            policy_text: policyText,
            incident,
            acknowledged_disclaimer: true,
          }),
        });
      }

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.message ??
            "잠시 후 다시 시도해 주세요. 짧은 시간에 많은 요청이 감지되었습니다."
        );
        setSubmitting(false);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "분석 중 오류가 발생했습니다.");
        setSubmitting(false);
        return;
      }

      let accumulated = "";
      await consumeNdjsonStream(res, {
        onToken: (chunk) => {
          accumulated += chunk;
          setReply(accumulated);
        },
        onState: (payload) => {
          setResult(payload as CoverageResult);
        },
        onError: (msg) => {
          setError(msg);
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1);
    setPolicyText("");
    setPolicyFile(null);
    setOccurredAt("");
    setAmount("");
    setDescription("");
    setAgreed(false);
    setReply("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <ol className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-label">
        {[1, 2, 3].map((n) => (
          <li
            key={n}
            className={cn(
              "flex items-center gap-2",
              n < step && "text-forest",
              n === step && "text-ink",
              n > step && "text-ink-mute"
            )}
          >
            <span
              className={cn(
                "inline-flex items-center justify-center w-6 h-6 rounded-full border",
                n < step && "bg-forest text-paper border-forest",
                n === step && "bg-ink text-paper border-ink",
                n > step && "border-paper-3"
              )}
            >
              {n}
            </span>
            <span>
              {n === 1 ? "약관" : n === 2 ? "사고 정보" : "결과"}
            </span>
            {n < 3 && <span aria-hidden className="ml-1">→</span>}
          </li>
        ))}
      </ol>

      {/* Step 1 — Policy input */}
      {step === 1 && (
        <section className="space-y-6">
          <div>
            <p className="label-mono text-gold">STEP 1</p>
            <h2 className="mt-3 font-serif-ko text-h2 font-semibold text-ink">
              보험 약관을 입력해 주세요
            </h2>
            <p className="mt-3 font-serif-ko text-body-lg text-ink-soft leading-base">
              PDF 약관 전문이 있으면 업로드, 없으면 핵심 조항만 텍스트로 붙여넣어도
              됩니다. 입력된 약관은 분석 후 24시간 내 자동 삭제됩니다.
            </p>
          </div>

          {/* Mode toggle */}
          <div className="inline-flex border border-paper-3 rounded-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setPolicyMode("text")}
              className={cn(
                "px-4 py-2 font-sans-ko text-[14px]",
                policyMode === "text"
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink-soft hover:bg-paper-2"
              )}
            >
              텍스트 붙여넣기
            </button>
            <button
              type="button"
              onClick={() => setPolicyMode("pdf")}
              className={cn(
                "px-4 py-2 font-sans-ko text-[14px] border-l border-paper-3",
                policyMode === "pdf"
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink-soft hover:bg-paper-2"
              )}
            >
              PDF 업로드
            </button>
          </div>

          {policyMode === "text" ? (
            <Textarea
              id="policy-text"
              name="policy_text"
              label="약관 본문 (보장 항목 + 면책 사유 위주)"
              required
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              placeholder="예) 제1조 보장의 범위 — 본 보험은 다음 각 호의 사고를 보장한다… 제5조 면책사유 — 다음의 경우 보상하지 아니한다…"
              hint="최소 30자. 약관에서 가장 관련 있는 부분 위주로 입력하시면 됩니다."
            />
          ) : (
            <div>
              <label htmlFor="policy-pdf" className="label-mono block">
                약관 PDF <span className="text-rust">*</span>
              </label>
              <label
                htmlFor="policy-pdf"
                className={cn(
                  "mt-2 flex flex-col items-center justify-center gap-3",
                  "border-2 border-dashed border-paper-3 rounded-md py-10 px-6",
                  "cursor-pointer hover:border-ink transition-colors"
                )}
              >
                {policyFile ? (
                  <>
                    <FileText size={24} className="text-gold-deep" aria-hidden />
                    <p className="font-serif-ko text-body-lg text-ink">{policyFile.name}</p>
                    <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
                      {(policyFile.size / 1024).toFixed(0)} KB · 변경하려면 클릭
                    </p>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="text-ink-mute" aria-hidden />
                    <p className="font-serif-ko text-body-lg text-ink-soft">
                      PDF 파일을 클릭하거나 끌어다 놓으세요
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
                      최대 10MB · 24시간 후 자동 삭제
                    </p>
                  </>
                )}
              </label>
              <input
                id="policy-pdf"
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => setPolicyFile(e.target.files?.[0] ?? null)}
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-sm",
                "bg-gold-deep text-paper font-sans-ko text-[14.5px] font-medium",
                "hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              다음 단계 →
            </button>
          </div>
        </section>
      )}

      {/* Step 2 — Incident details */}
      {step === 2 && (
        <section className="space-y-6">
          <div>
            <p className="label-mono text-gold">STEP 2</p>
            <h2 className="mt-3 font-serif-ko text-h2 font-semibold text-ink">
              사고/질병 내용을 입력해 주세요
            </h2>
            <p className="mt-3 font-serif-ko text-body-lg text-ink-soft leading-base">
              간단한 사실 위주로 적어주세요. AI가 약관과 매칭해 보장 가능성과
              검토 대상을 안내합니다.
            </p>
          </div>

          <Select
            id="cv-category"
            name="category"
            label="사건 유형"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              id="cv-when"
              name="occurred_at"
              label="발생 시점 (선택)"
              type="date"
              value={occurredAt}
              onChange={(e) => setOccurredAt(e.target.value)}
            />
            <Field
              id="cv-amount"
              name="amount"
              label="추정 청구액 (선택)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="예) 500만원"
            />
          </div>

          <Textarea
            id="cv-description"
            name="description"
            label="사고/질병 설명"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="언제·어디서·무엇이 있었는지, 진단명·증상·관계자·확보한 자료 등을 가능한 자세히 적어주세요."
            hint="최소 20자. 가능한 사실 위주로 작성하시면 정확한 분석에 도움이 됩니다."
          />

          {/* Mandatory consent — strongest framing */}
          <div className="rounded-md border-2 border-rust/40 bg-rust/5 p-5">
            <p className="font-mono text-[11px] uppercase tracking-label text-rust mb-2">
              ⚠ 이용 동의 — 필수
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 accent-ink"
              />
              <span className="font-serif-ko text-[14px] text-ink leading-base">
                <strong>본 도구는 법률 자문이나 보험 상담이 아닙니다.</strong> 결과는 약관 텍스트와
                사고 정보를 매칭한 일반 정보 안내이며, 실제 보험금 지급 여부는 보험사·변호사
                상담을 통해 확정해야 함을 이해합니다. 입력 정보는 분석 후 24시간 내 자동 삭제됩니다.
              </span>
            </label>
          </div>

          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center px-5 py-3 border border-ink text-ink rounded-sm font-sans-ko text-[14.5px] font-medium hover:bg-paper-2 transition-colors"
            >
              ← 이전
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!canProceedStep2}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-sm",
                "bg-gold-deep text-paper font-sans-ko text-[14.5px] font-medium",
                "hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Sparkles size={14} aria-hidden /> 분석 시작
            </button>
          </div>
        </section>
      )}

      {/* Step 3 — Result */}
      {step === 3 && (
        <section ref={resultRef} className="space-y-6">
          <div>
            <p className="label-mono text-gold">STEP 3</p>
            <h2 className="mt-3 font-serif-ko text-h2 font-semibold text-ink">
              분석 결과
            </h2>
          </div>

          {error && (
            <div role="alert" className="rounded-md border border-rust bg-paper-2 p-5">
              <p className="font-serif-ko text-body text-rust">{error}</p>
              <button
                type="button"
                onClick={reset}
                className="mt-3 font-mono text-[11px] uppercase tracking-label text-ink underline-offset-4 hover:underline"
              >
                다시 시작
              </button>
            </div>
          )}

          <CoverageResultPanel reply={reply} result={result} loading={submitting} />

          {result && !submitting && (
            <div className="flex justify-between gap-3 pt-4">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center px-5 py-3 border border-ink text-ink rounded-sm font-sans-ko text-[14.5px] font-medium hover:bg-paper-2 transition-colors"
              >
                ↻ 다시 시작
              </button>
            </div>
          )}

          <LegalDisclaimer className="mt-8" />
        </section>
      )}
    </div>
  );
}
