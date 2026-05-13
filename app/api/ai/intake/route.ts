import { NextResponse } from "next/server";
import { z } from "zod";
import { getAnthropic, hasAnthropicConfig, CLAUDE_MODEL, SYSTEM_FOOTER } from "@/lib/ai/anthropic";
import { withAudit } from "@/lib/ai/audit";
import { extractJson, textOf } from "@/lib/ai/json";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import {
  emptyIntakeState,
  mergeIntakeState,
  deriveCompleteness,
  matterTypes,
  matterTypeLabels,
  type IntakeState,
} from "@/lib/ai/intake-slots";

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

[출력 — JSON only, no prose outside]
{
  "reply": "사용자에게 보낼 한국어 답변. 정중한 ‘~습니다/요’ 체. 한 단락 이내.",
  "intake_state": {  // 위 슬롯 구조와 동일. 새로 알게 된 값만 채우고 나머지는 생략 가능. null은 '모름'을 의미.
    "matter_type": "...",
    "when": { ... },
    "where": { ... },
    "parties": { ... },
    "narrative": "...",
    "damages": { ... },
    "evidence": { ... },
    "desired_outcome": { ... },
    "prior_actions": { ... }
  },
  "next_question_target": "matter_type" | "when" | "where" | "parties" | "narrative" | "damages" | "evidence" | "desired_outcome" | "prior_actions" | "summary" | "done",
  "should_offer_summary": true | false   // 핵심 슬롯이 7개 이상 채워졌고 사용자가 추가 입력을 멈출 만한 시점이면 true
}

응답은 JSON 1개. 다른 텍스트 포함 금지.

${SYSTEM_FOOTER}`;

type IntakeReply = {
  reply: string;
  intake_state: Partial<IntakeState>;
  next_question_target: string;
  should_offer_summary: boolean;
};

function newSessionId() {
  return "ink_" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export async function POST(req: Request) {
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

  // Stub fallback when Anthropic isn't configured
  if (!hasAnthropicConfig()) {
    const stubReply: IntakeReply = {
      reply:
        "본 도구는 법률 자문이 아닌 사건 정보 정리 도우미입니다. 정확한 동작을 위해서는 ANTHROPIC_API_KEY가 필요합니다. 어떤 일이 있으셨는지 자유롭게 말씀해 주세요.",
      intake_state: {},
      next_question_target: "narrative",
      should_offer_summary: false,
    };
    return NextResponse.json({
      ...stubReply,
      sessionId,
      state: priorState,
      legal_notice: SYSTEM_FOOTER,
      stub: true,
    });
  }

  const result = await withAudit("intake", { sessionId, hasState: !!body.state }, async () => {
    const anthropic = getAnthropic();
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...body.history.map((m) => ({ role: m.role, content: m.content })),
      {
        role: "user",
        content:
          `[현재까지 정리된 상태]\n${JSON.stringify(priorState, null, 2)}\n\n[사용자의 새 발화]\n${body.message}`,
      },
    ];

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages,
    });

    const text = textOf(response.content);
    let parsed: IntakeReply;
    try {
      parsed = extractJson<IntakeReply>(text);
    } catch {
      parsed = {
        reply: text || "잠시 다시 말씀해 주시겠어요?",
        intake_state: {},
        next_question_target: "narrative",
        should_offer_summary: false,
      };
    }

    const tokensUsed =
      (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0);
    return { output: parsed, tokensUsed };
  });

  const nextState = mergeIntakeState(priorState, result.intake_state ?? {});
  // Server-side override: if our completeness derivation thinks we're ready,
  // honor that even if the model said otherwise (safety net).
  const offerSummary = result.should_offer_summary || nextState.ready_for_summary;

  // Persist conversation turn (best-effort — non-blocking is overkill at this volume)
  if (hasSupabaseConfig()) {
    try {
      const supabase = getServerSupabase();
      const newMessages = [
        ...body.history,
        { role: "user" as const, content: body.message },
        { role: "assistant" as const, content: result.reply },
      ];
      await supabase
        .from("ai_conversations")
        .upsert(
          {
            session_id: sessionId,
            persona: "personal",
            messages: newMessages,
            intake_state: nextState,
            classification: { matter_type: nextState.matter_type, completeness: nextState.completeness },
          },
          { onConflict: "session_id" }
        );
    } catch (e) {
      console.warn("[intake] persist warning:", e);
    }
  }

  return NextResponse.json({
    sessionId,
    reply: result.reply,
    state: nextState,
    completeness: deriveCompleteness(nextState),
    next_question_target: result.next_question_target,
    should_offer_summary: offerSummary,
    legal_notice: SYSTEM_FOOTER,
  });
}
