import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { MedicalForm } from "@/components/contact/medical-form";

export const metadata = { title: "의료분쟁 상담" };

export default function MedicalContactPage() {
  return (
    <section className="section-y">
      <Container size="narrow">
        <Eyebrow index={1}>MEDICAL DISPUTES</Eyebrow>
        <h1 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
          의료분쟁 상담
        </h1>
        <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">
          의사 자격 변호사가 의무기록 검토부터 직접 수행하는 의료분쟁 전용 상담 폼입니다.
          민감정보는 별도 격리 환경에서 처리됩니다.
        </p>

        <div className="mt-12">
          <MedicalForm />
        </div>
      </Container>
    </section>
  );
}
