import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { CoverageCheckForm } from "@/components/tools/coverage-check-form";

export const metadata = {
  title: "보험금 가능성 셀프체크 (AI)",
  description:
    "약관과 사고/질병 정보를 입력하면 AI가 약관 매칭 + 보장·면책 검토 + 관련 판례를 안내합니다. 본 도구는 법률·보험 자문이 아닙니다.",
};

export default function CoverageCheckPage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>AI · COVERAGE CHECK</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Coverage Check
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">
          보험금 가능성 셀프체크
        </p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          약관 + 사고 정보를 입력하면 AI가 약관과 사고를 매칭해 보장 가능성·면책 검토
          대상·관련 판례를 안내합니다.{" "}
          <strong className="text-ink">
            본 도구는 법률 자문이나 보험 상담이 아니며, 결과는 검토용 참고 정보입니다.
          </strong>{" "}
          정확한 판단은 변호사·보험사 상담을 통해 확정해야 합니다.
        </p>

        <div className="mt-12">
          <CoverageCheckForm />
        </div>
      </Container>
    </section>
  );
}
