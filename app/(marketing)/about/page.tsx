import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";

const sections = [
  {
    href: "/about/philosophy",
    no: "01",
    title: "철학·인사말",
    desc: "도원이 지향하는 법률 서비스의 원칙과 대표 인사말.",
  },
  {
    href: "/about/capability",
    no: "02",
    title: "통합 모델",
    desc: "조사 → 소송 → 구상 → 추심을 한 팀에서 끝내는 핵심 차별점.",
  },
  {
    href: "/about/history",
    no: "03",
    title: "연혁",
    desc: "도원이 걸어온 길과 주요 마일스톤.",
  },
  {
    href: "/about/contact",
    no: "04",
    title: "오시는 길",
    desc: "서울 서초 본사 위치·연락처·교통 안내.",
  },
];

export default function AboutIndex() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>ABOUT DOWON</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          About Dowon
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">도원 소개</p>
        <p className="mt-6 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          법무법인 도원은 보험 분쟁·의료분쟁·기업 자문을 통합 모델로 다루는 로펌입니다.
          민간조사센터와 채권회수팀을 부설로 운영해, 조사부터 회수까지 하나의 라인에서
          진행할 수 있도록 설계되어 있습니다.
        </p>

        <ul className="mt-16 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2">
          {sections.map((s) => (
            <li key={s.href} className="bg-paper">
              <Link href={s.href} className="block p-8 lg:p-10 group h-full">
                <span className="label-mono text-gold">{s.no}</span>
                <h2 className="mt-5 font-serif-ko text-h2 font-semibold text-ink group-hover:text-gold-deep transition-colors">
                  {s.title}
                </h2>
                <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base max-w-md">
                  {s.desc}
                </p>
                <span className="mt-8 inline-block font-mono text-[11px] uppercase tracking-label text-ink group-hover:text-gold-deep">
                  자세히 보기 →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
