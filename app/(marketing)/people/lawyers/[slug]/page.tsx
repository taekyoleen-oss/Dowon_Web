import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Eyebrow, Button, Tag } from "@/components/ui";
import { LawyerPhoto } from "@/components/lawyer/lawyer-photo";
import { LibraryCard } from "@/components/library/library-card";
import { JsonLd } from "@/components/seo/json-ld";
import { personSchema } from "@/lib/seo/schemas";
import {
  lawyers,
  getLawyerBySlug,
  practiceAreaLabels,
} from "@/lib/data/lawyers";
import { libraryItems } from "@/lib/data/library";

export function generateStaticParams() {
  return lawyers.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const l = getLawyerBySlug(params.slug);
  if (!l) return { title: "변호사" };
  return {
    title: `${l.nameKo} ${l.role}`,
    description: l.bioShort,
  };
}

export default function LawyerProfilePage({ params }: { params: { slug: string } }) {
  const lawyer = getLawyerBySlug(params.slug);
  if (!lawyer) notFound();

  const showSpecial =
    lawyer.specialQualifications && lawyer.specialQualifications.length > 0;

  // Auto-link library: columns where this lawyer is the author, cases where
  // they're listed in lawyerSlugs. Newest first, capped to keep the section
  // scannable. Falls back to "still empty" link when there's nothing yet.
  const relatedColumns = libraryItems
    .filter((it) => it.type === "column" && it.authorSlug === lawyer.slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 4);
  const relatedCases = libraryItems
    .filter((it) => it.type === "case" && it.lawyerSlugs?.includes(lawyer.slug))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 4);

  return (
    <>
      <JsonLd data={personSchema(lawyer)} />
      {/* Profile header */}
      <section className="section-y">
        <Container size="wide">
          <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute mb-6">
            <Link href="/people/lawyers" className="hover:text-ink">← 변호사 목록</Link>
          </p>

          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] bg-paper-2 border border-paper-3 rounded-md overflow-hidden relative">
                <LawyerPhoto
                  lawyer={lawyer}
                  priority
                  grayscaleOnHover={false}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                {showSpecial && (
                  <div className="absolute top-5 left-5 z-10">
                    <Tag variant="accent">{lawyer.specialQualifications!.join(" · ")}</Tag>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7">
              <Eyebrow>{lawyer.role}</Eyebrow>
              <h1 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
                {lawyer.nameKo} {lawyer.role}
              </h1>
              <p className="mt-2 font-display italic text-h2 text-ink-soft">
                {lawyer.nameEn}
              </p>

              <ul className="mt-7 flex flex-wrap gap-2">
                {lawyer.practiceAreas.map((pa) => (
                  <li key={pa}>
                    <Tag variant="default">{practiceAreaLabels[pa]}</Tag>
                  </li>
                ))}
              </ul>

              <p className="mt-8 font-serif-ko text-body-lg text-ink leading-base max-w-[36em]">
                {lawyer.bioShort}
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                {lawyer.email && (
                  <Button href={`mailto:${lawyer.email}`} variant="primary" size="md">
                    이메일 문의
                  </Button>
                )}
                <Button href="/contact/personal" variant="secondary" size="md">
                  예약 상담
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Education & Career */}
      <section className="section-y bg-paper-2">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow index={2}>EDUCATION</Eyebrow>
              <h2 className="mt-4 font-serif-ko text-h2 text-ink font-semibold">학력</h2>
              <ul className="mt-7 space-y-3">
                {lawyer.education.map((e) => (
                  <li key={e} className="flex gap-3 font-serif-ko text-body-lg text-ink-soft leading-base">
                    <span aria-hidden className="mt-2.5 h-px w-3 bg-gold shrink-0" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Eyebrow index={3}>CAREER</Eyebrow>
              <h2 className="mt-4 font-serif-ko text-h2 text-ink font-semibold">경력</h2>
              <ul className="mt-7 space-y-3">
                {lawyer.career.map((c) => (
                  <li key={c} className="flex gap-3 font-serif-ko text-body-lg text-ink-soft leading-base">
                    <span aria-hidden className="mt-2.5 h-px w-3 bg-gold shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Cases */}
      {lawyer.cases.length > 0 && (
        <section className="section-y">
          <Container size="wide">
            <Eyebrow index={4}>REPRESENTATIVE CASES (비식별)</Eyebrow>
            <h2 className="mt-4 font-serif-ko text-h2 text-ink font-semibold">대표 처리 사건</h2>

            <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2 lg:grid-cols-3">
              {lawyer.cases.map((c, i) => (
                <li key={c.issue} className="bg-paper p-7 lg:p-8">
                  <span className="label-mono text-gold">CASE {String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-label text-ink-mute">쟁점</p>
                  <p className="mt-2 font-serif-ko text-h3 font-semibold text-ink leading-tight">{c.issue}</p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-label text-ink-mute">결과</p>
                  <p className="mt-2 font-serif-ko text-body text-ink leading-base">{c.result}</p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-label text-ink-mute">시사점</p>
                  <p className="mt-2 font-serif-ko text-body text-ink-soft leading-base">{c.insight}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Related — auto-wired from library.ts (authorSlug / lawyerSlugs) */}
      {(relatedColumns.length > 0 || relatedCases.length > 0) && (
        <section className="section-y bg-paper-2">
          <Container size="wide">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <Eyebrow index={5}>RELATED COLUMNS</Eyebrow>
                <h2 className="mt-4 font-serif-ko text-h2 text-ink font-semibold">
                  {lawyer.nameKo} 변호사의 칼럼
                </h2>
                {relatedColumns.length > 0 ? (
                  <>
                    <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                      {relatedColumns.map((it) => (
                        <li key={it.slug}>
                          <LibraryCard item={it} compact />
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/library/columns"
                      className="mt-6 inline-flex items-center font-serif-ko text-[14px] text-ink font-semibold border-b border-ink pb-0.5 hover:text-gold-deep hover:border-gold-deep transition-colors"
                    >
                      모든 칼럼 보기 →
                    </Link>
                  </>
                ) : (
                  <p className="mt-5 font-serif-ko text-body text-ink-soft leading-base">
                    등록된 칼럼이 아직 없습니다.
                  </p>
                )}
              </div>
              <div>
                <Eyebrow index={6}>RELATED CASES</Eyebrow>
                <h2 className="mt-4 font-serif-ko text-h2 text-ink font-semibold">
                  관련 판례
                </h2>
                {relatedCases.length > 0 ? (
                  <>
                    <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                      {relatedCases.map((it) => (
                        <li key={it.slug}>
                          <LibraryCard item={it} compact />
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/library/cases"
                      className="mt-6 inline-flex items-center font-serif-ko text-[14px] text-ink font-semibold border-b border-ink pb-0.5 hover:text-gold-deep hover:border-gold-deep transition-colors"
                    >
                      모든 판례 보기 →
                    </Link>
                  </>
                ) : (
                  <p className="mt-5 font-serif-ko text-body text-ink-soft leading-base">
                    등록된 대표 판례가 아직 없습니다.
                  </p>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
