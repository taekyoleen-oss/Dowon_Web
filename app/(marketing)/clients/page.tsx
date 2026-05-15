import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";

export const metadata = {
  title: "고객사·협력사",
  description:
    "법무법인 도원과 자문·협업 관계를 맺어 온 보험사·기업·기관 — 6개 카테고리 43곳.",
};

/**
 * Mirrors dowonlaw.com/customer/customer.asp — same six categories,
 * same logo set. Logos live under public/brand/partners/{categoryNo}-{i}.png
 * (downloaded from the live site). Individual company names are not
 * shown because the live site doesn't either; visual identification by
 * logo is the norm in Korean B2B legal practice.
 */
const groups: Array<{
  no: string;
  category: string;
  en: string;
  count: number;
  desc: string;
}> = [
  {
    no: "01",
    category: "유관기관",
    en: "Public & Industry Bodies",
    count: 11,
    desc: "변호사·손해사정·보험·의료 산업의 협회·공공기관 — 자문·교육·정책 협력.",
  },
  {
    no: "02",
    category: "생명보험사",
    en: "Life Insurers",
    count: 3,
    desc: "사망·재해·장기보험 분야 자문계약.",
  },
  {
    no: "03",
    category: "손해보험사",
    en: "Non-life Insurers",
    count: 12,
    desc: "국내 주요 손해보험사 — 자문계약·SIU 협업·구상 위임의 메인 채널.",
  },
  {
    no: "04",
    category: "손해사정사",
    en: "Loss Adjusters",
    count: 10,
    desc: "손해 산정·합의 단계에서 도원 변호사단과 협업하는 손해사정 법인·개인.",
  },
  {
    no: "05",
    category: "병원",
    en: "Hospitals",
    count: 1,
    desc: "의료분쟁지원센터의 의학 자문 네트워크.",
  },
  {
    no: "06",
    category: "기타기관",
    en: "Other Organisations",
    count: 6,
    desc: "기업 자문·디지털 포렌식·교육 등의 협력 기관.",
  },
];

const TOTAL = groups.reduce((s, g) => s + g.count, 0);

export default function ClientsPage() {
  return (
    <>
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={1}>CLIENTS · 고객사·협력사</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            Clients &amp; Partners
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-ink">
            6개 카테고리 · {TOTAL}곳
          </p>
          <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
            법무법인 도원은 보험사·손해사정 법인·의료 자문 네트워크·유관기관을 포함한{" "}
            {TOTAL}곳의 고객·협력사와 자문·협업 관계를 유지하고 있습니다.
            카테고리별 로고로 갈음하며, 개별 협업 사례는 자문 상담 시 안내합니다.
          </p>
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="wide">
          <Eyebrow index={2}>PARTNERS · 카테고리별</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            카테고리별 분포
          </h2>

          <div className="mt-14 space-y-16 lg:space-y-20">
            {groups.map((g) => (
              <div key={g.no}>
                <div className="flex items-baseline justify-between gap-6 border-b border-paper-3 pb-4">
                  <div>
                    <span className="label-mono text-gold">{g.no}</span>
                    <h3 className="mt-2 font-serif-ko text-h2 font-semibold text-ink">
                      {g.category}
                    </h3>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                      {g.en}
                    </p>
                  </div>
                  <p className="font-display italic text-[clamp(32px,4vw,48px)] text-ink leading-none">
                    {g.count}
                    <span className="ml-1 font-serif-ko text-h3 text-ink-soft not-italic">
                      곳
                    </span>
                  </p>
                </div>

                <p className="mt-4 max-w-[42em] font-serif-ko text-body text-ink-soft leading-base">
                  {g.desc}
                </p>

                <ul
                  className="mt-8 grid gap-3 sm:gap-4"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(140px, 1fr))",
                  }}
                >
                  {Array.from({ length: g.count }).map((_, i) => {
                    const idx = i + 1;
                    return (
                      <li
                        key={idx}
                        className="aspect-[16/9] flex items-center justify-center rounded-sm border border-paper-3 bg-paper p-2 transition-colors hover:border-ink"
                      >
                        <Image
                          src={`/brand/partners/${g.no.replace(
                            /^0/,
                            ""
                          )}-${idx}.png`}
                          alt={`${g.category} 협력사 ${idx}`}
                          width={240}
                          height={120}
                          className="h-full w-full object-contain opacity-90"
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-14 font-mono text-[11px] uppercase tracking-label text-ink-mute">
            * 표시된 로고는 자문·협업 관계가 있었던 기관·기업으로, 각 로고의 권리는 해당 기관에 있습니다.
          </p>
        </Container>
      </section>

      <section className="section-y">
        <Container size="base" className="text-center">
          <Eyebrow>NEXT</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            B2B 자문 검토
          </h2>
          <p className="mt-5 mx-auto max-w-xl font-serif-ko text-body-lg text-ink-soft">
            보험사·기업의 자문 의뢰는 페르소나별 폼을 통해 1~2영업일 내 회신됩니다.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/contact/insurer" variant="primary" size="lg">
              보험사 자문
            </Button>
            <Button href="/contact/enterprise" variant="secondary" size="lg">
              기업 자문
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
