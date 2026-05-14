import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { StaffCard } from "@/components/people/staff-card";
import { fellows } from "@/lib/data/staff";

export const metadata = {
  title: "고문·전문위원",
  description:
    "법무법인 도원의 고문·전문위원 — 보험 산업·의학 자문 등 분야별 전문가가 변호사단과 협업해 사건 분석을 지원합니다.",
};

export default function FellowsPage() {
  return (
    <>
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={1}>FELLOWS · 고문·전문위원</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            Senior Advisors
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-ink">고문·전문위원</p>
          <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
            보험 산업 현장과 의료 자문 등 변호사 외 전문 영역에서, 도원 변호사단을
            지원하는 고문·전문위원입니다. 각 사건의 사실 분석·산업 관행 검토·의학
            쟁점 정리 등에 참여합니다.
          </p>
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="wide">
          <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
            {fellows.length}명
          </p>

          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {fellows.map((m) => (
              <li key={m.slug}>
                <StaffCard member={m} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
