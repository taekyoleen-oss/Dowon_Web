import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";

export const metadata = { title: "구성원" };

const teams = [
  {
    href: "/people/lawyers",
    no: "01",
    title: "변호사",
    en: "Lawyers",
    desc: "도원의 13명 변호사 — 보험·의료·구상·자문 영역별 전문성을 보유.",
  },
  {
    href: "/people/fellows",
    no: "02",
    title: "고문·전문위원",
    en: "Fellows & Advisors",
    desc: "산업·실무 전문가 네트워크와 자문위원.",
  },
  {
    href: "/people/recovery",
    no: "03",
    title: "채권회수팀",
    en: "Recovery Team",
    desc: "판결 이후 실제 회수까지 책임지는 전담 팀.",
  },
  {
    href: "/people/management",
    no: "04",
    title: "경영관리팀",
    en: "Management",
    desc: "프로젝트·행정·고객 관리.",
  },
  {
    href: "/people/group",
    no: "05",
    title: "조직도",
    en: "Org Chart",
    desc: "변호사단·부설기관·운영팀이 하나의 사건에 어떻게 동시 투입되는지.",
  },
];

export default function PeopleIndex() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>PEOPLE · 구성원</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Who we are.
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">도원 구성원</p>

        <ul className="mt-16 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2 lg:grid-cols-5">
          {teams.map((t) => (
            <li key={t.href} className="bg-paper">
              <Link href={t.href} className="block p-7 lg:p-8 group h-full">
                <span className="label-mono text-gold">{t.no}</span>
                <h2 className="mt-5 font-serif-ko text-h3 font-semibold text-ink group-hover:text-gold-deep transition-colors">
                  {t.title}
                </h2>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                  {t.en}
                </p>
                <p className="mt-5 font-serif-ko text-body text-ink-soft leading-base">{t.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
