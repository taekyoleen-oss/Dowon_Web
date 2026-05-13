import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { LibraryExplorer } from "@/components/library/library-explorer";

export const metadata = { title: "판례" };

export default function CasesPage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>CASES · 판례</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Case Briefs
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">판례</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          도원이 정리한 보험·의료·구상 분야의 판례. 쟁점·결론·시사점·담당 변호사로 구조화되어 있습니다.
        </p>

        <div className="mt-14">
          <LibraryExplorer initialType="case" />
        </div>
      </Container>
    </section>
  );
}
