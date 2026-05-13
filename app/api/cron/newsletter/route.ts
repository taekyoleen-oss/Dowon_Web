import { NextResponse } from "next/server";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * AI #8 — Weekly newsletter assembly.
 * Workflow (PRD §6.2 / AI #8):
 *   1. Gather new published cases from the last week.
 *   2. Compose weekly digest (HTML).
 *   3. Send via Resend to verified subscribers segmented by interest topic.
 *
 * This route prepares the digest payload; sending is left as a stub when
 * RESEND_API_KEY is missing.
 */

const CRON_SECRET = process.env.CRON_SECRET ?? "";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasSupabaseConfig()) {
    return NextResponse.json({ stub: true, message: "Supabase 미설정" });
  }

  const supabase = getServerSupabase();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: cases } = await supabase
    .from("cases")
    .select("slug, title, issue, conclusion, insight, practice_areas, published_at")
    .eq("is_published", true)
    .gte("published_at", weekAgo);

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("email, segment, topics")
    .eq("is_verified", true)
    .is("unsubscribed_at", null);

  // Compose simple digest body
  const html = renderDigest(cases ?? []);

  const apiKey = process.env.RESEND_API_KEY;
  let sent = 0;
  if (!apiKey || !subscribers || subscribers.length === 0) {
    return NextResponse.json({
      stub: !apiKey,
      subscribers: subscribers?.length ?? 0,
      cases: cases?.length ?? 0,
      sent,
    });
  }

  for (const sub of subscribers) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
        body: JSON.stringify({
          from: process.env.NOTIFY_FROM ?? "도원 뉴스레터 <noreply@dowonlaw.com>",
          to: sub.email,
          subject: "도원 주간 인사이트 — 새 판례·칼럼",
          html,
        }),
      });
      if (res.ok) sent++;
    } catch (e) {
      console.error("[newsletter]", e);
    }
  }

  return NextResponse.json({ sent, subscribers: subscribers.length, cases: cases?.length ?? 0 });
}

export const GET = POST;

function renderDigest(cases: Array<{ slug: string; title: string; issue: string | null }>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dowonlaw.com";
  const list = cases
    .map(
      (c) =>
        `<li style="margin: 0 0 16px">
          <a href="${baseUrl}/library/cases/${c.slug}" style="color:#1A1814; text-decoration:none; font-weight:600">${escapeHtml(
            c.title
          )}</a>
          <p style="margin:6px 0 0; color:#3D3830">${escapeHtml(c.issue ?? "")}</p>
        </li>`
    )
    .join("");
  return `<!doctype html><html><body style="font-family: 'Noto Serif KR', serif; background:#F5EFE4; padding:32px">
  <div style="max-width:600px; margin:0 auto; background:#fff; padding:32px">
    <p style="font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #B8924A">DOWON INSIGHTS</p>
    <h1 style="font-family: 'Cormorant Garamond', serif; font-style: italic; font-size:36px; margin: 16px 0 24px">Weekly digest</h1>
    <ul style="list-style: none; padding: 0; margin: 0">${list || "<li>이번 주 새 자료가 없습니다.</li>"}</ul>
    <hr style="border:none; border-top:1px solid #DFD6C2; margin:32px 0">
    <p style="font-size:12px; color: #6B6258">본 메일은 도원 뉴스레터 구독자에게 발송됩니다. 수신 거부는 아래 링크에서 가능합니다.</p>
  </div>
</body></html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
