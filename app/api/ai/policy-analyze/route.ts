import { NextResponse } from "next/server";
import { getCurrentAdminEmail } from "@/lib/admin/auth";
import { getAnthropic, hasAnthropicConfig, CLAUDE_MODEL, SYSTEM_FOOTER } from "@/lib/ai/anthropic";
import { withAudit } from "@/lib/ai/audit";
import { extractJson, textOf } from "@/lib/ai/json";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * AI #3 — Policy Reader. PRD §6.2/AI#3.
 * Access-controlled: requires an authenticated admin (lawyer) OR authenticated
 * insurer user. For now we gate on admin cookie. Real production should
 * implement insurer roles + Supabase Auth.
 */

const SYSTEM_PROMPT = `당신은 보험 약관 분석 도우미입니다. 업로드된 약관/증권 PDF에서
보장 항목, 면책 사유, 한도, 조건을 구조화해 추출합니다.

[가드레일]
- 약관 해석 결과를 단정하지 마십시오 — "그렇게 해석될 여지가 있다" 정도.
- 사용자 질문에 답할 때 직접적 청구 가능 여부 단정 금지.
- 변호사 검토 필요 항목은 명시적으로 표기.

[출력 — JSON]
{
  "document_summary": "약관 핵심 요약 2~3문장",
  "coverage": [{ "item": "...", "limit": "...", "conditions": ["..."], "source_page": 0 }],
  "exclusions": [{ "clause": "...", "interpretation": "...", "related_cases": ["..."], "source_page": 0 }],
  "user_question_answer": "사용자 질문에 대한 보조 답변 (있을 때만)"
}

${SYSTEM_FOOTER}`;

export async function POST(req: Request) {
  const email = getCurrentAdminEmail();
  if (!email) {
    return NextResponse.json(
      { error: "Unauthorized — admin or insurer user only." },
      { status: 401 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const analysisType = String(formData.get("analysis_type") ?? "coverage");
  const userQuestion = String(formData.get("user_question") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "PDF file required." }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)." }, { status: 413 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "PDF only." }, { status: 415 });
  }

  if (!hasAnthropicConfig()) {
    return NextResponse.json({
      stub: true,
      document_summary: "[STUB] ANTHROPIC_API_KEY 미설정. 실제 분석은 키 설정 후 동작합니다.",
      coverage: [
        { item: "예시 보장 항목", limit: "5천만원", conditions: ["조건 1", "조건 2"], source_page: 3 },
      ],
      exclusions: [
        { clause: "예시 면책 조항", interpretation: "해당 사유 시 면책 가능", related_cases: [], source_page: 12 },
      ],
      user_question_answer: userQuestion ? "API key 설정 후 답변이 제공됩니다." : null,
      legal_notice: SYSTEM_FOOTER,
    });
  }

  const buf = Buffer.from(await file.arrayBuffer());

  const out = await withAudit(
    "policy-analyze",
    { fileName: file.name, fileSize: file.size, analysisType, hasQuestion: !!userQuestion },
    async () => {
      const anthropic = getAnthropic();
      const userParts: Array<
        | { type: "document"; source: { type: "base64"; media_type: "application/pdf"; data: string } }
        | { type: "text"; text: string }
      > = [
        {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: buf.toString("base64"),
          },
        },
        {
          type: "text",
          text: `분석 유형: ${analysisType}${
            userQuestion ? `\n사용자 질문: ${userQuestion}` : ""
          }\n\n위 PDF를 분석하고 JSON으로만 응답하세요.`,
        },
      ];

      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 3000,
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: userParts }],
      });

      const text = textOf(response.content as Array<{ type: string } & Record<string, unknown>>);
      const parsed = extractJson(text);

      const tokensUsed =
        (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0);

      return { output: parsed, tokensUsed };
    }
  );

  return NextResponse.json({ ...out, legal_notice: SYSTEM_FOOTER });
}
