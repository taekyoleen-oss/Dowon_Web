import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { LawyerDirectory } from "@/components/lawyer/lawyer-directory";

export const metadata = { title: "변호사" };

export default function LawyersPage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>LAWYERS · 변호사</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Our Lawyers
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">변호사</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          전문분야·직책·특수자격으로 필터링하거나, 이름으로 검색해 적합한 변호사를 찾으세요.
          각 변호사 프로필에는 대표 사건, 관련 칼럼·판례가 연결됩니다.
        </p>

        <div className="mt-14">
          <LawyerDirectory />
        </div>
      </Container>
    </section>
  );
}
