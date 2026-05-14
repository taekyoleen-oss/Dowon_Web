import Link from "next/link";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import { TestNotifyButton } from "@/components/admin/test-notify-button";

export const metadata = { title: "대시보드" };

async function getCounts() {
  if (!hasSupabaseConfig()) {
    return {
      newConsultations: 0,
      publishedCases: 0,
      publishedColumns: 0,
      stub: true,
    };
  }
  const supabase = getServerSupabase();
  const [c, cases, columns] = await Promise.all([
    supabase.from("consultation_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("cases").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("columns").select("id", { count: "exact", head: true }).eq("is_published", true),
  ]);
  return {
    newConsultations: c.count ?? 0,
    publishedCases: cases.count ?? 0,
    publishedColumns: columns.count ?? 0,
    stub: false,
  };
}

export default async function AdminDashboard() {
  const counts = await getCounts();
  const cards = [
    { label: "신규 상담 신청", value: counts.newConsultations, href: "/admin/consultations" },
    { label: "발행된 판례",     value: counts.publishedCases, href: "/admin/cases" },
    { label: "발행된 칼럼",     value: counts.publishedColumns, href: "/admin/columns" },
  ];

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-label text-gold">DASHBOARD</p>
      <h1 className="mt-3 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-tight">
        Overview
      </h1>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">도원 어드민 대시보드</p>

      <ul className="mt-10 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.href} className="bg-paper p-6 lg:p-7">
            <p className="label-mono">{c.label}</p>
            <p className="mt-4 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-none">
              {c.value.toLocaleString("ko-KR")}
            </p>
            <Link
              href={c.href}
              className="mt-5 inline-flex items-center font-serif-ko text-[14px] text-ink font-semibold border-b border-ink pb-0.5 hover:text-gold-deep hover:border-gold-deep"
            >
              자세히 보기 →
            </Link>
          </li>
        ))}
      </ul>

      {counts.stub && (
        <p className="mt-8 font-mono text-[11px] uppercase tracking-label text-ink-mute">
          ⓘ Supabase 미설정 — 위 값은 0으로 표시됩니다. 환경 변수 설정 후 정상 동작합니다.
        </p>
      )}

      {/* Operations — verify the notification pipeline end-to-end */}
      <div className="mt-14 border-t border-paper-3 pt-8">
        <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
          OPERATIONS · 점검
        </p>
        <h2 className="mt-3 font-serif-ko text-h3 text-ink font-semibold">
          알림 파이프라인 테스트
        </h2>
        <p className="mt-2 max-w-prose font-serif-ko text-[14.5px] text-ink-soft leading-base">
          실제 상담 폼을 제출하지 않고도 Resend(이메일)·Slack 알림이 제대로 도달하는지 확인할 수 있습니다.
          현재 설정된 <code className="font-mono text-[12px]">NOTIFY_EMAIL</code> 로 테스트 메일이 발송됩니다.
        </p>
        <div className="mt-5">
          <TestNotifyButton />
        </div>
      </div>
    </div>
  );
}
