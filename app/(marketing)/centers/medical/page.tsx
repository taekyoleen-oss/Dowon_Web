import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";
import { LawyerPhoto } from "@/components/lawyer/lawyer-photo";
import { getLawyerBySlug } from "@/lib/data/lawyers";

export const metadata = {
  title: "의료분쟁지원센터",
  description:
    "진료기록 분석 → 보험금 지급 적정성 판단 → 의료과실 사고 분석 → 소송 수행. 의사 자격 변호사가 직접 수행합니다.",
};

/** Aligned with the real dowonlaw.com center page (4 core functions). */
const coreFunctions = [
  {
    no: "01",
    title: "진료기록 분석",
    body: "의무기록 사본의 의학적 검증 — 진단·치료·시술 적정성, 수정 흔적·시간차·기록 일관성 분석.",
  },
  {
    no: "02",
    title: "보험금 지급 적정성 판단",
    body: "보험사·피보험자 양측 자문. 진단 확정 시점, 약관 보장 범위 적용, 면책 사유 검토.",
  },
  {
    no: "03",
    title: "의료과실 사고 분석",
    body: "진료 가이드라인(대한의학회 등) 매핑, 인과관계·설명의무 위반 입증 자료 정리.",
  },
  {
    no: "04",
    title: "의료분쟁 소송 수행",
    body: "민사 손해배상, 형사 업무상과실, 행정 처분 대응까지 한 변호사가 일관 진행.",
  },
];

const whyDistinct = [
  {
    no: "01",
    title: "의학과 법률의 동시 판단",
    body: "의무기록 해석, 가이드라인 적용, 법률적 책임 판단을 한 변호사가 수행합니다. 외부 자문의에 의존하지 않습니다.",
  },
  {
    no: "02",
    title: "기록 위·변조 검증",
    body: "의무기록 사본의 수정 흔적, 시간차, 진료기록부와 진료비 산정의 일치 여부를 의학적 시각에서 검증합니다.",
  },
  {
    no: "03",
    title: "전문가 자문 네트워크",
    body: "타과 자문이 필요한 경우, 대학병원·전문 진료기관 의료진과의 네트워크로 신속한 검토.",
  },
];

const process = [
  "의무기록 사본 확보 (의뢰인 또는 도원 협조)",
  "의학적 검토 — 진단·치료·시술 적정성",
  "대한의학회·진료 가이드라인 매핑",
  "필요 시 외부 전문의 자문",
  "법률 검토 — 과실·인과·설명의무",
  "조정·소송 단계 결정",
];

export default function MedicalCenterPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={1}>CENTER · 의료분쟁지원센터</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            Medical Disputes Center
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-ink">의료분쟁지원센터</p>
          <p className="mt-10 max-w-[36em] font-serif-ko text-h3 text-ink-soft leading-base">
            의료분쟁은 ‘무엇이 잘못됐는가’와 ‘그것이 법적으로 어떻게 평가되는가’가 동시에
            다뤄져야 하는 영역입니다. 도원은 <strong className="text-ink">의사 자격을 보유한
            변호사</strong>가 의무기록 검토부터 법률 판단까지 한 사람이 수행합니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/contact/medical" variant="primary" size="lg">의료분쟁 상담 신청</Button>
            <Button href="/people/lawyers/yoon-eun-hee" variant="secondary" size="lg">
              담당 변호사 프로필
            </Button>
          </div>
        </Container>
      </section>

      {/* 4 core functions — directly mirrors real site */}
      <section className="section-y bg-paper-2">
        <Container size="wide">
          <Eyebrow index={2}>CORE FUNCTIONS · 핵심 기능 4가지</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            진료기록 분석부터 소송 수행까지
          </h2>

          <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-2">
            {coreFunctions.map((f) => (
              <li key={f.no} className="bg-paper p-8 lg:p-10">
                <span className="label-mono text-gold">{f.no}</span>
                <h3 className="mt-5 font-serif-ko text-h3 font-semibold text-ink">{f.title}</h3>
                <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">{f.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Featured lawyer */}
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={3}>FEATURED · 담당 변호사</Eyebrow>
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-label text-gold">
                변호사 · 의사 (비상임)
              </p>
              <h2 className="mt-3 font-display italic text-[clamp(48px,7vw,80px)] text-ink leading-tight">
                Yoon Eun-Hee
              </h2>
              <p className="mt-2 font-serif-ko text-h2 font-semibold text-ink">윤은희 변호사</p>
              <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
                의료분쟁에서 의학적 판단과 법률적 판단을 동시에 수행할 수 있는 국내 소수
                인력 중 한 명. 의무기록 자체의 신뢰성 검증, 진료 가이드라인 적용, 설명의무
                위반 입증을 한 변호사가 일관되게 처리합니다.
              </p>
              <div className="mt-8">
                <Link
                  href="/people/lawyers/yoon-eun-hee"
                  className="inline-flex items-center font-serif-ko text-[15px] text-ink font-semibold border-b border-ink pb-1 hover:text-gold-deep hover:border-gold-deep transition-colors"
                >
                  프로필 자세히 보기 →
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] bg-paper-3 border border-paper-3 rounded-md overflow-hidden relative">
                {(() => {
                  const yoon = getLawyerBySlug("yoon-eun-hee");
                  return yoon ? (
                    <LawyerPhoto
                      lawyer={yoon}
                      grayscaleOnHover={false}
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Why distinct */}
      <section className="section-y bg-paper-2">
        <Container size="wide">
          <Eyebrow index={4}>WHY DISTINCT</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            의료분쟁에서 도원이 가지는 차이
          </h2>

          <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 md:grid-cols-3">
            {whyDistinct.map((s) => (
              <li key={s.no} className="bg-paper p-8 lg:p-10">
                <span className="label-mono text-gold">{s.no}</span>
                <h3 className="mt-5 font-serif-ko text-h3 font-semibold text-ink">{s.title}</h3>
                <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">{s.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Process */}
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={5}>PROCESS</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            의무기록 → 소송 프로세스
          </h2>

          <ol className="mt-12 space-y-px bg-paper-3 border border-paper-3">
            {process.map((p, i) => (
              <li key={p} className="bg-paper p-7 lg:p-8 flex gap-6 items-baseline">
                <span className="label-mono text-gold shrink-0 w-16">
                  STEP {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-serif-ko text-body-lg text-ink leading-base">{p}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* CTA */}
      <section className="section-y bg-paper-2">
        <Container size="base" className="text-center">
          <Eyebrow>GET STARTED</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">의료분쟁 상담 신청</h2>
          <p className="mt-5 mx-auto max-w-xl font-serif-ko text-body-lg text-ink-soft">
            의무기록 보유 여부와 관계없이 1차 상담이 가능합니다. 기록 확보 절차도 함께 안내합니다.
          </p>
          <div className="mt-10">
            <Button href="/contact/medical" variant="primary" size="lg">의료분쟁 전용 상담 폼</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
