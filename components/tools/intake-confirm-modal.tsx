"use client";

import * as React from "react";
import Link from "next/link";
import { X, Users } from "lucide-react";
import { Field, Select } from "@/components/contact/form-primitives";
import { summarizeForLawyer, type IntakeState } from "@/lib/ai/intake-slots";
import { cn } from "@/lib/utils";

type SuggestedLawyer = {
  lawyer_id: string;
  name: string;
  match_score: number;
  match_reasons: string[];
};

type Result = {
  ok: boolean;
  message: string;
  consultationId?: string | null;
  errors?: Record<string, string>;
};

export function IntakeConfirmModal({
  open,
  onClose,
  state,
  sessionId,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  state: IntakeState;
  sessionId: string;
  onSubmitted: (result: Result) => void;
}) {
  const summary = React.useMemo(() => summarizeForLawyer(state), [state]);
  const [edits, setEdits] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [matches, setMatches] = React.useState<SuggestedLawyer[]>([]);

  // Fetch lawyer suggestions when modal opens, derived from extracted slots.
  React.useEffect(() => {
    if (!open || !state.matter_type) return;
    let cancelled = false;
    (async () => {
      try {
        // Map intake matter_type to practice area codes for the matcher.
        const paMap: Record<string, string[]> = {
          auto: ["auto"],
          medical: ["medical"],
          insurance: ["long-term", "life", "fire", "liability"],
          contract: ["advisory"],
          employment: ["advisory"],
          consumer: ["advisory"],
          criminal: ["criminal", "investigation"],
          real_estate: ["advisory"],
          other: [],
        };
        const practiceAreas = paMap[state.matter_type ?? "other"] ?? [];
        const caseContext = [state.narrative, summary.sections.map((s) => s.value).join(" ")]
          .filter(Boolean)
          .join(" ")
          .slice(0, 1200);
        const res = await fetch("/api/ai/lawyer-match", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ caseContext, practiceAreas, limit: 3 }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setMatches(data.matches ?? []);
      } catch {
        /* silent — non-critical UX hint */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, state.matter_type, state.narrative, summary]);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const fd = new FormData(e.currentTarget);
      const body = {
        sessionId,
        state,
        edits: edits || undefined,
        contact: {
          name: String(fd.get("name") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          email: String(fd.get("email") ?? ""),
          preferredMethod: (String(fd.get("preferredMethod") ?? "전화")) as "전화" | "방문" | "온라인",
          agreement: fd.get("agreement") === "on",
        },
      };
      const res = await fetch("/api/ai/intake/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: Result = await res.json();
      if (!data.ok && data.errors) setErrors(data.errors);
      onSubmitted(data);
    } catch (e) {
      onSubmitted({
        ok: false,
        message: "전송 중 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4 lg:p-8 overflow-y-auto"
    >
      <div className="relative bg-paper border border-paper-3 rounded-md shadow-paper w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-5 right-5 text-ink-mute hover:text-ink z-10"
        >
          <X size={20} />
        </button>

        <div className="p-7 lg:p-10 border-b border-paper-3">
          <p className="label-mono text-gold">CONFIRMATION</p>
          <h2 id="confirm-title" className="mt-3 font-display italic text-[clamp(28px,4vw,40px)] text-ink leading-tight">
            Review &amp; confirm.
          </h2>
          <p className="mt-3 font-serif-ko text-h3 text-ink">변호사에게 전달할 정보 확인</p>
          <p className="mt-4 font-serif-ko text-body text-ink-soft leading-base">
            아래 내용이 변호사에게 그대로 전달됩니다. 잘못된 부분이 있으면 화면 아래의
            <strong> &lsquo;추가/수정&rsquo;</strong> 칸에 적어주세요. 동의 후 <strong>&lsquo;확인하고 보내기&rsquo;</strong>를 누르면 도원으로 전송됩니다.
          </p>
        </div>

        <div className="p-7 lg:p-10">
          <p className="font-serif-ko text-h3 font-semibold text-ink">{summary.title}</p>

          <dl className="mt-6 space-y-5">
            {summary.sections.map((s) => (
              <div key={s.label} className="border-l-2 border-gold pl-4">
                <dt className="label-mono">{s.label}</dt>
                <dd className="mt-2 font-serif-ko text-body text-ink leading-base whitespace-pre-wrap">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          {matches.length > 0 && (
            <div className="mt-8 rounded-sm bg-paper-2 border border-paper-3 p-5">
              <p className="label-mono text-gold inline-flex items-center gap-1.5">
                <Users size={12} aria-hidden /> 예상 담당 변호사
              </p>
              <p className="mt-2 font-serif-ko text-[13.5px] text-ink-mute">
                자동 매칭된 후보입니다. 실제 배정은 변호사 검수 후 확정됩니다.
              </p>
              <ul className="mt-4 space-y-2.5">
                {matches.map((m) => (
                  <li key={m.lawyer_id}>
                    <Link
                      href={`/people/lawyers/${m.lawyer_id}`}
                      target="_blank"
                      className="block p-2 -m-2 rounded-sm hover:bg-paper transition-colors"
                    >
                      <p className="font-serif-ko text-[15px] font-semibold text-ink">{m.name}</p>
                      {m.match_reasons.length > 0 && (
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-label text-ink-mute">
                          {m.match_reasons.join(" · ")}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <label htmlFor="edits" className="label-mono block">
              추가하거나 수정할 내용 (선택)
            </label>
            <textarea
              id="edits"
              value={edits}
              onChange={(e) => setEdits(e.target.value)}
              rows={4}
              placeholder="예: 사건 발생일은 정확히 2026년 3월 5일이고, 가해자는 두 명이 아니라 세 명이었습니다."
              className="mt-2 w-full px-4 py-3 bg-paper border border-paper-3 rounded-sm font-serif-ko text-body text-ink placeholder:text-ink-mute leading-base focus:outline-none focus:border-ink"
            />
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-7 lg:p-10 border-t border-paper-3 bg-paper-2 space-y-5">
          <p className="label-mono text-gold">CONTACT</p>
          <div className="grid gap-5 md:grid-cols-2">
            <Field id="ink-name"  name="name"  label="성함"  required error={errors.name}  />
            <Field id="ink-phone" name="phone" label="연락처" type="tel" required error={errors.phone} />
            <Field id="ink-email" name="email" label="이메일 (선택)" type="email" error={errors.email} />
            <Select
              id="ink-method"
              name="preferredMethod"
              label="희망 상담 방식"
              options={[
                { value: "전화",   label: "전화" },
                { value: "방문",   label: "방문" },
                { value: "온라인", label: "온라인 (영상)" },
              ]}
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="agreement"
              value="on"
              required
              className="mt-1 h-4 w-4 accent-ink"
            />
            <span className="font-serif-ko text-[14px] text-ink-soft leading-base">
              위 사건 정보가 도원 변호사에게 전달되는 것에 동의하며, 개인정보 수집·이용
              (목적: 상담 진행, 보유: 상담 종료 후 3년)에 동의합니다.
            </span>
          </label>
          {errors.agreement && (
            <p className="font-sans-ko text-[12.5px] text-rust">{errors.agreement}</p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "inline-flex items-center justify-center px-8 py-4 rounded-sm",
                "bg-gold-deep text-paper font-sans-ko text-[15.5px] font-medium tracking-wide",
                "transition-colors duration-fast hover:bg-gold",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {submitting ? "전송 중..." : "확인하고 보내기"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center px-8 py-4 rounded-sm border border-ink text-ink font-sans-ko text-[15.5px] font-medium hover:bg-paper transition-colors"
            >
              계속 대화
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
