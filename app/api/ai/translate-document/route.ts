import { NextResponse } from "next/server";
import { getAnthropic, hasAnthropicConfig, CLAUDE_MODEL, SYSTEM_FOOTER } from "@/lib/ai/anthropic";
import { withAudit } from "@/lib/ai/audit";
import { extractJson, textOf } from "@/lib/ai/json";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { maskPII } from "@/lib/ai/pii-mask";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Plain Korean Legal Translator — public endpoint.
 *
 * Accepts a PDF uploaded by an anonymous visitor (소장·답변서·결정문·합의서 등),
 * extracts text via pdf-parse, masks PII server-side, and asks Claude to
 * produce a four-section plain-language summary. The PDF original is never
 * persisted; only the masked summary JSON lands in Supabase.
 */

const MAX_TEXT_LENGTH = 200_000; // ~50k tokens safety cap

const SYSTEM_PROMPT = `당신은 법률 문서를 일반인이 이해할 수 있게 정리하는 법무법인 도원의 문서 정리 도우미입니다.

[역할]
의뢰인이 업로드한 법률 문서(소장·답변서·결정문·합의서 등)를 다음 4개 섹션으로 정리합니다.

1. summary_3lines: 문서의 핵심을 3줄 (각 문장 60자 이내)
2. plain_terms: 등장한 법률 용어 → 일상 한국어 풀이. 용어:풀이 쌍, 최대 15개. 모르는 용어는 추측하지 말 것.
3. action_items: 의뢰인이 해야 할 일. 동사로 시작. 최대 10개.
4. calendar_events: 문서에 명시된 기한·일정. 추정 금지.

[가드레일 — 반드시 준수]
- 본 출력은 법률 자문이 아닙니다. 첫 줄에 명시할 필요 없이 결과 JSON 구조에 그대로 응답하세요. 법적 안내는 클라이언트가 별도 표시합니다.
- 결론적 판단 문구 금지: "이깁니다", "패소합니다", "유리합니다", "승소 확률"
- 변호사법 §23 광고 규제 표현 금지 ("최고/1위/보장/확실/꼭" 등)
- 마스킹된 자리(****, [사건번호], [전화번호] 등)는 그대로 두고 추측하지 말 것
- 시효·기간을 추정해서 calendar_events 에 추가하지 말 것. 문서에 명시된 날짜만.
- 응급(자살·폭력 위협) 신호 감지 시 정리 중단하고 119 / 1577-0199 안내를 doc_type 에 "응급" 으로 표기하고 plain_terms 첫 항목에 안내를 담으세요.

[출력 — JSON 만, 다른 텍스트 없이]
{
  "doc_type": "소장|답변서|결정문|합의서|판결문|기타",
  "summary_3lines": ["...", "...", "..."],
  "plain_terms": [{"term": "...", "plain": "..."}],
  "action_items": ["...", "..."],
  "calendar_events": [{"date": "YYYY-MM-DD", "label": "...", "importance": "high|medium|low"}]
}

${SYSTEM_FOOTER}`;

type TranslateResult = {
  doc_type: string;
  summary_3lines: string[];
  plain_terms: Array<{ term: string; plain: string }>;
  action_items: string[];
  calendar_events: Array<{ date: string; label: string; importance: "high" | "medium" | "low" }>;
};

export async function POST(req: Request) {
  try {
    return await handle(req);
  } catch (e) {
    // Top-level catch — without this, a Claude/JSON/parser failure leaks as
    // a bare 500 with no message, which is what the user sees in the UI.
    console.error("[translate-document] unhandled:", e);
    const detail =
      process.env.NODE_ENV === "production"
        ? undefined
        : e instanceof Error
          ? e.message
          : String(e);
    return NextResponse.json(
      {
        error: "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        detail,
      },
      { status: 500 }
    );
  }
}

async function handle(req: Request) {
  const limited = await checkRateLimit(req, "document");
  if (limited) return limited;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "PDF 파일을 첨부해 주세요." }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "파일이 너무 큽니다 (최대 10MB)." }, { status: 413 });
  }
  if (file.type && file.type !== "application/pdf") {
    return NextResponse.json({ error: "PDF 파일만 지원합니다." }, { status: 415 });
  }

  // Stub fallback when ANTHROPIC_API_KEY is not set — same wire format so the
  // client can render without branching.
  if (!hasAnthropicConfig()) {
    return NextResponse.json({
      stub: true,
      doc_type: "기타",
      summary_3lines: [
        "[STUB] ANTHROPIC_API_KEY 미설정 — 실제 분석은 키 설정 후 동작합니다.",
        "본 화면은 데모 출력입니다.",
        "변호사 상담 전 문서 이해용 도우미입니다.",
      ],
      plain_terms: [
        { term: "원고", plain: "소송을 제기한 사람" },
        { term: "피고", plain: "소송을 당한 사람" },
      ],
      action_items: ["변호사와 상담 일정을 잡으세요.", "문서 사본을 보관하세요."],
      calendar_events: [],
      truncated: false,
      pii_hits: [],
      legal_notice: SYSTEM_FOOTER,
    });
  }

  // Extract text via unpdf — purpose-built for serverless (no worker file
  // path resolution, no DOM polyfills required). Returns merged plain text.
  let rawText = "";
  try {
    const buf = await file.arrayBuffer();
    const { extractText } = await import("unpdf");
    // mergePages: true → returns { text: string } (joined across all pages).
    const { text } = await extractText(new Uint8Array(buf), { mergePages: true });
    rawText = text;
  } catch (e) {
    console.error("[translate-document] pdf extract error:", e);
    return NextResponse.json(
      {
        error: "PDF에서 텍스트를 추출할 수 없습니다. 스캔된 이미지 PDF이거나 손상된 파일일 수 있습니다.",
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

  if (!rawText.trim()) {
    return NextResponse.json(
      { error: "PDF에서 텍스트를 찾을 수 없습니다. 텍스트 PDF인지 확인해 주세요." },
      { status: 422 }
    );
  }

  const truncated = rawText.length > MAX_TEXT_LENGTH;
  const trimmed = truncated ? rawText.slice(0, MAX_TEXT_LENGTH) : rawText;
  const { masked, hits: piiHits } = maskPII(trimmed);

  const sessionId = "doc_" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);

  const out = await withAudit(
    "translate-document",
    {
      fileName: file.name,
      fileSize: file.size,
      textLength: trimmed.length,
      truncated,
      piiHits: piiHits.length,
    },
    async () => {
      const anthropic = getAnthropic();
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 4000,
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        messages: [
          {
            role: "user",
            content:
              `[문서 정보]\n파일명: ${file.name}\n${truncated ? "주의: 문서가 길어 처음 200,000자만 분석합니다.\n" : ""}\n[문서 본문 — 민감정보 마스킹 적용됨]\n${masked}\n\n위 문서를 분석하고 시스템 프롬프트에 명시된 JSON 형식으로만 응답하세요.`,
          },
        ],
      });

      const text = textOf(response.content);
      const parsed = extractJson<TranslateResult>(text);
      const tokensUsed =
        (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0);

      return { output: parsed, tokensUsed };
    }
  );

  // Persist masked result only — never the original PDF text.
  if (hasSupabaseConfig()) {
    try {
      const supabase = getServerSupabase();
      await supabase.from("document_translations").insert({
        session_id: sessionId,
        file_name: file.name,
        file_size: file.size,
        doc_type: out.doc_type,
        result: out,
        pii_hits: piiHits,
      });
    } catch (e) {
      console.warn("[translate-document] persist warning:", e);
    }
  }

  return NextResponse.json({
    ...out,
    sessionId,
    truncated,
    pii_hits: piiHits,
    legal_notice: SYSTEM_FOOTER,
  });
}
