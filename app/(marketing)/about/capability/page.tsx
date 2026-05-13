import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Eyebrow, Button, SectionHeader } from "@/components/ui";

export const metadata = {
  title: "통합 모델",
  description: "조사 → 소송 → 구상 → 추심을 한 팀에서 끝내는 도원의 핵심 차별점.",
};

const stages = [
  {
    no: "01",
    label: "조사",
    en: "Investigate",
    sub: "민간조사센터",
    what: "사고 경위 추적, 보험사기·위장사고 의심 정황 분석, 인적사항·재산 추적.",
    who: "전직 수사관, 보험사 출신 조사관, 디지털 포렌식 전담 인력.",
    when: "사고 직후 ‘이상 정황’이 있는 사건, 가해자 행방 불명, 위장사고 의심.",
    cases: [
      "보험사기 의심 자해사고 — 통신·결제 기록 교차 분석으로 위장 입증",
      "가해자 도주·재산 은닉 — 추적 후 압류·집행 단계 사전 준비",
    ],
    href: "/centers/investigation",
  },
  {
    no: "02",
    label: "소송",
    en: "Litigate",
    sub: "변호사단·의료분쟁지원센터",
    what: "조사 결과를 그대로 소송 전략에 반영, 1심·항소·상고를 단일 팀이 일관 수행.",
    who: "보험·의료 전문 변호사 13명, 의사 자격 변호사 1인.",
    when: "보험금 청구·면책 분쟁, 의료분쟁, 손해배상, 형사 동반 사건.",
    cases: [
      "장기보험 면책 — 약관 교부·설명 의무 위반 입증으로 보험금 인용",
      "의료분쟁 — 의무기록 의학적 분석과 법률 검토를 한 변호사가 수행",
    ],
    href: "/practice",
  },
  {
    no: "03",
    label: "구상",
    en: "Subrogate",
    sub: "구상·합의팀",
    what: "판결 이후 구상권 행사, 고액보상 합의 절충, 공동불법행위 책임 배분.",
    who: "구상 전담 변호사·실무 인력.",
    when: "보험금 지급 후 가해자 책임 회수, 다수 가해자 책임 분담, 고액 보상 합의.",
    cases: [
      "교통사고 합의금 지급 후 공동불법행위 가해자 대상 구상권 행사 인정",
      "산재·자배책 동시 발생 시 부담 비율 합의로 구상금 회수",
    ],
    href: "/practice/subrogation",
  },
  {
    no: "04",
    label: "추심",
    en: "Recover",
    sub: "채권회수팀",
    what: "판결문 확보 이후 실제 회수까지 — 재산조회·은닉 추적·강제집행·압류·추심.",
    who: "채권회수 전담 변호사·집행관 협력 네트워크.",
    when: "판결 받았으나 실제 회수에 어려움이 있는 사건, 가해자 자산 추적 필요.",
    cases: [
      "기성 판결 보유 의뢰인 — 가해자 은닉재산 추적 후 회수 성공",
      "다수 채무자 분산 추적 — 분기별 회수 리포트로 진척 관리",
    ],
    href: "/people/recovery",
  },
];

const comparisonRows = [
  ["조사",   "외부 흥신소·조사관 위탁 (정보 단절)", "민간조사센터 직접 수행"],
  ["소송",   "변호사 사무소 (조사 결과 재해석 필요)", "동일 변호사단이 일관 수행"],
  ["구상",   "별도 회수 위임 (자료 다시 정리)",      "동일 팀에서 자동 연계"],
  ["추심",   "추심 전문 사무소 위탁",                "도원 채권회수팀 직접 수행"],
];

export default function CapabilityPage() {
  return (
    <>
      {/* Intro */}
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={1}>CAPABILITY · 통합 모델</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            One Team. End to End.
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-ink">조사 → 소송 → 구상 → 추심, 한 팀에서</p>

          <p className="mt-10 max-w-[36em] font-serif-ko text-h3 text-ink-soft leading-base">
            일반 로펌은 보통 ‘소송’만 다룹니다. 그 앞·뒤로는 흥신소, 다른 사무소,
            추심 전문업체로 손이 바뀝니다. 손이 바뀔 때마다 정보·시간·신뢰가
            바닥에 떨어집니다. 도원은 이 네 단계를 같은 사람들이 처음부터 끝까지
            끌어가도록 설계되어 있습니다.
          </p>
        </Container>
      </section>

      {/* Stages */}
      {stages.map((s, idx) => (
        <section
          key={s.no}
          className={`section-y ${idx % 2 === 0 ? "bg-paper-2" : ""}`}
        >
          <Container size="wide">
            <div className="grid gap-10 lg:grid-cols-12">
              <header className="lg:col-span-4">
                <span className="font-mono text-[11px] uppercase tracking-label text-gold">
                  STAGE {s.no} · {s.en}
                </span>
                <h2 className="mt-3 font-display italic text-[clamp(48px,8vw,96px)] text-ink leading-none">
                  {s.no}
                </h2>
                <p className="mt-3 font-serif-ko text-h1 font-semibold text-ink">{s.label}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                  담당 · {s.sub}
                </p>
              </header>

              <div className="lg:col-span-8 space-y-7">
                <dl className="space-y-5 max-w-[42em]">
                  <div>
                    <dt className="label-mono">무엇을 하는가</dt>
                    <dd className="mt-2 font-serif-ko text-body-lg text-ink leading-base">{s.what}</dd>
                  </div>
                  <div>
                    <dt className="label-mono">누가 수행하는가</dt>
                    <dd className="mt-2 font-serif-ko text-body-lg text-ink-soft leading-base">{s.who}</dd>
                  </div>
                  <div>
                    <dt className="label-mono">언제 필요한가</dt>
                    <dd className="mt-2 font-serif-ko text-body-lg text-ink-soft leading-base">{s.when}</dd>
                  </div>
                </dl>

                <div>
                  <p className="label-mono">대표 사례 (비식별)</p>
                  <ul className="mt-3 space-y-3">
                    {s.cases.map((c) => (
                      <li
                        key={c}
                        className="flex gap-3 font-serif-ko text-body text-ink-soft leading-base"
                      >
                        <span aria-hidden className="mt-2.5 h-px w-3 bg-gold shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={s.href}
                  className="inline-flex items-center font-serif-ko text-[15px] text-ink font-semibold border-b border-ink pb-1 hover:text-gold-deep hover:border-gold-deep transition-colors"
                >
                  관련 페이지 보기 →
                </Link>
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* Comparison */}
      <section className="section-y bg-night text-paper">
        <Container size="wide">
          <SectionHeader
            index={5}
            tone="paper"
            eyebrow="COMPARISON"
            display="Why integration matters."
            heading="외주 4곳 vs 도원 한 팀"
            lead="같은 사건이라도 손이 몇 번 바뀌는지에 따라 의뢰인이 잃는 시간·비용·증거가 달라집니다."
          />

          <div className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-night-2">
                  <th className="text-left py-4 pr-6 font-mono text-[11px] uppercase tracking-label text-gold-bright">단계</th>
                  <th className="text-left py-4 pr-6 font-mono text-[11px] uppercase tracking-label text-paper-3">일반 로펌</th>
                  <th className="text-left py-4 font-mono text-[11px] uppercase tracking-label text-gold-bright">도원</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([stage, alt, dowon]) => (
                  <tr key={stage} className="border-b border-night-2">
                    <td className="py-5 pr-6 font-serif-ko font-semibold text-paper">{stage}</td>
                    <td className="py-5 pr-6 font-serif-ko text-paper-3 leading-base">{alt}</td>
                    <td className="py-5 font-serif-ko text-paper leading-base">{dowon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section-y">
        <Container size="base" className="text-center">
          <Eyebrow index={6}>NEXT STEP</Eyebrow>
          <h2 className="mt-4 font-display italic text-[clamp(36px,6vw,64px)] text-ink leading-tight">
            Ready to talk?
          </h2>
          <p className="mt-5 mx-auto max-w-xl font-serif-ko text-body-lg text-ink-soft">
            B2B 자문 계약은 보험사·기업별 상담 폼에서, 개인 사건은 1차 무료 상담 신청에서 시작하세요.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/contact/insurer" variant="primary" size="lg">보험사 자문 상담</Button>
            <Button href="/contact/enterprise" variant="secondary" size="lg">기업 자문 상담</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
