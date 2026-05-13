import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { LibrarySemanticSearch } from "@/components/library/library-semantic-search";

export const metadata = { title: "통합 검색" };

export default function SearchPage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>SEARCH · 통합 검색</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Ask the library.
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">자연어로 검색</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          판례·칼럼·강의 자료를 자연어 질문으로 탐색합니다. Phase 2에서 시맨틱 검색(AI #2)으로
          확장되며, 현재는 키워드 매칭 기반으로 동작합니다.
        </p>

        <div className="mt-14">
          <LibrarySemanticSearch />
        </div>
      </Container>
    </section>
  );
}
