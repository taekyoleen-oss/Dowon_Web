import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { PersonalForm } from "@/components/contact/personal-form";

export const metadata = { title: "개인 사건 상담" };

export default function PersonalContactPage() {
  return (
    <section className="section-y">
      <Container size="narrow">
        <Eyebrow index={1}>PERSONAL CASES</Eyebrow>
        <h1 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
          개인 사건 상담
        </h1>
        <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">
          1차 상담은 무료입니다. 가능한 범위에서 가장 정확한 첫 안내를 드립니다.
        </p>

        <div className="mt-12">
          <PersonalForm />
        </div>
      </Container>
    </section>
  );
}
