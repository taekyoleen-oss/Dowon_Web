import { lawyers, practiceAreaLabels } from "@/lib/data/lawyers";

export const metadata = { title: "변호사 관리 — 어드민" };

export default function LawyersAdmin() {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-label text-gold">LAWYERS</p>
      <h1 className="mt-3 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-tight">Lawyers</h1>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">변호사 13명</p>

      <ul className="mt-10 divide-y divide-paper-3 border-y border-paper-3">
        {lawyers.map((l) => (
          <li
            key={l.slug}
            className="py-5 grid gap-4 md:grid-cols-[200px_1fr_120px] items-baseline"
          >
            <div>
              <p className="font-serif-ko text-h3 font-semibold text-ink">{l.nameKo}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                {l.role}
              </p>
            </div>
            <p className="font-serif-ko text-[14px] text-ink-soft leading-base">
              {l.practiceAreas.map((pa) => practiceAreaLabels[pa]).join(" · ")}
              {l.specialQualifications?.length ? ` (${l.specialQualifications.join("·")})` : ""}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-label text-forest">
              ACTIVE
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
