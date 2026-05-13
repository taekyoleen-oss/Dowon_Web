"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui";

const stages = [
  {
    id: "investigate",
    no: "01",
    label: "조사",
    en: "Investigate",
    desc: "민간조사센터의 전직 수사관·조사관 인력이 사고 경위, 위장·보험사기, 인적사항을 추적합니다.",
    detail: [
      "보험사기 의심 사건 1차 조사",
      "위장사고·자해사고 정황 정밀 분석",
      "행방·재산 추적 (구상 사전 단계)",
    ],
    href: "/centers/investigation",
  },
  {
    id: "litigate",
    no: "02",
    label: "소송",
    en: "Litigate",
    desc: "조사 결과를 그대로 소송에 연결합니다. 별도 외주 없이 한 팀이 일관된 전략으로 끌어갑니다.",
    detail: [
      "보험 분쟁 5대 영역 직접 수행",
      "의료분쟁: 의사 자격 변호사 동시 검토",
      "1심·항소·상고 단일 팀 유지",
    ],
    href: "/practice",
  },
  {
    id: "subrogate",
    no: "03",
    label: "구상",
    en: "Subrogate",
    desc: "판결 이후 구상권 확보·고액보상 합의·절충까지, 동일 팀이 책임 범위를 확장합니다.",
    detail: [
      "구상 가능성 사전 진단",
      "합의 절충 (피해자/가해자 양측)",
      "기성 판결 기반 구상 회수",
    ],
    href: "/practice/subrogation",
  },
  {
    id: "recover",
    no: "04",
    label: "추심",
    en: "Recover",
    desc: "도원 채권회수팀이 실제 금전 회수까지 마무리합니다. 판결문이 곧 회수는 아닙니다.",
    detail: [
      "재산조회·은닉재산 추적",
      "강제집행·압류·추심 명령",
      "회수 진행 상황 의뢰인 리포트",
    ],
    href: "/people/recovery",
  },
];

export function IntegratedModel() {
  const [active, setActive] = React.useState<string>("investigate");
  const current = stages.find((s) => s.id === active) ?? stages[0];

  return (
    <section className="section-y bg-paper-2">
      <Container size="wide">
        <SectionHeader
          index={2}
          eyebrow="INTEGRATED MODEL"
          display="One Team. End to End."
          heading="조사부터 추심까지, 도원 한 팀에서"
          lead="대부분의 로펌은 ‘소송 전문’에 그칩니다. 도원은 부설 민간조사·의료지원센터와 채권회수팀까지 보유합니다. 외주 4곳을 거치는 동안 잃는 시간과 정보가 없습니다."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          {/* Stage rail */}
          <div className="lg:col-span-7">
            <ol className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {stages.map((stage, i) => {
                const isActive = stage.id === active;
                return (
                  <li key={stage.id}>
                    <button
                      type="button"
                      onClick={() => setActive(stage.id)}
                      onMouseEnter={() => setActive(stage.id)}
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
                        <span className="label-mono text-gold">{stage.no}</span>
                        <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
                          {stage.en}
                        </span>
                      </div>
                      <p className="mt-3 font-serif-ko text-h3 font-semibold text-ink">
                        {stage.label}
                      </p>
                      {/* connector arrow */}
                      {i < stages.length - 1 && (
                        <span
                          aria-hidden
                          className="hidden md:block absolute"
                          style={{ pointerEvents: "none" }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Detail panel */}
          <aside className="lg:col-span-5">
            <div className="bg-paper border border-paper-3 rounded-md p-7 lg:p-8 shadow-1 min-h-[300px]">
              <div className="flex items-baseline gap-3">
                <span className="label-mono text-gold">{current.no}</span>
                <p className="font-serif-ko text-h2 font-semibold text-ink">
                  {current.label}
                </p>
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
