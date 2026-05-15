import Link from "next/link";
import { getCurrentAdminEmail } from "@/lib/admin/auth";

export const metadata = {
  title: "도원 어드민",
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/admin",                label: "대시보드" },
  { href: "/admin/consultations",  label: "상담 신청" },
  { href: "/admin/briefs",         label: "서면 작성" },
  { href: "/admin/cases",          label: "판례 관리" },
  { href: "/admin/columns",        label: "칼럼 관리" },
  { href: "/admin/lawyers",        label: "변호사 관리" },
  { href: "/admin/audit-logs",     label: "AI 감사 로그" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Auth gating runs in middleware.ts. When the user is on /admin/login
  // before signing in, we render the page without the shell.
  const email = getCurrentAdminEmail();
  if (!email) return <>{children}</>;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 bg-night text-paper p-7 hidden lg:flex flex-col">
        <Link href="/admin" className="font-display italic text-2xl">Dowon Admin</Link>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-label text-paper-3 truncate">
          {email}
        </p>

        <nav aria-label="어드민 메뉴" className="mt-10">
          <ul className="space-y-1.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="block px-3 py-2 rounded-sm font-serif-ko text-[14.5px] text-paper-3 hover:bg-night-2 hover:text-paper transition-colors"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <form action="/api/admin/logout" method="post" className="mt-auto">
          <button
            type="submit"
            className="font-mono text-[11px] uppercase tracking-label text-paper-3 hover:text-paper"
          >
            로그아웃
          </button>
        </form>
      </aside>

      <main className="flex-1 bg-paper">
        <div className="px-6 lg:px-12 py-10">{children}</div>
      </main>
    </div>
  );
}
