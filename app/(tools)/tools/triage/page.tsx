import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { TriageChat } from "@/components/tools/triage-chat";

export const metadata = {
  title: "사건 유형 진단 (AI)",
  description: "자연어로 상황을 설명하면 사건 유형·필요 자료·예상 절차를 안내합니다.",
};

export default function TriagePage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>AI · TRIAGE</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Case Triage
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">사건 유형 안내</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          상황을 자연어로 설명해 주세요. 사건 유형, 필요한 자료, 예상 절차, 적합한 변호사를
          안내합니다. 본 안내는 일반 정보이며 법률 자문이 아닙니다.
        </p>

        <div className="mt-12">
          <TriageChat />
        </div>
      </Container>
    </section>
  );
}
