/**
 * Lawyer roster — PRD Appendix A
 *
 * NOTE: All bios, education, and case lists below are PLACEHOLDER content
 * generated for scaffolding the People pages. Replace with verified data
 * before public launch. The actual roster (13 lawyers, 2026.05) is taken
 * from PRD §부록 A; the displayed details are stand-ins.
 */

export type PracticeAreaCode =
  | "auto" | "long-term" | "fire" | "liability" | "life"
  | "medical" | "subrogation" | "investigation" | "advisory"
  | "criminal";

export const practiceAreaLabels: Record<PracticeAreaCode, string> = {
  auto: "자동차보험",
  "long-term": "장기보험",
  fire: "화재보험",
  liability: "배상책임",
  life: "생명보험",
  medical: "의료분쟁",
  subrogation: "구상·합의",
  investigation: "민간조사",
  advisory: "법률자문",
  criminal: "형사",
};

export type LawyerRole =
  | "대표변호사"
  | "파트너변호사"
  | "변호사"
  | "변호사 (비상임)"
  | "고문";

export type Lawyer = {
  slug: string;
  nameKo: string;
  nameEn: string;
  role: LawyerRole;
  isPartner: boolean;
  photoUrl?: string;
  bioShort: string;
  practiceAreas: PracticeAreaCode[];
  specialQualifications?: string[];
  email?: string;
  education: string[];
  career: string[];
  cases: Array<{ issue: string; result: string; insight: string }>;
  displayOrder: number;
};

export const lawyers: Lawyer[] = [
  {
    slug: "hong-myung-ho",
    nameKo: "홍명호",
    nameEn: "Hong, Myung-Ho",
    role: "대표변호사",
    isPartner: true,
    photoUrl: "https://www.dowonlaw.com/upload/employee/pk_202632614571325001.png",
    bioShort: "도원의 통합 모델을 설계한 대표변호사. 보험사 자문·SIU 협업의 실무 기준을 만들었다.",
    practiceAreas: ["auto", "long-term", "advisory", "subrogation"],
    email: "hong@dowonlaw.com",
    education: ["서울대학교 법과대학 졸업", "사법연수원 ○○기"],
    career: [
      "법무법인 도원 대표변호사",
      "○○보험 자문변호사 (현)",
      "대한변호사협회 보험분쟁 위원",
    ],
    cases: [
      {
        issue: "무보험차상해 약관조항 면책 효력",
        result: "원고 일부 승소",
        insight: "약관 교부·설명 의무 강화 시사",
      },
    ],
    displayOrder: 1,
  },
  {
    slug: "bang-jeong-sook",
    nameKo: "방정숙",
    nameEn: "Bang, Jeong-Sook",
    role: "파트너변호사",
    isPartner: true,
    photoUrl: "https://www.dowonlaw.com/upload/employee/pk_202571017275432570.png",
    bioShort: "재산 손해·화재·구상 분야 전담. 손해 산정과 합의 절충에 정평이 있다.",
    practiceAreas: ["fire", "subrogation", "liability"],
    education: ["고려대학교 법과대학 졸업", "사법연수원 ○○기"],
    career: ["법무법인 도원 파트너변호사", "前 ○○ 손해사정법인 자문"],
    cases: [
      { issue: "공장 화재 원인 다툼", result: "영업 손해 일부 인용", insight: "감정 자료 재해석 사례" },
    ],
    displayOrder: 2,
  },
  {
    slug: "lim-woong-chan",
    nameKo: "임웅찬",
    nameEn: "Lim, Woong-Chan",
    role: "파트너변호사",
    isPartner: true,
    photoUrl: "https://www.dowonlaw.com/upload/employee/pk_2021781057991959.png",
    bioShort: "장기보험·실손·후유장해 분쟁 전문. 의학 자료 분석에 강점이 있다.",
    practiceAreas: ["long-term", "life"],
    education: ["연세대학교 법과대학 졸업", "사법연수원 ○○기"],
    career: ["법무법인 도원 파트너변호사"],
    cases: [
      { issue: "암 진단 확정 시점 다툼", result: "보험금 지급 인용", insight: "진단 시점 입증 사례" },
    ],
    displayOrder: 3,
  },
  {
    slug: "yoon-eun-hee",
    nameKo: "윤은희",
    nameEn: "Yoon, Eun-Hee",
    role: "변호사 (비상임)",
    isPartner: false,
    photoUrl: "https://www.dowonlaw.com/upload/employee/pk_202531315474044261.png",
    bioShort:
      "변호사·의사 이중 자격. 의료분쟁에서 의학적 판단과 법률적 판단을 동시에 수행하는 국내 소수 인력 중 1인.",
    practiceAreas: ["medical", "long-term", "liability"],
    specialQualifications: ["의사", "변호사"],
    education: [
      "○○대학교 의과대학 졸업 (의사 면허)",
      "○○대학교 법학전문대학원 졸업 (변호사)",
    ],
    career: [
      "법무법인 도원 의료분쟁지원센터",
      "前 ○○대학교병원 임상 경력",
    ],
    cases: [
      {
        issue: "수술 후 합병증 — 설명의무 위반",
        result: "위자료 일부 인용",
        insight: "의무기록 사본의 의학적 검증이 결정적",
      },
    ],
    displayOrder: 4,
  },
  {
    slug: "jung-aerina",
    nameKo: "정애리나",
    nameEn: "Jung, Ae-Ri-Na",
    role: "파트너변호사",
    isPartner: true,
    bioShort: "기업·금융 분야 사내변호사 경력을 바탕으로 한 기업 법률자문 전담.",
    practiceAreas: ["advisory", "liability"],
    education: [
      "2007 서울대학교 정치학과 졸업",
      "2014 부산대학교 법학전문대학원 졸업",
    ],
    career: [
      "2014 제3회 변호사시험 합격",
      "2007– (주)STX 경영기획실",
      "2014– 법무법인 평원 변호사",
      "2016 서울강남경찰서 수사민원상담센터 자문변호사",
      "2019– 법무법인 알파로 변호사",
      "2022– 법무법인 도원 파트너변호사",
    ],
    cases: [
      { issue: "임원 D&O 책임 — 면책 사유 다툼", result: "면책 일부 인정", insight: "약관 적용 범위 명확화" },
    ],
    displayOrder: 5,
  },
  {
    slug: "lim-won-gyun",
    nameKo: "임원균",
    nameEn: "Lim, Won-Gyun",
    role: "변호사",
    isPartner: false,
    bioShort: "보험사 사내변호사 경력 보유. 민간조사 결과를 형사·민사 절차로 연계하는 데 강점.",
    practiceAreas: ["criminal", "investigation"],
    education: [
      "2014 서강대학교 수학과·경제학과",
      "2017 중앙대학교 법학전문대학원 졸업",
    ],
    career: [
      "2017 제6회 변호사시험 합격",
      "2017– 현대해상화재보험(주) 사내변호사",
      "2024– 법무법인 도원",
    ],
    cases: [
      { issue: "위장 자해사고 — 보험사기", result: "형사 고발 + 민사 부당이득", insight: "조사-형사-민사 연계 사례" },
    ],
    displayOrder: 6,
  },
  {
    slug: "seo-so-hyun",
    nameKo: "서소현",
    nameEn: "Seo, So-Hyun",
    role: "파트너변호사",
    isPartner: true,
    photoUrl: "https://www.dowonlaw.com/upload/employee/pk_202171910365168171.png",
    bioShort: "생명보험·재해 사망 분쟁 전문. 부검·수사기록의 법적 활용에 능하다.",
    practiceAreas: ["life", "long-term"],
    education: ["성균관대학교 법과대학 졸업"],
    career: ["법무법인 도원 파트너변호사"],
    cases: [
      { issue: "재해 사망 인정 여부", result: "사망보험금 인용", insight: "외래·우발성 입증" },
    ],
    displayOrder: 7,
  },
  {
    slug: "kim-geun-yo",
    nameKo: "김근요",
    nameEn: "Kim, Geun-Yo",
    role: "변호사",
    isPartner: false,
    photoUrl: "https://www.dowonlaw.com/upload/employee/pk_20217811122010161.png",
    bioShort: "자동차보험·과실비율 분쟁 전담.",
    practiceAreas: ["auto"],
    education: ["부산대학교 법학전문대학원 졸업"],
    career: ["법무법인 도원 변호사"],
    cases: [
      { issue: "과실비율 90:10 다툼", result: "60:40 조정 인용", insight: "재현 시뮬레이션 활용" },
    ],
    displayOrder: 8,
  },
  {
    slug: "choi-gyu-sung",
    nameKo: "최규성",
    nameEn: "Choi, Gyu-Sung",
    role: "변호사",
    isPartner: false,
    photoUrl: "https://www.dowonlaw.com/upload/employee/pk_20247151005273742.png",
    bioShort: "장기보험·실손 분쟁 전담.",
    practiceAreas: ["long-term"],
    education: ["경희대학교 법학전문대학원 졸업"],
    career: ["법무법인 도원 변호사"],
    cases: [
      { issue: "실손보험금 청구 거절 — 보장 범위", result: "원고 승소", insight: "약관 해석 사례" },
    ],
    displayOrder: 9,
  },
  {
    slug: "kim-yong-jun",
    nameKo: "김용준",
    nameEn: "Kim, Yong-Jun",
    role: "변호사",
    isPartner: false,
    photoUrl: "https://www.dowonlaw.com/upload/employee/pk_20245215485438788.png",
    bioShort: "구상·합의 절충 전담.",
    practiceAreas: ["subrogation", "auto"],
    education: ["전남대학교 법학전문대학원 졸업"],
    career: ["법무법인 도원 변호사"],
    cases: [
      { issue: "공동불법행위 구상", result: "구상권 인정", insight: "기성 판결 활용" },
    ],
    displayOrder: 10,
  },
  {
    slug: "lee-hyo-jung",
    nameKo: "이효정",
    nameEn: "Lee, Hyo-Jung",
    role: "변호사",
    isPartner: false,
    photoUrl: "https://www.dowonlaw.com/upload/employee/pk_2025659122019032.png",
    bioShort: "의료분쟁·배상책임 전담.",
    practiceAreas: ["medical", "liability"],
    education: ["이화여자대학교 법학전문대학원 졸업"],
    career: ["법무법인 도원 변호사"],
    cases: [
      { issue: "오진으로 인한 치료 지연", result: "손해배상 지급", insight: "가이드라인 매핑 사례" },
    ],
    displayOrder: 11,
  },
  {
    slug: "kang-min-ju",
    nameKo: "강민주",
    nameEn: "Kang, Min-Ju",
    role: "변호사",
    isPartner: false,
    photoUrl: "https://www.dowonlaw.com/upload/employee/pk_20255231101838371.png",
    bioShort: "기업 자문·계약 분쟁 전담.",
    practiceAreas: ["advisory"],
    education: ["서강대학교 법학전문대학원 졸업"],
    career: ["법무법인 도원 변호사"],
    cases: [
      { issue: "공급계약 불이행 분쟁", result: "조정 합의", insight: "계약 문언 해석 사례" },
    ],
    displayOrder: 12,
  },
  {
    slug: "jung-chan-ik",
    nameKo: "정찬익",
    nameEn: "Jung, Chan-Ik",
    role: "변호사",
    isPartner: false,
    photoUrl: "https://www.dowonlaw.com/upload/employee/pk_20251021954149370.png",
    bioShort: "민간조사 협력·형사 동반 사건 전담.",
    practiceAreas: ["investigation", "criminal"],
    education: ["중앙대학교 법학전문대학원 졸업"],
    career: ["법무법인 도원 변호사"],
    cases: [
      { issue: "보험사기 의심 사고 형사 대응", result: "불기소 결정 후 민사 종결", insight: "조사-형사 연계 사례" },
    ],
    displayOrder: 13,
  },
];

export function getLawyerBySlug(slug: string): Lawyer | undefined {
  return lawyers.find((l) => l.slug === slug);
}

export function getLawyerByNameKo(name: string): Lawyer | undefined {
  return lawyers.find((l) => l.nameKo === name);
}
