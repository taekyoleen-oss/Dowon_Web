"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui";
import { cn } from "@/lib/utils";

type PersonaId = "insurer" | "enterprise" | "medical" | "personal";

const personas: Array<{
  id: PersonaId;
  no: string;
  title: string;
  en: string;
  desc: string;
  href: string;
}> = [
  {
    id: "insurer",
    no: "A",
    title: "보험사·손해사정사",
    en: "For Insurers",
    desc: "자문 계약, SIU 협업, 구상 위임 — 보험사 실무에 특화된 통합 대응.",
    href: "/contact/insurer",
  },
  {
    id: "enterprise",
    no: "B",
    title: "기업 법률자문",
    en: "For Enterprises",
    desc: "산업별 자문 계약, 사고·분쟁·구상 사전 대응.",
    href: "/contact/enterprise",
  },
  {
    id: "medical",
    no: "C",
    title: "의료분쟁 피해자",
    en: "Medical Disputes",
    desc: "의사 자격 변호사가 의무기록 의학적 검토부터 직접 수행합니다.",
    href: "/contact/medical",
  },
  {
    id: "personal",
    no: "D",
    title: "개인 사건의뢰",
    en: "Personal Cases",
    desc: "보험 분쟁·교통사고 — AI와 함께 사건을 정리하고 1차 무료 상담.",
    href: "/contact/personal",
  },
];

export function PersonaGateway() {
  // Persist last-clicked persona to cookie (re-visit prioritization, PRD §3.3)
  const select = (id: PersonaId) => {
    if (typeof document === "undefined") return;
    const maxAge = 60 * 60 * 24 * 90; // 90 days
    document.cookie = `dowon_persona=${id}; path=/; max-age=${maxAge}; samesite=lax`;
  };

  useEffect(() => {
    // no-op: hydration anchor
  }, []);

  return (
    <section className="section-y">
      <Container size="wide">
        <SectionHeader
          index={3}
          eyebrow="PERSONA GATEWAY"
          display="How can we help?"
          heading="어떤 사건으로 오셨나요?"
          lead="4개의 입구를 통해 각 페르소나에 맞춤화된 정보·동선·상담 폼으로 연결합니다."
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-paper-3 border border-paper-3 rounded-md overflow-hidden">
          {personas.map((p) => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => select(p.id)}
              className={cn(
                "group relative bg-paper p-8 lg:p-12",
                "transition-colors duration-base ease-out-curve",
                "hover:bg-paper-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
              )}
            >
              {/* Top gold line on hover */}
              <span
                aria-hidden
                className={cn(
                  "absolute left-8 lg:left-12 top-0 h-[2px] bg-gold w-0",
                  "transition-[width] duration-base ease-out-curve",
                  "group-hover:w-[64px]"
                )}
              />

              <div className="flex items-baseline justify-between">
                <span className="label-mono text-gold">— {p.no}</span>
                <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
                  {p.en}
                </span>
              </div>

              <h3 className="mt-6 font-serif-ko text-h2 font-semibold text-ink">
                {p.title}
              </h3>
              <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base max-w-md">
                {p.desc}
              </p>

              <span className="mt-8 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-label text-ink group-hover:text-gold-deep">
                상담 신청 →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
