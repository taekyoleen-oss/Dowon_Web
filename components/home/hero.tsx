import { Button } from "@/components/ui";
import { Container } from "@/components/layout/container";

const axes = ["송무", "의료", "SIU", "구상"];

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
                  {ch === " " ? " " : ch}
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
              송무 · 의료 · SIU · 구상,
              <br />
              <span className="text-ink font-semibold">한 팀에서 동시에.</span>
            </p>

            <div
              className="mt-6 flex flex-wrap gap-1.5 animate-fade-up"
              style={{ animationDelay: "1000ms" }}
            >
              {axes.map((axis) => (
                <span
                  key={axis}
                  className="inline-flex items-center px-2.5 py-1 border border-paper-3 rounded-pill font-mono text-[11px] uppercase tracking-label text-ink-soft"
                >
                  {axis}
                </span>
              ))}
            </div>

            <div
              className="mt-8 flex flex-wrap gap-3 animate-fade-up"
              style={{ animationDelay: "1100ms" }}
            >
              <Button href="/tools/intake" variant="primary" size="lg">
                AI와 상담 정리하기
              </Button>
              <Button href="/about/capability" variant="secondary" size="lg">
                핵심역량 보기
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
