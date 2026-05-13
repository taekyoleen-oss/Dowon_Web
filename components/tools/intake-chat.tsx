"use client";

import * as React from "react";
import Link from "next/link";
import { Send, Sparkles, CheckCircle2 } from "lucide-react";
import { LegalDisclaimer } from "@/components/ai/legal-disclaimer";
import { IntakeProgress } from "./intake-progress";
import { IntakeConfirmModal } from "./intake-confirm-modal";
import { emptyIntakeState, type IntakeState } from "@/lib/ai/intake-slots";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

type ApiResponse = {
  sessionId: string;
  reply: string;
  state: IntakeState;
  completeness: number;
  next_question_target: string;
  should_offer_summary: boolean;
  stub?: boolean;
};

const examples = [
  "지난주에 교통사고가 났는데 상대방이 보험으로 처리를 거부합니다.",
  "병원에서 수술 받은 뒤 합병증이 생겼어요. 의료기록도 보고 싶고요.",
  "공사 대금을 받지 못해서 받아낼 방법이 있을지 알고 싶어요.",
];

export function IntakeChat() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content:
        "안녕하세요. 도원의 사건 정보 정리 도우미입니다. 본 대화는 법률 자문이 아니며, 변호사 상담 전에 사건 정보를 정확히 정리해 변호사에게 전달하기 위한 목적입니다.\n\n어떤 일이 있으셨는지 편하게 말씀해 주세요. 차례차례 여쭤보겠습니다.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [sessionId, setSessionId] = React.useState<string | undefined>();
  const [state, setState] = React.useState<IntakeState>(emptyIntakeState());
  const [loading, setLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState<{ ok: boolean; message: string } | null>(null);
  const endRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading || submitted?.ok) return;
    setInput("");
    setLoading(true);
    const history = messages.slice(1);
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);

    try {
      const res = await fetch("/api/ai/intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text, history, state, sessionId }),
      });
      const data: ApiResponse = await res.json();
      setSessionId(data.sessionId);
      setState(data.state);
      setMessages([...next, { role: "assistant", content: data.reply }]);
      if (data.should_offer_summary && !confirmOpen && !submitted) {
        // soft nudge — not auto-open per the agreed UX
      }
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "일시적인 오류가 발생했습니다. 잠시 후 다시 말씀해 주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const canConfirm = state.completeness >= 0.5 && !!sessionId;

  if (submitted?.ok) {
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
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Chat column */}
        <div className="flex flex-col bg-paper border border-paper-3 rounded-md overflow-hidden">
          <div className="px-6 py-4 border-b border-paper-3 flex items-center gap-2">
            <Sparkles size={16} className="text-gold-deep" aria-hidden />
            <p className="font-mono text-[11px] uppercase tracking-label text-ink">AI Intake · 사건 정보 정리</p>
          </div>

          <ul className="flex-1 px-4 lg:px-6 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
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
                    m.role === "user" ? "bg-ink text-paper" : "bg-paper-2 text-ink"
                  )}
                >
                  {m.content}
                </div>
              </li>
            ))}
            {loading && (
              <li>
                <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute mb-1">도원 AI</p>
                <p className="font-serif-ko text-[15px] text-ink-mute italic">정리 중입니다...</p>
              </li>
            )}
            <div ref={endRef} />
          </ul>

          {messages.length === 1 && (
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-paper-3 px-4 lg:px-6 py-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={state.ready_for_summary ? "추가로 알려주실 내용이 있으면 입력 (또는 오른쪽 '정리해서 확인하기')" : "편하게 말씀해 주세요..."}
              className="flex-1 px-4 py-3 bg-paper border border-paper-3 rounded-sm font-serif-ko text-[15px] text-ink focus:outline-none focus:border-ink"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-3 bg-ink text-paper rounded-sm font-sans-ko text-[14px] font-medium hover:bg-ink-soft transition-colors disabled:opacity-60"
            >
              <Send size={14} /> 전송
            </button>
          </form>
        </div>

        {/* Side panel */}
        <aside className="space-y-4">
          <IntakeProgress state={state} />

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
        onSubmitted={(r) => {
          setSubmitted(r);
          if (r.ok) setConfirmOpen(false);
        }}
      />
    </>
  );
}
