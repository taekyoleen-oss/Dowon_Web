import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";

export const metadata = {
  title: "민간조사센터",
  description: "보험사기·위장사고 조사부터 소송 연계까지. 보험사 SIU 협업 가능.",
};

const scope = [
  {
    no: "01",
    title: "보험사기·위장사고",
    body: "자해·위장 의심 사고의 통신·결제·CCTV·진료 기록 교차 분석.",
  },
  {
    no: "02",
    title: "행방·재산 추적",
    body: "구상 사전 단계에서 가해자 행방, 재산, 은닉 채권 추적.",
  },
  {
    no: "03",
    title: "디지털 포렌식",
    body: "스마트폰·메신저·SNS 기록 보전 및 분석.",
  },
  {
    no: "04",
    title: "현장 조사",
    body: "사고 현장 재구성, 목격자 진술 확보, 사진·동영상 증거화.",
  },
];

const team = [
  { role: "전직 수사관", body: "강력·교통·금융 수사 경력자" },
  { role: "보험사 조사관 출신", body: "SIU·손해사정 실무 경험" },
  { role: "디지털 포렌식 전담", body: "공인 자격 보유 분석가" },
];

const process = [
  "보험사·의뢰인 1차 미팅 — 사건 개요 청취",
  "조사 계획 수립 (목적·범위·기간·예상 결과)",
  "현장 조사 + 자료 수집 + 디지털 포렌식",
  "조사 보고서 작성 (소송에 그대로 활용 가능한 수준)",
  "필요 시 도원 변호사단으로 소송·구상 단계 연계",
];

export default function InvestigationCenterPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-y bg-night text-paper">
        <Container size="wide">
          <Eyebrow tone="paper" index={1}>CENTER · 민간조사센터</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-paper leading-tight">
            Investigation Center
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-paper">민간조사센터</p>
          <p className="mt-10 max-w-[36em] font-serif-ko text-h3 text-paper-3 leading-base">
            도원 부설 민간조사센터는 전직 수사관·보험사 조사관·디지털 포렌식 인력이
            모인 별도 조직입니다. 사고 직후 ‘이상 정황’이 있는 사건에서, 외부 흥신소를
            거치지 않고 도원 한 팀이 조사·소송·구상까지 잇습니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/contact/insurer" variant="primary" size="lg">조사 협업 의뢰</Button>
            <Button href="/contact/personal" variant="on-dark" size="lg">개인 의뢰 문의</Button>
          </div>
        </Container>
      </section>

      {/* Scope */}
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={2}>SCOPE</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">조사 범위</h2>

          <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2">
            {scope.map((s) => (
              <li key={s.no} className="bg-paper p-8 lg:p-10">
                <span className="label-mono text-gold">{s.no}</span>
                <h3 className="mt-5 font-serif-ko text-h3 font-semibold text-ink">{s.title}</h3>
                <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">{s.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Team */}
      <section className="section-y bg-paper-2">
        <Container size="wide">
          <Eyebrow index={3}>TEAM</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">조사 인력</h2>

          <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-3">
            {team.map((t) => (
              <li key={t.role} className="bg-paper p-8 lg:p-10">
                <p className="label-mono text-gold">PROFILE</p>
                <h3 className="mt-5 font-serif-ko text-h3 font-semibold text-ink">{t.role}</h3>
                <p className="mt-4 font-serif-ko text-body text-ink-soft leading-base">{t.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Process */}
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={4}>PROCESS</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">조사 → 소송 연계 프로세스</h2>

          <ol className="mt-12 space-y-px bg-paper-3 border border-paper-3">
            {process.map((p, i) => (
              <li key={p} className="bg-paper p-7 lg:p-8 flex gap-6 items-baseline">
                <span className="label-mono text-gold shrink-0 w-16">
                  STEP {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-serif-ko text-body-lg text-ink leading-base">{p}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* SIU collaboration */}
      <section className="section-y bg-paper-2">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-12">
            <header className="lg:col-span-5">
              <Eyebrow index={5}>SIU COLLAB</Eyebrow>
              <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
                보험사 SIU 협업
              </h2>
            </header>
            <div className="lg:col-span-7 max-w-[42em]">
              <p className="font-serif-ko text-body-lg text-ink leading-base">
                보험사 자체 SIU 부서와 별개의 외부 조사 라인이 필요할 때, 도원
                민간조사센터가 협업합니다. 조사 보고서는 그대로 부당이득 반환·구상 청구
                소장의 증거 자료로 사용할 수 있도록 작성됩니다.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "SIU 의심 사건 외부 검증 — 객관성 확보",
                  "조사 결과 소송 직접 연계 — 별도 사무소 거치지 않음",
                  "분기별 회수율·소송 결과 리포트 제공 (자문 계약 한정)",
                ].map((p) => (
                  <li
                    key={p}
                    className="flex gap-3 font-serif-ko text-body text-ink-soft leading-base"
                  >
                    <span aria-hidden className="mt-2.5 h-px w-3 bg-gold shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button href="/contact/insurer" variant="primary" size="md">
                  보험사 자문 상담
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
