/**
 * Practice areas — content source for /practice/* pages.
 * Mirrors PRD §3.1 / §5 / Appendix A.
 */

export type PracticeAreaSlug =
  | "insurance"
  | "insurance/auto"
  | "insurance/long-term"
  | "insurance/fire"
  | "insurance/liability"
  | "insurance/life"
  | "medical"
  | "advisory"
  | "investigation"
  | "subrogation";

export type PracticeArea = {
  slug: PracticeAreaSlug;
  eyebrow: string;       // EN label, mono
  displayEn: string;     // big italic
  nameKo: string;        // h1 KR heading
  lead: string;          // hero lead
  what: string[];        // bullet list — 무엇을 다루는가
  who: string;           // who handles
  process: string[];     // 도원의 진행 절차
  cases: Array<{ issue: string; result: string }>;
  related: { lawyers?: string[]; columns?: string[] };
  cta: {
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
  parent?: PracticeAreaSlug;
};

export const practiceAreas: Record<PracticeAreaSlug, PracticeArea> = {
  insurance: {
    slug: "insurance",
    eyebrow: "INSURANCE",
    displayEn: "Insurance Disputes",
    nameKo: "손해보험·생명보험",
    lead: "자동차·장기·화재·배상책임·생명 5개 영역을 한 팀에서 통합 대응합니다. 보험사 자문과 피보험자 분쟁 모두 처리합니다.",
    what: [
      "보험금 청구·면책 분쟁",
      "약관 해석 — 교부·설명 의무, 면책 조항",
      "보험사 자문계약 (SIU 협업 포함)",
      "보험사기 의심 사건 1차 조사 (민간조사센터 연계)",
    ],
    who: "보험 분쟁 전담 변호사단 + 민간조사센터 + 의료분쟁지원센터",
    process: [
      "사건 접수·약관·청구 자료 확보",
      "쟁점 분석 — 약관 해석, 입증 책임 배분",
      "필요 시 민간조사센터 1차 조사",
      "조정·소송·합의 단계 진행",
      "판결 후 구상·추심 단계 연계",
    ],
    cases: [
      { issue: "장기보험 면책 조항 효력", result: "약관 설명의무 위반 인정으로 보험금 인용" },
      { issue: "자동차보험 무보험차상해 약관", result: "원고 일부 승소 — 약관 교부의무 강화 시사" },
    ],
    related: { lawyers: ["홍명호", "방정숙", "임웅찬"] },
    cta: {
      primary: { label: "보험사 자문 상담", href: "/contact/insurer" },
      secondary: { label: "개인 사건 상담", href: "/contact/personal" },
    },
  },

  "insurance/auto": {
    slug: "insurance/auto",
    parent: "insurance",
    eyebrow: "AUTO INSURANCE",
    displayEn: "Auto Insurance",
    nameKo: "자동차보험",
    lead: "교통사고와 자동차보험 분쟁 전반. 무보험차·미보상·과실 비율·후유장해까지.",
    what: [
      "보험금 청구 거절·일부 지급 분쟁",
      "무보험차상해·자기신체사고",
      "과실 비율·합의금 절충",
      "후유장해 등급 분쟁",
    ],
    who: "자동차보험 분쟁 전담 변호사단",
    process: [
      "사고 경위·진단서·과실 분석",
      "약관 면책 조항 검토",
      "조정·소송 결정",
      "판결 후 가해자 구상 단계 연계",
    ],
    cases: [
      { issue: "무보험차상해 약관 면책 효력", result: "약관 설명의무 미이행 입증으로 보험금 인용" },
    ],
    related: { lawyers: ["홍명호"] },
    cta: {
      primary: { label: "상담 신청", href: "/contact/personal" },
    },
  },

  "insurance/long-term": {
    slug: "insurance/long-term",
    parent: "insurance",
    eyebrow: "LONG-TERM",
    displayEn: "Long-term Insurance",
    nameKo: "장기보험",
    lead: "암·실손·후유장해 등 장기보험 분쟁. 진단·치료 기록의 의학적 해석이 핵심입니다.",
    what: [
      "암보험 진단 확정 분쟁",
      "실손보험금 청구 거절",
      "후유장해 등급·기간 분쟁",
      "고지의무 위반 면책 다툼",
    ],
    who: "장기보험 전담 변호사단 + 의료분쟁지원센터",
    process: [
      "진단·치료 기록 의학적 검토 (의사 자격 변호사 동시 참여)",
      "약관·고지의무 검토",
      "조정·소송 단계 진행",
    ],
    cases: [
      { issue: "암 진단 확정 시점 다툼", result: "보험금 지급 인용 (의학적 진단 시점 입증)" },
    ],
    related: { lawyers: ["윤은희", "임웅찬"] },
    cta: { primary: { label: "상담 신청", href: "/contact/personal" } },
  },

  "insurance/fire": {
    slug: "insurance/fire",
    parent: "insurance",
    eyebrow: "FIRE",
    displayEn: "Fire Insurance",
    nameKo: "화재보험",
    lead: "화재로 인한 재산·영업·인적 손해 보상 분쟁. 화재 원인 감정과 손해액 산정이 쟁점입니다.",
    what: [
      "화재 원인 감정 분쟁",
      "고의·중과실 면책 다툼",
      "영업 중단 손해 산정",
      "공동 가입자 간 책임 분담",
    ],
    who: "재산 손해 전담 변호사단 + 민간조사센터",
    process: [
      "화재 감정·소방·CCTV 자료 확보",
      "필요 시 민간조사센터 1차 조사",
      "손해 사정·약관 면책 검토",
    ],
    cases: [
      { issue: "공장 화재 원인 다툼", result: "감정 자료 재해석으로 영업 손해 일부 인용" },
    ],
    related: { lawyers: ["방정숙"] },
    cta: { primary: { label: "상담 신청", href: "/contact/insurer" } },
  },

  "insurance/liability": {
    slug: "insurance/liability",
    parent: "insurance",
    eyebrow: "LIABILITY",
    displayEn: "Liability Insurance",
    nameKo: "배상책임보험",
    lead: "일반·전문직 배상책임 — 의사·변호사·시설주 등 직역별 배상책임 분쟁을 다룹니다.",
    what: [
      "전문직(의사·변호사 등) 배상책임",
      "시설물·일상생활 배상책임",
      "기업 임원 D&O 책임",
      "약관 면책 사유 다툼",
    ],
    who: "기업 자문팀 + 의료분쟁지원센터",
    process: [
      "약관·면책 사유 정밀 분석",
      "공동불법행위 책임 배분",
      "필요 시 구상·합의 절충 연계",
    ],
    cases: [
      { issue: "의사 배상책임 면책 사유 다툼", result: "보험사 면책 인정 — 약관 적용 범위 명확화" },
    ],
    related: { lawyers: ["윤은희", "정애리나"] },
    cta: { primary: { label: "상담 신청", href: "/contact/enterprise" } },
  },

  "insurance/life": {
    slug: "insurance/life",
    parent: "insurance",
    eyebrow: "LIFE",
    displayEn: "Life Insurance",
    nameKo: "생명보험",
    lead: "사망·재해·진단 생명보험 분쟁. 자살 면책, 재해 인정, 진단 확정이 주요 쟁점입니다.",
    what: [
      "사망보험금 청구 — 자살·재해 면책 다툼",
      "재해 사망 — 외래·우발·급격성 입증",
      "고지의무·계약 전 알릴 의무 위반 면책",
    ],
    who: "생명보험 분쟁 전담 변호사단",
    process: [
      "사망진단서·부검·수사기록 확보",
      "재해·고지의무 쟁점 분석",
      "조정·소송 진행",
    ],
    cases: [
      { issue: "재해사망 인정 여부", result: "외래·우발성 입증으로 사망보험금 인용" },
    ],
    related: { lawyers: ["서소현"] },
    cta: { primary: { label: "상담 신청", href: "/contact/personal" } },
  },

  medical: {
    slug: "medical",
    eyebrow: "MEDICAL DISPUTES",
    displayEn: "Medical Disputes",
    nameKo: "의료분쟁",
    lead: "의사 자격을 보유한 변호사가 의무기록 의학적 검토부터 법률적 판단까지 한 사람이 수행합니다.",
    what: [
      "수술·시술 과실로 인한 손해",
      "오진·진단 지연",
      "설명의무 위반",
      "약물·마취 사고",
    ],
    who: "의료분쟁지원센터 (윤은희 변호사·의사 외)",
    process: [
      "의무기록 사본 확보 및 의학적 검토",
      "대한의학회 가이드라인 매핑",
      "전문가 자문 (필요 시 외부 자문의)",
      "조정·소송 진행",
    ],
    cases: [
      { issue: "수술 후 합병증 — 설명의무 위반", result: "위자료 일부 인용" },
      { issue: "오진으로 인한 치료 지연", result: "손해배상금 지급 결정" },
    ],
    related: { lawyers: ["윤은희"] },
    cta: {
      primary: { label: "의료분쟁 상담 신청", href: "/contact/medical" },
      secondary: { label: "센터 자세히 보기", href: "/centers/medical" },
    },
  },

  advisory: {
    slug: "advisory",
    eyebrow: "LEGAL ADVISORY",
    displayEn: "Legal Advisory",
    nameKo: "법률자문",
    lead: "보험사·기업·기관 대상 산업별 법률자문. 사고 발생 전 대응 설계가 핵심입니다.",
    what: [
      "보험사 일반 자문 + SIU 자문",
      "기업 일반 자문 + 분쟁 사전 대응",
      "내부 규정·계약서 검토",
      "임직원 대상 법률 교육",
    ],
    who: "자문 전담 변호사단",
    process: [
      "산업·규모별 자문 구조 설계",
      "월·분기 단위 정기 회의",
      "분쟁 발생 시 동일 팀이 대응",
    ],
    cases: [
      { issue: "보험사 SIU 자문 — 자해사고 의심 사건", result: "조사·소송·구상 일원화로 사기 의심 사건 종결" },
    ],
    related: { lawyers: ["홍명호", "정애리나"] },
    cta: {
      primary: { label: "보험사 자문", href: "/contact/insurer" },
      secondary: { label: "기업 자문", href: "/contact/enterprise" },
    },
  },

  investigation: {
    slug: "investigation",
    eyebrow: "INVESTIGATION & CRIMINAL",
    displayEn: "Investigation",
    nameKo: "민간조사·형사소송",
    lead: "민간조사센터의 조사 능력을 형사 대응 단계까지 그대로 이어갑니다. 사고 직후 ‘이상 정황’ 사건에 강합니다.",
    what: [
      "보험사기·위장사고 정황 조사",
      "행방·재산 추적 (구상 사전 단계)",
      "형사 고소·고발 대응",
      "형사 + 민사 동시 진행 사건",
    ],
    who: "민간조사센터 + 형사 변호사",
    process: [
      "1차 조사 (전직 수사관·조사관)",
      "조사 결과의 형사 절차 활용",
      "민사 청구·구상과 동시 연계",
    ],
    cases: [
      { issue: "위장 자해사고 — 보험금 청구", result: "조사 결과 기반 형사 고발 + 민사 부당이득 반환" },
    ],
    related: { lawyers: ["임원균"] },
    cta: {
      primary: { label: "조사 협업 의뢰", href: "/contact/insurer" },
      secondary: { label: "센터 자세히 보기", href: "/centers/investigation" },
    },
  },

  subrogation: {
    slug: "subrogation",
    eyebrow: "SUBROGATION",
    displayEn: "Subrogation & Recovery",
    nameKo: "구상·고액보상·합의절충",
    lead: "보험금 지급 이후 가해자에 대한 구상권 행사와, 고액 보상 합의 절충, 그리고 회수까지를 동일 팀이 끌어갑니다.",
    what: [
      "보험사 구상권 행사",
      "공동불법행위 책임 분담",
      "고액 보상 합의 절충",
      "구상 회수율 분기 리포트 (보험사 자문 한정)",
    ],
    who: "구상·합의팀 + 채권회수팀",
    process: [
      "구상 가능성 사전 진단",
      "공동불법행위 책임 비율 분석",
      "합의 절충 또는 소송",
      "판결 후 채권회수팀 자동 연계",
    ],
    cases: [
      { issue: "교통사고 합의금 지급 후 공동불법행위 구상", result: "구상권 행사 인정 — 회수 성공" },
    ],
    related: { lawyers: ["방정숙", "정애리나"] },
    cta: {
      primary: { label: "구상 위임 상담", href: "/contact/insurer" },
      secondary: { label: "구상 가능성 자가진단 (AI)", href: "/tools/subrogation-check" },
    },
  },
};

export const insuranceSubAreas: PracticeAreaSlug[] = [
  "insurance/auto",
  "insurance/long-term",
  "insurance/fire",
  "insurance/liability",
  "insurance/life",
];

export const topLevelAreas: PracticeAreaSlug[] = [
  "insurance",
  "medical",
  "advisory",
  "investigation",
  "subrogation",
];
