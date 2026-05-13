import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { LibraryExplorer } from "@/components/library/library-explorer";

export const metadata = { title: "강의·미디어" };

export default function MediaPage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>MEDIA · 강의·미디어</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Lectures & Media
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">강의·컨설팅</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          외부 강의·세미나·자문 웨비나 등 도원 변호사들의 활동 자료.
        </p>

        <div className="mt-14">
          <LibraryExplorer initialType="media" />
        </div>
      </Container>
    </section>
  );
}
