import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui";

const mockInsights = [
  {
    type: "CASE",
    no: "#2025-001",
    area: "자동차보험",
    title: "무보험차상해 약관조항 면책 효력",
    href: "/library/cases/auto-uninsured-2025",
    summary: "대법원 2025다XXXXX — 약관 교부·설명 의무 미이행 시 보험자 면책 제한.",
    lawyer: "홍명호 변호사",
  },
  {
    type: "COLUMN",
    no: "—",
    area: "의료분쟁",
    title: "의무기록 사본의 증거능력과 위·변조 검증",
    href: "/library/columns/medical-records-evidence",
    summary: "의무기록 사본만으로 증명력을 다투는 방법, 그리고 의사 자격 변호사의 역할.",
    lawyer: "윤은희 변호사",
  },
  {
    type: "CASE",
    no: "#2025-014",
    area: "구상",
    title: "교통사고 합의금 지급 후 구상 가능성",
    href: "/library/cases/subrogation-traffic-settlement",
    summary: "피해자 일괄 합의 후 가해자 공동불법행위 책임에 대한 구상권 행사 인정 사례.",
    lawyer: "방정숙 변호사",
  },
];

export function RecentInsights() {
  return (
    <section className="section-y">
      <Container size="wide">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            index={5}
            eyebrow="RECENT INSIGHTS"
            display="From the library"
            heading="최근 판례·칼럼"
            lead="도원 변호사가 직접 정리한 보험·의료·구상 분야 최신 자료."
          />
          <Link
            href="/library"
            className="font-serif-ko text-[15px] text-ink font-semibold border-b border-ink pb-1 hover:text-gold-deep hover:border-gold-deep transition-colors self-start lg:self-end"
          >
            라이브러리 전체 보기 →
          </Link>
        </div>

        <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 lg:grid-cols-3">
          {mockInsights.map((it) => (
            <li key={it.href} className="bg-paper">
              <Link href={it.href} className="block h-full p-7 lg:p-8 group">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-label text-gold">
                    {it.type} · {it.no}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
                    {it.area}
                  </span>
                </div>
                <h3 className="mt-5 font-serif-ko text-h3 font-semibold text-ink leading-tight group-hover:text-gold-deep transition-colors">
                  {it.title}
                </h3>
                <p className="mt-4 font-serif-ko text-[14.5px] text-ink-soft leading-base">
                  {it.summary}
                </p>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                  담당 · {it.lawyer}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
