import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { practiceAreas, topLevelAreas } from "@/lib/data/practice-areas";

export const metadata = { title: "업무분야" };

export default function PracticeIndex() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>PRACTICE AREAS</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Practice Areas
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">업무분야</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-h3 text-ink-soft leading-base">
          손해보험·생명보험에서 의료분쟁까지, 도원의 5대 영역. 각 영역은 부설기관·전담팀과 연결되어 있습니다.
        </p>

        <ul className="mt-16 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2">
          {topLevelAreas.map((slug, i) => {
            const a = practiceAreas[slug];
            return (
              <li key={slug} className="bg-paper">
                <Link href={`/practice/${a.slug}`} className="block p-8 lg:p-10 group h-full">
                  <span className="label-mono text-gold">0{i + 1}</span>
                  <h2 className="mt-5 font-serif-ko text-h2 font-semibold text-ink group-hover:text-gold-deep transition-colors">
                    {a.nameKo}
                  </h2>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                    {a.eyebrow}
                  </p>
                  <p className="mt-5 font-serif-ko text-body-lg text-ink-soft leading-base max-w-md">
                    {a.lead}
                  </p>
                  <span className="mt-8 inline-block font-mono text-[11px] uppercase tracking-label text-ink group-hover:text-gold-deep">
                    자세히 보기 →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
