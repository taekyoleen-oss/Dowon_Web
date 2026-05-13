/**
 * Library content — case briefs, columns, media.
 * PLACEHOLDER data for scaffolding. Real content flows through CMS / migration.
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
  {
    slug: "auto-uninsured-2025",
    type: "case",
    title: "무보험차상해 약관조항의 면책 효력",
    caseNumber: "대법원 2025다XXXXX",
    practiceAreas: ["auto"],
    excerpt: "약관 면책조항의 명시·설명 의무 이행 여부가 쟁점이 된 사건.",
    issue: "보험사가 무보험차상해 약관 면책조항을 보험계약 체결 시 충분히 설명하지 않았다고 인정될 경우, 해당 면책조항을 보험자가 원용할 수 있는지.",
    conclusion: "원고 일부 승소. 약관 설명의무 미이행 시 보험자 면책 주장 제한.",
    insight: "보험사 입장에서는 약관 교부·설명 의무 이행을 입증할 자료(서명, 녹취, 안내문 등)를 사전 확보하는 것이 결정적임.",
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
    issue: "공동불법행위자 중 한 명이 보험금으로 합의금을 지급한 경우, 나머지 가해자에 대한 구상권 행사의 범위와 한계.",
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
    issue: "조직검사 결과지의 작성 시점과 의사의 최종 진단 시점이 다를 때, 보험약관상 '진단 확정' 시점.",
    conclusion: "피보험자 승. 의학적 진단 확정 시점을 기준으로 보험금 지급.",
    insight: "암보험은 조직검사 결과지와 임상의 진단서가 모두 확보되어야 함.",
    lawyerSlugs: ["lim-woong-chan", "yoon-eun-hee"],
    publishedAt: "2025-08-05",
  },
  {
    slug: "medical-records-evidence",
    type: "column",
    title: "의무기록 사본의 증거능력과 위·변조 검증",
    practiceAreas: ["medical"],
    excerpt: "의무기록 사본으로 증명력을 다투는 방법, 그리고 의사 자격 변호사의 역할.",
    authorSlug: "yoon-eun-hee",
    publishedAt: "2025-10-30",
  },
  {
    slug: "policy-disclosure-duty",
    type: "column",
    title: "약관 교부·설명의무, 어디까지가 의무인가",
    practiceAreas: ["auto", "long-term", "life"],
    excerpt: "최근 판례 동향을 통해 본 보험사의 약관 설명의무 이행 기준.",
    authorSlug: "hong-myung-ho",
    publishedAt: "2025-10-12",
  },
  {
    slug: "siu-collaboration-best-practice",
    type: "column",
    title: "보험사 SIU와 외부 조사 라인의 협업",
    practiceAreas: ["investigation", "advisory"],
    excerpt: "내부 SIU 부서와 외부 민간조사센터의 협업이 만들어내는 객관성 — 보험사 자문의 시각에서.",
    authorSlug: "hong-myung-ho",
    publishedAt: "2025-07-18",
  },
  {
    slug: "subrogation-fault-allocation",
    type: "column",
    title: "공동불법행위 책임 분담의 실무",
    practiceAreas: ["subrogation"],
    excerpt: "다수 가해자가 있는 사건에서 책임 비율을 정하는 도원의 접근법.",
    authorSlug: "bang-jeong-sook",
    publishedAt: "2025-06-04",
  },
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
