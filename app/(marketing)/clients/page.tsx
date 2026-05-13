import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";

export const metadata = {
  title: "고객사·협력사",
  description:
    "법무법인 도원과 자문·협업 관계를 맺어 온 보험사·기업·기관 — 6개 카테고리 43곳.",
};

/**
 * Categories and counts mirror dowonlaw.com/customer/customer.asp
 * (6 categories, 43 partners total). Specific entity names are kept
 * confidential per Dowon's policy.
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
    desc:
      "변호사·손해사정·보험·의료 산업의 협회·공공기관 — 자문·교육·정책 협력.",
  },
  {
    no: "02",
    category: "손해보험사",
    en: "Non-life Insurers",
    count: 12,
    desc:
      "국내 주요 손해보험사 — 자문계약·SIU 협업·구상 위임의 메인 채널.",
  },
  {
    no: "03",
    category: "생명보험사",
    en: "Life Insurers",
    count: 3,
    desc:
      "사망·재해·장기보험 분야 자문계약.",
  },
  {
    no: "04",
    category: "손해사정사",
    en: "Loss Adjusters",
    count: 10,
    desc:
      "손해 산정·합의 단계에서 도원 변호사단과 협업하는 손해사정 법인·개인.",
  },
  {
    no: "05",
    category: "병원",
    en: "Hospitals",
    count: 1,
    desc:
      "의료분쟁지원센터의 의학 자문 네트워크 (대학병원·전문 진료기관).",
  },
  {
    no: "06",
    category: "기타기관",
    en: "Other Organisations",
    count: 6,
    desc:
      "기업 자문·디지털 포렌식·교육 등의 협력 기관.",
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
            법무법인 도원은 보험사·손해사정 법인·의료 자문 네트워크·유관기관을 포함한
            {` ${TOTAL}`}곳의 고객·협력사와 자문·협업 관계를 유지하고 있습니다. 비밀유지의무에 따라 개별
            상호는 비공개이며, 카테고리 단위로만 공개합니다.
          </p>
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="wide">
          <Eyebrow index={2}>CATEGORIES</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            카테고리별 분포
          </h2>

          <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g) => (
              <li key={g.no} className="bg-paper p-7 lg:p-8">
                <div className="flex items-baseline justify-between">
                  <span className="label-mono text-gold">{g.no}</span>
                  <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
                    {g.en}
                  </span>
                </div>

                <p className="mt-4 font-display italic text-[clamp(40px,5vw,64px)] text-ink leading-none">
                  {g.count}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                  곳
                </p>

                <h3 className="mt-5 font-serif-ko text-h3 font-semibold text-ink">
                  {g.category}
                </h3>
                <p className="mt-3 font-serif-ko text-body text-ink-soft leading-base">
                  {g.desc}
                </p>

                {/* Progress-bar visual hint of relative weight */}
                <div className="mt-6 h-1 bg-paper-2 rounded-pill overflow-hidden">
                  <div
                    className="h-full bg-gold-deep"
                    style={{ width: `${Math.round((g.count / TOTAL) * 100)}%` }}
                    aria-hidden
                  />
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-label text-ink-mute">
                  {Math.round((g.count / TOTAL) * 100)}%
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-10 font-mono text-[11px] uppercase tracking-label text-ink-mute">
            * 변호사법 §28 비밀유지의무에 따라 개별 상호는 공개하지 않습니다.
            자세한 협업 사례는 자문 상담 시 안내합니다.
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
            <Button href="/contact/insurer" variant="primary" size="lg">보험사 자문</Button>
            <Button href="/contact/enterprise" variant="secondary" size="lg">기업 자문</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
