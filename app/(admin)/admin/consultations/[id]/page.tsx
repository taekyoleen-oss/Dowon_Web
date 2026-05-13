import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import { summarizeForLawyer, type IntakeState } from "@/lib/ai/intake-slots";

export const metadata = { title: "상담 상세 — 어드민" };

type Consultation = {
  id: string;
  persona: string;
  status: string;
  contact_info: Record<string, unknown>;
  case_summary: string;
  intake_session_id: string | null;
  created_at: string;
};

type Conversation = {
  session_id: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  intake_state: IntakeState | null;
  confirmed_summary: { title: string; sections: Array<{ label: string; value: string }> } | null;
  confirmed_at: string | null;
};

async function getDetail(id: string): Promise<{
  consultation: Consultation | null;
  conversation: Conversation | null;
}> {
  if (!hasSupabaseConfig()) return { consultation: null, conversation: null };
  const supabase = getServerSupabase();
  const { data: cons, error: ce } = await supabase
    .from("consultation_requests")
    .select("id, persona, status, contact_info, case_summary, intake_session_id, created_at")
    .eq("id", id)
    .single();
  if (ce || !cons) return { consultation: null, conversation: null };

  let conversation: Conversation | null = null;
  if ((cons as Consultation).intake_session_id) {
    const { data: conv } = await supabase
      .from("ai_conversations")
      .select("session_id, messages, intake_state, confirmed_summary, confirmed_at")
      .eq("session_id", (cons as Consultation).intake_session_id)
      .maybeSingle();
    conversation = (conv as Conversation) ?? null;
  }

  return { consultation: cons as Consultation, conversation };
}

const personaLabel: Record<string, string> = {
  insurer: "보험사·손해사정사",
  enterprise: "기업 자문",
  medical: "의료분쟁",
  personal: "개인 사건",
};

export default async function ConsultationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { consultation, conversation } = await getDetail(params.id);
  if (!consultation) notFound();

  const contact = consultation.contact_info;
  const name = String(
    contact.contactName ?? contact.patientName ?? contact.applicantName ?? "—"
  );

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute mb-4">
        <Link href="/admin/consultations" className="hover:text-ink">← 상담 목록</Link>
      </p>

      <div className="flex flex-wrap items-baseline gap-4">
        <h1 className="font-display italic text-[clamp(32px,4vw,48px)] text-ink leading-tight">
          Consultation
        </h1>
        {consultation.intake_session_id && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-gold-deep text-paper font-mono text-[11px] uppercase tracking-label">
            <Sparkles size={12} aria-hidden /> AI INTAKE
          </span>
        )}
      </div>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">
        {personaLabel[consultation.persona] ?? consultation.persona} · 접수 {consultation.created_at.slice(0, 10)} · 상태 {consultation.status}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <div className="space-y-10">
          {/* If intake summary exists, show structured cards */}
          {conversation?.confirmed_summary?.sections?.length ? (
            <section>
              <p className="label-mono text-gold">AI INTAKE — 사용자 확정 요약</p>
              <h2 className="mt-3 font-serif-ko text-h2 font-semibold text-ink">
                {conversation.confirmed_summary.title}
              </h2>
              {conversation.confirmed_at && (
                <p className="mt-1 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                  확정 시각 — {conversation.confirmed_at.replace("T", " ").slice(0, 16)}
                </p>
              )}
              <dl className="mt-7 space-y-6 max-w-[44em]">
                {conversation.confirmed_summary.sections.map((s) => (
                  <div key={s.label} className="border-l-2 border-gold pl-5">
                    <dt className="label-mono">{s.label}</dt>
                    <dd className="mt-2 font-serif-ko text-body-lg text-ink leading-base whitespace-pre-wrap">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : (
            <section>
              <p className="label-mono text-gold">사건 개요</p>
              <pre className="mt-5 font-serif-ko text-body text-ink leading-base whitespace-pre-wrap max-w-[44em]">
                {consultation.case_summary}
              </pre>
            </section>
          )}

          {/* Conversation log (collapsed-ish) */}
          {conversation?.messages?.length ? (
            <section>
              <details className="rounded-md border border-paper-3 bg-paper-2">
                <summary className="cursor-pointer p-5 font-mono text-[11px] uppercase tracking-label text-ink-mute hover:text-ink">
                  AI 인테이크 대화 보기 ({conversation.messages.length}턴)
                </summary>
                <ul className="border-t border-paper-3 p-5 space-y-4 max-h-96 overflow-y-auto">
                  {conversation.messages.map((m, i) => (
                    <li key={i} className="font-serif-ko text-[14px] leading-base">
                      <span className="font-mono text-[10px] uppercase tracking-label text-ink-mute mr-2">
                        {m.role === "user" ? "USER" : "AI"}
                      </span>
                      <span className={m.role === "user" ? "text-ink" : "text-ink-soft"}>
                        {m.content}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            </section>
          ) : null}
        </div>

        {/* Side panel */}
        <aside className="space-y-5">
          <div className="bg-paper border border-paper-3 rounded-md p-6">
            <p className="label-mono text-gold">CONTACT</p>
            <p className="mt-4 font-serif-ko text-h3 font-semibold text-ink">{name}</p>
            <dl className="mt-5 space-y-3 text-[14px] font-serif-ko">
              {Object.entries(contact).map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10px] uppercase tracking-label text-ink-mute">{k}</dt>
                  <dd className="text-ink">{String(v) || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>

          {conversation && (
            <div className="bg-paper border border-paper-3 rounded-md p-6">
              <p className="label-mono text-gold">SESSION</p>
              <p className="mt-3 font-mono text-[11px] text-ink-mute break-all">
                {conversation.session_id}
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                completeness
              </p>
              <p className="mt-1 font-display italic text-h2 text-ink leading-none">
                {Math.round((conversation.intake_state?.completeness ?? 0) * 100)}%
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
