import { NextResponse } from "next/server";
import { z } from "zod";
import { getAnthropic, hasAnthropicConfig, CLAUDE_MODEL, SYSTEM_FOOTER } from "@/lib/ai/anthropic";
import { withAudit } from "@/lib/ai/audit";
import { extractJson, textOf } from "@/lib/ai/json";

export const runtime = "nodejs";

const bodySchema = z.object({
  accident_type: z.string().min(1),
  parties: z.array(z.object({ role: z.string(), info: z.string() })).default([]),
  damages: z.object({
    amount: z.number().min(0),
    type: z.array(z.string()).default([]),
  }),
  insurance_paid: z.number().min(0),
  fault_ratio: z.string().optional(),
  additional_facts: z.string().default(""),
});

type SubrogationResult = {
  recovery_possibility: "high" | "medium" | "low" | "none";
  recovery_rate_estimate: { min: number; max: number };
  key_factors: string[];
  recommended_actions: string[];
  similar_cases: Array<{ summary: string; result: string }>;
};

const SYSTEM_PROMPT = `당신은 보험사 실무진을 돕는 구상 가능성 진단 도구입니다.

[입력] 사고 유형, 당사자, 손해액, 지급 보험금, 과실 비율, 추가 사실
[출력] 구상 가능성·예상 회수율·핵심 요인·권장 액션·유사 사례 (JSON)

[가드레일]
- 결과를 단정하지 마십시오 ("입니다" 대신 "가능성이 있습니다" 사용).
- 구체적 청구액·승소 가능성을 단정하지 마십시오.
- 반드시 변호사법 제23조 광고 규제를 준수합니다.

[응답 분량 — 토큰 절약]
- key_factors: 최대 4개, 각 항목 50자 이내
- recommended_actions: 최대 4개, 각 항목 40자 이내
- similar_cases: 최대 2개, summary/result 각 60자 이내
- 모든 값에서 불필요한 부연 설명 금지

응답은 다음 JSON 구조 1개:
{
  "recovery_possibility": "high"|"medium"|"low"|"none",
  "recovery_rate_estimate": { "min": 0~100, "max": 0~100 },
  "key_factors": ["..."],
  "recommended_actions": ["..."],
  "similar_cases": [{ "summary": "...", "result": "..." }]
}

${SYSTEM_FOOTER}`;

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

  if (!hasAnthropicConfig()) {
    // Heuristic stub
    const ratio = body.insurance_paid / Math.max(1, body.damages.amount);
    const possibility: SubrogationResult["recovery_possibility"] =
      ratio > 0.7 ? "high" : ratio > 0.4 ? "medium" : ratio > 0.1 ? "low" : "none";
    const stub: SubrogationResult = {
      recovery_possibility: possibility,
      recovery_rate_estimate: { min: 20, max: 60 },
      key_factors: [
        "당사자의 책임 범위와 과실 비율",
        "보험금 지급이 가해자 책임을 포함하는지",
        "구상권 행사 시효",
      ],
      recommended_actions: [
        "사고 경위 자료 정리",
        "가해자 책임 명확화 자료 확보",
        "구상권 행사 기간 확인",
      ],
      similar_cases: [
        {
          summary: "교통사고 합의금 지급 후 공동불법행위자 구상",
          result: "구상권 인정 — 회수 성공",
        },
      ],
    };
    return NextResponse.json({ ...stub, legal_notice: SYSTEM_FOOTER, stub: true });
  }

  const out = await withAudit("subrogation-check", body, async () => {
    const anthropic = getAnthropic();
    const userPrompt = `사고 유형: ${body.accident_type}
당사자: ${JSON.stringify(body.parties)}
손해액: ${body.damages.amount.toLocaleString()}원 (${body.damages.type.join(", ")})
지급 보험금: ${body.insurance_paid.toLocaleString()}원
과실 비율: ${body.fault_ratio ?? "미상"}
추가 사실: ${body.additional_facts || "없음"}

위 정보로 구상 가능성을 평가하고 JSON으로만 응답하세요.`;

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = textOf(response.content);
    const parsed = extractJson<SubrogationResult>(text);

    const tokensUsed = (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0);

    return { output: parsed, tokensUsed };
  });

  return NextResponse.json({ ...out, legal_notice: SYSTEM_FOOTER });
}
