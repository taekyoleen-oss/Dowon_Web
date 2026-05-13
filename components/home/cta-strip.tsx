import { Button } from "@/components/ui";
import { Container } from "@/components/layout/container";

export function CtaStrip() {
  return (
    <section className="section-y bg-paper-2">
      <Container size="base">
        <div className="text-center">
          <p className="label-mono text-gold">— GET IN TOUCH</p>
          <h2 className="mt-4 font-display italic text-[clamp(36px,6vw,64px)] text-ink leading-tight">
            Let&apos;s talk.
          </h2>
          <p className="mt-4 font-serif-ko text-h2 text-ink">
            1차 상담은 무료입니다.
          </p>
          <p className="mt-5 max-w-xl mx-auto font-serif-ko text-body-lg text-ink-soft">
            전화 한 통, 이메일 한 줄로 시작하세요. 상담 시점에 변호사법상 가능한 범위에서
            가장 정확한 첫 안내를 드립니다.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/contact/personal" variant="primary" size="lg">
              상담 신청
            </Button>
            <Button href="/about/contact" variant="secondary" size="lg">
              연락처·오시는 길
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
