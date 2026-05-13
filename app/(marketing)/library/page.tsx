import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { LibraryExplorer } from "@/components/library/library-explorer";

export const metadata = { title: "라이브러리" };

export default function LibraryPage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>LIBRARY · 라이브러리</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Library
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">판례·칼럼·강의</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          도원 변호사가 정리한 보험·의료·구상 판례, 약관 해석 칼럼, 외부 강의·자문 자료를 검색·필터로 탐색하세요.
        </p>

        <div className="mt-14">
          <LibraryExplorer />
        </div>
      </Container>
    </section>
  );
}
