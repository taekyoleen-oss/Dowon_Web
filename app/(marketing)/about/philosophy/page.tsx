import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";

export const metadata = { title: "인사말" };

const principles = [
  {
    no: "01",
    title: "조사·자문·소송·추심을 동시에",
    body:
      "사건 조사, 법률 자문, 민·형사 소송, 채권 추심을 같은 팀이 동시에 끌어갑니다. 손이 바뀌지 않으니 정보·시간·신뢰가 바닥에 떨어지지 않습니다.",
  },
  {
    no: "02",
    title: "결과는 단정하지 않는다",
    body:
      "승소를 약속하지 않습니다. 변호사법이 금지하기 때문이기도 하고, 결과를 단정하지 않는 것이 도원의 윤리 기준이기 때문이기도 합니다.",
  },
  {
    no: "03",
    title: "전문성은 자격으로 증명한다",
    body:
      "보험·의료·SIU·구상 4축마다 실무 경험과 자격을 갖춘 인력을 배치합니다. 의료분쟁에서는 의사 자격 변호사가 의학적·법률적 판단을 한 사람이 동시에 수행합니다.",
  },
  {
    no: "04",
    title: "축적된 경험으로 실질적 해결책을",
    body:
      "보험 분쟁·의료분쟁·민간조사·구상 등 분야별 누적 사건 경험을 바탕으로, 의뢰인의 실제 상황에 맞는 해결책을 제시합니다.",
  },
];

export default function PhilosophyPage() {
  return (
    <>
      <section className="section-y">
        <Container size="base">
          <Eyebrow index={1}>GREETINGS · 인사말</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            On Trust.
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-ink">고객의 신뢰를 지키기 위하여</p>

          <blockquote className="mt-12 border-l-2 border-gold pl-6 lg:pl-8 max-w-[34em]">
            <p className="font-serif-ko text-h3 text-ink leading-base">
              &ldquo;법무법인 도원은 보험·의료·민간조사·구상 분야의 변호사와 전문 인력이
              한 팀을 이루어, 사건 조사부터 소송·자문·채권 추심까지 동시에 진행되는
              종합 법률서비스 시스템을 구축해 왔습니다.&rdquo;
            </p>
            <p className="mt-5 font-serif-ko text-h3 text-ink leading-base">
              &ldquo;고객들이 신뢰하고 만족할 수 있는 법률서비스 제공을 위하여, 보험·의료·
              민간조사 분야의 변호사와 전문 인력들을 지속적으로 영입하고 있습니다.&rdquo;
            </p>
            <p className="mt-5 font-serif-ko text-h3 text-ink leading-base">
              &ldquo;고객의 신뢰를 지키기 위하여 최선을 다하겠습니다.&rdquo;
            </p>
            <footer className="mt-7 font-mono text-[11px] uppercase tracking-label text-ink-mute">
              — 대표변호사 홍명호
            </footer>
          </blockquote>
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="base">
          <Eyebrow index={2}>FOUR PRINCIPLES</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">네 가지 원칙</h2>

          <ol className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2">
            {principles.map((p) => (
              <li key={p.no} className="bg-paper p-8 lg:p-10">
                <span className="label-mono text-gold">{p.no}</span>
                <h3 className="mt-5 font-serif-ko text-h3 font-semibold text-ink">
                  {p.title}
                </h3>
                <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">
                  {p.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="section-y">
        <Container size="base" className="text-center">
          <Eyebrow index={3}>NEXT</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            도원의 핵심역량을 자세히 보세요
          </h2>
          <p className="mt-5 mx-auto max-w-xl font-serif-ko text-body-lg text-ink-soft">
            철학은 구조로 증명됩니다. 송무·의료·SIU·구상 4축이 어떻게 동시에 움직이는지
            다음 페이지에서 확인하세요.
          </p>
          <div className="mt-10">
            <Button href="/about/capability" variant="primary" size="lg">핵심역량 보기</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
