import { libraryItems } from "@/lib/data/library";
import { getLawyerBySlug } from "@/lib/data/lawyers";

export const metadata = { title: "칼럼 관리 — 어드민" };

export default function ColumnsAdmin() {
  const columns = libraryItems.filter((it) => it.type === "column");

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-label text-gold">COLUMNS</p>
      <h1 className="mt-3 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-tight">Columns</h1>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">칼럼 관리</p>

      <ul className="mt-10 divide-y divide-paper-3 border-y border-paper-3">
        {columns.map((c) => {
          const author = c.authorSlug ? getLawyerBySlug(c.authorSlug) : null;
          return (
            <li
              key={c.slug}
              className="py-5 grid gap-4 md:grid-cols-[110px_1fr_140px] items-baseline"
            >
              <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
                {c.publishedAt}
              </p>
              <div>
                <p className="font-serif-ko text-h3 font-semibold text-ink">{c.title}</p>
                {author && (
                  <p className="mt-1 font-mono text-[11px] text-ink-mute">
                    {author.nameKo} {author.role}
                  </p>
                )}
              </div>
              <p className="font-mono text-[11px] uppercase tracking-label text-forest">PUBLISHED</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
