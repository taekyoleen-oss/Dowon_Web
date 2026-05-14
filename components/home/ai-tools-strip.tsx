import Link from "next/link";
import { Sparkles, MessageSquare, ShieldCheck, Calculator } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";

const tools = [
  {
    href: "/tools/coverage-check",
    icon: ShieldCheck,
    title: "보험금 가능성 셀프체크",
    desc: "약관 + 사고 정보를 입력하면 약관 매칭 + 보장·면책 검토 + 관련 판례를 안내합니다.",
    audience: "개인 의뢰자",
    badge: "NEW",
  },
  {
    href: "/tools/intake",
    icon: MessageSquare,
    title: "AI 사건 정보 정리",
    desc: "AI 챗봇이 차례차례 질문해 사건 정보를 정리하고 변호사에게 정확히 전달합니다.",
    audience: "개인 의뢰자",
  },
  {
    href: "/tools/triage",
    icon: Sparkles,
    title: "사건 유형 진단",
    desc: "자연어로 상황을 설명하면 사건 유형 분류 + 적합 변호사를 안내합니다.",
    audience: "전 페르소나",
  },
  {
    href: "/tools/subrogation-check",
    icon: Calculator,
    title: "구상 가능성 진단",
    desc: "사고·당사자·손해 정보를 입력하면 구상 가능성과 회수율을 안내합니다.",
    audience: "보험사 실무",
  },
];

export function AiToolsStrip() {
  return (
    <section className="section-y bg-night text-paper">
      <Container size="wide">
        <Eyebrow tone="paper">AI TOOLS · 무료로 먼저 확인</Eyebrow>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-display italic text-[clamp(36px,5vw,56px)] text-paper leading-tight max-w-2xl">
            Try AI before you call.
          </h2>
          <p className="font-serif-ko text-body-lg text-paper-3 max-w-md leading-base">
            상담 신청 전, AI 도구로 먼저 사건의 윤곽을 잡으실 수 있습니다.
            모든 도구는 일반 정보 안내이며 법률 자문은 아닙니다.
          </p>
        </div>

        <ul className="mt-12 grid gap-px bg-night-2 border border-night-2 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <li key={t.href} className="bg-night">
                <Link
                  href={t.href}
                  className="block p-7 lg:p-8 group h-full hover:bg-night-2 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <Icon size={22} className="text-gold-bright" aria-hidden />
                    {t.badge && (
                      <span className="font-mono text-[10px] uppercase tracking-label text-gold-bright border border-gold-bright px-2 py-0.5 rounded-pill">
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-6 font-serif-ko text-h3 font-semibold text-paper group-hover:text-gold-bright transition-colors">
                    {t.title}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-label text-paper-3">
                    For · {t.audience}
                  </p>
                  <p className="mt-5 font-serif-ko text-[14.5px] text-paper-3 leading-base">
                    {t.desc}
                  </p>
                  <span className="mt-7 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-label text-gold-bright">
                    시작하기 →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
