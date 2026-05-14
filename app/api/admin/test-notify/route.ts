import { NextResponse } from "next/server";
import { getCurrentAdminEmail } from "@/lib/admin/auth";
import { notifyConsultation } from "@/lib/notifications";

export const runtime = "nodejs";

/**
 * Admin-only "send test notification" endpoint.
 *
 * Triggers the same notifyConsultation() path used by real form submissions
 * but with sample data, so operators can verify the full email pipeline
 * (RESEND_API_KEY → NOTIFY_FROM → NOTIFY_EMAIL) without faking a submission.
 *
 * Slack and email both run; either falls back to a console.log no-op when
 * their key isn't set — that's a feature for partial setups.
 */
export async function POST() {
  const email = getCurrentAdminEmail();
  if (!email) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await notifyConsultation({
      title: `🧪 테스트 알림 — ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
      replyTo: email,
      fields: [
        { name: "발신자",       value: `어드민 (${email})` },
        { name: "유형",         value: "TEST — 실제 상담 신청이 아닙니다" },
        { name: "확인 항목",    value: "RESEND_API_KEY · NOTIFY_FROM · NOTIFY_EMAIL · reply-to 헤더" },
        { name: "수신 시각",    value: new Date().toISOString() },
      ],
    });
    return NextResponse.json({
      ok: true,
      message: "테스트 알림을 발송했습니다. 받은편지함을 확인하세요.",
    });
  } catch (e) {
    console.error("[admin/test-notify]", e);
    return NextResponse.json(
      {
        ok: false,
        message:
          e instanceof Error
            ? e.message
            : "알림 발송 중 알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
