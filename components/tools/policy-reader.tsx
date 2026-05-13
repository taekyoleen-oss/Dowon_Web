"use client";

import * as React from "react";
import { Upload, ShieldCheck } from "lucide-react";
import { LegalDisclaimer } from "@/components/ai/legal-disclaimer";
import { cn } from "@/lib/utils";

type Coverage = { item: string; limit: string; conditions: string[]; source_page: number };
type Exclusion = { clause: string; interpretation: string; related_cases: string[]; source_page: number };
type AnalyzeResult = {
  document_summary: string;
  coverage: Coverage[];
  exclusions: Exclusion[];
  user_question_answer?: string | null;
  stub?: boolean;
};

export function PolicyReader() {
  const [file, setFile] = React.useState<File | null>(null);
  const [type, setType] = React.useState("coverage");
  const [question, setQuestion] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<AnalyzeResult | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("PDF 파일을 첨부해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("analysis_type", type);
      if (question) fd.set("user_question", question);
      const res = await fetch("/api/ai/policy-analyze", { method: "POST", body: fd });
      if (res.status === 401) {
        setError("권한이 없습니다. 관리자/보험사 인증이 필요합니다.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "분석 중 오류가 발생했습니다.");
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="pdf" className="label-mono block">
            약관/증권 PDF <span className="text-rust">*</span>
          </label>
          <label
            htmlFor="pdf"
            className={cn(
              "mt-2 flex flex-col items-center justify-center gap-3",
              "border-2 border-dashed border-paper-3 rounded-md py-12 px-6",
              "cursor-pointer hover:border-ink transition-colors"
            )}
          >
            <Upload size={28} className="text-ink-mute" aria-hidden />
            <p className="font-serif-ko text-body-lg text-ink-soft">
              {file ? file.name : "PDF 파일을 클릭하거나 끌어다 놓으세요"}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
              최대 10MB · 24시간 후 자동 삭제
            </p>
          </label>
          <input
            id="pdf"
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div>
          <label htmlFor="atype" className="label-mono block">분석 유형</label>
          <select
            id="atype"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-2 w-full px-4 py-3 bg-paper border border-paper-3 rounded-sm font-serif-ko text-body text-ink focus:outline-none focus:border-ink"
          >
            <option value="coverage">보장 분석</option>
            <option value="exclusion">면책 분석</option>
            <option value="comparison">조항 비교</option>
          </select>
        </div>

        <div>
          <label htmlFor="qst" className="label-mono block">특정 쟁점 질문 (선택)</label>
          <input
            id="qst"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="예: 무보험차상해 면책 적용 여부"
            className="mt-2 w-full px-4 py-3 bg-paper border border-paper-3 rounded-sm font-serif-ko text-body text-ink focus:outline-none focus:border-ink"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-deep text-paper rounded-sm font-sans-ko text-[15.5px] font-medium tracking-wide hover:bg-gold transition-colors disabled:opacity-60"
        >
          {loading ? "분석 중..." : "약관 분석 시작"}
        </button>

        {error && (
          <p role="alert" className="text-rust font-serif-ko text-body">{error}</p>
        )}

        <div className="rounded-sm bg-paper-2 border border-paper-3 p-5 flex gap-3">
          <ShieldCheck size={18} className="shrink-0 mt-0.5 text-gold-deep" aria-hidden />
          <p className="font-serif-ko text-[13.5px] text-ink-soft leading-base">
            업로드 PDF는 분석 처리 후 24시간 내 자동 삭제됩니다. 외부 모델에 데이터가
            저장되지 않도록 Anthropic 비훈련(no-training) 정책을 적용합니다. 의무기록 등
            의료 민감정보는 본 도구가 아닌 의료 분석 전용 라인을 이용해 주세요.
          </p>
        </div>
      </form>

      <aside className="space-y-4">
        {result && (
          <>
            <div className="bg-paper border border-paper-3 rounded-md p-6">
              <p className="label-mono text-gold">DOCUMENT SUMMARY</p>
              <p className="mt-3 font-serif-ko text-body-lg text-ink leading-base">
                {result.document_summary}
              </p>

              {result.coverage.length > 0 && (
                <>
                  <p className="mt-6 label-mono">보장 항목</p>
                  <ul className="mt-3 space-y-3">
                    {result.coverage.map((c, i) => (
                      <li key={i} className="font-serif-ko text-[14px] leading-base">
                        <p className="text-ink font-semibold">{c.item}</p>
                        <p className="text-ink-soft">한도: {c.limit}</p>
                        {c.conditions.length > 0 && (
                          <p className="text-ink-mute">조건: {c.conditions.join(", ")}</p>
                        )}
                        <p className="font-mono text-[10px] text-ink-mute">p.{c.source_page}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {result.exclusions.length > 0 && (
                <>
                  <p className="mt-6 label-mono">면책 사유</p>
                  <ul className="mt-3 space-y-3">
                    {result.exclusions.map((e, i) => (
                      <li key={i} className="font-serif-ko text-[14px] leading-base">
                        <p className="text-ink font-semibold">{e.clause}</p>
                        <p className="text-ink-soft">{e.interpretation}</p>
                        <p className="font-mono text-[10px] text-ink-mute">p.{e.source_page}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {result.user_question_answer && (
                <>
                  <p className="mt-6 label-mono">질문 답변</p>
                  <p className="mt-2 font-serif-ko text-body text-ink-soft leading-base">
                    {result.user_question_answer}
                  </p>
                </>
              )}

              {result.stub && (
                <p className="mt-4 font-mono text-[10px] uppercase tracking-label text-ink-mute">
                  ⓘ ANTHROPIC_API_KEY 미설정 — stub 응답
                </p>
              )}
            </div>
          </>
        )}

        <LegalDisclaimer />
      </aside>
    </div>
  );
}
