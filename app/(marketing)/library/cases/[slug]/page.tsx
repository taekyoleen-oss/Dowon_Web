import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Eyebrow, Button, Tag } from "@/components/ui";
import { libraryItems, getLibraryItemBySlug } from "@/lib/data/library";
import { getLawyerBySlug, practiceAreaLabels } from "@/lib/data/lawyers";

export function generateStaticParams() {
  return libraryItems.filter((it) => it.type === "case").map((it) => ({ slug: it.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = getLibraryItemBySlug(params.slug);
  if (!item) return { title: "판례" };
  return { title: item.title, description: item.excerpt };
}

export default function CaseDetailPage({ params }: { params: { slug: string } }) {
  const item = getLibraryItemBySlug(params.slug);
  if (!item || item.type !== "case") notFound();

  const lawyers = item.lawyerSlugs?.map((s) => getLawyerBySlug(s)).filter(Boolean) ?? [];

  return (
    <article className="section-y">
      <Container size="narrow">
        <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute mb-6">
          <Link href="/library/cases" className="hover:text-ink">← 판례 목록</Link>
        </p>

        <div className="flex items-center justify-between">
          <Eyebrow>CASE · 판례 {item.caseNumber && `· ${item.caseNumber}`}</Eyebrow>
          <time
            dateTime={item.publishedAt}
            className="font-mono text-[11px] uppercase tracking-label text-ink-mute"
          >
            {item.publishedAt.replace(/-/g, ".")}
          </time>
        </div>

        <h1 className="mt-4 font-serif-ko text-h1 text-ink font-semibold leading-tight">
          {item.title}
        </h1>

        <ul className="mt-7 flex flex-wrap gap-2">
          {item.practiceAreas.map((pa) => (
            <li key={pa}>
              <Tag variant="default">{practiceAreaLabels[pa]}</Tag>
            </li>
          ))}
        </ul>

        <div className="mt-12 space-y-10">
          {item.issue && (
            <section>
              <p className="label-mono text-gold">쟁점</p>
              <p className="mt-3 font-serif-ko text-body-lg text-ink leading-base">{item.issue}</p>
            </section>
          )}
          {item.conclusion && (
            <section>
              <p className="label-mono text-gold">결론</p>
              <p className="mt-3 font-serif-ko text-body-lg text-ink leading-base">{item.conclusion}</p>
            </section>
          )}
          {item.insight && (
            <section>
              <p className="label-mono text-gold">시사점</p>
              <p className="mt-3 font-serif-ko text-body-lg text-ink leading-base">{item.insight}</p>
            </section>
          )}
        </div>

        {lawyers.length > 0 && (
          <div className="mt-14 border-t border-paper-3 pt-8">
            <p className="label-mono">담당 변호사</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {lawyers.map((l) => (
                <li key={l!.slug}>
                  <Link
                    href={`/people/lawyers/${l!.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-paper-3 rounded-sm font-serif-ko text-body text-ink hover:border-ink hover:bg-paper-2 transition-colors"
                  >
                    {l!.nameKo} {l!.role}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-16 bg-paper-2 border border-paper-3 rounded-md p-8 text-center">
          <p className="font-serif-ko text-h3 text-ink font-semibold">
            유사한 사건에 대해 상담을 원하시나요?
          </p>
          <p className="mt-3 font-serif-ko text-body-lg text-ink-soft max-w-md mx-auto">
            본 판례는 일반 정보이며, 구체적 사건의 결과는 약관·증거에 따라 달라집니다.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/contact/personal" variant="primary" size="md">상담 신청</Button>
            <Button href="/contact/insurer" variant="secondary" size="md">보험사 자문 상담</Button>
          </div>
        </div>
      </Container>
    </article>
  );
}
