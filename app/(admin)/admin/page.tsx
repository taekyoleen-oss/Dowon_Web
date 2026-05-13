import Link from "next/link";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";

export const metadata = { title: "대시보드" };

async function getCounts() {
  if (!hasSupabaseConfig()) {
    return {
      newConsultations: 0,
      pendingAi: 0,
      publishedCases: 0,
      publishedColumns: 0,
      stub: true,
    };
  }
  const supabase = getServerSupabase();
  const [c, ai, cases, columns] = await Promise.all([
    supabase.from("consultation_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("cases").select("id", { count: "exact", head: true }).eq("is_published", false).eq("ai_generated", true),
    supabase.from("cases").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("columns").select("id", { count: "exact", head: true }).eq("is_published", true),
  ]);
  return {
    newConsultations: c.count ?? 0,
    pendingAi: ai.count ?? 0,
    publishedCases: cases.count ?? 0,
    publishedColumns: columns.count ?? 0,
    stub: false,
  };
}

export default async function AdminDashboard() {
  const counts = await getCounts();
  const cards = [
    { label: "신규 상담 신청", value: counts.newConsultations, href: "/admin/consultations" },
    { label: "AI 초안 검수 대기", value: counts.pendingAi, href: "/admin/ai-queue" },
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
    </div>
  );
}
