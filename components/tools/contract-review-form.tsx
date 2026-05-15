"use client";

import * as React from "react";
import {
  Upload,
  FileText,
  ShieldAlert,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Copy,
  Building,
  Loader2,
} from "lucide-react";
import { LegalDisclaimer } from "@/components/ai/legal-disclaimer";
import { cn } from "@/lib/utils";

type ObligationItem = {
  party: string;
  clause_ref: string;
  en: string;
  ko: string;
};
type RiskFlag = {
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  clause_ref: string;
  issue_en: string;
  issue_ko: string;
  why: string;
};
type KoreanLawPoint = { topic: string; ko: string; reason: string };
type LawyerItem = { item: string; reason: string };

export type ContractReviewResult = {
  document_meta: {
    doc_type: string;
    parties: Array<{ role: string; en_name: string; ko_name: string }>;
    governing_law: string;
    jurisdiction: string;
    effective_date: string;
    term: string;
    language: string;
  };
  summary_3lines_ko: string[];
  obligations_summary: ObligationItem[];
  risk_flags: RiskFlag[];
  korean_law_review_points: KoreanLawPoint[];
  must_be_reviewed_by_lawyer: LawyerItem[];
  truncated?: boolean;
  stub?: boolean;
};

type Mode = "file" | "text";

export function ContractReviewForm() {
  const [mode, setMode] = React.useState<Mode>("file");
  const [file, setFile] = React.useState<File | null>(null);
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<ContractReviewResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);

  const acceptFile = (f: File | null | undefined) => {
    if (!f) return;
    const isPdf =
      f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("PDF 파일만 지원합니다. 텍스트는 직접 붙여넣기 탭을 사용해 주세요.");
      return;
    }
    if (f.size > 25 * 1024 * 1024) {
      setError("파일이 너무 큽니다 (최대 25MB).");
      return;
    }
    setError(null);
    setFile(f);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);
    try {
      let res: Response;
      if (mode === "file") {
        if (!file) {
          setError("PDF 파일을 첨부해 주세요.");
          setLoading(false);
          return;
        }
        const fd = new FormData();
        fd.set("file", file);
        res = await fetch("/api/ai/contract-review", { method: "POST", body: fd });
      } else {
        if (text.trim().length < 100) {
          setError("계약서 텍스트를 100자 이상 붙여넣어 주세요.");
          setLoading(false);
          return;
        }
        res = await fetch("/api/ai/contract-review", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text }),
        });
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "분석 중 오류가 발생했습니다.");
        return;
      }
      const data = (await res.json()) as ContractReviewResult;
      setResult(data);
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const onCopyMarkdown = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(renderMarkdown(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_440px]">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Mode tabs */}
        <div role="tablist" className="inline-flex rounded-sm border border-paper-3 p-1 bg-paper">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "file"}
            onClick={() => setMode("file")}
            className={cn(
              "px-4 py-2 rounded-sm font-sans-ko text-[13.5px] transition-colors",
              mode === "file"
                ? "bg-ink text-paper"
                : "text-ink-soft hover:text-ink"
            )}
          >
            PDF 업로드
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "text"}
            onClick={() => setMode("text")}
            className={cn(
              "px-4 py-2 rounded-sm font-sans-ko text-[13.5px] transition-colors",
              mode === "text"
                ? "bg-ink text-paper"
                : "text-ink-soft hover:text-ink"
            )}
          >
            텍스트 붙여넣기
          </button>
        </div>

        {mode === "file" ? (
          <div>
            <label htmlFor="contract-pdf" className="label-mono block">
              영문 계약서 PDF <span className="text-rust">*</span>
            </label>
            <label
              htmlFor="contract-pdf"
              onDragEnter={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
                setDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                acceptFile(e.dataTransfer?.files?.[0]);
              }}
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
                최대 25MB · 수백 페이지 SPA/JV/License 한 번에 분석
              </p>
            </label>
            <input
              id="contract-pdf"
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="contract-text" className="label-mono block">
              계약서 본문 <span className="text-rust">*</span>
            </label>
            <textarea
              id="contract-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the full English contract text here. 영문 계약서 본문을 그대로 붙여넣어 주세요 (최소 100자)."
              rows={14}
              className="mt-2 w-full rounded-sm border border-paper-3 bg-paper p-4 font-mono text-[12.5px] text-ink leading-relaxed focus:border-ink focus:outline-none"
            />
            <p className="mt-2 font-mono text-[11px] tracking-label text-ink-mute">
              {text.length.toLocaleString()} chars
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-deep text-paper rounded-sm font-sans-ko text-[15.5px] font-medium tracking-wide hover:bg-gold transition-colors disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden /> 1차 검토 중...
            </>
          ) : (
            <>계약서 1차 검토 시작</>
          )}
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
              본 도구는 변호사 정식 검토 전 자체 스크리닝용입니다. 분석 결과는 모든 위험을
              포착하지 못할 수 있으며, 실제 의사 결정 전에는 도원 변호사의 상세 검토가 필요합니다.
            </p>
            <p className="mt-2">
              업로드한 PDF는 분석 직후 폐기되며, 마스킹된 결과 JSON만 감사 로그에 보존됩니다.
              극히 민감한 계약은 자문 의뢰로 안전하게 처리해 주세요.
            </p>
          </div>
        </div>
      </form>

      <aside className="space-y-4">
        {!result && !loading && <UsageGuide />}
        {loading && <LoadingPanel />}

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
            </div>

            <ResultPanel result={result} />
          </>
        )}

        <LegalDisclaimer />
      </aside>
    </div>
  );
}

function UsageGuide() {
  return (
    <div className="rounded-md border border-paper-3 bg-paper p-6">
      <p className="label-mono text-gold inline-flex items-center gap-1.5">
        <Scale size={12} aria-hidden /> WORKFLOW
      </p>
      <h3 className="mt-3 font-serif-ko text-h3 font-semibold text-ink">
        결과는 이렇게 받으실 수 있습니다
      </h3>
      <ol className="mt-5 space-y-4">
        {[
          {
            n: "01",
            t: "계약서 메타 정보",
            b: "계약 유형 · 양 당사자 · 준거법 · 분쟁 해결 관할 · 효력 발생일.",
          },
          {
            n: "02",
            t: "양 당사자 의무 요약 (한·영)",
            b: "각 의무 조항을 영문 원문과 한국어 해석으로 병기. 조항 번호 표기.",
          },
          {
            n: "03",
            t: "위험 조항 플래깅",
            b: "준거법·관할·손해배상 한도·일방 해지권·IP 양도 등 중대 위험을 등급(Critical/High/Medium)으로 분류.",
          },
          {
            n: "04",
            t: "한국법 관점 검토 포인트",
            b: "영문 텍스트만 보면 놓치기 쉬운 한국법 측면 (약관규제법·공정거래법·외국환거래법 등).",
          },
          {
            n: "05",
            t: "변호사 검토 필수 항목",
            b: "자체 판단이 위험한 회색지대 — 정식 자문 의뢰 시 우선 논의할 리스트.",
          },
        ].map((s) => (
          <li key={s.n} className="border-l-2 border-paper-3 pl-3">
            <p className="font-mono text-[10.5px] uppercase tracking-label text-gold-deep">
              STEP {s.n}
            </p>
            <p className="mt-0.5 font-serif-ko text-[14px] font-semibold text-ink">
              {s.t}
            </p>
            <p className="mt-1 font-serif-ko text-[13px] text-ink-soft leading-base">
              {s.b}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function LoadingPanel() {
  return (
    <div className="rounded-md border border-paper-3 bg-paper p-6">
      <div className="flex items-center gap-3">
        <Loader2 size={20} className="animate-spin text-gold-deep" aria-hidden />
        <p className="font-serif-ko text-h3 font-semibold text-ink">분석 중...</p>
      </div>
      <p className="mt-3 font-serif-ko text-body text-ink-soft leading-base">
        영문 계약서를 통째로 읽고 있습니다. 길이에 따라 30초~2분이 걸릴 수 있습니다.
      </p>
      <ul className="mt-5 space-y-2 font-mono text-[12px] tracking-label text-ink-mute">
        <li>· 텍스트 추출 → 조항 식별</li>
        <li>· 양 당사자 의무 매핑</li>
        <li>· 위험 조항 등급 산정</li>
        <li>· 한국법 관점 교차 검토</li>
      </ul>
    </div>
  );
}

function ResultPanel({ result }: { result: ContractReviewResult }) {
  return (
    <div className="bg-paper border border-paper-3 rounded-md p-6 space-y-7">
      {/* META */}
      <section>
        <p className="label-mono text-gold inline-flex items-center gap-1.5">
          <Building size={12} aria-hidden /> {result.document_meta.doc_type || "Contract"}
        </p>
        {result.stub && (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-label text-ink-mute">
            ⓘ STUB
          </p>
        )}
        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {result.document_meta.parties.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
                Parties
              </dt>
              <dd className="mt-1 space-y-1">
                {result.document_meta.parties.map((p, i) => (
                  <p
                    key={i}
                    className="font-serif-ko text-[13.5px] text-ink leading-snug"
                  >
                    <span className="text-ink-mute">{p.role}:</span> {p.en_name}
                    {p.ko_name ? ` · ${p.ko_name}` : ""}
                  </p>
                ))}
              </dd>
            </div>
          )}
          <MetaItem label="Governing law" value={result.document_meta.governing_law} />
          <MetaItem label="Jurisdiction" value={result.document_meta.jurisdiction} />
          <MetaItem label="Effective date" value={result.document_meta.effective_date} />
          <MetaItem label="Term" value={result.document_meta.term} />
        </dl>
      </section>

      {/* 3-line summary */}
      {result.summary_3lines_ko.length > 0 && (
        <section>
          <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
            3줄 요약
          </p>
          <ul className="mt-2 space-y-1.5">
            {result.summary_3lines_ko.map((s, i) => (
              <li key={i} className="font-serif-ko text-[14.5px] text-ink leading-base">
                <span className="text-gold-deep mr-2">·</span>
                {s}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* RISK FLAGS */}
      {result.risk_flags.length > 0 && (
        <section>
          <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute inline-flex items-center gap-1.5">
            <AlertTriangle size={11} aria-hidden /> 위험 조항 ({result.risk_flags.length})
          </p>
          <ul className="mt-2.5 space-y-3">
            {[...result.risk_flags]
              .sort((a, b) => sevRank(a.severity) - sevRank(b.severity))
              .map((r, i) => (
                <li
                  key={i}
                  className="border border-paper-3 rounded-sm p-3.5 bg-paper-2"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <SeverityBadge severity={r.severity} />
                    <span className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
                      {r.category}
                    </span>
                    {r.clause_ref && (
                      <span className="font-mono text-[10.5px] tracking-label text-ink">
                        {r.clause_ref}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-serif-ko text-[13.5px] text-ink font-medium leading-snug">
                    {r.issue_ko}
                  </p>
                  <p className="mt-1 font-mono text-[12px] text-ink-soft leading-relaxed">
                    {r.issue_en}
                  </p>
                  {r.why && (
                    <p className="mt-2 font-serif-ko text-[12.5px] text-ink-soft leading-base">
                      <span className="text-gold-deep">▸ </span>
                      {r.why}
                    </p>
                  )}
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* OBLIGATIONS */}
      {result.obligations_summary.length > 0 && (
        <section>
          <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute inline-flex items-center gap-1.5">
            <FileText size={11} aria-hidden /> 양 당사자 의무 ({result.obligations_summary.length})
          </p>
          <ul className="mt-2.5 space-y-3">
            {result.obligations_summary.map((o, i) => (
              <li key={i} className="border-l-2 border-paper-3 pl-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[10.5px] uppercase tracking-label text-gold-deep">
                    {o.party}
                  </span>
                  {o.clause_ref && (
                    <span className="font-mono text-[10.5px] tracking-label text-ink-mute">
                      {o.clause_ref}
                    </span>
                  )}
                </div>
                <p className="mt-1 font-serif-ko text-[13.5px] text-ink leading-snug">
                  {o.ko}
                </p>
                <p className="mt-0.5 font-mono text-[11.5px] text-ink-soft italic leading-relaxed">
                  &ldquo;{o.en}&rdquo;
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* KOREAN LAW POINTS */}
      {result.korean_law_review_points.length > 0 && (
        <section>
          <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
            한국법 관점 검토 포인트
          </p>
          <ul className="mt-2.5 space-y-2.5">
            {result.korean_law_review_points.map((k, i) => (
              <li key={i}>
                <span className="inline-block px-2 py-0.5 mr-2 rounded-sm bg-ink text-paper font-mono text-[10px] tracking-label">
                  {k.topic}
                </span>
                <span className="font-serif-ko text-[13.5px] text-ink">{k.ko}</span>
                <p className="mt-0.5 ml-1 font-serif-ko text-[12.5px] text-ink-soft leading-base">
                  {k.reason}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* MUST-BE-REVIEWED */}
      {result.must_be_reviewed_by_lawyer.length > 0 && (
        <section>
          <p className="font-mono text-[10.5px] uppercase tracking-label text-gold-deep">
            ★ 변호사 검토 필수
          </p>
          <ul className="mt-2 space-y-2">
            {result.must_be_reviewed_by_lawyer.map((m, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 font-serif-ko text-[13.5px] text-ink leading-base"
              >
                <span className="mt-0.5 inline-block h-3.5 w-3.5 rounded-[3px] border border-gold-deep shrink-0" />
                <div>
                  <p className="font-medium">{m.item}</p>
                  <p className="mt-0.5 text-[12.5px] text-ink-soft">{m.reason}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.truncated && (
        <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
          ⓘ 계약서가 길어 일부만 분석되었습니다 — 전체 검토는 변호사 자문 의뢰가 필요합니다
        </p>
      )}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
        {label}
      </dt>
      <dd className="mt-1 font-serif-ko text-[13.5px] text-ink leading-snug">
        {value}
      </dd>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: RiskFlag["severity"] }) {
  const map: Record<RiskFlag["severity"], { label: string; cls: string }> = {
    critical: { label: "CRITICAL", cls: "bg-rust text-paper" },
    high: { label: "HIGH", cls: "bg-gold-deep text-paper" },
    medium: { label: "MEDIUM", cls: "bg-ink text-paper" },
    low: { label: "LOW", cls: "bg-paper-3 text-ink" },
  };
  const v = map[severity] ?? map.medium;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-sm",
        "font-mono text-[10px] font-semibold tracking-label",
        v.cls
      )}
    >
      {v.label}
    </span>
  );
}

function sevRank(s: RiskFlag["severity"]): number {
  return { critical: 0, high: 1, medium: 2, low: 3 }[s] ?? 4;
}

function renderMarkdown(r: ContractReviewResult): string {
  const L: string[] = [];
  L.push(`# 영문 계약서 1차 검토 — 도원`);
  L.push("");
  L.push(`## Document Meta`);
  L.push(`- Type: ${r.document_meta.doc_type || "—"}`);
  if (r.document_meta.parties.length > 0) {
    L.push(`- Parties:`);
    for (const p of r.document_meta.parties)
      L.push(`  - ${p.role}: ${p.en_name}${p.ko_name ? ` (${p.ko_name})` : ""}`);
  }
  L.push(`- Governing law: ${r.document_meta.governing_law || "—"}`);
  L.push(`- Jurisdiction: ${r.document_meta.jurisdiction || "—"}`);
  L.push(`- Effective date: ${r.document_meta.effective_date || "—"}`);
  L.push(`- Term: ${r.document_meta.term || "—"}`);
  L.push("");

  if (r.summary_3lines_ko.length > 0) {
    L.push(`## 3줄 요약`);
    for (const s of r.summary_3lines_ko) L.push(`- ${s}`);
    L.push("");
  }

  if (r.risk_flags.length > 0) {
    L.push(`## 위험 조항 (${r.risk_flags.length})`);
    for (const f of [...r.risk_flags].sort(
      (a, b) => sevRank(a.severity) - sevRank(b.severity)
    )) {
      L.push(
        `- **[${f.severity.toUpperCase()}] ${f.category}** ${f.clause_ref ? `(${f.clause_ref})` : ""}`
      );
      L.push(`  - ${f.issue_ko}`);
      L.push(`  - "${f.issue_en}"`);
      if (f.why) L.push(`  - ▸ ${f.why}`);
    }
    L.push("");
  }

  if (r.obligations_summary.length > 0) {
    L.push(`## 양 당사자 의무`);
    for (const o of r.obligations_summary) {
      L.push(`- **${o.party}** ${o.clause_ref ? `(${o.clause_ref})` : ""} — ${o.ko}`);
      L.push(`  - "${o.en}"`);
    }
    L.push("");
  }

  if (r.korean_law_review_points.length > 0) {
    L.push(`## 한국법 관점 검토 포인트`);
    for (const k of r.korean_law_review_points) {
      L.push(`- **[${k.topic}]** ${k.ko}`);
      L.push(`  - ${k.reason}`);
    }
    L.push("");
  }

  if (r.must_be_reviewed_by_lawyer.length > 0) {
    L.push(`## 변호사 검토 필수`);
    for (const m of r.must_be_reviewed_by_lawyer) {
      L.push(`- [ ] **${m.item}** — ${m.reason}`);
    }
    L.push("");
  }

  L.push("---");
  L.push(
    "본 결과는 AI 기반 1차 정리이며 법률 자문이 아닙니다. 실제 계약 체결 전에는 변호사 검토가 필요합니다."
  );
  return L.join("\n");
}
