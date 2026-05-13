import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Eyebrow, Tag, Button } from "@/components/ui";
import { lawyers } from "@/lib/data/lawyers";

export const metadata = {
  title: "조직도",
  description:
    "법무법인 도원의 조직 구조 — 변호사단, 부설기관(민간조사센터·의료분쟁지원센터), 채권회수팀, 경영관리팀.",
};

type Node = {
  key: string;
  title: string;
  en: string;
  count?: number | string;
  desc: string;
  href?: string;
  members?: string[]; // lawyer slugs
  highlight?: boolean;
};

const partners = lawyers.filter((l) => l.isPartner);
const associates = lawyers.filter((l) => !l.isPartner && l.role === "변호사");
const nonResident = lawyers.filter((l) => l.role.includes("비상임"));

const tree: { layer: string; nodes: Node[] }[] = [
  {
    layer: "Leadership",
    nodes: [
      {
        key: "rep",
        title: "대표변호사",
        en: "Managing Partner",
        count: 1,
        desc: "도원의 통합 모델을 설계하고 보험사 자문·SIU 협업의 실무 기준을 만든 대표.",
        href: "/people/lawyers/hong-myung-ho",
        members: ["hong-myung-ho"],
        highlight: true,
      },
    ],
  },
  {
    layer: "Practice — 변호사단",
    nodes: [
      {
        key: "partners",
        title: "파트너변호사",
        en: "Partners",
        count: partners.length,
        desc: "보험·의료·자문·구상 분야 책임 운영.",
        href: "/people/lawyers",
        members: partners.map((l) => l.slug),
      },
      {
        key: "associates",
        title: "변호사",
        en: "Associates",
        count: associates.length,
        desc: "분야별 사건 실무 수행.",
        href: "/people/lawyers",
        members: associates.map((l) => l.slug),
      },
      {
        key: "fellows",
        title: "비상임 / 고문",
        en: "Of Counsel / Fellows",
        count: nonResident.length + " + 외부 전문가 네트워크",
        desc: "의사 자격 변호사(윤은희), 산업·실무 전문가 자문진.",
        href: "/people/fellows",
        members: nonResident.map((l) => l.slug),
      },
    ],
  },
  {
    layer: "Affiliate Centers — 부설기관",
    nodes: [
      {
        key: "siu",
        title: "민간조사센터",
        en: "SIU · Investigation Center",
        desc:
          "수사기관 출신 조사·수사 전문가 — 내부자 비리·디지털 포렌식·지재권·기업 실사·소송 지원 7대 영역.",
        href: "/centers/investigation",
        highlight: true,
      },
      {
        key: "medical",
        title: "의료분쟁지원센터",
        en: "Medical Disputes Center",
        desc:
          "진료기록 분석·보험금 지급 적정성 판단·의료과실 사고 분석·소송 수행. 의사 자격 변호사가 직접.",
        href: "/centers/medical",
        highlight: true,
      },
    ],
  },
  {
    layer: "Operations — 운영팀",
    nodes: [
      {
        key: "recovery",
        title: "채권회수팀",
        en: "Recovery Team",
        desc: "재산조회·은닉 추적·강제집행·압류·추심. 판결 이후 회수까지 책임.",
        href: "/people/recovery",
      },
      {
        key: "management",
        title: "경영관리팀",
        en: "Management",
        desc: "프로젝트·고객 관리·행정·총무.",
        href: "/people/management",
      },
    ],
  },
];

function membersOf(slugs?: string[]) {
  if (!slugs?.length) return null;
  const list = slugs
    .map((s) => lawyers.find((l) => l.slug === s))
    .filter((x): x is (typeof lawyers)[number] => !!x);
  if (list.length === 0) return null;
  return list;
}

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
            도원은 변호사단을 중심으로, 부설 민간조사센터·의료분쟁지원센터, 그리고
            채권회수팀·경영관리팀이 한 사건에 동시 투입되는 구조입니다. 송무·의료·SIU·구상
            4축이 직선 배치가 아닌 병렬 협업으로 작동합니다.
          </p>
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="wide">
          <div className="space-y-14">
            {tree.map((row) => (
              <div key={row.layer}>
                <p className="label-mono text-gold">{row.layer}</p>
                <div
                  className="mt-5 grid gap-px bg-paper-3 border border-paper-3"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(row.nodes.length, 3)}, minmax(0, 1fr))`,
                  }}
                >
                  {row.nodes.map((n) => {
                    const m = membersOf(n.members);
                    return (
                      <div
                        key={n.key}
                        className={
                          "bg-paper p-7 lg:p-9 flex flex-col" +
                          (n.highlight ? " border-l-2 border-gold" : "")
                        }
                      >
                        <div className="flex items-baseline justify-between">
                          <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
                            {n.en}
                          </p>
                          {n.count !== undefined && (
                            <span className="font-mono text-[11px] uppercase tracking-label text-gold">
                              {typeof n.count === "number" ? `${n.count}명` : n.count}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 font-serif-ko text-h2 font-semibold text-ink">
                          {n.title}
                        </h3>
                        <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">
                          {n.desc}
                        </p>

                        {m && (
                          <ul className="mt-5 flex flex-wrap gap-1.5">
                            {m.slice(0, 6).map((l) => (
                              <li key={l.slug}>
                                <Link href={`/people/lawyers/${l.slug}`}>
                                  <Tag variant={l.specialQualifications?.length ? "accent" : "default"}>
                                    {l.nameKo}
                                  </Tag>
                                </Link>
                              </li>
                            ))}
                            {m.length > 6 && (
                              <li>
                                <Tag variant="default">+{m.length - 6}</Tag>
                              </li>
                            )}
                          </ul>
                        )}

                        {n.href && (
                          <Link
                            href={n.href}
                            className="mt-7 inline-flex items-center font-serif-ko text-[14.5px] text-ink font-semibold border-b border-ink pb-1 hover:text-gold-deep hover:border-gold-deep transition-colors self-start"
                          >
                            자세히 →
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-y">
        <Container size="base" className="text-center">
          <Eyebrow>NEXT</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            전공 분야별 변호사 찾기
          </h2>
          <p className="mt-5 mx-auto max-w-xl font-serif-ko text-body-lg text-ink-soft">
            전문분야·직책·특수자격으로 필터링해서 적합한 변호사를 찾아보세요.
          </p>
          <div className="mt-10">
            <Button href="/people/lawyers" variant="primary" size="lg">변호사 디렉터리</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
