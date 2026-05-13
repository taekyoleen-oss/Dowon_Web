import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { SubrogationCheckForm } from "@/components/tools/subrogation-check-form";

export const metadata = {
  title: "구상 가능성 자가진단 (AI)",
  description: "사고·당사자·손해 정보를 입력하면 구상 가능성과 예상 회수율을 안내합니다.",
};

export default function SubrogationCheckPage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>AI · SUBROGATION CHECK</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Subrogation Check
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">구상 가능성 자가진단</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          보험사·손해사정 실무진을 위한 빠른 진단 도구. 사고 정보를 입력하면 구상 가능성과
          예상 회수율, 권장 액션을 안내합니다. 본 결과는 일반 정보이며 법률 자문이 아닙니다.
        </p>

        <div className="mt-12">
          <SubrogationCheckForm />
        </div>
      </Container>
    </section>
  );
}
