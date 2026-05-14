import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Eyebrow, Button, Tag } from "@/components/ui";
import { libraryItems, getLibraryItemBySlug } from "@/lib/data/library";
import { getLawyerBySlug, practiceAreaLabels } from "@/lib/data/lawyers";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema } from "@/lib/seo/schemas";

export function generateStaticParams() {
  return libraryItems.filter((it) => it.type === "column").map((it) => ({ slug: it.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = getLibraryItemBySlug(params.slug);
  if (!item) return { title: "칼럼" };
  return { title: item.title, description: item.excerpt };
}

export default function ColumnDetailPage({ params }: { params: { slug: string } }) {
  const item = getLibraryItemBySlug(params.slug);
  if (!item || item.type !== "column") notFound();

  const author = item.authorSlug ? getLawyerBySlug(item.authorSlug) : null;

  return (
    <article className="section-y">
      <JsonLd
        data={articleSchema({
          headline: item.title,
          description: item.excerpt,
          url: `/library/columns/${item.slug}`,
          datePublished: item.publishedAt,
          authorName: author?.nameKo,
        })}
      />
      <Container size="narrow">
        <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute mb-6">
          <Link href="/library/columns" className="hover:text-ink">← 칼럼 목록</Link>
        </p>

        <div className="flex items-center justify-between">
          <Eyebrow>COLUMN · 칼럼</Eyebrow>
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

        {author && (
          <p className="mt-5 font-serif-ko text-body-lg text-ink-soft">
            <Link href={`/people/lawyers/${author.slug}`} className="hover:text-gold-deep">
              {author.nameKo} {author.role}
            </Link>
          </p>
        )}

        <ul className="mt-7 flex flex-wrap gap-2">
          {item.practiceAreas.map((pa) => (
            <li key={pa}>
              <Tag variant="default">{practiceAreaLabels[pa]}</Tag>
            </li>
          ))}
        </ul>

        <div className="mt-12 space-y-6 font-serif-ko text-body-lg text-ink leading-loose">
          <p className="text-ink-soft">{item.excerpt}</p>
          <p className="text-ink-mute italic">
            칼럼 본문은 라이브러리 CMS와 연결되면 자동 노출됩니다. (Phase 3 CMS 연동 시점)
          </p>
        </div>

        <div className="mt-16 bg-paper-2 border border-paper-3 rounded-md p-8 text-center">
          <p className="font-serif-ko text-h3 text-ink font-semibold">
            관련 사건으로 상담을 원하시나요?
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/contact/personal" variant="primary" size="md">상담 신청</Button>
            {author && (
              <Button href={`/people/lawyers/${author.slug}`} variant="secondary" size="md">
                {author.nameKo} 변호사 프로필
              </Button>
            )}
          </div>
        </div>
      </Container>
    </article>
  );
}
