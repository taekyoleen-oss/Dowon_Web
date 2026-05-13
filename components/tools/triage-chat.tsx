"use client";

import * as React from "react";
import Link from "next/link";
import { Send, Sparkles } from "lucide-react";
import { LegalDisclaimer } from "@/components/ai/legal-disclaimer";
import { practiceAreaLabels, type PracticeAreaCode } from "@/lib/data/lawyers";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };
type SuggestedLawyer = {
  id: string;
  name: string;
  match_reason: string;
  match_score: number;
};
type TriageResponse = {
  reply: string;
  needs_more_info: boolean;
  matter_type: string;
  confidence: number;
  needed_documents: string[];
  estimated_timeline: string;
  next_action: "consultation" | "ask_more" | "library";
  conversationId: string;
  suggested_lawyers: SuggestedLawyer[];
  stub?: boolean;
};

const examples = [
  "교통사고로 무보험차에 받혀서 보험금 청구 중인데 면책 통지가 왔어요",
  "병원에서 수술 후 합병증이 생겼는데, 의무기록은 어떻게 받나요",
  "보험사가 약관에 없는 사유로 보험금을 거절합니다",
];

export function TriageChat() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content:
        "안녕하세요. 법무법인 도원의 사건 유형 안내 도우미입니다. 본 안내는 일반 정보이며 법률 자문이 아닙니다. 어떤 상황이신지 자유롭게 설명해 주세요.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [conversationId, setConversationId] = React.useState<string | undefined>();
  const [latest, setLatest] = React.useState<TriageResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, latest]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    setLoading(true);
    const history = messages.slice(1);
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);

    try {
      const res = await fetch("/api/ai/triage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text, history, conversationId }),
      });
      const data: TriageResponse = await res.json();
      setLatest(data);
      setConversationId(data.conversationId);
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages([
        ...next,
        { role: "assistant", content: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const matterLabel =
    latest && latest.matter_type !== "unknown" &&
    (practiceAreaLabels as Record<string, string>)[latest.matter_type];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Chat */}
      <div className="flex flex-col bg-paper border border-paper-3 rounded-md overflow-hidden">
        <div className="px-6 py-4 border-b border-paper-3 flex items-center gap-2">
          <Sparkles size={16} className="text-gold-deep" />
          <p className="font-mono text-[11px] uppercase tracking-label text-ink">AI Triage · 사건 유형 안내</p>
        </div>

        <ul className="flex-1 px-4 lg:px-6 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {messages.map((m, i) => (
            <li
              key={i}
              className={cn(
                "max-w-[85%]",
                m.role === "user" ? "ml-auto text-right" : ""
              )}
            >
              <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute mb-1">
                {m.role === "user" ? "YOU" : "도원 AI"}
              </p>
              <div
                className={cn(
                  "inline-block px-4 py-3 rounded-md font-serif-ko text-[15px] leading-base whitespace-pre-wrap",
                  m.role === "user"
                    ? "bg-ink text-paper"
                    : "bg-paper-2 text-ink"
                )}
              >
                {m.content}
              </div>
            </li>
          ))}
          {loading && (
            <li>
              <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute mb-1">도원 AI</p>
              <p className="font-serif-ko text-[15px] text-ink-mute italic">답변을 작성 중입니다...</p>
            </li>
          )}
          <div ref={endRef} />
        </ul>

        {messages.length === 1 && (
          <div className="px-4 lg:px-6 pb-4">
            <p className="label-mono mb-2">예시 질문</p>
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
            placeholder="상황을 설명해 주세요..."
            className="flex-1 px-4 py-3 bg-paper border border-paper-3 rounded-sm font-serif-ko text-[15px] text-ink focus:outline-none focus:border-ink"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-1.5 px-5 py-3 bg-gold-deep text-paper rounded-sm font-sans-ko text-[14px] font-medium hover:bg-gold transition-colors disabled:opacity-60"
          >
            <Send size={14} /> 전송
          </button>
        </form>
      </div>

      {/* Insights panel */}
      <aside className="space-y-4">
        {latest && latest.matter_type !== "unknown" && (
          <div className="bg-paper border border-paper-3 rounded-md p-6">
            <p className="label-mono text-gold">CLASSIFICATION</p>
            <p className="mt-3 font-serif-ko text-h3 font-semibold text-ink">
              {matterLabel ?? latest.matter_type}
            </p>
            <p className="mt-2 font-mono text-[11px] text-ink-mute">
              confidence {Math.round(latest.confidence * 100)}%
            </p>

            {latest.needed_documents.length > 0 && (
              <>
                <p className="mt-6 label-mono">필요 자료</p>
                <ul className="mt-2 space-y-1.5">
                  {latest.needed_documents.map((d) => (
                    <li key={d} className="font-serif-ko text-[14px] text-ink-soft leading-base flex gap-2">
                      <span aria-hidden className="mt-2 h-px w-2.5 bg-gold shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p className="mt-6 label-mono">예상 기간</p>
            <p className="mt-2 font-serif-ko text-[14.5px] text-ink-soft">
              {latest.estimated_timeline}
            </p>

            <div className="mt-7 flex flex-col gap-2">
              <Link
                href="/tools/intake"
                className="inline-flex items-center justify-center px-5 py-3 bg-gold-deep text-paper rounded-sm font-sans-ko text-[14px] font-medium hover:bg-gold transition-colors"
              >
                AI와 더 자세히 정리하기 →
              </Link>
              <Link
                href={`/contact/${classifyToPersona(latest.matter_type)}`}
                className="inline-flex items-center justify-center px-5 py-3 border border-ink text-ink rounded-sm font-sans-ko text-[14px] font-medium hover:bg-paper-2 transition-colors"
              >
                바로 상담 신청
              </Link>
            </div>
          </div>
        )}

        {latest && latest.suggested_lawyers.length > 0 && (
          <div className="bg-paper border border-paper-3 rounded-md p-6">
            <p className="label-mono text-gold">SUGGESTED LAWYERS</p>
            <ul className="mt-4 space-y-3">
              {latest.suggested_lawyers.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/people/lawyers/${l.id}`}
                    className="block p-3 -m-3 rounded-sm hover:bg-paper-2 transition-colors"
                  >
                    <p className="font-serif-ko text-[15px] font-semibold text-ink">{l.name}</p>
                    <p className="mt-1 font-serif-ko text-[13px] text-ink-soft">{l.match_reason}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <LegalDisclaimer />

        {latest?.stub && (
          <p className="font-mono text-[10px] uppercase tracking-label text-ink-mute">
            ⓘ API key 미설정 — stub 응답이 표시됩니다.
          </p>
        )}
      </aside>
    </div>
  );
}

function classifyToPersona(matter: string): "personal" | "medical" | "insurer" | "enterprise" {
  if (matter === "medical") return "medical";
  if (matter === "advisory") return "enterprise";
  if (matter === "subrogation" || matter === "investigation") return "insurer";
  return "personal";
}
