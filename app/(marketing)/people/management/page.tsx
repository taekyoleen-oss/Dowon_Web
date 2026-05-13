import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";

export const metadata = { title: "경영관리팀" };

const teams = [
  { no: "01", title: "프로젝트 관리", body: "사건 단계별 진행, 일정, 자료 통합 관리." },
  { no: "02", title: "고객 관리", body: "의뢰인 커뮤니케이션·일정·결제." },
  { no: "03", title: "행정·총무", body: "내부 운영, 회계, 인사·총무 전반." },
];

export default function ManagementPage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>MANAGEMENT · 경영관리팀</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Operations.
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">경영관리팀</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          변호사단의 사건 처리가 흔들리지 않도록 받쳐주는 운영팀. 프로젝트·고객·행정 영역을 분담합니다.
        </p>

        <ul className="mt-14 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-3">
          {teams.map((t) => (
            <li key={t.no} className="bg-paper p-8 lg:p-10">
              <span className="label-mono text-gold">{t.no}</span>
              <h2 className="mt-5 font-serif-ko text-h3 font-semibold text-ink">{t.title}</h2>
              <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">{t.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
