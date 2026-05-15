import { NextResponse } from "next/server";
import { z } from "zod";
import { getAnthropic, hasAnthropicConfig, CLAUDE_MODEL, SYSTEM_FOOTER } from "@/lib/ai/anthropic";
import { recordAudit } from "@/lib/ai/audit";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import {
  ndjsonFromAnthropicStream,
  ndjsonResponse,
  ndjsonStubResponse,
  SHARED_STREAM_INSTRUCTIONS,
} from "@/lib/ai/stream";
import {
  emptyIntakeState,
  mergeIntakeState,
  matterTypes,
  matterTypeLabels,
  type IntakeState,
} from "@/lib/ai/intake-slots";
import { maskPII } from "@/lib/ai/pii-mask";
import { matchLawyersByMatter } from "@/lib/ai/lawyer-routing";
import { matchChecklist } from "@/lib/data/checklists";

export const runtime = "nodejs";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const bodySchema = z.object({
  message: z.string().min(1),
  history: z.array(messageSchema).default([]),
  state: z.unknown().optional(),
  sessionId: z.string().optional(),
});

const SYSTEM_PROMPT = `당신은 법무법인 도원의 사건 정보 수집 도우미입니다.

[역할]
사용자가 변호사와 상담하기 전, 사건 정보를 차분히 정리해서 변호사에게 정확히 전달되도록 돕습니다.

[중요 — 절대 지키기]
1. 본 도구는 법률 자문이 아닙니다. 첫 응답에서 한 번 명시하고 이후 반복하지 마십시오.
2. 승소 가능성·구체적 청구액·법률 해석 의견을 제공하지 마십시오. 사실만 수집합니다.
3. 변호사법 §23 광고 규제 표현("최고/1위/보장/확실/꼭") 금지.
4. 폭력 위협·자살 위험을 감지하면 112 / 1577-0199(생명의전화)를 안내하고 즉시 인간 응대 권유.

[대화 원칙]
- 따뜻하고 차분한 어조. 사용자가 힘든 상황일 가능성을 인지합니다.
- 한 번에 하나의 질문만. 심문하지 않습니다.
- 사용자가 자연스럽게 말한 내용을 슬롯에 자동 분류합니다. 모르는 슬롯은 null로 두고 다음에 다시 물어봅니다.
- 핵심 슬롯(사건 유형·시점·당사자·경위·손해·자료·원하는 결과)이 채워지면 "이만 정리해드릴까요?"를 제안합니다.
- 사용자가 멈추고 싶다고 하면 즉시 멈춥니다.

[슬롯 — 채워야 할 정보]
1. matter_type: ${matterTypes.join(" | ")}
   라벨: ${Object.entries(matterTypeLabels).map(([k, v]) => `${k}=${v}`).join(", ")}
2. when: { date, time_of_day, ongoing, notes }
3. where: { location, notes }
4. parties: { user_role(victim|perpetrator|witness|claimant|other), other_parties[{role, description}], notes }
5. narrative: 자유 서술 (5W1H)
6. damages: { physical, property, financial, psychological, notes }
7. evidence: { items[], missing[], notes }
8. desired_outcome: { options[](compensation|settlement|criminal|retraction|injunction|other), notes }
9. prior_actions: { police_report, insurance_claim, settlement_attempt, other_lawyer, notes }
10. deadlines: 사용자가 명시한 행동 마감일만 (시효 추정 금지)
    - 예: 출석요구일 / 답변서 제출일 / 항소 기한 등 — 사용자 발화에 등장한 날짜만
    - 시효(공소시효·소멸시효)를 추정해서 deadlines 에 추가하지 마십시오. 일반 정보 안내가 필요하면 본문에서만 언급하고 deadlines 에 채우지 마십시오.
    - date 는 반드시 YYYY-MM-DD. 사용자가 "다음 주 화요일" 같이 상대 표현만 했다면 채우지 마십시오.

[추가 가드레일 — 본 확장 기능용]
- 결론적 법률 판단 문구 금지: "이기실 수 있습니다", "유리합니다", "승소 확률", "보장" 등
- 사용자가 주민번호·계좌·구체 사건번호를 입력한 경우(자동 마스킹되어 표시될 수 있음): "민감정보는 입력하지 않으셔도 됩니다"로 안내하고 그 정보를 본문에서 반복 인용하지 마십시오.
- 시급성 안내 시 마무리 멘트로 "시효·기간 적용 여부는 변호사 확인이 필요합니다" 를 1회 덧붙입니다.

${SHARED_STREAM_INSTRUCTIONS}

[State JSON 스키마]
{
  "intake_state": {
    "matter_type": "...",
    "when": { ... },
    "where": { ... },
    "parties": { ... },
    "narrative": "...",
    "damages": { ... },
    "evidence": { ... },
    "desired_outcome": { ... },
    "prior_actions": { ... },
    "deadlines": [ { "label": "...", "date": "YYYY-MM-DD", "source": "..." } ]
  },
  "next_question_target": "matter_type" | "when" | "where" | "parties" | "narrative" | "damages" | "evidence" | "desired_outcome" | "prior_actions" | "deadlines" | "summary" | "done",
  "should_offer_summary": true | false
}

${SYSTEM_FOOTER}`;

type IntakeStateJson = {
  intake_state: Partial<IntakeState>;
  next_question_target: string;
  should_offer_summary: boolean;
};

function newSessionId() {
  return "ink_" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export async function POST(req: Request) {
  const limited = await checkRateLimit(req, "intake-long");
  if (limited) return limited;

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid request", details: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    );
  }

  const sessionId = body.sessionId ?? newSessionId();
  const priorState = (body.state as IntakeState | undefined) ?? emptyIntakeState();

  // Server-side PII re-mask. The client should already mask, but we never
  // trust callers — anything sent to Claude or persisted to Supabase passes
  // through this filter as a belt-and-suspenders.
  const { masked: userMessage, hits: piiHits } = maskPII(body.message);

  // Stub fallback — same NDJSON wire so the client doesn't need branching.
  if (!hasAnthropicConfig()) {
    return ndjsonStubResponse([
      {
        type: "token",
        text:
          "본 도구는 법률 자문이 아닌 사건 정보 정리 도우미입니다. 정확한 동작을 위해서는 ANTHROPIC_API_KEY가 필요합니다. 어떤 일이 있으셨는지 자유롭게 말씀해 주세요.",
      },
      {
        type: "state",
        sessionId,
        state: priorState,
        completeness: priorState.completeness,
        next_question_target: "narrative",
        should_offer_summary: false,
        legal_notice: SYSTEM_FOOTER,
        stub: true,
      },
    ]);
  }

  const anthropic = getAnthropic();
  const t0 = Date.now();
  const aiStream = anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 1500,
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [
      ...body.history.map((m) => ({ role: m.role, content: m.content })),
      {
        role: "user",
        content:
          `[현재까지 정리된 상태]\n${JSON.stringify(priorState, null, 2)}\n\n[사용자의 새 발화]\n${userMessage}` +
          (piiHits.length > 0
            ? `\n\n[시스템 안내] 사용자 발화에 민감정보(${piiHits.map((h) => h.label).join(", ")})가 포함되어 마스킹되었습니다. 사용자에게 한 번만 "민감정보는 입력하지 않으셔도 됩니다"라고 안내하고 본문에서 그 정보를 다시 인용하지 마십시오.`
            : ""),
      },
    ],
  });

  const stream = ndjsonFromAnthropicStream<IntakeStateJson>(aiStream, {
    enrich: (parsed, fullReply) => {
      const delta = parsed?.intake_state ?? {};
      const nextState = mergeIntakeState(priorState, delta);
      const offerSummary =
        (parsed?.should_offer_summary ?? false) || nextState.ready_for_summary;
      const suggestedLawyers = matchLawyersByMatter(nextState.matter_type, 3);
      const checklist = matchChecklist(nextState.matter_type, nextState.evidence.items);
      return {
        sessionId,
        state: nextState,
        completeness: nextState.completeness,
        next_question_target: parsed?.next_question_target ?? "narrative",
        should_offer_summary: offerSummary,
        suggested_lawyers: suggestedLawyers,
        checklist: checklist.map(({ item, matched }) => ({
          id: item.id,
          label: item.label,
          required: item.required,
          matched,
        })),
        deadlines: nextState.deadlines ?? [],
        pii_hits: piiHits,
        legal_notice: SYSTEM_FOOTER,
        // expose the assembled reply so the client can rebuild full text after
        // a network blip (the held-back tail) — also handy for audit logs.
        reply: fullReply,
      };
    },
    onFinal: async (parsed, fullReply) => {
      const delta = parsed?.intake_state ?? {};
      const nextState = mergeIntakeState(priorState, delta);
      const durationMs = Date.now() - t0;

      // Audit (best-effort)
      recordAudit({
        toolName: "intake",
        input: { sessionId, hasState: !!body.state, piiHits: piiHits.length },
        output: { matter_type: nextState.matter_type, completeness: nextState.completeness },
        durationMs,
      }).catch(() => undefined);

      // Persist conversation turn (best-effort). Only the MASKED message is
      // stored — raw user input never lands in Supabase.
      if (hasSupabaseConfig()) {
        try {
          const supabase = getServerSupabase();
          const newMessages = [
            ...body.history,
            { role: "user" as const, content: userMessage },
            { role: "assistant" as const, content: fullReply },
          ];
          await supabase
            .from("ai_conversations")
            .upsert(
              {
                session_id: sessionId,
                persona: "personal",
                messages: newMessages,
                intake_state: nextState,
                classification: {
                  matter_type: nextState.matter_type,
                  completeness: nextState.completeness,
                },
              },
              { onConflict: "session_id" }
            );
        } catch (e) {
          console.warn("[intake] persist warning:", e);
        }
      }
    },
  });

  return ndjsonResponse(stream);
}
