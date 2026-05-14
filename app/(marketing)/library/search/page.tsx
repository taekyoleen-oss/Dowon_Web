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
          도원 라이브러리(칼럼·판례·강의)와 국가법령정보(법령 조문)을 자연어 질문 하나로
          함께 검색합니다. OpenAI 임베딩 + Claude rerank — “음주운전 면책”,
          “구상권 행사 시점” 같은 자연어로 물어보세요.
        </p>

        <div className="mt-14">
          <LibrarySemanticSearch />
        </div>
      </Container>
    </section>
  );
}
