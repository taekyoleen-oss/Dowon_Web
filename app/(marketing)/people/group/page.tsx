import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";
import { lawyers } from "@/lib/data/lawyers";
import { fellows, recoveryTeam, managementTeam } from "@/lib/data/staff";

export const metadata = {
  title: "조직도",
  description:
    "법무법인 도원의 조직 구조 — 부설기관(민간조사센터·의료분쟁지원센터)과 5개 실무팀(조사·송무·형사·구상·고액보상)으로 구성됩니다.",
};

// Five operating teams as shown on dowonlaw.com/member/group.asp
const teams = [
  {
    name: "조사팀",
    en: "Investigation",
    work: ["사건조사", "증거수집"],
    experts: ["담당변호사", "민간조사전문가"],
  },
  {
    name: "송무팀",
    en: "Litigation",
    work: ["채무부존재소송", "손해배상소송"],
    experts: ["담당변호사"],
  },
  {
    name: "형사팀",
    en: "Criminal",
    work: ["형사지원", "고소대리"],
    experts: ["담당변호사"],
  },
  {
    name: "구상팀",
    en: "Subrogation",
    work: ["추심 법조치"],
    experts: ["담당변호사", "관련업무경력자"],
  },
  {
    name: "고액보상팀",
    en: "High-value Claims",
    work: ["개호환자", "추적관리", "합의절충"],
    experts: ["담당변호사", "관련업무경력자"],
  },
];

const centers = [
  {
    name: "민간조사센터",
    en: "SIU · Investigation Center",
    href: "/centers/investigation",
    desc: "수사기관 출신 조사·수사 전문가가 내부자 비리·디지털 포렌식·기업 실사·소송 지원을 수행.",
  },
  {
    name: "의료분쟁지원센터",
    en: "Medical Disputes Center",
    href: "/centers/medical",
    desc: "의사 자격 변호사가 진료기록 분석·보험금 지급 적정성·의료과실 사건을 직접 검토.",
  },
];

const lawyerTotal = lawyers.length;
const staffTotal = fellows.length + recoveryTeam.length + managementTeam.length;

export default function GroupPage() {
  return (
    <>
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={1}>ORG · 조직도</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            How we&apos;re organized.
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-ink">법무법인 도원 조직도</p>
          <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
            법무법인 도원을 중심으로 두 개의 부설기관(민간조사센터·의료분쟁지원센터)이 자리하고,
            그 아래에 5개 실무팀(조사·송무·형사·구상·고액보상)이 각각 업무 영역과 전문가군을
            가진 구조로 운영됩니다.
          </p>
        </Container>
      </section>

      {/* Structured org chart — mirrors the live site's group.asp diagram
          but rendered as native HTML with brand styling so links and
          counts stay current. */}
      <section className="section-y bg-paper-2">
        <Container size="wide">
          <Eyebrow index={2}>STRUCTURE · 구조</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            조직 구조도
          </h2>

          <div className="mt-14 space-y-6">
            {/* Root — 법무법인 도원 */}
            <div className="flex justify-center">
              <div className="relative inline-flex items-center gap-3 rounded-md border-2 border-ink bg-paper px-8 py-5 shadow-[5px_5px_0_0_var(--tw-shadow-color)] shadow-ink/15">
                <span className="font-display italic text-2xl text-ink">D</span>
                <span className="h-7 w-px bg-paper-3" />
                <div>
                  <p className="font-serif-ko text-h3 font-semibold text-ink">
                    법무법인 도원
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-label text-ink-mute">
                    Dowon Law Firm
                  </p>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center" aria-hidden>
              <div className="h-7 w-px bg-ink/30" />
            </div>

            {/* Two affiliate centers */}
            <ul className="grid gap-4 sm:grid-cols-2">
              {centers.map((c) => (
                <li key={c.name}>
                  <Link
                    href={c.href}
                    className="block h-full rounded-md border border-ink bg-night text-paper p-6 hover:bg-night-2 transition-colors"
                  >
                    <p className="font-mono text-[10.5px] uppercase tracking-label text-gold-bright">
                      {c.en}
                    </p>
                    <h3 className="mt-3 font-serif-ko text-h3 font-semibold">
                      {c.name}
                    </h3>
                    <p className="mt-3 font-serif-ko text-[14px] text-paper-3 leading-relaxed">
                      {c.desc}
                    </p>
                    <span className="mt-5 inline-flex items-center font-mono text-[11px] uppercase tracking-label text-gold-bright">
                      자세히 →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Connector */}
            <div className="flex justify-center" aria-hidden>
              <div className="h-7 w-px bg-ink/30" />
            </div>

            {/* Five operating teams */}
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {teams.map((t) => (
                <li
                  key={t.name}
                  className="flex flex-col rounded-md border border-ink bg-paper overflow-hidden"
                >
                  <div className="bg-ink text-paper px-4 py-3">
                    <p className="font-serif-ko text-h3 font-semibold leading-tight">
                      {t.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-label text-paper-3">
                      {t.en}
                    </p>
                  </div>

                  <div className="flex-1 p-4 space-y-4">
                    <div>
                      <p className="inline-block rounded-sm bg-gold/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-label text-gold-deep">
                        업무
                      </p>
                      <ul className="mt-2 space-y-1 font-serif-ko text-[13.5px] text-ink leading-snug">
                        {t.work.map((w) => (
                          <li key={w}>{w}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="inline-block rounded-sm bg-paper-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-label text-ink-soft">
                        주요 전문가
                      </p>
                      <ul className="mt-2 space-y-1 font-serif-ko text-[13.5px] text-ink-soft leading-snug">
                        {t.experts.map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Reference image — original org chart from dowonlaw.com,
              kept for visual continuity with the legacy site. */}
          <details className="mt-14 group">
            <summary className="inline-flex items-center gap-2 cursor-pointer font-mono text-[11px] uppercase tracking-label text-ink-mute hover:text-ink">
              참고 · 기존 조직도 이미지
              <span aria-hidden className="transition-transform group-open:rotate-90">
                →
              </span>
            </summary>
            <div className="mt-5 rounded-md border border-paper-3 bg-paper p-6">
              <Image
                src="/brand/group/org-chart.png"
                alt="법무법인 도원 기존 조직도"
                width={977}
                height={680}
                className="w-full h-auto"
              />
            </div>
          </details>
        </Container>
      </section>

      {/* Personnel summary — totals + links to each section */}
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={3}>PEOPLE · 구성원</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            구성원 현황
          </h2>
          <p className="mt-5 max-w-[42em] font-serif-ko text-body-lg text-ink-soft leading-base">
            변호사 {lawyerTotal}명을 중심으로, 산업·의학 자문 고문 {fellows.length}명과
            채권회수·경영관리 실무진 {staffTotal - fellows.length}명이 함께 사건을 받칩니다.
          </p>

          <ul className="mt-12 grid gap-px bg-paper-3 border border-paper-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/people/lawyers",
                label: "변호사",
                en: "Lawyers",
                count: lawyerTotal,
              },
              {
                href: "/people/fellows",
                label: "고문·전문위원",
                en: "Fellows",
                count: fellows.length,
              },
              {
                href: "/people/recovery",
                label: "채권회수팀",
                en: "Recovery",
                count: recoveryTeam.length,
              },
              {
                href: "/people/management",
                label: "경영관리팀",
                en: "Management",
                count: managementTeam.length,
              },
            ].map((g) => (
              <li key={g.href} className="bg-paper">
                <Link
                  href={g.href}
                  className="block p-7 lg:p-8 h-full hover:bg-paper-2 transition-colors group"
                >
                  <p className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
                    {g.en}
                  </p>
                  <p className="mt-4 font-display italic text-[clamp(40px,5vw,56px)] text-ink leading-none">
                    {g.count}
                    <span className="ml-1 font-serif-ko text-h3 text-ink-soft not-italic">
                      명
                    </span>
                  </p>
                  <p className="mt-5 font-serif-ko text-h3 font-semibold text-ink">
                    {g.label}
                  </p>
                  <span className="mt-4 inline-flex items-center font-serif-ko text-[14px] text-ink font-semibold border-b border-ink pb-0.5 group-hover:text-gold-deep group-hover:border-gold-deep transition-colors">
                    자세히 →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="base" className="text-center">
          <Eyebrow>NEXT</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            전공 분야별 변호사 찾기
          </h2>
          <p className="mt-5 mx-auto max-w-xl font-serif-ko text-body-lg text-ink-soft">
            전문분야·직책·특수자격으로 필터링해서 적합한 변호사를 찾아보세요.
          </p>
          <div className="mt-10">
            <Button href="/people/lawyers" variant="primary" size="lg">
              변호사 디렉터리
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
