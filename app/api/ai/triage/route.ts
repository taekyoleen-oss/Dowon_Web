import { NextResponse } from "next/server";
import { z } from "zod";
import { getAnthropic, hasAnthropicConfig, CLAUDE_MODEL, SYSTEM_FOOTER } from "@/lib/ai/anthropic";
import { recordAudit } from "@/lib/ai/audit";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import {
  ndjsonFromAnthropicStream,
  ndjsonResponse,
  ndjsonStubResponse,
  SHARED_STREAM_INSTRUCTIONS,
} from "@/lib/ai/stream";
import { lawyers, practiceAreaLabels, type PracticeAreaCode } from "@/lib/data/lawyers";

export const runtime = "nodejs";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const bodySchema = z.object({
  message: z.string().min(1),
  history: z.array(messageSchema).default([]),
  conversationId: z.string().optional(),
  context: z
    .object({
      referrer: z.string().optional(),
      persona: z.enum(["personal", "enterprise", "medical", "insurer"]).optional(),
    })
    .optional(),
});

const PRACTICE_AREA_CODES: PracticeAreaCode[] = [
  "auto","long-term","fire","liability","life",
  "medical","subrogation","investigation","advisory","criminal",
];

const SYSTEM_PROMPT = `당신은 법무법인 도원의 사건 유형 진단 챗봇입니다.

[역할]
방문자의 자연어 설명을 듣고 (1) 사건 유형 분류, (2) 필요한 자료, (3) 예상 절차/기간, (4) 적합한 변호사를 안내합니다.

[대화 흐름]
1. 첫 답변에서는 반드시 "본 안내는 법률 자문이 아니며 일반 정보 안내임"을 명시합니다.
2. 사건 개요를 듣고, 분류에 필요한 핵심 정보가 부족하면 1~3회 캐치업 질문을 합니다.
3. 충분한 정보가 모이면 사건 유형을 분류하고, 필요 자료와 예상 절차를 안내합니다.
4. 마지막에는 도원 상담 신청 폼으로 안내합니다.

[가드레일 — 반드시 준수]
- 구체적 법률 자문(특정 청구액, 승소 가능성, 특정 조항 해석)을 제공하지 마십시오.
- 승소 가능성·결과를 단정하지 마십시오.
- 변호사법 제23조 위반 표현(최고·1위·보장·확실 등)을 사용하지 마십시오.
- 응급 상황(자살 위협, 폭력 위험)을 감지하면 즉시 119/1577-0199(생명의전화)를 안내하고 인간 응대 연결을 권유하십시오.

[가능한 사건 유형 (matter_type 분류 코드)]
${PRACTICE_AREA_CODES.map((c) => `- ${c}: ${practiceAreaLabels[c]}`).join("\n")}

${SHARED_STREAM_INSTRUCTIONS}

[State JSON 스키마]
{
  "needs_more_info": true|false,
  "matter_type": "위 코드 중 하나 또는 unknown",
  "confidence": 0~1,
  "needed_documents": ["필요한 자료1", "..."],
  "estimated_timeline": "예: '3~6개월'",
  "next_action": "consultation" | "ask_more" | "library"
}

${SYSTEM_FOOTER}`;

type ClassifyResult = {
  needs_more_info: boolean;
  matter_type: string;
  confidence: number;
  needed_documents: string[];
  estimated_timeline: string;
  next_action: "consultation" | "ask_more" | "library";
};

function matchLawyers(matter: string, limit = 3) {
  const isPracticeCode = (PRACTICE_AREA_CODES as string[]).includes(matter);
  const scored = lawyers
    .map((l) => {
      let score = 0;
      if (isPracticeCode && l.practiceAreas.includes(matter as PracticeAreaCode)) score += 3;
      if (matter === "medical" && l.specialQualifications?.includes("의사")) score += 2;
      if (l.isPartner) score += 0.5;
      return { l, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ l, score }) => ({
    id: l.slug,
    name: l.nameKo,
    match_reason:
      isPracticeCode && l.practiceAreas.includes(matter as PracticeAreaCode)
        ? `${practiceAreaLabels[matter as PracticeAreaCode]} 전담 변호사`
        : "관련 분야 변호사",
    match_score: Number((score / 5).toFixed(2)),
  }));
}

function newConversationId() {
  return "trg_" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export async function POST(req: Request) {
  const limited = await checkRateLimit(req, "chat");
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

  const conversationId = body.conversationId ?? newConversationId();

  if (!hasAnthropicConfig()) {
    return ndjsonStubResponse([
      {
        type: "token",
        text:
          "본 답변은 일반 정보 안내입니다. 더 정확한 도움을 위해 ANTHROPIC_API_KEY가 설정되어야 합니다. 사건 유형을 정확히 분류하려면 상담 신청 폼을 이용해주세요.",
      },
      {
        type: "state",
        conversationId,
        matter_type: "unknown",
        confidence: 0,
        needs_more_info: true,
        needed_documents: [],
        estimated_timeline: "—",
        next_action: "consultation",
        suggested_lawyers: [],
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
      { role: "user", content: body.message },
    ],
  });

  const stream = ndjsonFromAnthropicStream<ClassifyResult>(aiStream, {
    enrich: (parsed) => {
      const matter = parsed?.matter_type ?? "unknown";
      return {
        conversationId,
        matter_type: matter,
        confidence: parsed?.confidence ?? 0,
        needs_more_info: parsed?.needs_more_info ?? true,
        needed_documents: parsed?.needed_documents ?? [],
        estimated_timeline: parsed?.estimated_timeline ?? "—",
        next_action: parsed?.next_action ?? "ask_more",
        suggested_lawyers: matchLawyers(matter),
        legal_notice: SYSTEM_FOOTER,
      };
    },
    onFinal: (parsed) => {
      recordAudit({
        toolName: "triage",
        input: { message: body.message.slice(0, 200), persona: body.context?.persona },
        output: { matter_type: parsed?.matter_type, confidence: parsed?.confidence },
        durationMs: Date.now() - t0,
      }).catch(() => undefined);
    },
  });

  return ndjsonResponse(stream);
}
