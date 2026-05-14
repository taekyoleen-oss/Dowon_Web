import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getAnthropic,
  hasAnthropicConfig,
  CLAUDE_MODEL,
  SYSTEM_FOOTER,
} from "@/lib/ai/anthropic";
import { recordAudit } from "@/lib/ai/audit";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import {
  ndjsonFromAnthropicStream,
  ndjsonResponse,
  ndjsonStubResponse,
  SHARED_STREAM_INSTRUCTIONS,
} from "@/lib/ai/stream";
import { libraryItems } from "@/lib/data/library";
import { practiceAreaLabels, type PracticeAreaCode } from "@/lib/data/lawyers";

export const runtime = "nodejs";
export const maxDuration = 60;

const incidentSchema = z.object({
  category: z.enum([
    "auto",
    "long-term",
    "fire",
    "liability",
    "life",
    "medical",
    "other",
  ]),
  occurred_at: z.string().optional(),
  amount_estimate: z.string().optional(),
  description: z.string().min(20, "사고/질병 내용을 20자 이상 입력해 주세요."),
});

const turnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const bodySchema = z.object({
  policy_text: z.string().optional(),
  incident: incidentSchema,
  // Follow-up support: prior alternating turns (user/assistant). When
  // non-empty, `followup_message` is treated as the new user input and the
  // request is sent to Claude as a multi-turn conversation.
  history: z.array(turnSchema).optional(),
  followup_message: z.string().optional(),
  acknowledged_disclaimer: z.literal(true, {
    message: "이용 동의가 필요합니다.",
  }),
});

/**
 * Coverage Check — consumer-facing self-diagnostic.
 *
 * Two ingest paths:
 *   1. multipart/form-data with `policy` (PDF) + JSON `body` field
 *   2. application/json with `policy_text` (typed/pasted policy excerpt)
 *
 * Output: NDJSON stream
 *   { type: "token", text: "..." }              — natural language summary
 *   { type: "state", payload }                  — structured cards + matches
 */

const SYSTEM_PROMPT = `당신은 법무법인 도원의 보험금 가능성 셀프체크 도우미입니다.

[목적]
의뢰인이 본인의 보험 약관 텍스트와 사고/질병 정보를 입력하면, 약관과 사고 사실을 매칭해 다음을 안내합니다:
1. 보험금 지급 가능성에 대한 *후보* 검토 결과 (단정 금지)
2. 약관에서 추출된 관련 보장 조항
3. 약관에서 검토 대상이 될 가능성이 있는 면책 사유
4. 권장 다음 단계

[절대 지키기 — 변호사법 §23 / 보험업법]
1. 본 도구는 법률 자문이나 보험 상담이 아닙니다. 반드시 응답에 명시.
2. "지급됩니다", "받으실 수 있습니다", "X% 확률" 같은 단정 표현 절대 금지.
3. 대신 다음 표현 사용: "지급 가능성이 검토되는 사안으로 보입니다", "다음 조항이 검토 대상입니다", "변호사·보험사 상담을 통해 확정해야 합니다".
4. 구체적 청구액·승소율·예상 기간을 제시하지 마십시오.
5. 약관에 명시되지 않은 내용을 추론으로 보충하지 마십시오 — 약관에 없으면 "제공된 약관 내 명시 없음"이라고 표시.
6. 변호사법 §23 위반 표현(최고·1위·보장·확실·꼭) 금지.

[입력 처리]
- policy_text: 사용자가 붙여넣은 약관 본문 (또는 PDF에서 추출된 텍스트). 비어있으면 "약관 텍스트가 제공되지 않았습니다"로 답변.
- incident: 사고/질병 카테고리 + 자유 서술 + 추정 금액 + 발생 시점.

${SHARED_STREAM_INSTRUCTIONS}

[State JSON 스키마]
{
  "matter_type": "auto" | "long-term" | "fire" | "liability" | "life" | "medical" | "other",
  "possibility": "high" | "medium" | "low" | "unclear",   // unclear: 정보 부족
  "possibility_label": "지급 가능성 검토 — 높음/중간/낮음/판단 어려움 중 자연어",
  "coverage_clauses": [           // 약관에서 보장 항목 후보로 보이는 조항
    { "clause": "조항 인용 또는 요약", "relevance": "사고와의 연관 설명" }
  ],
  "exclusion_candidates": [       // 약관에서 면책으로 검토될 가능성이 있는 조항
    { "clause": "조항 인용 또는 요약", "concern": "왜 검토 대상인지" }
  ],
  "missing_info": ["사용자가 추가 확인이 필요한 자료"],
  "recommended_actions": ["다음 단계 권장 사항"]
}

[reply 본문]
- 한국어, 정중한 ‘~습니다/~입니다’ 체.
- 첫 문장: "본 결과는 일반 정보 안내이며 법률·보험 자문이 아닙니다."
- 분량: 4~6문장 정도로 간결하게.
- "지급됩니다" 같은 단정 표현 절대 금지.

[후속 대화 처리 — 멀티턴]
사용자가 추가 질문이나 보충 자료(텍스트/PDF)를 제공해 대화를 이어가는 경우:
- 직전 분석 결과를 기억하고, 새 정보를 반영해 검토를 *갱신*합니다.
- 첫 문장 디스클레이머("본 결과는 ... 자문이 아닙니다.")는 매 응답마다 반복합니다.
- 새 정보가 없는 단순 질문이면 기존 검토를 더 자세히 설명하되, state JSON은 변경되지 않은 필드를 그대로 유지합니다.
- 새 정보가 있으면 coverage_clauses / exclusion_candidates / possibility / missing_info 등을 갱신하고, 갱신 사유를 한 줄로 reply에 포함합니다 (예: "추가 자료를 반영하여 면책 후보 1건을 갱신했습니다").
- 어떤 경우든 위에 명시된 출력 형식(reply → STATE 마커 → state JSON)을 그대로 따릅니다.

${SYSTEM_FOOTER}`;

type CoverageState = {
  matter_type?: PracticeAreaCode | "other";
  possibility?: "high" | "medium" | "low" | "unclear";
  possibility_label?: string;
  coverage_clauses?: Array<{ clause: string; relevance: string }>;
  exclusion_candidates?: Array<{ clause: string; concern: string }>;
  missing_info?: string[];
  recommended_actions?: string[];
};

/**
 * Lightweight library matcher — keyword-only for safety. Avoids extra
 * round-trip to /api/ai/library-search and keeps the response self-contained.
 * The semantic search route is still available for power users via /library/search.
 */
function matchLibrary(matter: string, incidentText: string, limit = 5) {
  const text = incidentText.toLowerCase();
  const terms = text.split(/\s+/).filter((t) => t.length > 1);

  const scored = libraryItems
    .map((it) => {
      let score = 0;
      const haystack = (
        it.title +
        " " +
        it.excerpt +
        " " +
        (it.issue ?? "") +
        " " +
        (it.insight ?? "")
      ).toLowerCase();

      // Practice area boost
      if (matter !== "other") {
        if (it.practiceAreas.includes(matter as PracticeAreaCode)) {
          score += 3;
        }
      }
      for (const term of terms) {
        if (haystack.includes(term)) score += 1;
      }
      return { it, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ it }) => ({
      id: it.slug,
      type: it.type,
      title: it.title,
      excerpt: it.excerpt,
      practice_areas: it.practiceAreas.map((p) => practiceAreaLabels[p]),
      url:
        it.type === "case"
          ? `/library/cases/${it.slug}`
          : it.type === "column"
          ? `/library/columns/${it.slug}`
          : `/library/media#${it.slug}`,
    }));
}

async function parseRequest(req: Request): Promise<{
  ok: true;
  body: z.infer<typeof bodySchema>;
  policyText: string;
  extraFile?: File;
} | { ok: false; response: Response }> {
  const ct = req.headers.get("content-type") ?? "";

  // multipart path — PDF + JSON. Two PDF slots:
  //   - `policy`: the original policy PDF (re-sent on follow-up turns)
  //   - `extra`:  supplementary doc attached only in follow-up turns
  if (ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    const file = fd.get("policy");
    const extra = fd.get("extra");
    const bodyJson = fd.get("body");
    if (typeof bodyJson !== "string") {
      return {
        ok: false,
        response: NextResponse.json({ error: "body field missing" }, { status: 400 }),
      };
    }
    let parsed: z.infer<typeof bodySchema>;
    try {
      parsed = bodySchema.parse(JSON.parse(bodyJson));
    } catch (e) {
      const issues =
        e instanceof z.ZodError
          ? Object.fromEntries(e.issues.map((i) => [i.path.join("."), i.message]))
          : undefined;
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Invalid request", details: issues ?? String(e) },
          { status: 400 }
        ),
      };
    }

    let policyText = parsed.policy_text ?? "";
    if (file instanceof File) {
      if (file.size > 10 * 1024 * 1024) {
        return {
          ok: false,
          response: NextResponse.json(
            { error: "PDF가 10MB를 초과합니다." },
            { status: 413 }
          ),
        };
      }
      // Pass the PDF to Claude as a document block instead of parsing here —
      // matches the Policy Reader pattern and gives Claude page-aware context.
      // We mark the policyText as "[PDF attached: <name>]" so the prompt knows.
      policyText = `[PDF 첨부됨: ${file.name} · ${(file.size / 1024).toFixed(0)}KB]
PDF 본문은 이 메시지 다음의 document 블록을 참조하세요.`;
      // We'll stash the file on the parsed object via a side channel
      (parsed as { _pdfFile?: File })._pdfFile = file;
    }
    let extraFile: File | undefined;
    if (extra instanceof File) {
      if (extra.size > 10 * 1024 * 1024) {
        return {
          ok: false,
          response: NextResponse.json(
            { error: "추가 PDF가 10MB를 초과합니다." },
            { status: 413 }
          ),
        };
      }
      extraFile = extra;
    }
    return { ok: true, body: parsed, policyText, extraFile };
  }

  // JSON path — text-only
  let parsed: z.infer<typeof bodySchema>;
  try {
    parsed = bodySchema.parse(await req.json());
  } catch (e) {
    const issues =
      e instanceof z.ZodError
        ? Object.fromEntries(e.issues.map((i) => [i.path.join("."), i.message]))
        : undefined;
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid request", details: issues ?? String(e) },
        { status: 400 }
      ),
    };
  }
  return { ok: true, body: parsed, policyText: parsed.policy_text ?? "" };
}

export async function POST(req: Request) {
  // Heavy tier — PDF processing is expensive. Per IP since it's public.
  const limited = await checkRateLimit(req, "heavy");
  if (limited) return limited;

  const parsed = await parseRequest(req);
  if (!parsed.ok) return parsed.response;
  const { body, policyText, extraFile } = parsed;
  const pdfFile = (body as { _pdfFile?: File })._pdfFile;
  const history = body.history ?? [];
  const isFollowup = history.length > 0 && !!body.followup_message?.trim();

  // Stub fallback when no Anthropic key.
  if (!hasAnthropicConfig()) {
    return ndjsonStubResponse([
      {
        type: "token",
        text:
          "본 결과는 일반 정보 안내이며 법률·보험 자문이 아닙니다. 정확한 분석은 ANTHROPIC_API_KEY 설정 후 가능합니다. 대신, 도원 변호사 상담을 통해 약관과 사고 정황을 함께 검토하시기를 권합니다.",
      },
      {
        type: "state",
        matter_type: body.incident.category,
        possibility: "unclear",
        possibility_label: "판단 어려움 — API 키 미설정",
        coverage_clauses: [],
        exclusion_candidates: [],
        missing_info: ["ANTHROPIC_API_KEY 환경변수 설정"],
        recommended_actions: ["도원 1:1 상담 신청"],
        related_library: matchLibrary(body.incident.category, body.incident.description),
        legal_notice: SYSTEM_FOOTER,
        stub: true,
      },
    ]);
  }

  const anthropic = getAnthropic();
  const t0 = Date.now();

  // Compose the original user message (policy + incident). On follow-up
  // turns, this is replayed as messages[0] so Claude still has access to
  // the policy PDF/text for re-evaluation.
  type UserPart =
    | { type: "text"; text: string }
    | {
        type: "document";
        source: { type: "base64"; media_type: "application/pdf"; data: string };
      };

  const initialUserParts: UserPart[] = [];

  if (pdfFile) {
    const buf = Buffer.from(await pdfFile.arrayBuffer());
    initialUserParts.push({
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: buf.toString("base64"),
      },
    });
  }

  initialUserParts.push({
    type: "text",
    text:
      `[약관]\n${policyText || "(약관 텍스트 미제공 — 위 PDF 또는 일반 약관 지식 기반으로 답변)"}\n\n` +
      `[사고/질병 정보]\n` +
      `- 카테고리: ${body.incident.category}\n` +
      `- 발생 시점: ${body.incident.occurred_at ?? "미상"}\n` +
      `- 추정 청구액: ${body.incident.amount_estimate ?? "미상"}\n` +
      `- 설명: ${body.incident.description}`,
  });

  // Build the messages array. For follow-ups, replay the original turn,
  // then alternating history, then the new user message (with optional
  // additional PDF).
  const messages: Array<
    | { role: "user"; content: UserPart[] }
    | { role: "assistant"; content: string }
  > = [{ role: "user", content: initialUserParts }];

  if (isFollowup) {
    for (const turn of history) {
      if (turn.role === "assistant") {
        messages.push({ role: "assistant", content: turn.content });
      } else {
        messages.push({
          role: "user",
          content: [{ type: "text", text: turn.content }],
        });
      }
    }

    const followupParts: UserPart[] = [];
    if (extraFile) {
      const buf = Buffer.from(await extraFile.arrayBuffer());
      followupParts.push({
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: buf.toString("base64"),
        },
      });
      followupParts.push({
        type: "text",
        text: `[추가 자료 PDF 첨부됨: ${extraFile.name} · ${(extraFile.size / 1024).toFixed(0)}KB]`,
      });
    }
    followupParts.push({
      type: "text",
      text: `[사용자 추가 입력]\n${body.followup_message ?? ""}`,
    });
    messages.push({ role: "user", content: followupParts });
  }

  const aiStream = anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 2500,
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages,
  });

  const stream = ndjsonFromAnthropicStream<CoverageState>(aiStream, {
    enrich: (parsedState) => {
      const matter = parsedState?.matter_type ?? body.incident.category;
      const related = matchLibrary(matter, body.incident.description);
      return {
        matter_type: matter,
        possibility: parsedState?.possibility ?? "unclear",
        possibility_label: parsedState?.possibility_label ?? "판단 어려움",
        coverage_clauses: parsedState?.coverage_clauses ?? [],
        exclusion_candidates: parsedState?.exclusion_candidates ?? [],
        missing_info: parsedState?.missing_info ?? [],
        recommended_actions: parsedState?.recommended_actions ?? [],
        related_library: related,
        legal_notice: SYSTEM_FOOTER,
      };
    },
    onFinal: (parsedState) => {
      recordAudit({
        toolName: "coverage-check",
        input: {
          category: body.incident.category,
          policy_text_length: policyText.length,
          has_pdf: !!pdfFile,
          description_length: body.incident.description.length,
          is_followup: isFollowup,
          history_turns: history.length,
          has_extra_pdf: !!extraFile,
        },
        output: {
          possibility: parsedState?.possibility,
          coverage_count: parsedState?.coverage_clauses?.length ?? 0,
          exclusion_count: parsedState?.exclusion_candidates?.length ?? 0,
        },
        durationMs: Date.now() - t0,
      }).catch(() => undefined);
    },
  });

  return ndjsonResponse(stream);
}
