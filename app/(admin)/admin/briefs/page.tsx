import Link from "next/link";
import { BRIEF_SKILLS } from "@/lib/legal-briefs/skills";

export const metadata = { title: "서면 작성 — 어드민" };

export default function BriefsCatalog() {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-label text-gold">SKILLS</p>
      <h1 className="mt-3 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-tight">
        Korean Legal Brief Skills
      </h1>
      <p className="mt-3 max-w-prose font-serif-ko text-body-lg text-ink-soft">
        서면 유형별 Claude Skill을 사무소 자산으로 관리합니다. 각 스킬은
        법적 요건 체크리스트·표준 양식·자동 계산·HWP 호환 docx 출력을
        포함하며, 변호사가 직접 확장·개선할 수 있도록 데이터 구조로
        정의되어 있습니다.
      </p>

      <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2">
        {BRIEF_SKILLS.map((s) => (
          <li key={s.slug} className="bg-paper p-7 lg:p-8 flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>
                {s.icon}
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-label text-ink-mute">
                  {s.category} · {s.englishName}
                </p>
                <h2 className="font-serif-ko text-h3 text-ink font-semibold">
                  {s.name}
                </h2>
              </div>
            </div>

            <p className="mt-4 font-serif-ko text-[14.5px] text-ink-soft leading-base">
              {s.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {s.checklist.slice(0, 3).map((c) => (
                <span
                  key={c.label}
                  className="inline-flex items-center px-2 py-0.5 rounded-pill bg-paper-2 font-mono text-[10px] uppercase tracking-label text-ink-soft"
                >
                  {c.label.length > 24 ? c.label.slice(0, 24) + "…" : c.label}
                </span>
              ))}
              {s.checklist.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-label text-ink-mute">
                  +{s.checklist.length - 3}
                </span>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4 mt-auto pt-5 border-t border-paper-3">
              <Link
                href={`/admin/briefs/${s.slug}`}
                className="inline-flex items-center px-4 py-2 rounded-sm border border-ink bg-ink text-paper font-sans-ko text-[13px] font-medium hover:bg-night"
              >
                작성하기 →
              </Link>
              <Link
                href={`/admin/briefs/${s.slug}?tab=example`}
                className="font-serif-ko text-[13.5px] text-ink-soft underline underline-offset-2 hover:text-ink"
              >
                예시 보기
              </Link>
            </div>

            <p className="mt-5 font-mono text-[10px] uppercase tracking-label text-ink-mute">
              skill: <span className="text-ink">{s.slug}</span>
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-14 border-t border-paper-3 pt-8 max-w-prose">
        <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
          ABOUT — 스킬 구조
        </p>
        <h3 className="mt-3 font-serif-ko text-h3 text-ink font-semibold">
          tkleen의 app-doc-ppt 스킬과 동일한 자산 접근
        </h3>
        <p className="mt-2 font-serif-ko text-[14.5px] text-ink-soft leading-base">
          각 스킬은 단순 프롬프트가 아니라 <strong>입력 스키마 + 체크리스트
          + 출력 섹션 구조 + 예시 + 톤 가이드</strong>를 포함한 재사용 자산입니다.
          변호사가 lib/legal-briefs/skills.ts 파일을 수정해 새 서면 유형을
          추가하거나 기존 스킬을 개선할 수 있고, UI·docx 출력은 자동으로
          반영됩니다. Claude의 docx 스킬과 결합되어 최종 산출물은 한국 법원
          관례에 맞춘 .docx (함초롬바탕·A4·줄간격 200%)로 저장됩니다.
        </p>
      </div>
    </div>
  );
}
