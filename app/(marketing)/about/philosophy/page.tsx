import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";

export const metadata = { title: "철학·인사말" };

const principles = [
  {
    no: "01",
    title: "사건은 종결까지 책임진다",
    body: "판결문은 출발선입니다. 도원은 판결 이후 구상·추심까지 동일 팀이 끌어갑니다. 의뢰인이 다른 사무소를 다시 찾아야 하는 단절은 만들지 않습니다.",
  },
  {
    no: "02",
    title: "결과는 단정하지 않는다",
    body: "승소를 약속하지 않습니다. 변호사법이 금지하기 때문이기도 하고, 결과를 단정하지 않는 것이 도원의 윤리 기준이기 때문이기도 합니다.",
  },
  {
    no: "03",
    title: "전문성은 자격으로 증명한다",
    body: "의사·세무사·회계사 등 이중 자격을 보유한 변호사를 배치합니다. 의료분쟁에서는 의학적 판단과 법률적 판단을 한 사람이 동시에 수행합니다.",
  },
  {
    no: "04",
    title: "정보는 의뢰인에게 돌아간다",
    body: "사건 진행 상황은 의뢰인이 묻기 전에 도원이 먼저 보고합니다. 회수 단계까지 단계별 리포트를 의무화합니다.",
  },
];

export default function PhilosophyPage() {
  return (
    <>
      <section className="section-y">
        <Container size="base">
          <Eyebrow index={1}>PHILOSOPHY · 철학</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            On Trust.
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-ink">법으로 신뢰를 짓는 일</p>

          <blockquote className="mt-12 border-l-2 border-gold pl-6 lg:pl-8 max-w-[32em]">
            <p className="font-serif-ko text-h3 text-ink leading-base">
              &ldquo;법률 서비스는 정보의 비대칭을 메우는 일입니다. 의뢰인이 모르는 것을
              먼저 알려드리고, 결과를 단정하지 않으며, 끝까지 책임지는 — 도원이 지키려는
              세 가지 원칙은 이것이 전부입니다.&rdquo;
            </p>
            <footer className="mt-6 font-mono text-[11px] uppercase tracking-label text-ink-mute">
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
            도원의 통합 모델을 자세히 보세요
          </h2>
          <p className="mt-5 mx-auto max-w-xl font-serif-ko text-body-lg text-ink-soft">
            철학은 구조로 증명됩니다. 도원이 어떻게 조사부터 추심까지 한 팀으로 잇는지
            다음 페이지에서 확인하세요.
          </p>
          <div className="mt-10">
            <Button href="/about/capability" variant="primary" size="lg">통합 모델 보기</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
