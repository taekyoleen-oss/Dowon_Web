import { Container } from "@/components/layout/container";
import { Counter } from "@/components/ui";
import { Eyebrow } from "@/components/ui/eyebrow";

const points = [
  { value: 1300, suffix: "+", label: "누적 수임 건수", note: "보험·의료·구상 통합" },
  { value: 86,   suffix: "%",  label: "구상 회수율",   note: "최근 3년 평균" },
  { value: 13,   suffix: "명",  label: "변호사",         note: "의사·세무사 등 특수자격 포함" },
  { value: 4,    suffix: "곳",  label: "부설·전담팀",     note: "민간조사·의료·채권회수·자문" },
];

export function ProofPoints() {
  return (
    <section className="section-y bg-night text-paper">
      <Container size="wide">
        <Eyebrow tone="paper" index={4}>PROOF POINTS · 정량 신뢰 지표</Eyebrow>
        <h2 className="mt-4 font-display italic text-[clamp(32px,5vw,56px)] text-paper leading-tight">
          Numbers behind the work.
        </h2>
        <p className="mt-4 max-w-2xl font-serif-ko text-h3 text-paper-3 leading-base">
          도원이 통합 모델을 운영해 온 결과는 숫자로도 드러납니다.
        </p>

        <dl className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-px bg-night-2 border border-night-2">
          {points.map((p) => (
            <div
              key={p.label}
              className="bg-night px-6 py-10 lg:px-8 lg:py-12"
            >
              <dt className="label-mono text-gold-bright">{p.label}</dt>
              <dd className="mt-5 font-display italic text-[clamp(36px,6vw,64px)] text-paper leading-tight">
                <Counter value={p.value} suffix={p.suffix} />
              </dd>
              <p className="mt-3 font-serif-ko text-[14px] text-paper-3">
                {p.note}
              </p>
            </div>
          ))}
        </dl>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-label text-paper-3">
          * 회수율·수임 건수는 도원 내부 집계 기준 (2026.05). 사건마다 결과가 다를 수 있습니다.
        </p>
      </Container>
    </section>
  );
}
