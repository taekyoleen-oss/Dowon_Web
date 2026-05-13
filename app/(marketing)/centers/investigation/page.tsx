import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";

export const metadata = {
  title: "민간조사센터",
  description:
    "수사기관 출신 조사·수사 전문가들로 구성된 도원 부설 민간조사센터. 내부자 비리·디지털포렌식·지재권·기업실사·소송지원 통합.",
};

/**
 * Aligned with the real dowonlaw.com center page (7 service areas).
 */
const scope = [
  {
    no: "01",
    title: "내부자 비리·중대범죄 조사",
    body: "기업 내부 비리, 중대범죄 의심 사건의 1차 사실조사 및 감사업무 위탁.",
  },
  {
    no: "02",
    title: "내부 감사 / 범죄심리 분석",
    body: "기업·보험사 내부 감사, 사건 정황의 범죄심리학적 해석 지원.",
  },
  {
    no: "03",
    title: "디지털 포렌식",
    body: "스마트폰·메신저·결제·CCTV 기록의 포렌식 보전 및 분석. 공인 자격 보유 인력.",
  },
  {
    no: "04",
    title: "지식재산권·사업재산 보호",
    body: "기업 영업비밀·특허·상표 침해 정황 조사, 기술유출·인력유출 추적.",
  },
  {
    no: "05",
    title: "기업 실사 (Due Diligence)",
    body: "M&A·투자·계약 체결 전 거래 상대방의 평판·재정·법적 리스크 검증.",
  },
  {
    no: "06",
    title: "빅데이터 분석",
    body: "공공·민간 자료원 통합 분석으로 패턴화된 사기·이상 정황 식별.",
  },
  {
    no: "07",
    title: "소송 지원 (증거확보·사실관계 조사)",
    body: "도원 소송팀과 직결되는 증거 보전·사실관계 정리 — 소장 작성에 그대로 활용.",
  },
];

const team = [
  { role: "전직 수사관", body: "강력·교통·금융 수사 경력자" },
  { role: "보험사 SIU 출신", body: "SIU·손해사정 실무 경험" },
  { role: "디지털 포렌식 전담", body: "공인 자격 보유 분석가" },
];

const process = [
  "보험사·기업·의뢰인 1차 미팅 — 사건 개요 청취",
  "조사 계획 수립 (목적·범위·기간·예상 결과물)",
  "현장 조사 + 자료 수집 + 디지털 포렌식",
  "조사 보고서 작성 (소송에 그대로 활용 가능한 수준)",
  "도원 변호사단으로 소송·구상 단계 자동 연계",
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
            도원 부설 민간조사센터는 <strong className="text-paper">수사기관 출신 조사·수사 전문가</strong>로
            구성된 별도 조직입니다. 보험사기 의심 사건뿐 아니라 기업 내부 감사·지식재산권 보호·실사·
            디지털 포렌식까지 폭넓게 다룹니다. 외부 흥신소를 거치지 않고 도원 한 팀이 조사·소송·구상까지 잇습니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/contact/insurer" variant="primary" size="lg">조사 협업 의뢰</Button>
            <Button href="/contact/enterprise" variant="on-dark" size="lg">기업 실사·감사 문의</Button>
          </div>
        </Container>
      </section>

      {/* Scope — 7 service areas */}
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={2}>SCOPE</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">조사 범위 7대 영역</h2>
          <p className="mt-4 max-w-2xl font-serif-ko text-body-lg text-ink-soft leading-base">
            보험·기업·지재권·디지털 영역의 사실조사를 한 곳에서 처리합니다.
          </p>

          <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2 lg:grid-cols-3">
            {scope.map((s) => (
              <li key={s.no} className="bg-paper p-7 lg:p-8">
                <span className="label-mono text-gold">{s.no}</span>
                <h3 className="mt-5 font-serif-ko text-h3 font-semibold text-ink">{s.title}</h3>
                <p className="mt-4 font-serif-ko text-body text-ink-soft leading-base">{s.body}</p>
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
