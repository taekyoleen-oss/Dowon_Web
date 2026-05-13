/**
 * Library content — case briefs, columns, media.
 *
 * Column titles below are taken verbatim from the real dowonlaw.com
 * 칼럼 게시판 (dowonlaw.com/inform/data/list/). Case briefs are still
 * scaffolded placeholders; replace with real case_numbers + content as
 * Dowon publishes them through the admin CMS.
 */

import type { PracticeAreaCode } from "./lawyers";

export type LibraryItemType = "case" | "column" | "media";

export type LibraryItem = {
  slug: string;
  type: LibraryItemType;
  title: string;
  practiceAreas: PracticeAreaCode[];
  caseNumber?: string;
  excerpt: string;
  issue?: string;
  conclusion?: string;
  insight?: string;
  authorSlug?: string;       // for columns
  lawyerSlugs?: string[];    // for cases
  publishedAt: string;       // YYYY-MM-DD
  source?: string;           // for media (강의·세미나)
};

export const libraryItems: LibraryItem[] = [
  // ─── Case briefs (placeholder until CMS) ──────────────────────────
  {
    slug: "auto-uninsured-2025",
    type: "case",
    title: "무보험차상해 약관조항의 면책 효력",
    caseNumber: "대법원 2025다XXXXX",
    practiceAreas: ["auto"],
    excerpt: "약관 면책조항의 명시·설명 의무 이행 여부가 쟁점이 된 사건.",
    issue:
      "보험사가 무보험차상해 약관 면책조항을 보험계약 체결 시 충분히 설명하지 않았다고 인정될 경우, 해당 면책조항을 보험자가 원용할 수 있는지.",
    conclusion: "원고 일부 승소. 약관 설명의무 미이행 시 보험자 면책 주장 제한.",
    insight:
      "보험사 입장에서는 약관 교부·설명 의무 이행을 입증할 자료(서명, 녹취, 안내문 등)를 사전 확보하는 것이 결정적임.",
    lawyerSlugs: ["hong-myung-ho"],
    publishedAt: "2025-11-14",
  },
  {
    slug: "subrogation-traffic-settlement",
    type: "case",
    title: "교통사고 합의금 지급 후 공동불법행위자에 대한 구상권",
    caseNumber: "서울중앙지법 2025가합XXXXX",
    practiceAreas: ["subrogation", "auto"],
    excerpt: "피해자와 일괄 합의를 마친 보험사가, 사후에 다른 가해자에게 구상권을 행사할 수 있는지.",
    issue:
      "공동불법행위자 중 한 명이 보험금으로 합의금을 지급한 경우, 나머지 가해자에 대한 구상권 행사의 범위와 한계.",
    conclusion: "구상권 행사 인정. 부담 비율은 사고 기여도에 따라 결정.",
    insight: "합의서 작성 단계부터 다른 가해자에 대한 구상권 유보 조항을 명기하는 것이 안전.",
    lawyerSlugs: ["bang-jeong-sook"],
    publishedAt: "2025-09-22",
  },
  {
    slug: "long-term-cancer-diagnosis",
    type: "case",
    title: "암 진단 확정 시점과 보험금 지급",
    caseNumber: "○○지법 2025가단XXXXX",
    practiceAreas: ["long-term"],
    excerpt: "암 진단 확정 시점을 놓고 보험사와 피보험자 간 다툼이 있었던 사건.",
    issue:
      "조직검사 결과지의 작성 시점과 의사의 최종 진단 시점이 다를 때, 보험약관상 '진단 확정' 시점.",
    conclusion: "피보험자 승. 의학적 진단 확정 시점을 기준으로 보험금 지급.",
    insight: "암보험은 조직검사 결과지와 임상의 진단서가 모두 확보되어야 함.",
    lawyerSlugs: ["lim-woong-chan", "yoon-eun-hee"],
    publishedAt: "2025-08-05",
  },

  // ─── Columns — verbatim titles from dowonlaw.com/inform/data/list/ ─
  {
    slug: "law-spirit-management",
    type: "column",
    title: "법의 정신 그리고 경영자의 관심",
    practiceAreas: ["advisory"],
    excerpt:
      "경영자가 법의 기본 정신을 어떻게 의사결정에 반영해야 하는지에 대한 도원 대표변호사의 칼럼.",
    authorSlug: "hong-myung-ho",
    publishedAt: "2023-02-02",
  },
  {
    slug: "autonomous-vehicle-regulation",
    type: "column",
    title: "자율주행 자동차 관련 규정정비 시급하다",
    practiceAreas: ["auto", "advisory"],
    excerpt:
      "자율주행차 상용화 단계에서의 사고 책임·보험·인허가 규제 정비 필요성에 관한 칼럼.",
    authorSlug: "hong-myung-ho",
    publishedAt: "2023-01-16",
  },
  {
    slug: "hospital-or-lodging",
    type: "column",
    title: "병원인가, 숙박시설인가?",
    practiceAreas: ["medical", "long-term"],
    excerpt:
      "장기 입원·보험금 청구에서 ‘병원성 입원’ 판단 기준을 둘러싼 쟁점을 분석한 칼럼.",
    authorSlug: "yoon-eun-hee",
    publishedAt: "2023-01-01",
  },
  {
    slug: "traffic-accident-oriental-clinic",
    type: "column",
    title: "교통사고 나면 한방병원이라는 생각은 그만",
    practiceAreas: ["auto", "long-term"],
    excerpt:
      "교통사고 후 한방진료에 집중되는 진료 패턴과 보험금 청구 구조에 대한 비판적 검토.",
    authorSlug: "hong-myung-ho",
    publishedAt: "2022-12-18",
  },
  {
    slug: "severe-accident-punishment-law",
    type: "column",
    title: "중대재해처벌법의 목적과 실효성 논쟁",
    practiceAreas: ["advisory", "criminal"],
    excerpt:
      "중대재해처벌법 시행 이후 논쟁이 된 입법 취지·기업 운영상 책임·실효성에 관한 분석.",
    authorSlug: "hong-myung-ho",
    publishedAt: "2022-12-04",
  },
  {
    slug: "electric-kickboard-insurance",
    type: "column",
    title: "전동 킥보드 책임보험 의무가입 법제화 필요",
    practiceAreas: ["auto", "advisory"],
    excerpt:
      "전동 킥보드 사고 급증과 피해자 보호를 위한 책임보험 의무가입 법제화의 필요성.",
    authorSlug: "hong-myung-ho",
    publishedAt: "2022-11-06",
  },
  {
    slug: "fraud-psychology-prevention",
    type: "column",
    title: "사기꾼의 심리와 보험범죄의 근절",
    practiceAreas: ["investigation", "criminal"],
    excerpt:
      "보험범죄 가해자의 심리적 패턴과, 도원 민간조사센터가 보는 사기 적발 실무.",
    authorSlug: "hong-myung-ho",
    publishedAt: "2022-10-23",
  },
  {
    slug: "golf-course-consumer-rights",
    type: "column",
    title: "골프장의 소비자 무시 횡포 근절돼야",
    practiceAreas: ["advisory"],
    excerpt:
      "회원제 골프장의 운영 관행이 소비자 권익을 침해하는 사례와 법적 대응 방안.",
    authorSlug: "jung-aerina",
    publishedAt: "2022-10-03",
  },
  {
    slug: "oriental-medicine-fee-standard",
    type: "column",
    title: "한방 진료수가의 표준화가 시급하다",
    practiceAreas: ["medical", "long-term"],
    excerpt:
      "한방 진료수가 산정 체계의 비표준성이 보험금 분쟁을 키우는 구조적 원인.",
    authorSlug: "yoon-eun-hee",
    publishedAt: "2022-08-28",
  },
  {
    slug: "golf-membership-reservation",
    type: "column",
    title: "회원제 골프장의 예약보장과 미이행시 법적책임",
    practiceAreas: ["advisory"],
    excerpt:
      "예약 보장 약관과 실제 운영의 괴리에서 발생하는 손해배상 책임 구조를 정리.",
    authorSlug: "jung-aerina",
    publishedAt: "2022-08-24",
  },

  // ─── Media ────────────────────────────────────────────────────────
  {
    slug: "kbla-symposium-2025",
    type: "media",
    title: "한국손해사정사회 심포지엄 — 약관 해석의 최근 동향",
    practiceAreas: ["auto", "long-term"],
    excerpt: "대표변호사 홍명호의 손해사정사 심포지엄 강의.",
    source: "2025 한국손해사정사회 심포지엄",
    publishedAt: "2025-05-20",
  },
  {
    slug: "insurer-advisory-webinar",
    type: "media",
    title: "보험사 자문 — 통합 모델의 실무 (웨비나)",
    practiceAreas: ["advisory"],
    excerpt: "보험사 실무진 대상 비공개 웨비나 다이제스트.",
    source: "도원 자문 웨비나 시리즈",
    publishedAt: "2025-04-10",
  },
];

export function getLibraryItemBySlug(slug: string) {
  return libraryItems.find((i) => i.slug === slug);
}
