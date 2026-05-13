import { Button } from "@/components/ui";
import { Container } from "@/components/layout/container";

export function Hero() {
  const heroText = "Dowon Law";

  return (
    <section className="relative section-y overflow-hidden">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <p className="label-mono text-gold animate-fade-up">— 01 / DOWON LAW FIRM</p>

            <h1
              aria-label={heroText}
              className="mt-6 font-display italic text-display text-ink leading-tight"
            >
              {heroText.split("").map((ch, i) => (
                <span
                  key={i}
                  className="inline-block animate-letter-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </h1>

            <p
              className="mt-4 font-serif-ko text-h2 text-ink animate-fade-up"
              style={{ animationDelay: "700ms" }}
            >
              법무법인 도원
            </p>
          </div>

          <div className="lg:col-span-4">
            <p
              className="font-serif-ko text-h3 text-ink-soft leading-base animate-fade-up"
              style={{ animationDelay: "900ms" }}
            >
              조사 <span aria-hidden className="text-gold mx-1">→</span>
              소송 <span aria-hidden className="text-gold mx-1">→</span>
              구상 <span aria-hidden className="text-gold mx-1">→</span>
              추심,
              <br />
              한 팀으로 끝냅니다.
            </p>

            <div
              className="mt-10 flex flex-wrap gap-3 animate-fade-up"
              style={{ animationDelay: "1100ms" }}
            >
              <Button href="/contact/personal" variant="primary" size="lg">
                상담 신청
              </Button>
              <Button href="/about/capability" variant="secondary" size="lg">
                통합 모델 보기
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
