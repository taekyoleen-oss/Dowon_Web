import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import { notifyConsultation } from "@/lib/notifications";
import { summarizeForLawyer, type IntakeState } from "@/lib/ai/intake-slots";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().min(1, "성함을 입력해 주세요."),
  phone: z.string().min(1, "연락처를 입력해 주세요."),
  email: z.string().email("올바른 이메일 형식이 아닙니다.").or(z.literal("")).optional(),
  preferredMethod: z.enum(["전화", "방문", "온라인"]).default("전화"),
  agreement: z.literal(true, { message: "개인정보 수집·이용 동의가 필요합니다." }),
});

const bodySchema = z.object({
  sessionId: z.string().min(1),
  state: z.unknown(),                  // server validates structurally below
  edits: z.string().optional(),        // user's optional last-mile edit to the narrative
  contact: contactSchema,
});

export async function POST(req: Request) {
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch (e) {
    const issues =
      e instanceof z.ZodError
        ? Object.fromEntries(e.issues.map((i) => [i.path.join("."), i.message]))
        : undefined;
    return NextResponse.json(
      {
        ok: false,
        message: "입력값을 확인해 주세요.",
        errors: issues,
      },
      { status: 400 }
    );
  }

  const state = body.state as IntakeState;
  if (!state || typeof state !== "object") {
    return NextResponse.json(
      { ok: false, message: "상태가 비었습니다. 다시 시도해 주세요." },
      { status: 400 }
    );
  }

  // If user added a last-mile edit, append to narrative.
  const finalState: IntakeState = body.edits
    ? { ...state, narrative: [state.narrative, body.edits].filter(Boolean).join("\n\n[사용자 추가]\n") }
    : state;

  const summary = summarizeForLawyer(finalState);

  try {
    let consultationId: string | null = null;
    if (hasSupabaseConfig()) {
      const supabase = getServerSupabase();

      const contactInfo = {
        applicantName: body.contact.name,
        phone: body.contact.phone,
        email: body.contact.email ?? "",
        preferredMethod: body.contact.preferredMethod,
        intakeSessionId: body.sessionId,
      };

      const matterLabel = summary.sections.find((s) => s.label === "사건 유형")?.value ?? "기타";

      // 1) Insert consultation_request
      const { data: cr, error: crErr } = await supabase
        .from("consultation_requests")
        .insert({
          persona: "personal",
          contact_info: contactInfo,
          case_summary:
            `[AI 인테이크 요약]\n사건 유형: ${matterLabel}\n\n` +
            summary.sections
              .filter((s) => s.label !== "사건 유형")
              .map((s) => `[${s.label}]\n${s.value}`)
              .join("\n\n"),
          ai_triage_id: null,
          intake_session_id: body.sessionId,
          status: "new",
        })
        .select("id")
        .single();
      if (crErr) throw crErr;
      consultationId = (cr as { id: string }).id;

      // 2) Update ai_conversations: link consultation, store confirmed summary
      const { error: convErr } = await supabase
        .from("ai_conversations")
        .update({
          confirmed_summary: { title: summary.title, sections: summary.sections, state: finalState },
          confirmed_at: new Date().toISOString(),
          converted: true,
          consultation_request_id: consultationId,
        })
        .eq("session_id", body.sessionId);
      if (convErr) console.warn("[intake/confirm] conv update warn:", convErr);
    } else {
      console.log("[intake/confirm:noop]", { summary, contact: body.contact });
    }

    // 3) Notify dowon
    await notifyConsultation({
      title: `🔔 신규 AI 인테이크 — ${body.contact.name} (${summary.sections[0]?.value ?? "기타"})`,
      fields: [
        { name: "성함",      value: body.contact.name },
        { name: "연락처",     value: body.contact.phone },
        { name: "이메일",     value: body.contact.email ?? "—" },
        { name: "희망 방식",  value: body.contact.preferredMethod },
        { name: "세션 ID",   value: body.sessionId },
        ...summary.sections.map((s) => ({ name: s.label, value: s.value })),
      ],
    });

    return NextResponse.json({
      ok: true,
      consultationId,
      message:
        "사건 정보가 도원 변호사에게 전달되었습니다. 영업일 기준 1~2일 내에 담당자가 연락드립니다.",
      summary,
    });
  } catch (e) {
    console.error("[intake/confirm] error:", e);
    return NextResponse.json(
      {
        ok: false,
        message:
          "전송 중 오류가 발생했습니다. 잠시 후 다시 시도하시거나 02-3481-6540으로 연락 주세요.",
      },
      { status: 500 }
    );
  }
}
