import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { StaffCard } from "@/components/people/staff-card";
import { managementTeam } from "@/lib/data/staff";

export const metadata = {
  title: "경영관리팀",
  description:
    "법무법인 도원 경영관리팀 — 보상·구상 실무와 법무법인 운영 경력을 갖춘 실무진이 사건 진행과 의뢰인 커뮤니케이션을 받칩니다.",
};

const teams = [
  { no: "01", title: "프로젝트 관리", body: "사건 단계별 진행·일정·자료 통합 관리." },
  { no: "02", title: "고객 관리",     body: "의뢰인 커뮤니케이션·일정·결제." },
  { no: "03", title: "행정·총무",     body: "내부 운영·회계·인사·총무 전반." },
];

export default function ManagementPage() {
  return (
    <>
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={1}>MANAGEMENT · 경영관리팀</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            Operations.
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-ink">경영관리팀</p>
          <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
            변호사단의 사건 처리가 흔들리지 않도록 받쳐주는 운영팀입니다.
            보상·구상 실무 출신과 법무법인 운영 경력을 가진 실무진으로 구성됩니다.
          </p>
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="wide">
          <Eyebrow index={2}>TEAM · 팀 구성</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            팀 구성 <span className="font-mono text-h3 text-ink-mute">({managementTeam.length}명)</span>
          </h2>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {managementTeam.map((m) => (
              <li key={m.slug}>
                <StaffCard member={m} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={3}>SCOPE</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">담당 영역</h2>

          <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-3">
            {teams.map((t) => (
              <li key={t.no} className="bg-paper p-8 lg:p-10">
                <span className="label-mono text-gold">{t.no}</span>
                <h3 className="mt-5 font-serif-ko text-h3 font-semibold text-ink">{t.title}</h3>
                <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">{t.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
