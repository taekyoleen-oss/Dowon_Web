import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { IntakeChat } from "@/components/tools/intake-chat";

export const metadata = {
  title: "사건 정보 정리 (AI 인테이크)",
  description:
    "변호사 상담 전에 사건 정보를 AI와 함께 정리해 도원에 정확히 전달합니다. 본 도구는 법률 자문이 아닙니다.",
};

export default function IntakePage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>AI · INTAKE</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Tell us your story.
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">사건 정보 정리 도우미</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          편하게 말씀해 주세요. AI가 차례차례 질문을 드려 사건 정보를 정리하고, 마지막에
          요약을 보여드립니다. 사용자가 확인한 내용만 도원 변호사에게 전달됩니다.
          <br />
          <span className="text-ink-mute">본 도구는 법률 자문이 아닌 정보 정리용입니다.</span>
        </p>

        <div className="mt-12">
          <IntakeChat />
        </div>
      </Container>
    </section>
  );
}
