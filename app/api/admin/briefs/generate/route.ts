import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminEmail } from "@/lib/admin/auth";
import { getAnthropic, hasAnthropicConfig, CLAUDE_MODEL, SYSTEM_FOOTER } from "@/lib/ai/anthropic";
import { recordAudit } from "@/lib/ai/audit";
import { getBriefSkill } from "@/lib/legal-briefs/skills";
import { computeCivilComplaint } from "@/lib/legal-briefs/calc";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  skillSlug: z.string(),
  inputs: z.record(z.string(), z.union([z.string(), z.number()])),
  followUpAnswers: z.array(z.string()).optional().default([]),
});

type Section = { title: string; body: string };

function tryParseJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : text.trim();
  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req: Request) {
  const adminEmail = getCurrentAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid request", details: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    );
  }

  const skill = getBriefSkill(body.skillSlug);
  if (!skill) {
    return NextResponse.json({ error: "Unknown skill" }, { status: 404 });
  }

  // Compute auxiliary numbers for civil complaint so Claude doesn't have to
  // (and so we never let the LLM hallucinate filing fees).
  let calcSummary: string | null = null;
  if (skill.slug === "korean-civil-complaint-skill") {
    const calc = computeCivilComplaint({
      principal: Number(body.inputs.principal) || 0,
      partialRepayment: Number(body.inputs.partialRepayment) || 0,
      loanDate: String(body.inputs.loanDate ?? ""),
      dueDate: String(body.inputs.dueDate ?? ""),
      interestRatePct: Number(body.inputs.interestRate) || 0,
    });
    calcSummary = [
      `잔존 원금: ${calc.remainingPrincipal.toLocaleString("ko-KR")}원`,
      `약정이자: ${calc.agreedInterest.toLocaleString("ko-KR")}원`,
      `추정 소가: ${calc.estimatedSoga.toLocaleString("ko-KR")}원`,
      `인지대: ${calc.filingFee.fee.toLocaleString("ko-KR")}원 (${calc.filingFee.formula})`,
      `송달료: ${calc.serviceFee.fee.toLocaleString("ko-KR")}원 (${calc.serviceFee.formula})`,
    ].join("\n");
  }

  if (!hasAnthropicConfig()) {
    // Stub fallback — return the example's sections so the UI flow works
    // end-to-end even without an API key.
    return NextResponse.json({
      stub: true,
      documentTitle: skill.example.title.split(" — ")[0] ?? skill.name,
      sections: skill.example.sections,
      flags: skill.example.flags ?? [],
      calculations: skill.example.calculations ?? [],
      message:
        "ANTHROPIC_API_KEY 미설정 — 예시 데이터로 출력. 실제 생성에는 환경변수 설정이 필요합니다.",
    });
  }

  const followUpBlock =
    body.followUpAnswers.length > 0
      ? skill.followUpQuestions
          .map((q, i) => `- ${q}\n  → ${body.followUpAnswers[i] ?? "(미응답)"}`)
          .join("\n")
      : "(추가 질문 응답 없음)";

  const inputsBlock = Object.entries(body.inputs)
    .map(([k, v]) => {
      const fieldDef = skill.fields.find((f) => f.name === k);
      return `- ${fieldDef?.label ?? k}: ${v}`;
    })
    .join("\n");

  const sectionsSpec = skill.outputSections
    .map((s, i) => `${i + 1}. "${s.title}" — ${s.hint}`)
    .join("\n");

  const systemPrompt = `당신은 법무법인 도원의 시니어 변호사를 보조하는 한국 법조 서면 초안 작성 전문가입니다.

[스킬] ${skill.name} (${skill.englishName})
[작성 목적] ${skill.description}

[톤·문체 가이드]
${skill.toneGuide}

[법적 요건 체크리스트]
${skill.checklist.map((c, i) => `${i + 1}. ${c.label}${c.required ? " (필수)" : ""}`).join("\n")}

[주요 법령·판례]
${skill.citationDb ?? ""}

[출력 섹션 구조]
다음 섹션 순서·제목을 그대로 따라야 합니다:
${sectionsSpec}

[엄격 규칙]
1. 출력은 오직 JSON 한 개. 마크다운 금지, 코드펜스 금지.
2. JSON 스키마:
{
  "documentTitle": "문서 표제(예: 대여금 청구의 소)",
  "sections": [ { "title": "섹션 제목", "body": "본문 텍스트(줄바꿈 \\n 허용)" }, ... ],
  "flags": [ { "label": "변호사 확인 항목", "detail": "왜 확인이 필요한지" } ],
  "calculations": [ { "label": "계산 항목", "value": "계산 결과", "note": "산식" } ]
}
3. body 안에는 어떠한 마크다운(##, **, [], 이모지)도 쓰지 않습니다. 줄바꿈은 \\n 만 사용.
4. 모든 일자는 "2026. 5. 15." 형식. 금액은 "금 40,000,000원".
5. 승소 가능성·확실성을 단정하는 표현 금지(변호사법 §23 광고규제).
6. 사실관계는 사용자 입력에서만 사용. 새 사실을 창작하지 않습니다. 정보가 부족하면 "(추후 확인)" 같은 자리표시자를 적습니다.
7. 인지대·송달료는 시스템이 계산해서 제공한 값을 그대로 인용하고, 본문에 별도 계산식을 만들지 마십시오.

${SYSTEM_FOOTER}`;

  const userPrompt = `[입력 항목]
${inputsBlock}

[추가 질문 응답]
${followUpBlock}

${calcSummary ? `[시스템 자동 계산 — 인지대·송달료 등]\n${calcSummary}\n` : ""}

위 내용을 바탕으로 [출력 섹션 구조]에 맞춰 JSON 한 개만 출력하세요.`;

  const t0 = Date.now();
  try {
    const anthropic = getAnthropic();
    const resp = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4500,
      system: [
        { type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = resp.content
      .filter((c) => c.type === "text")
      .map((c) => (c as { type: "text"; text: string }).text)
      .join("");

    const parsed = tryParseJson(text) as
      | {
          documentTitle?: string;
          sections?: Section[];
          flags?: { label: string; detail: string }[];
          calculations?: { label: string; value: string; note?: string }[];
        }
      | null;

    if (!parsed?.sections || !Array.isArray(parsed.sections)) {
      return NextResponse.json(
        { error: "AI 응답을 해석하지 못했습니다.", raw: text.slice(0, 600) },
        { status: 502 }
      );
    }

    const durationMs = Date.now() - t0;

    recordAudit({
      toolName: `brief:${skill.slug}`,
      userId: adminEmail,
      input: { inputs: Object.keys(body.inputs), followUps: body.followUpAnswers.length },
      output: { sectionCount: parsed.sections.length, flagCount: parsed.flags?.length ?? 0 },
      tokensUsed: resp.usage?.input_tokens ?? undefined,
      durationMs,
    }).catch(() => undefined);

    return NextResponse.json({
      stub: false,
      documentTitle: parsed.documentTitle ?? skill.name,
      sections: parsed.sections,
      flags: parsed.flags ?? [],
      calculations: parsed.calculations ?? [],
    });
  } catch (e) {
    recordAudit({
      toolName: `brief:${skill.slug}`,
      userId: adminEmail,
      input: { inputs: Object.keys(body.inputs) },
      output: { error: e instanceof Error ? e.message : String(e) },
      durationMs: Date.now() - t0,
    }).catch(() => undefined);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "서면 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
