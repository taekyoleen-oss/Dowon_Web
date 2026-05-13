import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { InsurerForm } from "@/components/contact/insurer-form";

export const metadata = { title: "보험사·손해사정사 상담" };

export default function InsurerContactPage() {
  return (
    <section className="section-y">
      <Container size="narrow">
        <Eyebrow index={1}>B2B · INSURER</Eyebrow>
        <h1 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
          보험사·손해사정사 상담
        </h1>
        <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">
          자문계약, SIU 협업, 개별 사건, 구상 위임 등의 의뢰를 받습니다. 영업일 기준
          1~2일 내에 담당자가 회신드립니다.
        </p>

        <div className="mt-12">
          <InsurerForm />
        </div>
      </Container>
    </section>
  );
}
