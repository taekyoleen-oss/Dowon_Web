import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { DocumentTranslatorForm } from "@/components/tools/document-translator-form";

export const metadata = {
  title: "문서 정리 도우미 (쉬운 말 풀이)",
  description:
    "받으신 소장·답변서·결정문·합의서 PDF를 AI가 3줄 요약, 쉬운 말 풀이, 할 일, 일정으로 정리해 드립니다. 본 도구는 법률 자문이 아닙니다.",
};

export default function DocumentTranslatorPage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={2}>AI · DOCUMENT</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          What does this say?
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">법률 문서 쉬운 말 풀이</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          받으신 소장·답변서·결정문·합의서를 업로드하시면, AI가 3줄 요약, 법률 용어 풀이,
          해야 할 일, 일정을 정리해 드립니다. 변호사를 만나기 전에 자기 문서를 먼저 이해해
          오시면 첫 상담이 훨씬 효율적입니다.
          <br />
          <span className="text-ink-mute">본 도구는 법률 자문이 아닌 정보 정리용입니다.</span>
        </p>

        <div className="mt-12">
          <DocumentTranslatorForm />
        </div>
      </Container>
    </section>
  );
}
