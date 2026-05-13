import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";

export const metadata = { title: "상담 신청" };

const personas = [
  { no: "A", href: "/contact/insurer",    title: "보험사·손해사정사", en: "For Insurers",     desc: "자문계약·SIU 협업·구상 위임 요청." },
  { no: "B", href: "/contact/enterprise", title: "기업 법률자문",     en: "For Enterprises",  desc: "산업별 자문 계약 문의." },
  { no: "C", href: "/contact/medical",    title: "의료분쟁",          en: "Medical Disputes", desc: "의료사고 — 의무기록 보유 여부 확인 포함." },
  { no: "D", href: "/contact/personal",   title: "개인 사건의뢰",     en: "Personal Cases",   desc: "1차 상담은 무료입니다." },
];

export default function ContactIndex() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>CONTACT · 상담 신청</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          How can we help?
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">어떤 사건이신가요?</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          4개의 페르소나별 폼을 통해 빠르게 적합한 담당자에게 연결됩니다.
        </p>

        <ul className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-paper-3 border border-paper-3">
          {personas.map((p) => (
            <li key={p.href} className="bg-paper">
              <Link href={p.href} className="block p-8 lg:p-12 group h-full">
                <div className="flex items-baseline justify-between">
                  <span className="label-mono text-gold">— {p.no}</span>
                  <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
                    {p.en}
                  </span>
                </div>
                <h2 className="mt-6 font-serif-ko text-h2 font-semibold text-ink group-hover:text-gold-deep transition-colors">
                  {p.title}
                </h2>
                <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base max-w-md">
                  {p.desc}
                </p>
                <span className="mt-8 inline-block font-mono text-[11px] uppercase tracking-label text-ink group-hover:text-gold-deep">
                  상담 폼 열기 →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
