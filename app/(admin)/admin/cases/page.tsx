import { libraryItems } from "@/lib/data/library";

export const metadata = { title: "판례 관리 — 어드민" };

export default function CasesAdmin() {
  const cases = libraryItems.filter((it) => it.type === "case");

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-label text-gold">CASES</p>
      <h1 className="mt-3 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-tight">Cases</h1>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">판례 관리</p>

      <p className="mt-6 font-serif-ko text-body text-ink-soft max-w-[40em] leading-base">
        현재 시드 데이터 기준으로 표시됩니다. Supabase + CMS 연동 시점에서는 실시간 데이터로 전환됩니다.
        편집/삭제/발행 토글 UI는 Phase 3 Week 9-10에 완성됩니다.
      </p>

      <ul className="mt-10 divide-y divide-paper-3 border-y border-paper-3">
        {cases.map((c) => (
          <li key={c.slug} className="py-5 grid gap-4 md:grid-cols-[110px_1fr_120px] items-baseline">
            <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">{c.publishedAt}</p>
            <div>
              <p className="font-serif-ko text-h3 font-semibold text-ink">{c.title}</p>
              {c.caseNumber && (
                <p className="mt-1 font-mono text-[11px] text-ink-mute">{c.caseNumber}</p>
              )}
            </div>
            <p className="font-mono text-[11px] uppercase tracking-label text-forest">PUBLISHED</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
