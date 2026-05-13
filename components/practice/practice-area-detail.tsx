import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";
import { practiceAreas, insuranceSubAreas, type PracticeArea } from "@/lib/data/practice-areas";

export function PracticeAreaDetail({ area }: { area: PracticeArea }) {
  const subs = area.slug === "insurance"
    ? insuranceSubAreas.map((s) => practiceAreas[s])
    : [];

  return (
    <>
      {/* Hero */}
      <section className="section-y">
        <Container size="wide">
          {area.parent && (
            <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute mb-4">
              <Link
                href={`/practice/${area.parent}`}
                className="hover:text-ink"
              >
                ← {practiceAreas[area.parent].nameKo}
              </Link>
            </p>
          )}
          <Eyebrow index={1}>{area.eyebrow}</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            {area.displayEn}
          </h1>
          <p className="mt-3 font-serif-ko text-h1 text-ink font-semibold">{area.nameKo}</p>
          <p className="mt-8 max-w-[36em] font-serif-ko text-h3 text-ink-soft leading-base">
            {area.lead}
          </p>
        </Container>
      </section>

      {/* Sub-areas (only for insurance) */}
      {subs.length > 0 && (
        <section className="section-y bg-paper-2">
          <Container size="wide">
            <Eyebrow index={2}>SUB-AREAS</Eyebrow>
            <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">5개 하위 영역</h2>
            <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2 lg:grid-cols-5">
              {subs.map((s, i) => (
                <li key={s.slug} className="bg-paper">
                  <Link
                    href={`/practice/${s.slug}`}
                    className="block p-7 group h-full"
                  >
                    <span className="label-mono text-gold">0{i + 1}</span>
                    <h3 className="mt-5 font-serif-ko text-h3 font-semibold text-ink group-hover:text-gold-deep transition-colors">
                      {s.nameKo}
                    </h3>
                    <p className="mt-3 font-serif-ko text-[13.5px] text-ink-mute">
                      {s.eyebrow}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* What & Who */}
      <section className={`section-y ${subs.length === 0 ? "bg-paper-2" : ""}`}>
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-12">
            <header className="lg:col-span-4">
              <Eyebrow index={subs.length > 0 ? 3 : 2}>SCOPE</Eyebrow>
              <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
                무엇을 다루는가
              </h2>
            </header>
            <div className="lg:col-span-8">
              <ul className="space-y-4 max-w-[42em]">
                {area.what.map((w) => (
                  <li
                    key={w}
                    className="flex gap-3 font-serif-ko text-body-lg text-ink leading-base"
                  >
                    <span aria-hidden className="mt-2.5 h-px w-3 bg-gold shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-12 border-t border-paper-3 pt-8">
                <p className="label-mono">담당</p>
                <p className="mt-3 font-serif-ko text-h3 text-ink leading-base max-w-[36em]">
                  {area.who}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className={`section-y ${subs.length === 0 ? "" : "bg-paper-2"}`}>
        <Container size="wide">
          <Eyebrow index={subs.length > 0 ? 4 : 3}>PROCESS</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">도원의 진행 절차</h2>

          <ol className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2 lg:grid-cols-5">
            {area.process.map((p, i) => (
              <li key={p} className="bg-paper p-7">
                <span className="label-mono text-gold">STEP {String(i + 1).padStart(2, "0")}</span>
                <p className="mt-5 font-serif-ko text-body-lg text-ink leading-base">{p}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Cases */}
      {area.cases.length > 0 && (
        <section className="section-y">
          <Container size="wide">
            <Eyebrow index={subs.length > 0 ? 5 : 4}>CASES (비식별)</Eyebrow>
            <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">대표 사례</h2>
            <p className="mt-4 max-w-2xl font-serif-ko text-body-lg text-ink-soft">
              구체적인 결과는 사건마다 다릅니다. 아래는 도원이 다룬 사건의 일반적 패턴이며,
              관련 법령·약관·증거에 따라 다른 결론이 도출될 수 있습니다.
            </p>

            <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2">
              {area.cases.map((c, i) => (
                <li key={c.issue} className="bg-paper p-8 lg:p-10">
                  <span className="label-mono text-gold">CASE {String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-label text-ink-mute">쟁점</p>
                  <p className="mt-2 font-serif-ko text-h3 font-semibold text-ink leading-tight">
                    {c.issue}
                  </p>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-label text-ink-mute">결과</p>
                  <p className="mt-2 font-serif-ko text-body-lg text-ink leading-base">{c.result}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="section-y bg-paper-2">
        <Container size="base" className="text-center">
          <Eyebrow>GET STARTED</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            {area.nameKo} 관련 상담
          </h2>
          <p className="mt-5 mx-auto max-w-xl font-serif-ko text-body-lg text-ink-soft">
            상담 시점에 가능한 범위에서 가장 정확한 1차 안내를 드립니다.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href={area.cta.primary.href} variant="primary" size="lg">
              {area.cta.primary.label}
            </Button>
            {area.cta.secondary && (
              <Button href={area.cta.secondary.href} variant="secondary" size="lg">
                {area.cta.secondary.label}
              </Button>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
