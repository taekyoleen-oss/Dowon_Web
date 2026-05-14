import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_TO_EMAIL;

  if (!apiKey || !from || !to) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing env vars",
        missing: {
          RESEND_API_KEY: !apiKey,
          RESEND_FROM_EMAIL: !from,
          RESEND_TO_EMAIL: !to,
        },
      },
      { status: 500 }
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "[테스트] 도원 법무법인 - Resend 연동 확인",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; max-width: 560px;">
          <h2 style="color: #0f172a; margin: 0 0 12px;">Resend 테스트 메일</h2>
          <p style="color: #334155; line-height: 1.6;">
            이 메일이 보이면 Resend 연동이 성공적으로 완료된 것입니다.
          </p>
          <p style="color: #64748b; font-size: 14px;">
            발송 시각: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}<br/>
            From: ${from}<br/>
            To: ${to}
          </p>
        </div>
      `,
    }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, status: res.status, error: body },
      { status: res.status }
    );
  }

  return NextResponse.json({ ok: true, data: body });
}
