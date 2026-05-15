"use client";

import * as React from "react";
import Link from "next/link";
import { Send, Sparkles, CheckCircle2, RotateCw, ShieldAlert } from "lucide-react";
import { LegalDisclaimer } from "@/components/ai/legal-disclaimer";
import { IntakeProgress } from "./intake-progress";
import { IntakeDeadlines } from "./intake-deadlines";
import { IntakeChecklist } from "./intake-checklist";
import { IntakeLawyerSuggest } from "./intake-lawyer-suggest";
import { IntakeConfirmModal } from "./intake-confirm-modal";
import { emptyIntakeState, type IntakeState } from "@/lib/ai/intake-slots";
import { maskPII } from "@/lib/ai/pii-mask";
import { consumeNdjsonStream } from "@/lib/ai/stream-client";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

type SuggestedLawyer = {
  id: string;
  name: string;
  match_reason: string;
  match_score: number;
};

type ChecklistEntry = {
  id: string;
  label: string;
  required: boolean;
  matched: boolean;
};

type Deadline = { label: string; date: string; source?: string };

const STORAGE_KEY = "dowon_intake_v1";
const STORAGE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

type Persisted = {
  sessionId: string;
  messages: Message[];
  state: IntakeState;
  savedAt: number;
};

const GREETING: Message = {
  role: "assistant",
  content:
    "안녕하세요. 도원의 사건 정보 정리 도우미입니다. 본 대화는 법률 자문이 아니며, 변호사 상담 전에 사건 정보를 정확히 정리해 변호사에게 전달하기 위한 목적입니다.\n\n어떤 일이 있으셨는지 편하게 말씀해 주세요. 차례차례 여쭤보겠습니다.",
};

const examples = [
  "지난주에 교통사고가 났는데 상대방이 보험으로 처리를 거부합니다.",
  "병원에서 수술 받은 뒤 합병증이 생겼어요. 의료기록도 보고 싶고요.",
  "공사 대금을 받지 못해서 받아낼 방법이 있을지 알고 싶어요.",
];

function loadPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Persisted;
    if (!parsed.sessionId || !Array.isArray(parsed.messages)) return null;
    if (Date.now() - parsed.savedAt > STORAGE_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function persist(data: Persisted) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota or private mode — silently ignore */
  }
}

function clearPersisted() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function IntakeChat() {
  // Resume offer (only shown on mount when localStorage has a recent session)
  const [resumeOffer, setResumeOffer] = React.useState<Persisted | null>(null);
  const [resumed, setResumed] = React.useState(false);

  const [messages, setMessages] = React.useState<Message[]>([GREETING]);
  const [input, setInput] = React.useState("");
  const [sessionId, setSessionId] = React.useState<string | undefined>();
  const [state, setState] = React.useState<IntakeState>(emptyIntakeState());
  const [loading, setLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState<{ ok: boolean; message: string } | null>(null);
  const [suggestedLawyers, setSuggestedLawyers] = React.useState<SuggestedLawyer[]>([]);
  const [checklist, setChecklist] = React.useState<ChecklistEntry[]>([]);
  const [deadlines, setDeadlines] = React.useState<Deadline[]>([]);
  const [preferredLawyer, setPreferredLawyer] = React.useState<string | null>(null);
  const [piiNotice, setPiiNotice] = React.useState<string | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const isFirstRender = React.useRef(true);

  // Check for resumable session on mount.
  React.useEffect(() => {
    const found = loadPersisted();
    if (found && found.messages.length > 1) {
      setResumeOffer(found);
    }
  }, []);

  // Persist on every meaningful change.
  React.useEffect(() => {
    if (!sessionId || submitted?.ok) return;
    persist({ sessionId, messages, state, savedAt: Date.now() });
  }, [sessionId, messages, state, submitted?.ok]);

  // Scroll the chat container only — never the page.
  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const resume = () => {
    if (!resumeOffer) return;
    setMessages(resumeOffer.messages);
    setSessionId(resumeOffer.sessionId);
    setState(resumeOffer.state);
    setResumed(true);
    setResumeOffer(null);
  };

  const startFresh = () => {
    clearPersisted();
    setResumeOffer(null);
  };

  const send = async (text: string) => {
    if (!text.trim() || loading || submitted?.ok) return;
    setInput("");
    setLoading(true);

    // Client-side PII mask — raw text never leaves the browser.
    const { masked, hits } = maskPII(text);
    if (hits.length > 0) {
      setPiiNotice(
        `민감정보(${hits.map((h) => h.label).join(", ")})가 자동 마스킹되었습니다. 다음부터는 입력하지 않으셔도 괜찮습니다.`
      );
    } else {
      setPiiNotice(null);
    }

    const history = messages.slice(1); // exclude greeting
    const userMsg: Message = { role: "user", content: masked };
    const assistantMsg: Message = { role: "assistant", content: "" };
    let assistantIdx = -1;

    // Insert user message and placeholder assistant message in one update.
    setMessages((prev) => {
      const next = [...prev, userMsg, assistantMsg];
      assistantIdx = next.length - 1;
      return next;
    });

    let accumulated = "";
    let firstTokenSeen = false;

    try {
      const res = await fetch("/api/ai/intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: masked, history, state, sessionId }),
      });

      await consumeNdjsonStream(res, {
        onToken: (chunk) => {
          accumulated += chunk;
          if (!firstTokenSeen) {
            firstTokenSeen = true;
            setLoading(false); // first token arrived — hide "정리 중..." indicator
          }
          setMessages((prev) => {
            if (assistantIdx < 0 || assistantIdx >= prev.length) return prev;
            const copy = [...prev];
            copy[assistantIdx] = { role: "assistant", content: accumulated };
            return copy;
          });
        },
        onState: (payload) => {
          if (payload.sessionId && typeof payload.sessionId === "string") {
            setSessionId(payload.sessionId);
          }
          if (payload.state && typeof payload.state === "object") {
            setState(payload.state as IntakeState);
          }
          if (Array.isArray(payload.suggested_lawyers)) {
            setSuggestedLawyers(payload.suggested_lawyers as SuggestedLawyer[]);
          }
          if (Array.isArray(payload.checklist)) {
            setChecklist(payload.checklist as ChecklistEntry[]);
          }
          if (Array.isArray(payload.deadlines)) {
            setDeadlines(payload.deadlines as Deadline[]);
          }
          // If we had no streamed text (rare), use the consolidated reply.
          if (!accumulated && typeof payload.reply === "string" && payload.reply) {
            setMessages((prev) => {
              if (assistantIdx < 0 || assistantIdx >= prev.length) return prev;
              const copy = [...prev];
              copy[assistantIdx] = { role: "assistant", content: payload.reply as string };
              return copy;
            });
          }
        },
        onError: (err) => {
          console.error("[intake] stream error:", err);
          setMessages((prev) => {
            if (assistantIdx < 0 || assistantIdx >= prev.length) return prev;
            const copy = [...prev];
            copy[assistantIdx] = {
              role: "assistant",
              content: "일시적인 오류가 발생했습니다. 잠시 후 다시 말씀해 주세요.",
            };
            return copy;
          });
        },
      });
    } catch (e) {
      console.error(e);
      setMessages((prev) => {
        if (assistantIdx < 0 || assistantIdx >= prev.length) return prev;
        const copy = [...prev];
        copy[assistantIdx] = {
          role: "assistant",
          content: "일시적인 오류가 발생했습니다. 잠시 후 다시 말씀해 주세요.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  const canConfirm = state.completeness >= 0.5 && !!sessionId;

  if (submitted?.ok) {
    // Clear localStorage so a fresh visit starts clean.
    clearPersisted();
    return (
      <div className="bg-paper border border-paper-3 rounded-md p-10 lg:p-14 text-center max-w-2xl mx-auto">
        <CheckCircle2 size={48} className="mx-auto text-forest" aria-hidden />
        <h2 className="mt-6 font-display italic text-[clamp(32px,4vw,48px)] text-ink leading-tight">
          Thank you.
        </h2>
        <p className="mt-3 font-serif-ko text-h3 text-ink">상담 신청이 접수되었습니다</p>
        <p className="mt-5 font-serif-ko text-body-lg text-ink-soft leading-base max-w-md mx-auto">
          {submitted.message}
        </p>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-label text-ink-mute">
          접수 ID — {sessionId}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-ink rounded-sm font-sans-ko text-[14px] font-medium text-ink hover:bg-paper-2 transition-colors"
          >
            홈으로
          </Link>
          <Link
            href="/library"
            className="inline-flex items-center px-6 py-3 bg-gold-deep rounded-sm font-sans-ko text-[14px] font-medium text-paper hover:bg-gold transition-colors"
          >
            라이브러리 둘러보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Resume offer (rendered before chat so user sees it first) */}
      {resumeOffer && (
        <div className="mb-6 rounded-md border border-gold bg-paper-2 p-5 lg:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-label text-gold">RESUME</p>
            <p className="mt-2 font-serif-ko text-body-lg text-ink">
              이전에 진행하시던 대화가 있습니다 ({resumeOffer.messages.length - 1}턴 ·
              {" "}{Math.round(resumeOffer.state.completeness * 100)}% 정리됨)
            </p>
            <p className="mt-1 font-serif-ko text-[13px] text-ink-soft">
              저장 시각 — {new Date(resumeOffer.savedAt).toLocaleString("ko-KR")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resume}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm bg-gold-deep text-paper font-sans-ko text-[14px] font-medium hover:bg-gold transition-colors"
            >
              <RotateCw size={14} aria-hidden /> 이어하기
            </button>
            <button
              type="button"
              onClick={startFresh}
              className="inline-flex items-center px-5 py-2.5 rounded-sm border border-ink text-ink font-sans-ko text-[14px] font-medium hover:bg-paper transition-colors"
            >
              새로 시작
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Chat column */}
        <div className="flex flex-col bg-paper border border-paper-3 rounded-md overflow-hidden">
          <div className="px-6 py-4 border-b border-paper-3 flex items-center gap-2">
            <Sparkles size={16} className="text-gold-deep" aria-hidden />
            <p className="font-mono text-[11px] uppercase tracking-label text-ink">
              AI Intake · 사건 정보 정리{resumed && <span className="ml-2 text-gold">· 이어하는 중</span>}
            </p>
          </div>

          <ul
            ref={listRef}
            className="flex-1 px-4 lg:px-6 py-5 lg:py-6 space-y-5 max-h-[55vh] lg:max-h-[60vh] overflow-y-auto overscroll-contain"
          >
            {messages.map((m, i) => (
              <li
                key={i}
                className={cn("max-w-[85%]", m.role === "user" ? "ml-auto text-right" : "")}
              >
                <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute mb-1">
                  {m.role === "user" ? "YOU" : "도원 AI"}
                </p>
                <div
                  className={cn(
                    "inline-block px-4 py-3 rounded-md font-serif-ko text-[15px] leading-base whitespace-pre-wrap",
                    m.role === "user" ? "bg-ink text-paper" : "bg-paper-2 text-ink",
                    m.role === "assistant" && !m.content && "text-ink-mute italic"
                  )}
                >
                  {m.content || (loading ? "..." : "")}
                </div>
              </li>
            ))}
            {loading && messages[messages.length - 1]?.role !== "assistant" && (
              <li>
                <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute mb-1">도원 AI</p>
                <p className="font-serif-ko text-[15px] text-ink-mute italic">정리 중입니다...</p>
              </li>
            )}
          </ul>

          {messages.length === 1 && !resumeOffer && (
            <div className="px-4 lg:px-6 pb-4">
              <p className="label-mono mb-2">예시</p>
              <ul className="space-y-2">
                {examples.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => send(q)}
                      className="font-serif-ko text-[14px] text-ink-soft border-b border-paper-3 hover:text-ink hover:border-ink transition-colors text-left"
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {piiNotice && (
            <div
              role="status"
              className="mx-4 lg:mx-6 mb-3 rounded-sm border border-gold bg-paper-2 p-3 flex items-start gap-2.5"
            >
              <ShieldAlert size={14} className="text-gold-deep shrink-0 mt-0.5" aria-hidden />
              <p className="font-serif-ko text-[13px] text-ink-soft leading-base">{piiNotice}</p>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-paper-3 px-4 lg:px-6 py-3 flex flex-col gap-1.5"
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  state.ready_for_summary
                    ? "추가로 알려주실 내용이 있으면 입력 (또는 오른쪽 '정리해서 확인하기')"
                    : "편하게 말씀해 주세요..."
                }
                className="flex-1 px-4 py-3 bg-paper border border-paper-3 rounded-sm font-serif-ko text-[15px] text-ink focus:outline-none focus:border-ink"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-3 bg-ink text-paper rounded-sm font-sans-ko text-[14px] font-medium hover:bg-ink-soft transition-colors disabled:opacity-60"
              >
                <Send size={14} /> 전송
              </button>
            </div>
            <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
              주민번호·계좌·카드·사건번호 등 민감정보는 입력하지 마세요
            </p>
          </form>
        </div>

        {/* Side panel */}
        <aside className="space-y-4">
          <IntakeProgress state={state} />

          {deadlines.length > 0 && <IntakeDeadlines deadlines={deadlines} />}

          {checklist.length > 0 && <IntakeChecklist items={checklist} />}

          {suggestedLawyers.length > 0 && (
            <IntakeLawyerSuggest
              lawyers={suggestedLawyers}
              selectedSlug={preferredLawyer}
              onSelect={setPreferredLawyer}
            />
          )}

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={!canConfirm}
            className={cn(
              "w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-sm",
              "font-sans-ko text-[15px] font-medium tracking-wide",
              "transition-colors duration-fast",
              canConfirm
                ? "bg-gold-deep text-paper hover:bg-gold"
                : "bg-paper-3 text-ink-mute cursor-not-allowed"
            )}
          >
            <Sparkles size={14} aria-hidden /> 정리해서 확인하기
          </button>
          {!canConfirm && (
            <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute text-center">
              핵심 정보 절반 이상이 채워지면 활성화됩니다
            </p>
          )}
          {submitted?.ok === false && (
            <div role="alert" className="rounded-sm border border-rust bg-paper-2 p-4 font-serif-ko text-body text-rust">
              {submitted.message}
            </div>
          )}

          <LegalDisclaimer />
        </aside>
      </div>

      <IntakeConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        state={state}
        sessionId={sessionId ?? ""}
        preferredLawyerSlug={preferredLawyer}
        onSubmitted={(r) => {
          setSubmitted(r);
          if (r.ok) setConfirmOpen(false);
        }}
      />
    </>
  );
}
