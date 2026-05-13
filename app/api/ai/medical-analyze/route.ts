import { NextResponse } from "next/server";
import { getCurrentAdminEmail } from "@/lib/admin/auth";
import { getAnthropic, hasAnthropicConfig, CLAUDE_MODEL, SYSTEM_FOOTER } from "@/lib/ai/anthropic";
import { withAudit } from "@/lib/ai/audit";
import { extractJson, textOf } from "@/lib/ai/json";
import { checkRateLimit } from "@/lib/ai/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * AI #4 — Medical records pre-analysis. Internal only.
 *
 * PRD §6.2 / AI #4 strictly requires:
 *   - Admin-only access (handled here by getCurrentAdminEmail).
 *   - Per-patient hash, never raw PII in audit logs.
 *   - Optional on-prem opt-out via DOWON_DISABLE_EXTERNAL_AI=true.
 *
 * NOTE: When DOWON_DISABLE_EXTERNAL_AI=true is set, this route refuses to call
 *       external APIs. A closed-network model is expected to be plumbed in via
 *       an internal MEDICAL_AI_URL — that integration is out of scope for the
 *       scaffolding; the gate is in place so production cannot accidentally
 *       leak records through the cloud path.
 */

const SYSTEM_PROMPT = `당신은 의료 기록 사전 분석 도구입니다. 의무기록·검사결과 등에서 시간순 이벤트, 잠재적 쟁점, 가이드라인 매핑 후보를 추출합니다.

[가드레일]
- 모든 분석은 *초안*이며 의료 자격자(변호사·의사)의 검수가 필수입니다.
- 진단·과실 여부를 단정하지 마십시오 — "검토가 필요한 정황" 정도.
- 환자 식별 정보는 응답에 포함하지 마십시오.

[출력 — JSON]
{
  "timeline": [{ "date": "YYYY-MM-DD", "event": "...", "source": { "file": "...", "page": 0 } }],
  "potential_issues": [{ "issue": "...", "severity": "low|medium|high", "relevant_guidelines": ["..."], "requires_expert_review": true|false }],
  "diagnostic_summary": "임상 흐름 요약 (식별정보 없이)",
  "missing_records": ["추가 확보 필요 자료"]
}

${SYSTEM_FOOTER}`;

export async function POST(req: Request) {
  const email = getCurrentAdminEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized — admin only." }, { status: 401 });
  }

  const limited = await checkRateLimit(req, "heavy", email);
  if (limited) return limited;

  if (process.env.DOWON_DISABLE_EXTERNAL_AI === "true") {
    return NextResponse.json(
      {
        error:
          "External AI disabled by org policy. Route closed-network medical model.",
      },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const caseId = String(formData.get("case_id") ?? "");
  const patientIdHash = String(formData.get("patient_id_hash") ?? "");
  if (!caseId || !patientIdHash) {
    return NextResponse.json(
      { error: "case_id and patient_id_hash are required." },
      { status: 400 }
    );
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "At least one PDF file is required." }, { status: 400 });
  }
  for (const f of files) {
    if (f.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: `File too large: ${f.name}` }, { status: 413 });
    }
    if (f.type !== "application/pdf") {
      return NextResponse.json({ error: `Non-PDF rejected: ${f.name}` }, { status: 415 });
    }
  }

  if (!hasAnthropicConfig()) {
    return NextResponse.json({
      stub: true,
      timeline: [],
      potential_issues: [],
      diagnostic_summary: "ANTHROPIC_API_KEY 미설정. 키 설정 후 분석이 동작합니다.",
      missing_records: [],
      legal_notice: SYSTEM_FOOTER,
    });
  }

  const anthropic = getAnthropic();
  const fileParts = await Promise.all(
    files.map(async (f) => ({
      type: "document" as const,
      source: {
        type: "base64" as const,
        media_type: "application/pdf" as const,
        data: Buffer.from(await f.arrayBuffer()).toString("base64"),
      },
    }))
  );

  const out = await withAudit(
    "medical-analyze",
    { case_id: caseId, patient_id_hash: patientIdHash, file_count: files.length },
    async () => {
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 3000,
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        messages: [
          {
            role: "user",
            content: [
              ...fileParts,
              {
                type: "text",
                text:
                  "위 의무기록을 분석해 JSON으로만 응답하세요. 환자 식별정보 포함 금지.",
              },
            ],
          },
        ],
      });
      const text = textOf(response.content);
      const parsed = extractJson<Record<string, unknown>>(text);
      const tokensUsed =
        (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0);
      return { output: parsed, tokensUsed };
    }
  );

  return NextResponse.json({ ...out, legal_notice: SYSTEM_FOOTER });
}
