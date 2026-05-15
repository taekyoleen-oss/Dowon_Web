"use client";

import * as React from "react";
import { Upload, Copy, Calendar, FileText, ListChecks, BookOpen, CheckCircle2, ShieldAlert } from "lucide-react";
import { LegalDisclaimer } from "@/components/ai/legal-disclaimer";
import { cn } from "@/lib/utils";
import { buildIcs, type IcsEvent } from "@/lib/utils/ics";
import { daysUntil, formatDday } from "@/lib/utils/date";

type CalendarEvent = {
  date: string;
  label: string;
  importance: "high" | "medium" | "low";
};

type TranslateResult = {
  doc_type: string;
  summary_3lines: string[];
  plain_terms: Array<{ term: string; plain: string }>;
  action_items: string[];
  calendar_events: CalendarEvent[];
  truncated?: boolean;
  pii_hits?: Array<{ id: string; label: string; count: number }>;
  stub?: boolean;
};

export function DocumentTranslatorForm() {
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<TranslateResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);

  const acceptFile = (f: File | null | undefined) => {
    if (!f) return;
    if (f.type && f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("PDF 파일만 지원합니다.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("파일이 너무 큽니다 (최대 10MB).");
      return;
    }
    setError(null);
    setFile(f);
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    setDragOver(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    acceptFile(f);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("PDF 파일을 첨부해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/ai/translate-document", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "분석 중 오류가 발생했습니다.");
        return;
      }
      const data = (await res.json()) as TranslateResult;
      setResult(data);
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const onCopyMarkdown = async () => {
    if (!result) return;
    const md = renderMarkdown(result);
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const onDownloadIcs = () => {
    if (!result || result.calendar_events.length === 0) return;
    const events: IcsEvent[] = result.calendar_events.map((ev) => ({
      date: ev.date,
      label: ev.label,
      description: `중요도: ${ev.importance}`,
    }));
    const ics = buildIcs(events, `도원 — ${result.doc_type || "문서"} 일정`);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dowon-${(result.doc_type || "document").replace(/[^\w가-힣]/g, "_")}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_440px]">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="doc-pdf" className="label-mono block">
            문서 PDF <span className="text-rust">*</span>
          </label>
          <label
            htmlFor="doc-pdf"
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              "mt-2 flex flex-col items-center justify-center gap-3",
              "border-2 border-dashed rounded-md py-12 px-6",
              "cursor-pointer transition-colors",
              dragOver
                ? "border-gold-deep bg-gold-deep/5"
                : "border-paper-3 hover:border-ink"
            )}
          >
            <Upload size={28} className="text-ink-mute" aria-hidden />
            <p className="font-serif-ko text-body-lg text-ink-soft pointer-events-none">
              {file
                ? file.name
                : dragOver
                  ? "여기에 놓으세요"
                  : "PDF 파일을 클릭하거나 끌어다 놓으세요"}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute pointer-events-none">
              최대 10MB · 텍스트 추출 후 즉시 분석
            </p>
          </label>
          <input
            id="doc-pdf"
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={(e) => acceptFile(e.target.files?.[0])}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-deep text-paper rounded-sm font-sans-ko text-[15.5px] font-medium tracking-wide hover:bg-gold transition-colors disabled:opacity-60"
        >
          {loading ? "정리 중..." : "문서 정리 시작"}
        </button>

        {error && (
          <p role="alert" className="text-rust font-serif-ko text-body">
            {error}
          </p>
        )}

        <div className="rounded-sm bg-paper-2 border border-paper-3 p-5 flex gap-3">
          <ShieldAlert size={18} className="shrink-0 mt-0.5 text-gold-deep" aria-hidden />
          <div className="font-serif-ko text-[13.5px] text-ink-soft leading-base">
            <p>
              업로드한 PDF는 텍스트 추출 후 즉시 폐기되며, 저장되지 않습니다. 추출된 텍스트의
              주민번호·계좌·카드·사건번호·전화번호는 자동 마스킹된 뒤 AI 분석에 사용됩니다.
            </p>
            <p className="mt-2">
              본 도구는 받으신 문서를 이해하시는 데 도움을 드리는 정보 정리 도우미이며,
              법률 자문이 아닙니다. 실제 대응은 변호사 상담을 통해 진행해 주세요.
            </p>
          </div>
        </div>
      </form>

      <aside className="space-y-4">
        {result && (
          <>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onCopyMarkdown}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm border border-ink text-ink font-sans-ko text-[13px] font-medium hover:bg-paper-2 transition-colors"
              >
                {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                {copied ? "복사됨" : "Markdown 복사"}
              </button>
              {result.calendar_events.length > 0 && (
                <button
                  type="button"
                  onClick={onDownloadIcs}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-ink text-paper font-sans-ko text-[13px] font-medium hover:bg-ink-soft transition-colors"
                >
                  <Calendar size={13} /> 캘린더 다운로드 (.ics)
                </button>
              )}
            </div>

            <div className="bg-paper border border-paper-3 rounded-md p-6">
              <div className="flex items-baseline justify-between">
                <p className="label-mono text-gold inline-flex items-center gap-1.5">
                  <FileText size={12} aria-hidden /> {result.doc_type || "문서 정리"}
                </p>
                {result.stub && (
                  <p className="font-mono text-[10px] uppercase tracking-label text-ink-mute">
                    ⓘ STUB
                  </p>
                )}
              </div>

              <div className="mt-5">
                <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
                  3줄 요약
                </p>
                <ul className="mt-2 space-y-2">
                  {result.summary_3lines.map((s, i) => (
                    <li key={i} className="font-serif-ko text-[15px] text-ink leading-base">
                      <span className="text-gold-deep mr-2">·</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {result.plain_terms.length > 0 && (
                <div className="mt-6">
                  <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute inline-flex items-center gap-1.5">
                    <BookOpen size={11} aria-hidden /> 쉬운 말 풀이
                  </p>
                  <dl className="mt-2 space-y-3">
                    {result.plain_terms.map((t, i) => (
                      <div key={i} className="border-l-2 border-paper-3 pl-3">
                        <dt className="font-serif-ko text-[14px] font-semibold text-ink">
                          {t.term}
                        </dt>
                        <dd className="mt-0.5 font-serif-ko text-[13.5px] text-ink-soft leading-base">
                          {t.plain}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {result.action_items.length > 0 && (
                <div className="mt-6">
                  <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute inline-flex items-center gap-1.5">
                    <ListChecks size={11} aria-hidden /> 할 일
                  </p>
                  <ul className="mt-2 space-y-2">
                    {result.action_items.map((a, i) => (
                      <li key={i} className="flex items-start gap-2.5 font-serif-ko text-[14px] text-ink leading-base">
                        <span className="mt-0.5 inline-block h-3.5 w-3.5 rounded-[3px] border border-ink-mute shrink-0" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.calendar_events.length > 0 && (
                <div className="mt-6">
                  <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute inline-flex items-center gap-1.5">
                    <Calendar size={11} aria-hidden /> 일정
                  </p>
                  <ul className="mt-2 space-y-2.5">
                    {[...result.calendar_events]
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map((ev, i) => {
                        const days = daysUntil(ev.date);
                        const urgent = days !== null && days >= 0 && days <= 7;
                        return (
                          <li key={i} className="flex items-start gap-3">
                            <span
                              className={cn(
                                "shrink-0 inline-flex items-center justify-center min-w-[60px] px-2 py-1 rounded-sm",
                                "font-mono text-[11px] font-semibold tracking-label",
                                ev.importance === "high" || urgent
                                  ? "bg-gold-deep text-paper"
                                  : ev.importance === "medium"
                                    ? "bg-paper-2 text-ink"
                                    : "bg-paper-2 text-ink-mute"
                              )}
                            >
                              {formatDday(days)}
                            </span>
                            <div>
                              <p className="font-serif-ko text-[14px] font-semibold text-ink leading-snug">
                                {ev.label}
                              </p>
                              <p className="mt-0.5 font-mono text-[11px] tracking-label text-ink-mute">
                                {ev.date}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                  <p className="mt-3 font-serif-ko text-[12.5px] text-ink-mute leading-base">
                    시효·기간 적용 여부는 변호사 확인이 필요합니다.
                  </p>
                </div>
              )}

              {result.truncated && (
                <p className="mt-5 font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
                  ⓘ 문서가 길어 처음 일부만 분석되었습니다
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

function renderMarkdown(r: TranslateResult): string {
  const lines: string[] = [];
  lines.push(`# ${r.doc_type || "문서 정리"} — 도원`);
  lines.push("");
  lines.push("## 3줄 요약");
  for (const s of r.summary_3lines) lines.push(`- ${s}`);
  if (r.plain_terms.length > 0) {
    lines.push("");
    lines.push("## 쉬운 말 풀이");
    for (const t of r.plain_terms) lines.push(`- **${t.term}** — ${t.plain}`);
  }
  if (r.action_items.length > 0) {
    lines.push("");
    lines.push("## 할 일");
    for (const a of r.action_items) lines.push(`- [ ] ${a}`);
  }
  if (r.calendar_events.length > 0) {
    lines.push("");
    lines.push("## 일정");
    for (const ev of r.calendar_events) lines.push(`- ${ev.date} — ${ev.label} (${ev.importance})`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(
    "본 문서는 AI가 정리한 일반 정보 안내이며, 법률 자문이 아닙니다. " +
      "실제 대응은 변호사 상담을 통해 진행해 주세요."
  );
  return lines.join("\n");
}
