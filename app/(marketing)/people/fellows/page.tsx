import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";

export const metadata = { title: "고문·전문위원" };

const fellows = [
  { name: "○○○ 고문", role: "보험 산업", focus: "손해보험 실무·약관 자문" },
  { name: "○○○ 전문위원", role: "디지털 포렌식", focus: "통신·결제 기록 분석" },
  { name: "○○○ 전문위원", role: "의학 자문", focus: "정형외과·신경외과 분야" },
];

export default function FellowsPage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>FELLOWS · 고문·전문위원</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Fellows & Advisors
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">고문·전문위원</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          변호사단 외에 산업·실무·의학 분야의 외부 전문가가 도원의 사건에 자문으로 참여합니다.
          아래는 대표 분야이며, 실제 자문진 명단은 사건별로 별도 안내됩니다.
        </p>

        <ul className="mt-14 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-3">
          {fellows.map((f) => (
            <li key={f.name} className="bg-paper p-8 lg:p-10">
              <p className="label-mono text-gold">{f.role.toUpperCase()}</p>
              <h2 className="mt-5 font-serif-ko text-h3 font-semibold text-ink">{f.name}</h2>
              <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">{f.focus}</p>
            </li>
          ))}
        </ul>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-label text-ink-mute">
          * 자문진 명단은 도원 내부에서 사건별로 운영됩니다.
        </p>
      </Container>
    </section>
  );
}
