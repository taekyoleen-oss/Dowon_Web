import { NextResponse } from "next/server";
import { getAnthropic, hasAnthropicConfig, SYSTEM_FOOTER } from "@/lib/ai/anthropic";
import { withAudit } from "@/lib/ai/audit";
import { extractJson, textOf } from "@/lib/ai/json";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * English Contract Preliminary Review — B2B endpoint.
 *
 * Accepts a long-form EN contract (PDF upload OR pasted text). Uses Claude
 * Opus's long-context window to read SPA/JV/License-class documents
 * end-to-end and returns:
 *   1. document_meta            — type, parties, governing law, jurisdiction
 *   2. obligations_summary      — each party's duties (EN + KO)
 *   3. risk_flags               — risky clauses with severity
 *   4. korean_law_review_points — Korean-law angles not visible from EN text
 *   5. must_be_reviewed_by_lawyer — items that must NOT be self-served
 *   6. summary_3lines_ko        — 3-line Korean executive summary
 */

const MAX_TEXT_LENGTH = 400_000; // ~100k tokens — well within Opus long-context

// Opus 4.7 — long-context, strongest legal reasoning. Falls back to env override.
const CONTRACT_MODEL = process.env.ANTHROPIC_CONTRACT_MODEL || "claude-opus-4-7";

const SYSTEM_PROMPT = `You are a senior contract-review assistant for 법무법인 도원 (Dowon Law Firm), a Korean law firm with strong B2B advisory practice. Your job is to perform a FIRST-PASS review of English-language commercial contracts so the corporate client can prepare an efficient briefing with a Korean lawyer.

[ROLE]
Given a single English contract (SPA, M&A, JV, License, NDA, MSA, Service Agreement, Employment, etc.), analyze the WHOLE document and return a structured JSON.

[OUTPUT — JSON ONLY, NO OTHER TEXT]
{
  "document_meta": {
    "doc_type": "SPA | M&A | JV | License | NDA | MSA | Service | Employment | Distribution | Loan | Settlement | Other",
    "parties": [{"role": "Buyer/Seller/Licensor/etc.", "en_name": "...", "ko_name": "..."}],
    "governing_law": "string + clause_ref like §16.1",
    "jurisdiction": "court or arbitral seat + rules + clause_ref",
    "effective_date": "YYYY-MM-DD or 'unspecified'",
    "term": "duration / renewal language",
    "language": "English | Bilingual KO-EN | Other"
  },
  "summary_3lines_ko": ["...", "...", "..."],
  "obligations_summary": [
    {"party": "...", "clause_ref": "§X.Y or 'page N'", "en": "≤200 chars", "ko": "≤120 chars"}
  ],
  "risk_flags": [
    {
      "severity": "critical | high | medium | low",
      "category": "governing_law | jurisdiction | liability_cap | indemnity | termination | ip | confidentiality | payment | change_of_control | warranty | data_privacy | non_compete | force_majeure | other",
      "clause_ref": "§X.Y or 'page N'",
      "issue_en": "≤220 chars — what the clause actually says",
      "issue_ko": "≤180 chars — 한국어 위험 요약",
      "why": "≤220 chars — 왜 한국 당사자에게 불리한지 (1-2문장)"
    }
  ],
  "korean_law_review_points": [
    {
      "topic": "공정거래법 | 약관규제법 | 개인정보보호법 | 외국환거래법 | 관세법 | 하도급법 | 상법 | 민법 | 중재법 | 노동법 | 기타",
      "ko": "검토 포인트 (≤180 chars)",
      "reason": "왜 한국법이 이를 다루는지 (≤180 chars)"
    }
  ],
  "must_be_reviewed_by_lawyer": [
    {"item": "≤140 chars", "reason": "≤180 chars"}
  ]
}

[GUARDRAILS — 반드시 준수]
- 본 출력은 사전 1차 정보 정리이며 법률 자문이 아닙니다. 단정·확언 금지 ("문제없다", "안전하다", "유리하다", "이긴다").
- 변호사법 §23 광고 규제 표현 금지 ("최고/1위/보장/확실").
- 조항 번호가 본문에서 확실치 않으면 추정하지 말고 "page N 인근" 또는 "Recitals"·"Schedule A" 등 위치만 표기.
- risk_flags의 severity는 보수적으로 산정. critical은 한국 당사자가 사실상 협상력 없이 수용 시 중대한 손해/주권 포기 효과가 있는 경우에만 사용 (예: 무한 책임, 일방적 즉시 해지권, 모든 IP 양도, 외국 법원 전속관할).
- risk_flags 최대 12개, obligations_summary 5~12개, korean_law_review_points 4~10개, must_be_reviewed_by_lawyer 3~8개.
- "korean_law_review_points"는 영문 텍스트만 보면 놓치기 쉬운 한국법 측면 (예: 외국환거래법 신고, 약관규제법 §6 무효 가능성, 공정거래법 §45 불공정거래 소지)에 집중.
- 의무·위험 분석에서 "we recommend"·"한국 당사자는 ~해야 한다" 같은 처방 금지. 사실 적시 + 검토 필요성 지적만.
- 본문이 영문이 아니거나 계약서로 보이지 않으면 doc_type="Other", summary_3lines_ko에 그 사실을 적고 다른 섹션은 빈 배열로 반환.

${SYSTEM_FOOTER}`;

type ObligationItem = {
  party: string;
  clause_ref: string;
  en: string;
  ko: string;
};
type RiskFlag = {
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  clause_ref: string;
  issue_en: string;
  issue_ko: string;
  why: string;
};
type KoreanLawPoint = { topic: string; ko: string; reason: string };
type LawyerItem = { item: string; reason: string };

export type ContractReviewResult = {
  document_meta: {
    doc_type: string;
    parties: Array<{ role: string; en_name: string; ko_name: string }>;
    governing_law: string;
    jurisdiction: string;
    effective_date: string;
    term: string;
    language: string;
  };
  summary_3lines_ko: string[];
  obligations_summary: ObligationItem[];
  risk_flags: RiskFlag[];
  korean_law_review_points: KoreanLawPoint[];
  must_be_reviewed_by_lawyer: LawyerItem[];
};

export async function POST(req: Request) {
  try {
    return await handle(req);
  } catch (e) {
    console.error("[contract-review] unhandled:", e);
    const detail =
      process.env.NODE_ENV === "production"
        ? undefined
        : e instanceof Error
          ? e.message
          : String(e);
    return NextResponse.json(
      {
        error: "계약서 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        detail,
      },
      { status: 500 }
    );
  }
}

async function handle(req: Request) {
  const limited = await checkRateLimit(req, "heavy");
  if (limited) return limited;

  const contentType = req.headers.get("content-type") || "";
  let rawText = "";
  let fileName = "pasted-text.txt";
  let fileSize = 0;

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const file = formData.get("file");
    const text = formData.get("text");

    if (file instanceof File) {
      if (file.size > 25 * 1024 * 1024) {
        return NextResponse.json(
          { error: "파일이 너무 큽니다 (최대 25MB)." },
          { status: 413 }
        );
      }
      if (file.type && file.type !== "application/pdf") {
        return NextResponse.json(
          { error: "PDF 파일만 지원합니다. 텍스트 본문은 직접 붙여넣기를 사용해 주세요." },
          { status: 415 }
        );
      }
      fileName = file.name;
      fileSize = file.size;
      try {
        const buf = await file.arrayBuffer();
        const { extractText } = await import("unpdf");
        const { text: extracted } = await extractText(new Uint8Array(buf), {
          mergePages: true,
        });
        rawText = extracted;
      } catch (e) {
        console.error("[contract-review] pdf extract error:", e);
        return NextResponse.json(
          {
            error:
              "PDF에서 텍스트를 추출할 수 없습니다. 스캔본 PDF이거나 손상된 파일일 수 있습니다. 텍스트를 직접 붙여넣어 주세요.",
            detail:
              process.env.NODE_ENV === "production"
                ? undefined
                : e instanceof Error
                  ? e.message
                  : String(e),
          },
          { status: 422 }
        );
      }
    } else if (typeof text === "string" && text.trim().length > 0) {
      rawText = text;
    } else {
      return NextResponse.json(
        { error: "PDF 파일 또는 계약서 텍스트를 입력해 주세요." },
        { status: 400 }
      );
    }
  } else {
    // JSON body — { text: string }
    let body: { text?: string } = {};
    try {
      body = (await req.json()) as { text?: string };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    if (!body.text || typeof body.text !== "string" || body.text.trim().length < 100) {
      return NextResponse.json(
        { error: "계약서 텍스트가 너무 짧습니다 (최소 100자)." },
        { status: 400 }
      );
    }
    rawText = body.text;
  }

  if (!rawText.trim()) {
    return NextResponse.json(
      { error: "분석할 텍스트가 없습니다." },
      { status: 422 }
    );
  }

  // STUB fallback when ANTHROPIC_API_KEY is missing — keeps client wire-format stable.
  if (!hasAnthropicConfig()) {
    return NextResponse.json({
      stub: true,
      document_meta: {
        doc_type: "Other",
        parties: [
          { role: "Party A", en_name: "Example, Inc.", ko_name: "[샘플] 갑" },
          { role: "Party B", en_name: "Korea Co., Ltd.", ko_name: "[샘플] 을" },
        ],
        governing_law: "[STUB] not analyzed — ANTHROPIC_API_KEY 미설정",
        jurisdiction: "[STUB] not analyzed",
        effective_date: "unspecified",
        term: "unspecified",
        language: "English",
      },
      summary_3lines_ko: [
        "[STUB] ANTHROPIC_API_KEY 미설정 상태입니다.",
        "실제 분석은 키 설정 후 동작합니다.",
        "본 화면은 데모용 출력입니다.",
      ],
      obligations_summary: [],
      risk_flags: [],
      korean_law_review_points: [],
      must_be_reviewed_by_lawyer: [],
      truncated: false,
      legal_notice: SYSTEM_FOOTER,
    });
  }

  const truncated = rawText.length > MAX_TEXT_LENGTH;
  const trimmed = truncated ? rawText.slice(0, MAX_TEXT_LENGTH) : rawText;
  const sessionId =
    "contract_" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);

  const out = await withAudit(
    "contract-review",
    {
      fileName,
      fileSize,
      textLength: trimmed.length,
      truncated,
      model: CONTRACT_MODEL,
    },
    async () => {
      const anthropic = getAnthropic();
      const response = await anthropic.messages.create({
        model: CONTRACT_MODEL,
        max_tokens: 8000,
        system: [
          { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
        ],
        messages: [
          {
            role: "user",
            content:
              `[CONTRACT METADATA]\nFile: ${fileName}\nLength: ${trimmed.length} chars${truncated ? " (truncated)" : ""}\n\n[CONTRACT BODY]\n${trimmed}\n\nReturn ONLY the JSON object specified in the system prompt.`,
          },
        ],
      });

      const text = textOf(response.content);
      const parsed = extractJson<ContractReviewResult>(text);
      const tokensUsed =
        (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0);
      return { output: parsed, tokensUsed };
    }
  );

  if (hasSupabaseConfig()) {
    try {
      const supabase = getServerSupabase();
      await supabase.from("contract_reviews").insert({
        session_id: sessionId,
        file_name: fileName,
        file_size: fileSize,
        doc_type: out.document_meta?.doc_type ?? null,
        result: out,
      });
    } catch (e) {
      // Table may not exist yet — log but don't fail the response.
      console.warn("[contract-review] persist warning (table may be missing):", e);
    }
  }

  return NextResponse.json({
    ...out,
    sessionId,
    truncated,
    legal_notice: SYSTEM_FOOTER,
  });
}
