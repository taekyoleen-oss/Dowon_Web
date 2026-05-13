import { NextResponse } from "next/server";
import { getAnthropic, hasAnthropicConfig, CLAUDE_MODEL } from "@/lib/ai/anthropic";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import { withAudit } from "@/lib/ai/audit";
import { extractJson, textOf } from "@/lib/ai/json";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * AI #6 — Daily judgment harvest pipeline.
 *
 * Workflow (PRD §6.2 / AI #6):
 *   1. [02:00 KST daily] Fetch new cases from external source.
 *   2. Filter for insurance / medical / subrogation keywords.
 *   3. Claude summarises into 4-part structure (issue · conclusion · insight).
 *   4. Persist as `cases` row with ai_generated=true, is_published=false.
 *   5. Lawyers review via /admin/ai-queue; on approval -> published.
 *
 * NOTE: External source integration (대법원 종합법률정보 / 국가법령정보 API) is
 *       intentionally a stub here — those services require separate credentials
 *       and contract review. Wire up in production.
 */

const CRON_SECRET = process.env.CRON_SECRET ?? "";

const SAMPLE_CASES = [
  {
    case_number: "대법원 2026다XXXXX",
    raw_text:
      "[샘플] 자동차보험 무보험차상해 약관 면책조항의 효력에 관한 사안. 약관 교부·설명의무 위반 여부가 쟁점.",
    practice_areas: ["auto"],
  },
];

const SYSTEM_PROMPT = `당신은 법률 판례 요약 전문가입니다. 입력된 판결문 또는 판례 요지를 4-part 구조로 요약합니다.

[출력 — JSON]
{
  "title": "한 줄 제목 (사건의 핵심 쟁점)",
  "issue": "쟁점 (2~3문장)",
  "conclusion": "결론 (1~2문장)",
  "insight": "시사점 — 보험사·실무자 관점 (2~3문장)"
}

응답은 JSON 객체 1개. 한국어 ‘~다’ 체.`;

export async function POST(req: Request) {
  // Authenticate cron caller
  const auth = req.headers.get("authorization") ?? "";
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasAnthropicConfig() || !hasSupabaseConfig()) {
    return NextResponse.json({
      stub: true,
      message:
        "ANTHROPIC_API_KEY 또는 Supabase 미설정. 키 설정 후 실제 파이프라인이 동작합니다.",
      processed: 0,
    });
  }

  const anthropic = getAnthropic();
  const supabase = getServerSupabase();
  let processed = 0;

  for (const raw of SAMPLE_CASES) {
    try {
      const summary = await withAudit(
        "harvest-cases",
        { case_number: raw.case_number },
        async () => {
          const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 800,
            system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
            messages: [{ role: "user", content: raw.raw_text }],
          });
          const text = textOf(response.content as Array<{ type: string } & Record<string, unknown>>);
          const parsed = extractJson<{
            title: string;
            issue: string;
            conclusion: string;
            insight: string;
          }>(text);
          const tokensUsed =
            (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0);
          return { output: parsed, tokensUsed };
        }
      );

      const slug = `ai-${raw.case_number.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`;
      await supabase.from("cases").insert({
        slug,
        case_number: raw.case_number,
        title: summary.title,
        issue: summary.issue,
        conclusion: summary.conclusion,
        insight: summary.insight,
        practice_areas: raw.practice_areas,
        ai_generated: true,
        is_published: false,
      });
      processed++;
    } catch (e) {
      console.error("[harvest-cases]", e);
    }
  }

  return NextResponse.json({ processed });
}

// Allow GET for Vercel Cron triggers
export const GET = POST;
