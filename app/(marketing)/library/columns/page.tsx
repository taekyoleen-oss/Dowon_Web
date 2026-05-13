import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { LibraryExplorer } from "@/components/library/library-explorer";

export const metadata = { title: "칼럼" };

export default function ColumnsPage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>COLUMNS · 칼럼</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Columns
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">칼럼</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          도원 변호사가 직접 쓰는 약관 해석·실무 노트·판결 분석.
        </p>

        <div className="mt-14">
          <LibraryExplorer initialType="column" />
        </div>
      </Container>
    </section>
  );
}
