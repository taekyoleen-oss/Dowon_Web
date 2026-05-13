import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";

export const metadata = { title: "채권회수팀" };

const services = [
  { no: "01", title: "재산조회·은닉 추적", body: "공공·민간 자료원 활용, 명의·관계인 자산 추적." },
  { no: "02", title: "강제집행·압류", body: "부동산·예금·채권·동산 압류 절차 진행." },
  { no: "03", title: "추심·전부 명령", body: "법원 결정 후 실제 회수까지 절차 일관 수행." },
  { no: "04", title: "회수 리포트", body: "분기별 회수 진척 보고 (보험사 자문 한정)." },
];

export default function RecoveryPage() {
  return (
    <>
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={1}>RECOVERY · 채권회수팀</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            Recovery Team
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-ink">채권회수팀</p>
          <p className="mt-8 max-w-[36em] font-serif-ko text-h3 text-ink-soft leading-base">
            판결문이 곧 회수는 아닙니다. 도원 채권회수팀은 판결 이후의 실제 회수 절차 —
            재산조회, 압류, 추심 — 까지 동일 팀에서 끌어갑니다.
          </p>
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="wide">
          <Eyebrow index={2}>SERVICES</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">서비스 범위</h2>

          <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2">
            {services.map((s) => (
              <li key={s.no} className="bg-paper p-8 lg:p-10">
                <span className="label-mono text-gold">{s.no}</span>
                <h3 className="mt-5 font-serif-ko text-h3 font-semibold text-ink">{s.title}</h3>
                <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">{s.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section-y">
        <Container size="base" className="text-center">
          <Eyebrow>GET STARTED</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">기성 판결 보유 의뢰</h2>
          <p className="mt-5 mx-auto max-w-xl font-serif-ko text-body-lg text-ink-soft">
            도원에서 받지 않은 판결이라도, 회수 단계만 별도로 의뢰하실 수 있습니다.
          </p>
          <div className="mt-10">
            <Button href="/contact/personal" variant="primary" size="lg">회수 의뢰 문의</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
