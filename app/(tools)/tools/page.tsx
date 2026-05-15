import Link from "next/link";
import {
  ArrowRight,
  FileText,
  MessagesSquare,
  Compass,
  ShieldCheck,
  Calculator,
  FileSearch,
  Search,
  Scale,
  Building2,
  User,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "AI 도구 — 도원 법무법인",
  description:
    "도원의 AI 도구는 변호사 상담을 더 빠르고 정확하게 만들기 위한 사전 정리 도우미입니다. 사건 정보 정리, 사건 유형 진단, 문서 풀이, 보험금 검토, 영문 계약서 1차 검토 등 8개 도구를 제공합니다.",
};

type ToolCategory = "individual" | "business" | "common";

type Tool = {
  slug: string;
  href: string;
  icon: LucideIcon;
  name: string;
  en: string;
  tagline: string;
  audience: string;
  whenToUse: string;
  output: string[];
  category: ToolCategory;
  badge?: "신규" | "B2B" | "로그인";
};

const tools: Tool[] = [
  {
    slug: "intake",
    href: "/tools/intake",
    icon: MessagesSquare,
    name: "사건 정보 정리",
    en: "Case Intake",
    tagline: "상담 전, AI와 함께 사건 정보를 차근차근 정리합니다.",
    audience: "처음 변호사 상담을 준비하는 개인 의뢰인",
    whenToUse:
      "사건을 어떻게 설명해야 할지 막막할 때 · 상담 시간을 효율적으로 쓰고 싶을 때",
    output: ["사건 요약 (의뢰인 확인 후 도원 전달)", "필요한 자료 체크리스트", "추천 변호사 안내"],
    category: "individual",
  },
  {
    slug: "triage",
    href: "/tools/triage",
    icon: Compass,
    name: "사건 유형 진단",
    en: "Case Triage",
    tagline: "내 상황이 어떤 사건 유형인지, 어떤 절차를 거치는지 안내합니다.",
    audience: "절차를 처음 접하는 개인 의뢰인",
    whenToUse:
      "내 상황이 보험 분쟁인지, 의료 분쟁인지 모를 때 · 어떤 변호사를 만나야 할지 가늠하고 싶을 때",
    output: ["사건 유형 분류", "예상 절차·기간", "필요한 자료", "적합한 변호사 분야"],
    category: "individual",
  },
  {
    slug: "document-translator",
    href: "/tools/document-translator",
    icon: FileText,
    name: "문서 쉬운 말 풀이",
    en: "Plain Korean Translator",
    tagline: "받으신 법률 문서를 3줄 요약과 일상어로 풀어 드립니다.",
    audience: "법원·상대방·보험사로부터 문서를 받은 개인 의뢰인",
    whenToUse:
      "소장·답변서·결정문·합의서가 무슨 뜻인지 모를 때 · 회신 기한을 놓치지 않도록 일정 정리가 필요할 때",
    output: ["3줄 요약", "법률 용어 풀이", "해야 할 일 목록", "캘린더 (.ics) 다운로드"],
    category: "individual",
  },
  {
    slug: "coverage-check",
    href: "/tools/coverage-check",
    icon: ShieldCheck,
    name: "보험금 가능성 셀프체크",
    en: "Coverage Check",
    tagline: "약관과 사고 정보를 입력하면 보장 가능성과 면책 사유를 안내합니다.",
    audience: "보험금 청구를 준비하는 가입자",
    whenToUse:
      "사고·질병이 약관 보장 대상인지 확인하고 싶을 때 · 보험사 거절 후 다툼 여지가 있는지 가늠할 때",
    output: ["약관-사고 매칭 결과", "보장·면책 검토", "관련 판례 안내"],
    category: "individual",
  },
  {
    slug: "contract-review",
    href: "/tools/contract-review",
    icon: Scale,
    name: "영문 계약서 1차 검토",
    en: "EN Contract Review",
    tagline: "수백 페이지 영문 계약서를 통째로 분석해 위험 조항을 가려냅니다.",
    audience: "B2B 기업 고객 (해외 거래·M&A·라이선스·합작 담당)",
    whenToUse:
      "정식 자문 의뢰 전, 어떤 조항이 문제일지 미리 알고 싶을 때 · SPA·JV·License·NDA를 빠르게 스크리닝할 때",
    output: [
      "양 당사자 의무 요약 (한·영 병기)",
      "위험 조항 플래깅 (준거법·관할·손해배상 한도·일방 해지권 등)",
      "한국법 관점 검토 포인트",
      "변호사 검토 필수 항목",
    ],
    category: "business",
    badge: "신규",
  },
  {
    slug: "subrogation-check",
    href: "/tools/subrogation-check",
    icon: Calculator,
    name: "구상 가능성 자가진단",
    en: "Subrogation Check",
    tagline: "사고 정보를 입력하면 구상 가능성과 예상 회수율을 안내합니다.",
    audience: "보험사·손해사정 법인 실무진",
    whenToUse: "구상 위임 여부를 빠르게 판단할 때 · 구상권 행사 시점·우선순위를 가늠할 때",
    output: ["구상 가능성 등급", "예상 회수율", "권장 액션 (위임·자체 처리·포기)"],
    category: "business",
  },
  {
    slug: "policy-reader",
    href: "/tools/policy-reader",
    icon: FileSearch,
    name: "약관 분석",
    en: "Policy Reader",
    tagline: "약관·증권 PDF에서 보장 항목과 면책 사유를 구조화 추출합니다.",
    audience: "보험사 내부 사용자 (인증 필요)",
    whenToUse: "약관 비교 분석 · 면책 사유 일관성 검토",
    output: ["보장 항목 구조화", "면책 사유 추출", "특약별 요약"],
    category: "business",
    badge: "로그인",
  },
  {
    slug: "library-search",
    href: "/library/search",
    icon: Search,
    name: "AI 의미 검색",
    en: "Semantic Library Search",
    tagline: "자연어 질문 하나로 도원 라이브러리와 국가법령정보를 함께 검색합니다.",
    audience: "모든 방문자",
    whenToUse: "특정 쟁점에 대한 도원의 시각이 궁금할 때 · 관련 법령 조문을 빠르게 찾을 때",
    output: ["관련 칼럼·판례·강의", "관련 법령 조문", "AI 재순위 매김"],
    category: "common",
  },
];

const categoryLabels: Record<ToolCategory, { label: string; en: string; icon: LucideIcon; desc: string }> = {
  individual: {
    label: "개인 의뢰인용",
    en: "For Individuals",
    icon: User,
    desc: "처음 변호사를 만나기 전, 사건을 정리하고 받으신 문서를 이해하는 데 도움이 되는 도구들입니다.",
  },
  business: {
    label: "보험사·기업 자문용",
    en: "For Business · B2B",
    icon: Briefcase,
    desc: "보험사·손해사정·기업 실무자가 정식 의뢰 전에 빠르게 1차 판단을 내리도록 돕는 도구들입니다.",
  },
  common: {
    label: "공통 도구",
    en: "Common",
    icon: Building2,
    desc: "방문자 누구나 사용할 수 있는 검색·자료 도구입니다.",
  },
};

const grouped: Record<ToolCategory, Tool[]> = {
  individual: tools.filter((t) => t.category === "individual"),
  business: tools.filter((t) => t.category === "business"),
  common: tools.filter((t) => t.category === "common"),
};

export default function ToolsHubPage() {
  return (
    <>
      {/* HERO */}
      <section className="section-y">
        <Container size="wide">
          <Eyebrow index={1}>AI · TOOLS</Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            AI Tools
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-ink">도원의 AI 도우미</p>
          <p className="mt-8 max-w-[44em] font-serif-ko text-body-lg text-ink-soft leading-base">
            도원의 AI 도구는 <strong className="text-ink">변호사 상담을 대체하지 않습니다.</strong> 변호사를 만나기
            전에 사건을 더 빨리, 더 정확하게 정리할 수 있도록 돕는{" "}
            <em>사전 정리 도우미</em>입니다. 개인 의뢰인에게는 막막함을 덜고, 보험사·기업에는 1차 스크리닝
            시간을 줄여 드립니다.
          </p>

          {/* How to choose — 처음 방문자를 위한 빠른 가이드 */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3 max-w-4xl">
            <HowToCard
              step="01"
              title="목적을 고르세요"
              body="개인 사건 정리 · 받은 문서 풀이 · 보험금 검토 · 영문 계약 스크리닝 — 카테고리로 정리되어 있습니다."
            />
            <HowToCard
              step="02"
              title="카드를 확인하세요"
              body="각 도구 카드에 누구를 위한 도구인지, 무엇을 얻을 수 있는지 적혀 있습니다."
            />
            <HowToCard
              step="03"
              title="바로 시작"
              body="원하는 도구의 「시작하기」를 누르면 바로 사용할 수 있습니다. 회원가입은 필요 없습니다."
            />
          </div>

          <p className="mt-10 font-mono text-[11px] uppercase tracking-label text-ink-mute">
            * 모든 결과는 일반 정보이며 법률 자문이 아닙니다. 실제 사건은 변호사 상담을 통해 진행해 주세요.
          </p>
        </Container>
      </section>

      {/* CATEGORY SECTIONS */}
      {(["individual", "business", "common"] as ToolCategory[]).map((cat, idx) => {
        const meta = categoryLabels[cat];
        const Icon = meta.icon;
        const list = grouped[cat];
        if (list.length === 0) return null;
        return (
          <section
            key={cat}
            className={cn("section-y", idx % 2 === 0 ? "bg-paper-2" : "")}
          >
            <Container size="wide">
              <div className="flex items-baseline justify-between gap-6 border-b border-paper-3 pb-4">
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-gold-deep" aria-hidden />
                  <div>
                    <span className="label-mono text-gold">{String(idx + 1).padStart(2, "0")}</span>
                    <h2 className="mt-1 font-serif-ko text-h2 font-semibold text-ink">
                      {meta.label}
                    </h2>
                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                      {meta.en}
                    </p>
                  </div>
                </div>
                <p className="font-display italic text-[clamp(28px,3.5vw,40px)] text-ink leading-none">
                  {list.length}
                  <span className="ml-1 font-serif-ko text-h3 text-ink-soft not-italic">개</span>
                </p>
              </div>

              <p className="mt-4 max-w-[42em] font-serif-ko text-body text-ink-soft leading-base">
                {meta.desc}
              </p>

              <ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {list.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </ul>
            </Container>
          </section>
        );
      })}

      {/* CTA */}
      <section className="section-y">
        <Container size="base" className="text-center">
          <Eyebrow>NEXT</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            도구로 정리한 뒤, 변호사와 만나세요
          </h2>
          <p className="mt-5 mx-auto max-w-xl font-serif-ko text-body-lg text-ink-soft">
            AI 도구로 정리된 결과는 정식 상담에서 그대로 활용됩니다. 더 짧은 상담, 더 정확한 답변.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/contact/personal" variant="primary" size="lg">
              개인 상담 신청
            </Button>
            <Button href="/contact/insurer" variant="secondary" size="lg">
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

function HowToCard({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-md border border-paper-3 bg-paper p-5">
      <p className="font-mono text-[11px] uppercase tracking-label text-gold-deep">
        STEP {step}
      </p>
      <h3 className="mt-2 font-serif-ko text-[16px] font-semibold text-ink leading-snug">
        {title}
      </h3>
      <p className="mt-2 font-serif-ko text-[13.5px] text-ink-soft leading-base">
        {body}
      </p>
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <li className="group">
      <Link
        href={tool.href}
        className={cn(
          "relative block h-full rounded-md border border-paper-3 bg-paper",
          "p-6 lg:p-7",
          "transition-all duration-base ease-out-curve",
          "hover:border-ink hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        )}
      >
        <span
          aria-hidden
          className="absolute left-6 lg:left-7 top-0 h-[2px] w-[30px] bg-gold"
        />

        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex items-center justify-center h-11 w-11 rounded-sm bg-paper-2 text-gold-deep group-hover:bg-gold-deep group-hover:text-paper transition-colors">
            <Icon size={20} aria-hidden />
          </div>
          {tool.badge && (
            <span
              className={cn(
                "shrink-0 inline-flex items-center px-2 py-0.5 rounded-sm",
                "font-mono text-[10px] uppercase tracking-label",
                tool.badge === "신규"
                  ? "bg-gold-deep text-paper"
                  : tool.badge === "B2B"
                    ? "bg-ink text-paper"
                    : "border border-paper-3 text-ink-mute"
              )}
            >
              {tool.badge}
            </span>
          )}
        </div>

        <h3 className="mt-5 font-serif-ko text-[19px] font-semibold text-ink leading-snug">
          {tool.name}
        </h3>
        <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
          {tool.en}
        </p>

        <p className="mt-4 font-serif-ko text-[14.5px] text-ink-soft leading-base">
          {tool.tagline}
        </p>

        <dl className="mt-5 space-y-3 border-t border-paper-3 pt-4">
          <div>
            <dt className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
              누구를 위해
            </dt>
            <dd className="mt-1 font-serif-ko text-[13.5px] text-ink leading-base">
              {tool.audience}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
              이럴 때
            </dt>
            <dd className="mt-1 font-serif-ko text-[13.5px] text-ink-soft leading-base">
              {tool.whenToUse}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
              결과물
            </dt>
            <dd className="mt-1">
              <ul className="space-y-1">
                {tool.output.map((o, i) => (
                  <li
                    key={i}
                    className="font-serif-ko text-[13.5px] text-ink-soft leading-base"
                  >
                    <span className="text-gold-deep mr-1.5">·</span>
                    {o}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <span
          className={cn(
            "mt-6 inline-flex items-center gap-1.5",
            "font-sans-ko text-[13.5px] font-medium",
            "text-gold-deep group-hover:text-ink transition-colors"
          )}
        >
          시작하기
          <ArrowRight
            size={14}
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </Link>
    </li>
  );
}
