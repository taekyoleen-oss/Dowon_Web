import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Eyebrow, Button, SectionHeader } from "@/components/ui";

export const metadata = {
  title: "도원의 핵심역량",
  description:
    "송무·의료·SIU·구상 4축이 한 팀에서 동시 병렬로 진행되는 도원의 통합 모델.",
};

/**
 * 4 axes that run *in parallel*, not sequentially. This mirrors the real
 * dowonlaw.com positioning: "조사·자문·민/형사 소송·채권 추심을 동시 진행".
 */
const axes = [
  {
    no: "01",
    label: "송무",
    en: "Litigation",
    tag: "MAIN",
    sub: "변호사단",
    what: "보험·의료·구상·형사 5대 영역의 1심·항소·상고를 단일 팀이 일관 수행합니다.",
    detail: [
      "보험금 청구·면책 분쟁",
      "손해배상·합의 절충",
      "형사 동반 사건",
      "1심·항소·상고 일관 대리",
    ],
    href: "/practice",
  },
  {
    no: "02",
    label: "의료",
    en: "Medical",
    tag: "DUAL-CRED",
    sub: "의료분쟁지원센터",
    what: "의사 자격 보유 변호사가 진료기록 의학적 검토부터 법률 판단까지 한 사람이 수행합니다.",
    detail: [
      "진료기록 분석",
      "보험금 지급 적정성 판단",
      "의료과실 사고 분석",
      "의료분쟁 소송 수행",
    ],
    href: "/centers/medical",
  },
  {
    no: "03",
    label: "SIU",
    en: "Investigation",
    tag: "FACT-FIND",
    sub: "민간조사센터",
    what: "수사기관 출신 인력이 사건 경위·증거를 1차 확보해 그대로 소송 전략에 연결합니다.",
    detail: [
      "내부자 비리·중대범죄 조사",
      "디지털 포렌식",
      "지식재산권·사업재산 보호",
      "기업 실사 / 빅데이터 분석",
    ],
    href: "/centers/investigation",
  },
  {
    no: "04",
    label: "구상",
    en: "Recovery",
    tag: "FOLLOW-THROUGH",
    sub: "구상·합의팀 + 채권회수팀",
    what: "판결문이 곧 회수가 아닙니다. 도원은 구상권 확보부터 실제 회수·추심까지 같은 팀이 끌어갑니다.",
    detail: [
      "구상권 행사 / 공동불법행위 책임 배분",
      "고액보상 합의 절충",
      "재산조회·은닉 추적",
      "강제집행·압류·추심",
    ],
    href: "/people/recovery",
  },
];

const comparisonRows = [
  ["조사 (SIU)", "외부 흥신소·조사관 위탁 (정보 단절)", "민간조사센터 직접 수행"],
  ["의료 검토",  "외부 자문의 / 별도 사무소",            "의사 자격 변호사 직접 검토"],
  ["소송 (송무)", "변호사 사무소 (조사 결과 재해석 필요)",  "동일 변호사단이 일관 수행"],
  ["구상·추심",  "별도 회수 위임 (자료 다시 정리)",      "구상팀 + 채권회수팀 직접 수행"],
];

export default function CapabilityPage() {
  return (
    <>
      {/* Intro */}
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={1}>CAPABILITY · 도원의 핵심역량</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            Four axes. One team.
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-ink">
            송무 · 의료 · SIU · 구상, 동시 병렬로
          </p>

          <p className="mt-10 max-w-[36em] font-serif-ko text-h3 text-ink-soft leading-base">
            대부분의 로펌은 ‘소송’만 다룹니다. 그 앞·뒤로는 흥신소, 외부 자문의,
            추심 전문업체로 손이 바뀝니다. 손이 바뀔 때마다 정보·시간·신뢰가
            바닥에 떨어집니다. <strong className="text-ink font-semibold">
            도원은 이 네 축을 같은 팀이 동시에 끌어가도록 설계되어 있습니다.</strong>
          </p>
        </Container>
      </section>

      {/* 4-axis grid (parallel, not sequential) */}
      <section className="section-y bg-paper-2">
        <Container size="wide">
          <Eyebrow index={2}>FOUR AXES · 4축</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            동시 병렬 (Parallel) — 순차 (Sequential) 아님
          </h2>
          <p className="mt-5 max-w-[42em] font-serif-ko text-body-lg text-ink-soft leading-base">
            아래 4축은 사건 단계를 순서대로 거치는 것이 아니라, 각 축의 인력이
            동일 사건에 대해 동시에 협업하며 진행됩니다.
          </p>

          <div className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2">
            {axes.map((a) => (
              <div key={a.no} className="bg-paper p-7 lg:p-9 flex flex-col">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-label text-gold">
                    AXIS {a.no} · {a.en}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-label text-ink-mute">
                    {a.tag}
                  </span>
                </div>
                <p className="mt-4 font-display italic text-[clamp(40px,5vw,64px)] text-ink leading-none">
                  {a.no}
                </p>
                <h3 className="mt-3 font-serif-ko text-h2 font-semibold text-ink">
                  {a.label}
                </h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                  담당 · {a.sub}
                </p>
                <p className="mt-5 font-serif-ko text-body-lg text-ink leading-base">
                  {a.what}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {a.detail.map((d) => (
                    <li
                      key={d}
                      className="flex gap-3 font-serif-ko text-[14.5px] text-ink-soft leading-base"
                    >
                      <span aria-hidden className="mt-2.5 h-px w-3 bg-gold shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={a.href}
                  className="mt-7 inline-flex items-center font-serif-ko text-[14.5px] text-ink font-semibold border-b border-ink pb-1 hover:text-gold-deep hover:border-gold-deep transition-colors self-start"
                >
                  관련 페이지 →
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Comparison */}
      <section className="section-y bg-night text-paper">
        <Container size="wide">
          <SectionHeader
            index={3}
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
                  <th className="text-left py-4 pr-6 font-mono text-[11px] uppercase tracking-label text-gold-bright">
                    축
                  </th>
                  <th className="text-left py-4 pr-6 font-mono text-[11px] uppercase tracking-label text-paper-3">
                    일반 로펌
                  </th>
                  <th className="text-left py-4 font-mono text-[11px] uppercase tracking-label text-gold-bright">
                    도원
                  </th>
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
          <Eyebrow index={4}>NEXT STEP</Eyebrow>
          <h2 className="mt-4 font-display italic text-[clamp(36px,6vw,64px)] text-ink leading-tight">
            Ready to talk?
          </h2>
          <p className="mt-5 mx-auto max-w-xl font-serif-ko text-body-lg text-ink-soft">
            B2B 자문 계약은 보험사·기업별 상담 폼에서, 개인 사건은 1차 무료 상담 신청에서 시작하세요.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/contact/insurer" variant="primary" size="lg">보험사 자문 상담</Button>
            <Button href="/contact/enterprise" variant="secondary" size="lg">기업 자문 상담</Button>
            <Button href="/tools/intake" variant="ghost" size="lg">개인 사건 — AI 가이드</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
