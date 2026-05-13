"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui";

/**
 * 4 axes that run in parallel, mirroring the real dowonlaw.com positioning:
 * "조사·자문·민/형사 소송·채권 추심을 동시 진행".
 */
const axes = [
  {
    id: "litigation",
    no: "01",
    label: "송무",
    en: "Litigation",
    desc: "보험·의료·구상·형사 5대 영역의 1심·항소·상고를 단일 변호사단이 일관 수행합니다.",
    detail: [
      "보험금 청구·면책 분쟁",
      "손해배상·합의 절충",
      "형사 동반 사건",
    ],
    href: "/practice",
  },
  {
    id: "medical",
    no: "02",
    label: "의료",
    en: "Medical",
    desc: "의사 자격 변호사가 진료기록 의학적 검토부터 법률 판단까지 한 사람이 수행합니다.",
    detail: [
      "진료기록 분석",
      "보험금 지급 적정성 판단",
      "의료과실 사고 분석",
    ],
    href: "/centers/medical",
  },
  {
    id: "siu",
    no: "03",
    label: "SIU",
    en: "Investigation",
    desc: "수사기관 출신 인력이 사실조사·증거 확보부터 소송 전략까지 직결합니다.",
    detail: [
      "내부자 비리·중대범죄 조사",
      "디지털 포렌식",
      "기업 실사·빅데이터 분석",
    ],
    href: "/centers/investigation",
  },
  {
    id: "recovery",
    no: "04",
    label: "구상",
    en: "Recovery",
    desc: "판결문 확보 이후 구상권 행사·합의 절충·실제 회수까지 동일 팀이 끌어갑니다.",
    detail: [
      "구상권 행사·책임 배분",
      "고액보상 합의 절충",
      "재산조회·강제집행·추심",
    ],
    href: "/people/recovery",
  },
];

export function IntegratedModel() {
  const [active, setActive] = React.useState<string>("litigation");
  const current = axes.find((s) => s.id === active) ?? axes[0];

  return (
    <section className="section-y bg-paper-2">
      <Container size="wide">
        <SectionHeader
          index={2}
          eyebrow="INTEGRATED MODEL · 핵심역량"
          display="Four axes. One team."
          heading="송무 · 의료 · SIU · 구상, 동시 병렬로"
          lead="대부분의 로펌은 ‘소송 전문’에 그칩니다. 도원은 보험·의료·민간조사·구상 분야의 변호사와 전문 인력이 한 팀을 이루어, 같은 사건에 대해 4축이 동시에 움직입니다."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          {/* Axis chips — clearly labeled as parallel, not sequential */}
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute mb-4">
              ↳ 4 axes run in parallel
            </p>
            <ol className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {axes.map((axis) => {
                const isActive = axis.id === active;
                return (
                  <li key={axis.id}>
                    <button
                      type="button"
                      onClick={() => setActive(axis.id)}
                      onMouseEnter={() => setActive(axis.id)}
                      className={cn(
                        "w-full text-left p-5 rounded-md border transition-all duration-base",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                        isActive
                          ? "border-ink bg-paper shadow-paper"
                          : "border-paper-3 bg-transparent hover:border-ink-mute"
                      )}
                      aria-pressed={isActive}
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="label-mono text-gold">{axis.no}</span>
                        <span className="font-mono text-[10px] uppercase tracking-label text-ink-mute">
                          {axis.en}
                        </span>
                      </div>
                      <p className="mt-3 font-serif-ko text-h3 font-semibold text-ink">
                        {axis.label}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* Visual — 4 concurrent rails (replaces the old →→→ flow) */}
            <div
              aria-hidden
              className="mt-8 hidden lg:block rounded-md border border-paper-3 p-5 bg-paper"
            >
              <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute mb-3">
                — A single case, four simultaneous workstreams
              </p>
              <ul className="space-y-2">
                {axes.map((axis) => (
                  <li key={axis.id} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-label text-ink-mute w-12">
                      {axis.label}
                    </span>
                    <span
                      className={cn(
                        "h-1.5 flex-1 rounded-pill bg-paper-3 overflow-hidden",
                        active === axis.id && "bg-paper-2"
                      )}
                    >
                      <span
                        className={cn(
                          "block h-full transition-all duration-slow ease-out-curve",
                          active === axis.id ? "w-full bg-gold" : "w-[35%] bg-gold-deep/40"
                        )}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detail panel */}
          <aside className="lg:col-span-5">
            <div className="bg-paper border border-paper-3 rounded-md p-7 lg:p-8 shadow-1 min-h-[300px]">
              <div className="flex items-baseline gap-3">
                <span className="label-mono text-gold">{current.no}</span>
                <p className="font-serif-ko text-h2 font-semibold text-ink">
                  {current.label}
                </p>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-label text-ink-mute">
                  {current.en}
                </span>
              </div>
              <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">
                {current.desc}
              </p>
              <ul className="mt-6 space-y-2.5">
                {current.detail.map((d) => (
                  <li
                    key={d}
                    className="flex gap-3 font-serif-ko text-[15px] text-ink-soft leading-base"
                  >
                    <span aria-hidden className="mt-2.5 h-px w-3 bg-gold shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={current.href}
                className="mt-7 inline-flex items-center gap-1.5 font-serif-ko text-[14.5px] text-ink font-semibold border-b border-ink pb-1 hover:text-gold-deep hover:border-gold-deep transition-colors"
              >
                자세히 보기 →
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
