/**
 * Non-lawyer personnel — fellows, debt recovery team, management team.
 *
 * Data sourced from dowonlaw.com:
 *   - /member/research_fellow.asp   (고문·전문위원)
 *   - /member/planning.asp          (채권회수팀)
 *   - /member/officer.asp           (경영관리팀)
 *
 * Photo URLs point at the live dowonlaw.com server (same pattern as
 * lawyers.ts). next.config.mjs already allows any https hostname for
 * next/image.
 */

const PHOTO_BASE = "https://www.dowonlaw.com/upload/employee";

export type StaffMember = {
  slug: string;
  nameKo: string;
  role: string;
  /** Short role qualifier — practice focus, dept, expertise area. */
  affiliation?: string;
  photoUrl?: string;
  bio: string[];
};

// ── Fellows / 고문·전문위원 ────────────────────────────────────────────

export const fellows: StaffMember[] = [
  {
    slug: "son-eul-sik",
    nameKo: "손을식",
    role: "고문",
    affiliation: "보험 산업 자문",
    photoUrl: `${PHOTO_BASE}/pk_2025731061824267.png`,
    bio: [
      "도원의 손해보험 실무·약관 분석 자문",
      "다년간의 보험업계 현장 경험을 바탕으로 사건 검토에 참여",
    ],
  },
  {
    slug: "park-jong-hwa",
    nameKo: "박종화",
    role: "고문",
    affiliation: "보험 실무",
    photoUrl: `${PHOTO_BASE}/pk_20253209512289240.png`,
    bio: [
      "보험사 손해사정·실무 운영 자문",
      "장기보험 분쟁 사건 검토 지원",
    ],
  },
  {
    slug: "park-tae-jun",
    nameKo: "박태준",
    role: "고문",
    affiliation: "산업 자문",
    photoUrl: `${PHOTO_BASE}/pk_202319943226748.png`,
    bio: [
      "기업 자문 · 분쟁 해결 전략 컨설팅",
      "도원의 자문 네트워크 운영 자문",
    ],
  },
  {
    slug: "kim-eun-hee",
    nameKo: "김은희",
    role: "수석의료팀장",
    affiliation: "의료분쟁지원센터",
    photoUrl: `${PHOTO_BASE}/pk_2021781123448481.png`,
    bio: [
      "의료분쟁지원센터의 의학 자문·자료 분석 책임",
      "진료기록 검토·의학 쟁점 정리로 변호사단 지원",
    ],
  },
];

// ── Recovery / 채권회수팀 ─────────────────────────────────────────────

export const recoveryTeam: StaffMember[] = [
  {
    slug: "choi-nam-hoon",
    nameKo: "최남훈",
    role: "팀장",
    affiliation: "채권회수팀",
    photoUrl: `${PHOTO_BASE}/pk_2023471857844749.jpg`,
    bio: [
      "1990 삼성화재해상보험 입사 — 보상·구상 실무",
      "2023 도원 합류 — 채권회수팀 총괄",
    ],
  },
  {
    slug: "park-yong-an",
    nameKo: "박용안",
    role: "실장",
    affiliation: "채권회수팀",
    photoUrl: `${PHOTO_BASE}/pk_20217720533544999.png`,
    bio: [
      "2008 신용관리사 자격 취득",
      "2000~ 미래신용정보 보험구상 추심 업무",
      "2011 도원 합류",
    ],
  },
  {
    slug: "lee-dae-ryong",
    nameKo: "이대룡",
    role: "실장",
    affiliation: "채권회수팀",
    photoUrl: `${PHOTO_BASE}/pk_20217814594668667.png`,
    bio: [
      "LG카드·삼성카드·SG신용정보·KTB신용정보 등 신용·금융 경력",
      "현대캐피탈·KB캐피탈 채권 추심 업무",
      "2021 도원 합류",
    ],
  },
  {
    slug: "park-yang-seop",
    nameKo: "박양섭",
    role: "실장",
    affiliation: "채권회수팀",
    photoUrl: `${PHOTO_BASE}/pk_202271216381693990.jpg`,
    bio: [
      "한국외국어대학교 중국어과 졸업",
      "1988~ 삼성화재해상보험 — 보상·구상 실무",
      "2022 도원 합류",
    ],
  },
];

// ── Management / 경영관리팀 ────────────────────────────────────────────

export const managementTeam: StaffMember[] = [
  {
    slug: "lee-myung-chul",
    nameKo: "이명철",
    role: "상무",
    affiliation: "경영관리팀",
    photoUrl: `${PHOTO_BASE}/pk_202462513161846783.jpg`,
    bio: [
      "연세대학교 경영학과 졸업",
      "1991~ 삼성화재해상보험 — 보상·구상 부서 다수 역임",
      "2024 도원 합류",
    ],
  },
  {
    slug: "lee-bok-soo",
    nameKo: "이복수",
    role: "이사",
    affiliation: "경영관리팀",
    photoUrl: `${PHOTO_BASE}/pk_20246241024081133.jpg`,
    bio: [
      "1992 서강대학교 경영학과 졸업",
      "1992~2024 삼성화재해상보험 근무",
      "2024 도원 합류",
    ],
  },
  {
    slug: "song-jae-il",
    nameKo: "송재일",
    role: "국장",
    affiliation: "경영관리팀",
    photoUrl: `${PHOTO_BASE}/pk_20217814285718294.png`,
    bio: [
      "1995 고려대학교 졸업",
      "1995 삼성화재 보상사정",
      "1997 법무팀 송무 업무",
      "2017 도원 — 송무 업무",
    ],
  },
  {
    slug: "lee-eun-ju",
    nameKo: "이은주",
    role: "팀장",
    affiliation: "경영관리팀",
    photoUrl: `${PHOTO_BASE}/pk_20217815231522516.png`,
    bio: [
      "2007 호서대학교 졸업",
      "법무법인 실무 경력 다수",
      "2017 도원 합류",
    ],
  },
  {
    slug: "cho-jung-sook",
    nameKo: "조정숙",
    role: "실장",
    affiliation: "경영관리팀",
    photoUrl: `${PHOTO_BASE}/pk_20217815201143474.png`,
    bio: [
      "인하대학교 산업공학과 졸업",
      "2014~2016 법무법인 근무",
      "2021 도원 합류",
    ],
  },
  {
    slug: "han-seung-eun",
    nameKo: "한승은",
    role: "차장",
    affiliation: "경영관리팀",
    photoUrl: `${PHOTO_BASE}/pk_20217815244730163.png`,
    bio: [
      "2008 대불대학교 졸업",
      "2017~2021 법무법인 경력",
      "2021 도원 합류",
    ],
  },
  {
    slug: "seo-hye-min",
    nameKo: "서혜민",
    role: "과장",
    affiliation: "경영관리팀",
    photoUrl: `${PHOTO_BASE}/pk_20217815261842210.png`,
    bio: [
      "2016 장안대학교 행정법률과 졸업",
      "2015~ 법무법인 실무",
      "2017 도원 합류",
    ],
  },
  {
    slug: "chae-eun-jin",
    nameKo: "채은진",
    role: "과장",
    affiliation: "경영관리팀",
    photoUrl: `${PHOTO_BASE}/pk_20217815274263833.png`,
    bio: [
      "2014 장안대학교 행정법률과 졸업",
      "2014 공익법무 활동",
      "2019 도원 합류",
    ],
  },
  {
    slug: "jang-seo-hyun",
    nameKo: "장서현",
    role: "대리",
    affiliation: "경영관리팀",
    photoUrl: `${PHOTO_BASE}/pk_202212113221520569.png`,
    bio: [
      "2016 대림대학교 바이오의약융합과 졸업",
      "2018 도원 합류",
    ],
  },
  {
    slug: "kim-na-young",
    nameKo: "김나영",
    role: "사원",
    affiliation: "경영관리팀",
    photoUrl: `${PHOTO_BASE}/pk_20247301005446852.jpg`,
    bio: ["2024 도원 합류"],
  },
];
