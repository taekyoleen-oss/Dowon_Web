import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { EnterpriseForm } from "@/components/contact/enterprise-form";

export const metadata = { title: "기업 법률자문 상담" };

export default function EnterpriseContactPage() {
  return (
    <section className="section-y">
      <Container size="narrow">
        <Eyebrow index={1}>B2B · ENTERPRISE</Eyebrow>
        <h1 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
          기업 법률자문 상담
        </h1>
        <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">
          산업별 자문계약과 사고·분쟁·구상 사전 대응을 함께 설계합니다.
        </p>

        <div className="mt-12">
          <EnterpriseForm />
        </div>
      </Container>
    </section>
  );
}
