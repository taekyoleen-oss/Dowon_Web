import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";

export const metadata = { title: "연혁" };

const milestones: Array<{ year: string; entries: string[] }> = [
  {
    year: "2026",
    entries: [
      "AI 기반 라이브러리 통합 검색 도입 (Phase 2)",
      "보험사 SaaS형 약관 분석 도구 베타 운영",
    ],
  },
  {
    year: "2024",
    entries: [
      "채권회수팀 신설 — 추심 단계까지 통합 모델 완성",
      "구상 회수율 80% 돌파 (내부 집계)",
    ],
  },
  {
    year: "2022",
    entries: [
      "의료분쟁지원센터 부설 — 의사 자격 변호사 영입",
      "기업 법률자문 전담팀 분리",
    ],
  },
  {
    year: "2020",
    entries: [
      "민간조사센터 부설 — 보험사 SIU 협업 본격화",
    ],
  },
  {
    year: "2015",
    entries: [
      "법무법인 도원 설립 — 보험 분쟁 특화 로펌으로 출발",
      "서초 본사 개소",
    ],
  },
];

export default function HistoryPage() {
  return (
    <section className="section-y">
      <Container size="base">
        <Eyebrow index={1}>HISTORY · 연혁</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          A decade of integration.
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">도원이 걸어온 길</p>

        <ol className="mt-16 space-y-12 border-l border-paper-3 pl-8 lg:pl-12">
          {milestones.map((m) => (
            <li key={m.year} className="relative">
              <span
                aria-hidden
                className="absolute -left-[37px] lg:-left-[49px] top-1.5 h-3 w-3 rounded-full bg-gold border-2 border-paper"
              />
              <p className="font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-none">
                {m.year}
              </p>
              <ul className="mt-5 space-y-3">
                {m.entries.map((e) => (
                  <li
                    key={e}
                    className="flex gap-3 font-serif-ko text-body-lg text-ink-soft leading-base"
                  >
                    <span aria-hidden className="mt-2.5 h-px w-3 bg-gold shrink-0" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <p className="mt-16 font-mono text-[11px] uppercase tracking-label text-ink-mute">
          * 연혁 정보는 도원 내부 자료에 기반하며, 추후 정식 자료로 갱신됩니다.
        </p>
      </Container>
    </section>
  );
}
