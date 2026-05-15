/**
 * Korean Legal Brief Skill Registry
 *
 * Each skill defines:
 *   - input schema (fields the lawyer fills in)
 *   - checklist (legal-requirement coverage)
 *   - output sections (the structure Claude must produce)
 *   - tone guide (Korean court-style prose rules)
 *   - example (worked input → output, viewable as docx)
 *
 * The same shape drives both the live form and the .docx export, so
 * lawyers can extend a skill (add a field, tweak a checklist item) without
 * touching the renderer or the LLM endpoint.
 */

export type BriefFieldType =
  | "text"
  | "textarea"
  | "date"
  | "money"
  | "select"
  | "tel";

export type BriefField = {
  name: string;
  label: string;
  type: BriefFieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: string[];
  group?: string;
};

export type BriefChecklistItem = {
  label: string;
  required: boolean;
  /** Auto-checked by the form/calc layer, not the lawyer. */
  auto?: boolean;
};

export type BriefSection = {
  /** Heading printed in the docx and shown in the UI. */
  title: string;
  /** Hint that the LLM uses to fill in the body. */
  hint: string;
};

export type BriefExample = {
  title: string;
  scenario: string;
  inputs: Record<string, string | number>;
  flags?: { label: string; detail: string }[];
  calculations?: { label: string; value: string; note?: string }[];
  sections: { title: string; body: string }[];
};

export type BriefSkill = {
  slug: string;
  name: string;
  englishName: string;
  category: "민사" | "형사" | "가사";
  tagline: string;
  description: string;
  icon: string;
  toneGuide: string;
  checklist: BriefChecklistItem[];
  fields: BriefField[];
  followUpQuestions: string[];
  outputSections: BriefSection[];
  example: BriefExample;
  citationDb?: string;
};

/* ──────────────────────────────────────────────────────────────── */
/* 1. 민사 소장 — korean-civil-complaint-skill                       */
/* ──────────────────────────────────────────────────────────────── */

const civilComplaint: BriefSkill = {
  slug: "korean-civil-complaint-skill",
  name: "민사 소장",
  englishName: "Civil Complaint",
  category: "민사",
  tagline: "청구취지·청구원인·증거방법 구조",
  description:
    "대여금·약정금·손해배상 등 민사 청구 소장을 작성합니다. 청구취지·청구원인·입증방법·관할·인지대 자동 계산이 포함됩니다.",
  icon: "📄",
  toneGuide: `- 문어체 평서형. 종결어미는 "~한다", "~하였다", "~이다".
- 1인칭("저", "원고는 본인") 금지. 항상 "원고", "피고"로 지칭.
- 법조문 인용 시 띄어쓰기 정확히: "민법 제598조", "민사소송법 제3조".
- 금액은 한글-아라비아 병기: "금 40,000,000원(사천만원)".
- 일자는 "2024. 3. 15." 형식 (점·공백 정확).`,
  checklist: [
    { label: "당사자 표시 (원·피고 성명·주소·생년월일)", required: true },
    { label: "청구취지 — 원금·이자·소송비용·가집행", required: true },
    { label: "청구원인 5요소 (당사자관계·법률행위·이행청구·채무불이행·잔존채무)", required: true },
    { label: "입증방법 (갑호증 목록)", required: true },
    { label: "관할 적정성 확인 (민사소송법 §3 보통재판적)", required: true, auto: true },
    { label: "인지대·송달료 계산", required: true, auto: true },
    { label: "소멸시효 검토 (일반채권 10년·상사 5년)", required: true },
    { label: "이자제한법 한도(연 20%) 검토", required: true },
  ],
  fields: [
    { group: "원고", name: "plaintiffName", label: "원고 성명", type: "text", required: true, placeholder: "박민수" },
    { group: "원고", name: "plaintiffBirth", label: "원고 생년월일", type: "text", placeholder: "1985-04-12" },
    { group: "원고", name: "plaintiffAddress", label: "원고 주소", type: "text", required: true, placeholder: "서울특별시 강남구 …" },
    { group: "피고", name: "defendantName", label: "피고 성명", type: "text", required: true, placeholder: "김영호" },
    { group: "피고", name: "defendantAddress", label: "피고 주소", type: "text", required: true, placeholder: "서울특별시 송파구 …" },
    { group: "사실관계", name: "loanDate", label: "대여(계약) 일자", type: "date", required: true },
    { group: "사실관계", name: "principal", label: "원금 (원)", type: "money", required: true, placeholder: "50000000" },
    { group: "사실관계", name: "interestRate", label: "약정 이자율 (연 %)", type: "text", placeholder: "5" },
    { group: "사실관계", name: "dueDate", label: "변제기", type: "date", required: true },
    { group: "사실관계", name: "partialRepayment", label: "일부 변제액 (원)", type: "money", placeholder: "10000000" },
    { group: "사실관계", name: "partialRepaymentDate", label: "일부 변제 일자", type: "date" },
    { group: "사실관계", name: "evidence", label: "증거 (차용증, 계좌이체 내역 등)", type: "textarea", required: true, hint: "쉼표로 구분해 나열하면 갑호증으로 정리됩니다." },
    { group: "관할·대리", name: "court", label: "관할 법원", type: "text", required: true, placeholder: "서울동부지방법원" },
    { group: "관할·대리", name: "firm", label: "법무법인", type: "text", required: true, placeholder: "법무법인 정의" },
    { group: "관할·대리", name: "leadCounsel", label: "대표변호사", type: "text", placeholder: "이정훈" },
    { group: "관할·대리", name: "counsel", label: "담당변호사", type: "text", required: true, placeholder: "김지영" },
  ],
  followUpQuestions: [
    "피고가 변제기 이후 지급을 거절한 구체적인 정황이 있나요? (예: 카톡 회피, 연락두절)",
    "원고가 지급명령·내용증명 등 사전 절차를 거쳤다면 일자를 알려주세요.",
    "가집행 선고를 청구할 특별한 이유가 있나요? (변제자력 의심, 도주 우려 등)",
  ],
  outputSections: [
    { title: "당사자", hint: "원고·피고의 성명·주소·생년월일을 표준 형식으로 표시" },
    { title: "청구취지", hint: "지급 청구액(원금+이자+지연손해금)·소송비용·가집행 청구" },
    { title: "청구원인", hint: "1.당사자관계 → 2.대여계약 → 3.이행청구 → 4.피고의 채무불이행 → 5.잔존채무 명시" },
    { title: "입증방법", hint: "갑 제1호증부터 순번 부여" },
    { title: "관할", hint: "민사소송법 제3조에 따른 피고 보통재판적 명시" },
    { title: "맺음말", hint: "관할법원·일자·법무법인·담당변호사 기재" },
  ],
  example: {
    title: "대여금 청구의 소 — 박민수 v. 김영호",
    scenario:
      "원고 박민수가 피고 김영호에게 2024.3.15. 금 5,000만원을 약정이자 연 5%, 변제기 6개월로 대여하였으나, 만기일(2024.9.15.)이 도과된 후 2025.1.에 1,000만원만 일부 변제하고 잔존채무 4,000만원을 지급하지 않은 사안.",
    inputs: {
      plaintiffName: "박민수",
      plaintiffBirth: "1985-04-12",
      plaintiffAddress: "서울특별시 강남구 테헤란로 123, 401호",
      defendantName: "김영호",
      defendantAddress: "서울특별시 송파구 올림픽로 456, 1203호",
      loanDate: "2024-03-15",
      principal: 50_000_000,
      interestRate: "5",
      dueDate: "2024-09-15",
      partialRepayment: 10_000_000,
      partialRepaymentDate: "2025-01-10",
      evidence: "차용증, 계좌이체 내역(국민은행), 일부변제 입금증, 카카오톡 대화 사본",
      court: "서울동부지방법원",
      firm: "법무법인 정의",
      leadCounsel: "이정훈",
      counsel: "김지영",
    },
    flags: [
      {
        label: "소멸시효 — 문제없음, 다만 일부변제는 시효중단 사유",
        detail:
          "일반채권 10년(민법 §162 ①). 2025.1.10. 일부 변제로 시효 중단되어 그 다음날부터 새 시효 진행.",
      },
      {
        label: "지연손해금 분할 계산 필요",
        detail:
          "2024.9.16.~2025.1.10. 구간은 원금 5,000만원 기준, 2025.1.11. 이후는 4,000만원 기준.",
      },
      {
        label: "이자제한법 적합",
        detail: "약정 연 5%는 이자제한법상 최고이율(연 20%) 이내.",
      },
    ],
    calculations: [
      { label: "잔존 원금", value: "금 40,000,000원", note: "5,000만 − 1,000만 일부변제" },
      {
        label: "약정이자 (2024.3.15.~2024.9.15., 6개월, 연 5%)",
        value: "금 1,250,000원",
        note: "50,000,000 × 0.05 × 184/365 ≈ 1,260,274원 → 원 단위 절사",
      },
      { label: "소가 (추정)", value: "약 41,250,000원" },
      {
        label: "인지대",
        value: "194,000원",
        note: "민사소송등인지법: 소가 × 0.0045 + 5,000 = 4,125만 × 0.0045 + 5,000 ≈ 190,625 → 1,000원 단위 절사 후 5,000원 가산",
      },
      {
        label: "송달료",
        value: "156,000원",
        note: "당사자 2명 × 5,200원 × 15회",
      },
    ],
    sections: [
      {
        title: "당사자",
        body:
          "원   고   박민수 (850412-*******)\n          서울특별시 강남구 테헤란로 123, 401호\n\n피   고   김영호\n          서울특별시 송파구 올림픽로 456, 1203호\n\n대여금 청구의 소",
      },
      {
        title: "청구취지",
        body:
          "1. 피고는 원고에게 금 40,000,000원 및 이에 대하여 2025. 1. 11.부터 이 사건 소장 부본 송달일까지는 연 5%의, 그 다음날부터 다 갚는 날까지는 연 12%의 각 비율로 계산한 돈을 지급하라.\n2. 소송비용은 피고가 부담한다.\n3. 제1항은 가집행할 수 있다.\n라는 판결을 구합니다.",
      },
      {
        title: "청구원인",
        body:
          "1. 당사자 관계\n원고는 피고와 2020년경부터 알고 지낸 지인 관계입니다.\n\n2. 금전소비대차계약의 체결\n원고는 2024. 3. 15. 피고의 요청에 따라 피고에게 금 50,000,000원을 변제기 2024. 9. 15., 약정이자 연 5%로 정하여 대여하였습니다(갑 제1호증 차용증, 갑 제2호증 계좌이체 내역).\n\n3. 일부 변제 및 잔존채무\n피고는 변제기가 도과된 후인 2025. 1. 10. 원고에게 금 10,000,000원을 변제하였을 뿐(갑 제3호증), 나머지 잔존 원금 40,000,000원 및 그에 대한 약정이자·지연손해금을 현재까지 지급하지 아니하고 있습니다.\n\n4. 피고의 이행거절\n원고는 피고에게 수차례에 걸쳐 잔존채무의 변제를 촉구하였으나(갑 제4호증 카카오톡 대화), 피고는 변제를 거절하고 있을 뿐만 아니라 최근에는 연락마저 두절된 상태입니다.\n\n5. 결론\n따라서 원고는 피고로부터 잔존 원금 40,000,000원 및 이에 대한 2025. 1. 11.부터 소장 부본 송달일까지는 약정이율 연 5%의, 그 다음날부터 다 갚는 날까지는 소송촉진 등에 관한 특례법 소정의 연 12%의 각 비율로 계산한 지연손해금의 지급을 구하기 위하여 이 사건 소를 제기합니다.",
      },
      {
        title: "입증방법",
        body:
          "1. 갑 제1호증     차용증\n1. 갑 제2호증     계좌이체 내역 (국민은행)\n1. 갑 제3호증     일부변제 입금증\n1. 갑 제4호증     카카오톡 대화 사본",
      },
      {
        title: "첨부서류",
        body:
          "1. 위 입증방법      각 1통\n1. 소장 부본          1통\n1. 송달료 납부서      1통",
      },
      {
        title: "관할",
        body:
          "민사소송법 제3조에 따라 피고의 보통재판적이 있는 서울특별시 송파구의 관할 법원인 귀원이 본 사건의 관할 법원입니다.",
      },
      {
        title: "맺음말",
        body:
          "2026. 5. 15.\n\n위 원고 소송대리인\n법무법인 정의\n대표변호사   이정훈\n담당변호사   김지영\n\n서울동부지방법원 귀중",
      },
    ],
  },
  citationDb: "민법 §162(소멸시효), §379(법정이율), §387(이행지체), §397(금전채무의 특칙), 소송촉진 등에 관한 특례법 §3, 민사소송등인지법 §2",
};

/* ──────────────────────────────────────────────────────────────── */
/* 2. 형사 변론요지서 — korean-criminal-defense-skill                */
/* ──────────────────────────────────────────────────────────────── */

const criminalDefense: BriefSkill = {
  slug: "korean-criminal-defense-skill",
  name: "형사 변론요지서",
  englishName: "Criminal Defense Memorandum",
  category: "형사",
  tagline: "공소사실 부인·양형부당 통합 변론",
  description:
    "형사 1심·항소심 변론요지서를 작성합니다. 공소사실 인부, 핵심 쟁점, 양형사유(피해자와의 합의·반성·초범 등)를 체계적으로 구성합니다.",
  icon: "⚖️",
  toneGuide: `- 변론요지서는 "피고인은 ~합니다"의 격식체.
- 양형사유 나열 시 번호 매겨 단호한 평서문으로.
- 판례 인용은 "대법원 2014. 3. 27. 선고 2013도11357 판결" 식 정확한 출처 표기.`,
  checklist: [
    { label: "사건번호·재판부 표시", required: true },
    { label: "피고인 인적사항", required: true },
    { label: "공소사실 인부 의견 (전부부인·일부부인·자백)", required: true },
    { label: "쟁점 정리 (사실관계·법리)", required: true },
    { label: "양형사유 (피해회복·반성·초범·가족관계 등)", required: true },
    { label: "예상 판례 인용", required: false },
    { label: "선처 호소 결론", required: true },
  ],
  fields: [
    { group: "사건", name: "caseNumber", label: "사건번호", type: "text", required: true, placeholder: "2026고단1234" },
    { group: "사건", name: "courtDivision", label: "재판부", type: "text", required: true, placeholder: "서울중앙지방법원 형사7단독" },
    { group: "사건", name: "charge", label: "죄명", type: "text", required: true, placeholder: "사기" },
    { group: "피고인", name: "defendantName", label: "피고인 성명", type: "text", required: true },
    { group: "피고인", name: "defendantBirth", label: "피고인 생년월일", type: "text" },
    { group: "공소사실", name: "indictmentSummary", label: "공소사실 요지", type: "textarea", required: true, hint: "검사의 공소장을 요약" },
    { group: "변론", name: "stance", label: "인부 의견", type: "select", required: true, options: ["전부 부인", "일부 부인", "자백·양형부당"] },
    { group: "변론", name: "keyIssues", label: "주요 쟁점", type: "textarea", required: true, hint: "사실관계 다툼·법리 쟁점" },
    { group: "양형", name: "mitigationFactors", label: "양형 자료", type: "textarea", required: true, hint: "초범, 합의, 반성, 부양가족 등" },
    { group: "양형", name: "victimSettlement", label: "피해자와의 합의 여부", type: "select", options: ["합의 완료", "합의 진행 중", "합의 시도 중", "해당없음"] },
    { group: "관할·대리", name: "firm", label: "법무법인", type: "text", required: true },
    { group: "관할·대리", name: "counsel", label: "담당변호사", type: "text", required: true },
  ],
  followUpQuestions: [
    "피고인의 직업·가족관계·전과 유무를 알려주세요.",
    "공소사실 중 다투지 않는 부분이 있다면 무엇입니까?",
    "선처를 구하는 결정적 사정 1~2가지를 강조 표현으로 알려주세요.",
  ],
  outputSections: [
    { title: "사건의 표시", hint: "사건번호·재판부·죄명·피고인" },
    { title: "공소사실에 대한 의견", hint: "전부부인/일부부인/자백 입장" },
    { title: "쟁점에 관한 변론", hint: "사실관계 다툼·법리 주장 정리" },
    { title: "양형사유", hint: "1) 초범, 2) 반성, 3) 합의, 4) 가족부양 등 번호로 정리" },
    { title: "결론", hint: "선처 호소·구체적 형종 호소(집행유예·벌금형 등)" },
  ],
  example: {
    title: "사기 변론요지서 — 피고인 이수진",
    scenario:
      "피고인이 지인으로부터 사업자금 명목으로 3,000만원을 차용한 후 사업 실패로 변제하지 못한 사안. 검사는 변제 의사·능력 없이 편취한 것으로 보아 사기 기소. 피고인은 차용 당시 변제의사가 있었음을 주장하며 일부 부인.",
    inputs: {
      caseNumber: "2026고단1234",
      courtDivision: "서울중앙지방법원 형사7단독",
      charge: "사기",
      defendantName: "이수진",
      defendantBirth: "1979-08-21",
      indictmentSummary:
        "피고인은 2024. 6.경 피해자 박상호에게 사업자금 명목으로 30,000,000원을 차용하면서, 실제로는 변제 의사나 능력이 없었음에도 마치 6개월 내 변제할 수 있는 것처럼 기망하여 동액을 편취하였다.",
      stance: "일부 부인",
      keyIssues:
        "1) 차용 당시 피고인은 카페 운영 매출이 있었고 변제의사·능력이 인정됨. 2) 사업 실패는 코로나19 재유행으로 인한 외부 요인. 3) 피고인이 차용 직후 일부 이자를 지급한 사실은 편취 고의와 양립할 수 없음.",
      mitigationFactors:
        "초범, 피해자와 분할변제 합의 완료(2026.4. 1,500만원 선지급), 깊이 반성, 미성년 자녀 2명 부양, 정신과 치료 중",
      victimSettlement: "합의 완료",
      firm: "법무법인 정의",
      counsel: "김지영",
    },
    flags: [
      { label: "편취 고의 부정 — 차용 당시 자력 입증 필요", detail: "카페 매출 자료·임대료 납부 내역으로 변제능력 객관화." },
      { label: "합의서 첨부 필수", detail: "처벌불원서가 양형 가장 큰 감경요소 — 원본 별첨." },
      { label: "양형기준상 권고형역 — 일반사기 1유형", detail: "권고형역: 징역 6월~1년6월. 감경요소 다수 → 집행유예 호소 가능." },
    ],
    sections: [
      {
        title: "사건의 표시",
        body:
          "사건번호  2026고단1234 사기\n재  판  부  서울중앙지방법원 형사7단독\n피  고  인  이수진 (790821-*******)\n\n위 사건에 관하여 피고인의 변호인은 다음과 같이 변론합니다.",
      },
      {
        title: "공소사실에 대한 의견",
        body:
          "피고인은 공소사실 중 피해자로부터 금 30,000,000원을 차용한 사실은 인정하나, 차용 당시 변제 의사 및 능력이 없었다는 점은 강력히 부인합니다.\n\n피고인은 2024. 6. 당시 마포구 소재 카페를 운영하며 월평균 매출 1,200만원을 기록하고 있었고, 차용 직후 2024. 7.과 8. 두 차례에 걸쳐 약정이자를 지급한 사실(증 제1호증 입금내역)이 있는바, 이는 피고인이 차용 시점에 변제 의사가 있었음을 명백히 보여주는 객관적 정황입니다.",
      },
      {
        title: "쟁점에 관한 변론",
        body:
          "1. 차용 당시의 변제 능력\n피고인의 카페 운영 매출(증 제2호증 사업자등록증 및 매출자료)은 월평균 1,200만원 수준으로, 6개월 내 3,000만원 변제는 객관적으로 가능한 범위에 있었습니다.\n\n2. 사업 실패의 외부적 요인\n피고인이 변제기를 도과하게 된 것은 2024. 8. 코로나19 재유행에 따른 매출 급감(증 제3호증) 때문이며, 이는 차용 당시에는 예측할 수 없었던 사정입니다.\n\n3. 편취 고의의 부정\n대법원은 차용금 편취 사안에서 \"차용 후 일부 변제가 이루어진 경우 편취 고의의 인정에 신중하여야 한다\"고 판시한 바 있습니다(대법원 2014. 3. 27. 선고 2013도11357 판결). 피고인은 차용 직후 이자를 지급하였고 사후에도 분할변제를 약정하였는바, 편취 고의가 인정되기 어렵습니다.",
      },
      {
        title: "양형사유",
        body:
          "설령 귀 재판부께서 위 변론을 받아들이지 아니하시더라도, 다음 사정을 양형에 참작하여 주시기 바랍니다.\n\n1. 피고인은 본건 외 동종 전과가 전혀 없는 초범입니다.\n\n2. 피고인은 피해자와 2026. 4. 분할변제 합의를 완료하고 합의금 중 일부인 15,000,000원을 선지급하였으며(증 제4호증 합의서 및 송금내역), 피해자는 피고인에 대한 처벌을 원하지 않는다는 의사를 명백히 표시하였습니다(증 제5호증 처벌불원서).\n\n3. 피고인은 본건에 대하여 깊이 반성하고 있으며, 향후 동종 범행을 결코 저지르지 않을 것을 다짐하고 있습니다.\n\n4. 피고인은 미성년 자녀 2명(13세, 9세)을 부양하는 가장으로, 실형이 선고될 경우 가족의 생계가 곤란한 상황입니다.\n\n5. 피고인은 본건 이후 우울증으로 정신과 치료를 받고 있는 상태(증 제6호증)로, 사회 내 처우를 통한 재활 가능성이 충분합니다.",
      },
      {
        title: "결론",
        body:
          "이상의 사정을 종합하면, 피고인의 행위가 사기죄에 해당한다고 보기 어렵고, 가사 유죄가 인정된다 하더라도 피고인에게 사회 내에서 자녀를 부양하고 피해를 회복할 기회를 주는 것이 정의에 부합한다 할 것입니다.\n\n부디 귀 재판부께서 피고인에게 무죄 또는 집행유예의 관대한 판결을 내려 주시기를 간곡히 청합니다.\n\n2026. 5. 15.\n\n피고인의 변호인\n법무법인 정의\n담당변호사   김지영\n\n서울중앙지방법원 형사7단독 귀중",
      },
    ],
  },
  citationDb: "형법 §347(사기), 형법 §51(양형의 조건), 형사소송법 §323(유죄판결의 이유), 대법원 2014. 3. 27. 선고 2013도11357 판결",
};

/* ──────────────────────────────────────────────────────────────── */
/* 3. 이혼소장 — korean-divorce-petition-skill                       */
/* ──────────────────────────────────────────────────────────────── */

const divorcePetition: BriefSkill = {
  slug: "korean-divorce-petition-skill",
  name: "이혼소장",
  englishName: "Divorce Petition",
  category: "가사",
  tagline: "재산분할·위자료·친권 통합 청구",
  description:
    "재판상 이혼 소장을 작성합니다. 이혼 사유(민법 §840), 위자료, 재산분할, 친권·양육권·양육비를 통합 청구하는 표준 양식을 사용합니다.",
  icon: "💔",
  toneGuide: `- 가사사건의 특수성 반영 — 자녀 보호·정서 배려.
- 사실관계는 시간순으로, 감정 표현 최소화.
- 미성년 자녀가 있으면 친권·양육권 청구 누락 금지.`,
  checklist: [
    { label: "당사자 표시 (성명·주소·생년월일)", required: true },
    { label: "혼인 신고일·자녀 관계", required: true },
    { label: "이혼 사유 (민법 §840 1~6호 적시)", required: true },
    { label: "위자료 청구 금액·근거", required: true },
    { label: "재산분할 청구 — 분할 대상·분할 비율", required: true },
    { label: "친권자·양육권자 지정 (미성년 자녀)", required: true },
    { label: "양육비 산정 (양육비 산정기준표)", required: true },
    { label: "관할 — 가정법원", required: true, auto: true },
  ],
  fields: [
    { group: "원고", name: "plaintiffName", label: "원고 성명", type: "text", required: true },
    { group: "원고", name: "plaintiffBirth", label: "원고 생년월일", type: "text" },
    { group: "원고", name: "plaintiffAddress", label: "원고 주소", type: "text", required: true },
    { group: "피고", name: "defendantName", label: "피고 성명", type: "text", required: true },
    { group: "피고", name: "defendantAddress", label: "피고 주소", type: "text", required: true },
    { group: "혼인", name: "marriageDate", label: "혼인신고일", type: "date", required: true },
    { group: "혼인", name: "separationDate", label: "별거 시점", type: "date" },
    { group: "자녀", name: "children", label: "미성년 자녀 (이름/생년월일, 쉼표로 구분)", type: "textarea", placeholder: "이지원/2015-04-12, 이지훈/2018-09-08" },
    { group: "사유", name: "groundsType", label: "이혼 사유 (§840)", type: "select", required: true, options: [
      "1호 — 배우자의 부정한 행위",
      "2호 — 악의의 유기",
      "3호 — 배우자/직계존속의 부당한 대우",
      "4호 — 자기의 직계존속에 대한 부당한 대우",
      "5호 — 3년 이상 생사불명",
      "6호 — 혼인을 계속하기 어려운 중대한 사유",
    ] },
    { group: "사유", name: "factSummary", label: "구체적 사실관계", type: "textarea", required: true, hint: "시간순 정리" },
    { group: "청구", name: "alimony", label: "위자료 청구 (원)", type: "money", placeholder: "30000000" },
    { group: "청구", name: "propertyDivision", label: "재산분할 청구 내용", type: "textarea", hint: "예: 아파트 1/2 지분, 예금 합계의 50%" },
    { group: "청구", name: "custody", label: "친권·양육권 청구 자녀", type: "text", placeholder: "이지원, 이지훈 모두" },
    { group: "청구", name: "childSupport", label: "양육비 (1인 월 원)", type: "money", placeholder: "1500000" },
    { group: "관할·대리", name: "court", label: "관할 가정법원", type: "text", required: true, placeholder: "서울가정법원" },
    { group: "관할·대리", name: "firm", label: "법무법인", type: "text", required: true },
    { group: "관할·대리", name: "counsel", label: "담당변호사", type: "text", required: true },
  ],
  followUpQuestions: [
    "혼인 파탄의 결정적 계기가 된 사건이 있었나요? (시점·내용)",
    "재산분할 대상에서 빠뜨려서는 안 될 자산이 있나요? (퇴직금·보험·해외계좌 등)",
    "자녀가 양육환경에 대해 표시한 의사가 있다면 알려주세요.",
  ],
  outputSections: [
    { title: "당사자", hint: "원고·피고·자녀 표시" },
    { title: "청구취지", hint: "1. 이혼, 2. 위자료, 3. 재산분할, 4. 친권자·양육권자 지정, 5. 양육비" },
    { title: "청구원인", hint: "혼인경위 → 파탄 사유 → 위자료·재산분할 산정근거 → 자녀 양육환경" },
    { title: "입증방법", hint: "혼인관계증명서·가족관계증명서·재산자료 등" },
    { title: "맺음말", hint: "관할가정법원 표시" },
  ],
  example: {
    title: "이혼·위자료·재산분할 청구의 소 — 이혜진 v. 박정수",
    scenario:
      "혼인 12년차 부부. 피고의 외도 사실이 2025년 발각되어 이혼 결심. 미성년 자녀 2명, 공동명의 아파트 1채, 예금 약 2억원.",
    inputs: {
      plaintiffName: "이혜진",
      plaintiffBirth: "1983-07-14",
      plaintiffAddress: "서울특별시 양천구 목동중앙로 50, 102동 1503호",
      defendantName: "박정수",
      defendantAddress: "서울특별시 양천구 목동중앙로 50, 102동 1503호",
      marriageDate: "2013-05-20",
      separationDate: "2025-11-01",
      children: "박지원/2015-04-12, 박지훈/2018-09-08",
      groundsType: "1호 — 배우자의 부정한 행위",
      factSummary:
        "원고와 피고는 2013.5.20. 혼인신고. 자녀 2명을 두고 평온하게 생활해 왔으나, 2025.10. 원고는 피고의 휴대전화에서 직장 동료와 부적절한 관계를 유지한 정황을 발견. 피고는 사실을 인정하고도 관계를 정리하지 않아 원고는 2025.11.1. 자녀와 함께 친정으로 분가.",
      alimony: 30_000_000,
      propertyDivision:
        "공동명의 아파트(시가 약 12억) 원고 1/2 지분, 예금 약 2억원의 1/2(각자 명의 잔액 합산 후 정산), 피고 명의 퇴직금 중간정산금 산입.",
      custody: "박지원, 박지훈 모두 원고",
      childSupport: 1_500_000,
      court: "서울가정법원",
      firm: "법무법인 정의",
      counsel: "김지영",
    },
    flags: [
      { label: "민법 §840 1호 — 부정행위 입증자료 필수", detail: "메시지·통화내역·목격진술 등 정황증거 결합 필요." },
      { label: "위자료 — 통상 2,000만~5,000만 범위", detail: "혼인 기간·자녀 수·유책 정도에 비례. 본 사안은 3,000만원 청구 적정." },
      { label: "양육비 산정기준 — 서울가정법원 산정표 적용", detail: "부부 합산 소득·자녀 연령 기준. 추후 변경 가능성 명시." },
    ],
    sections: [
      {
        title: "당사자",
        body:
          "원   고   이혜진 (830714-*******)\n          서울특별시 양천구 목동중앙로 50, 102동 1503호\n\n피   고   박정수\n          서울특별시 양천구 목동중앙로 50, 102동 1503호\n\n사   건   이혼 및 위자료·재산분할·친권자 지정 등 청구의 소",
      },
      {
        title: "청구취지",
        body:
          "1. 원고와 피고는 이혼한다.\n2. 피고는 원고에게 위자료로 금 30,000,000원 및 이에 대한 이 사건 소장 부본 송달일 다음날부터 다 갚는 날까지 연 12%의 비율로 계산한 돈을 지급하라.\n3. 피고는 원고에게 재산분할로 별지 목록 기재 아파트 중 피고 지분 1/2을 분할하여 원고에게 이전등기절차를 이행하고, 금 100,000,000원을 지급하라.\n4. 사건본인들 박지원(2015. 4. 12.생), 박지훈(2018. 9. 8.생)의 친권자 및 양육자로 원고를 지정한다.\n5. 피고는 원고에게 사건본인들의 양육비로 각 1인당 매월 1,500,000원씩을 사건본인들이 각 성년에 이르는 날까지 매월 말일 지급하라.\n6. 소송비용은 피고가 부담한다.\n라는 판결을 구합니다.",
      },
      {
        title: "청구원인",
        body:
          "1. 혼인관계의 성립\n원고와 피고는 2013. 5. 20. 혼인신고를 마친 법률상 부부로(갑 제1호증 혼인관계증명서), 슬하에 미성년 자녀 박지원(2015. 4. 12.생), 박지훈(2018. 9. 8.생)을 두고 있습니다(갑 제2호증 가족관계증명서).\n\n2. 혼인 파탄 사유 — 피고의 부정한 행위\n원고와 피고는 평온한 혼인생활을 영위해 왔으나, 2025. 10. 원고는 피고의 휴대전화 메시지를 통해 피고가 직장 동료 김OO과 2025. 6.경부터 부적절한 관계를 유지해 온 사실을 발견하였습니다(갑 제3호증 메시지 사본).\n\n원고가 피고에게 관계 정리를 요구하였으나 피고는 이를 거부하였고, 원고는 더 이상 혼인생활을 지속할 수 없다고 판단하여 2025. 11. 1. 자녀와 함께 친정으로 분가하였습니다.\n\n피고의 위와 같은 행위는 민법 제840조 제1호 소정의 \"배우자의 부정한 행위\"에 해당하므로, 원고는 피고에 대하여 이혼을 청구합니다.\n\n3. 위자료\n피고의 부정한 행위로 인하여 원고는 극심한 정신적 고통을 받았는바, 혼인 기간(12년), 자녀의 수(2명), 피고의 유책 정도 등을 종합하여 위자료로 금 30,000,000원의 지급을 구합니다.\n\n4. 재산분할\n원고와 피고가 혼인 기간 중 공동으로 형성한 재산은 다음과 같습니다.\n  가. 서울 양천구 목동중앙로 50, 102동 1503호 아파트(공동명의, 시가 약 12억원)\n  나. 부부 양 명의 예금 합계 약 200,000,000원\n  다. 피고 명의 퇴직금 중간정산금\n\n원고는 혼인기간 동안 가사노동과 자녀양육을 전담하면서 피고의 직장생활을 적극 지원하였는바, 위 재산 형성에 대한 원고의 기여도는 최소 50%로 평가됨이 상당합니다. 이에 별지 목록 기재 아파트 중 피고 지분 1/2의 이전 및 정산금 100,000,000원의 지급을 구합니다.\n\n5. 친권·양육권·양육비\n사건본인들은 출생 이후 줄곧 원고와 강한 정서적 유대를 형성해 왔고, 분가 이후에도 원고와 함께 안정적으로 생활하고 있습니다. 사건본인들의 복리를 위하여 친권자 및 양육자를 원고로 지정함이 타당합니다.\n\n양육비는 서울가정법원 양육비 산정기준표상 부부 합산 소득 구간 및 자녀 연령을 고려할 때 1인당 월 1,500,000원이 적정합니다.",
      },
      {
        title: "입증방법",
        body:
          "1. 갑 제1호증     혼인관계증명서\n1. 갑 제2호증     가족관계증명서\n1. 갑 제3호증     메시지 사본\n1. 갑 제4호증     부동산등기사항전부증명서\n1. 갑 제5호증     예금 잔액증명서\n1. 갑 제6호증     소득금액증명원",
      },
      {
        title: "맺음말",
        body:
          "2026. 5. 15.\n\n위 원고 소송대리인\n법무법인 정의\n담당변호사   김지영\n\n서울가정법원 귀중",
      },
    ],
  },
  citationDb: "민법 §840(재판상 이혼 원인), §843(준용), §839조의2(재산분할), §909(친권), 가사소송법 §22, 양육비산정기준표(서울가정법원 2021. 12. 22.)",
};

/* ──────────────────────────────────────────────────────────────── */
/* 4. 답변서/준비서면 — korean-objection-skill                       */
/* ──────────────────────────────────────────────────────────────── */

const objection: BriefSkill = {
  slug: "korean-objection-skill",
  name: "답변서·준비서면",
  englishName: "Answer / Preparatory Brief",
  category: "민사",
  tagline: "원고 주장 반박·항변·증거제출",
  description:
    "피고 측 답변서 또는 후속 준비서면을 작성합니다. 원고 청구취지에 대한 부인·항변, 새로운 사실 주장, 추가 증거 제출을 구조화합니다.",
  icon: "✋",
  toneGuide: `- 답변서는 피고의 첫 응답 — 청구취지 전부 다툼을 명시.
- 항변(소멸시효·동시이행 등)은 청구원인 반박과 분리해 별도 항목으로.
- 원고 주장 사실관계를 인용할 때는 "원고가 주장하는…"으로 객관화.`,
  checklist: [
    { label: "사건번호·당사자 표시", required: true },
    { label: "청구취지에 대한 답변 (전부기각·일부기각)", required: true },
    { label: "청구원인에 대한 답변 — 사실 인부", required: true },
    { label: "피고의 항변 — 소멸시효·변제·상계·동시이행 등", required: false },
    { label: "입증방법 (을호증)", required: true },
    { label: "후속 준비서면 — 원고 준비서면 반박", required: false },
  ],
  fields: [
    { group: "사건", name: "caseNumber", label: "사건번호", type: "text", required: true, placeholder: "2026가단12345" },
    { group: "사건", name: "court", label: "재판부", type: "text", required: true, placeholder: "서울중앙지방법원 민사23단독" },
    { group: "당사자", name: "plaintiffName", label: "원고 성명", type: "text", required: true },
    { group: "당사자", name: "defendantName", label: "피고 성명", type: "text", required: true },
    { group: "원고 주장", name: "plaintiffClaim", label: "원고 청구 요지", type: "textarea", required: true },
    { group: "피고 입장", name: "stance", label: "응답 입장", type: "select", required: true, options: ["청구 전부 기각", "일부 기각", "조정·화해 의사 있음"] },
    { group: "피고 입장", name: "factualResponse", label: "사실관계 반박", type: "textarea", required: true, hint: "원고 주장 사실 인부 정리" },
    { group: "피고 입장", name: "defenses", label: "법률상 항변", type: "textarea", hint: "소멸시효·변제·상계·동시이행항변 등" },
    { group: "피고 입장", name: "newFacts", label: "새로운 사실 주장", type: "textarea" },
    { group: "관할·대리", name: "firm", label: "법무법인", type: "text", required: true },
    { group: "관할·대리", name: "counsel", label: "담당변호사", type: "text", required: true },
  ],
  followUpQuestions: [
    "원고가 제출한 증거 중 진정성립을 다툴 것이 있나요?",
    "조정·화해 가능성이 있다면 수용 가능한 조건은?",
    "추가로 신청할 증인·문서제출명령 대상이 있나요?",
  ],
  outputSections: [
    { title: "사건의 표시", hint: "사건번호·당사자·재판부" },
    { title: "청구취지에 대한 답변", hint: "전부기각·소송비용 부담 청구" },
    { title: "청구원인에 대한 답변", hint: "사실관계 인부 + 부인 사유" },
    { title: "피고의 항변", hint: "법률상 항변 정리 (필요 시)" },
    { title: "입증방법", hint: "을 제O호증" },
    { title: "맺음말", hint: "일자·법무법인·담당변호사·재판부" },
  ],
  example: {
    title: "대여금 청구의 소 — 답변서 (피고 김영호)",
    scenario:
      "원고가 5,000만원 대여를 주장하나, 피고는 그 중 2,000만원은 동업 투자금으로 받은 것이지 차용금이 아니라고 다투고, 나머지 3,000만원에 대해서는 상사채권 5년 소멸시효 항변을 함.",
    inputs: {
      caseNumber: "2026가단12345",
      court: "서울동부지방법원 민사5단독",
      plaintiffName: "박민수",
      defendantName: "김영호",
      plaintiffClaim:
        "원고는 2024.3.15. 피고에게 5,000만원을 변제기 6개월·연 5%로 대여하였으나 일부 변제 후 잔존 4,000만원을 지급하지 않는다고 주장.",
      stance: "일부 기각",
      factualResponse:
        "피고가 원고로부터 2024.3.15.자로 합계 5,000만원을 수령한 사실은 인정한다. 다만 그 중 2,000만원은 원고와 피고가 공동으로 진행한 '커피 트럭 사업'의 출자금이고, 차용금은 3,000만원에 한정된다.",
      defenses:
        "1) 위 3,000만원은 양 당사자가 상인이고 사업 운영자금 명목으로 수수된 것으로 상사채권에 해당하므로, 상법 제64조에 따라 5년 소멸시효가 적용되어야 한다. 2) 피고는 2025.1.10. 1,000만원을 변제하였으므로 잔존 채무는 2,000만원에 불과하다.",
      newFacts:
        "피고와 원고는 2024.3.10. 사업 동업계약을 체결하였고(을 제1호증), 2,000만원은 동업계약상 출자금으로 입금되었다(을 제2호증 메모).",
      firm: "법무법인 정의",
      counsel: "김지영",
    },
    flags: [
      { label: "상사채권 5년 시효 항변 — 상인성 입증 필요", detail: "양 당사자가 사업자등록 보유했는지, 출자금 인정 여부가 핵심." },
      { label: "동업계약·출자금 입증자료 첨부", detail: "을 제1호증(동업계약서) 필수." },
    ],
    sections: [
      {
        title: "사건의 표시",
        body:
          "사건번호  2026가단12345 대여금\n원      고  박민수\n피      고  김영호\n재  판  부  서울동부지방법원 민사5단독\n\n위 사건에 관하여 피고는 다음과 같이 답변합니다.",
      },
      {
        title: "청구취지에 대한 답변",
        body:
          "1. 원고의 청구를 기각한다.\n2. 소송비용은 원고가 부담한다.\n라는 판결을 구합니다.",
      },
      {
        title: "청구원인에 대한 답변",
        body:
          "1. 피고가 2024. 3. 15. 원고로부터 합계 50,000,000원을 수령한 사실은 인정합니다.\n\n2. 그러나 위 금원 중 20,000,000원은 차용금이 아니라, 원고와 피고가 공동으로 진행한 '커피 트럭 사업'의 출자금으로 수수된 것입니다(을 제1호증 동업계약서, 을 제2호증 메모).\n\n3. 따라서 원고가 피고에게 대여한 금액은 30,000,000원에 한정되며, 피고는 2025. 1. 10. 그 중 10,000,000원을 변제하였으므로 잔존 채무는 20,000,000원에 불과합니다.",
      },
      {
        title: "피고의 항변",
        body:
          "1. 상사채권 소멸시효\n원고와 피고는 모두 사업자등록을 보유한 상인이며, 본 대여금 30,000,000원은 사업 운영자금 명목으로 수수된 상사채권에 해당합니다(상법 제47조).\n\n상법 제64조는 상사채권의 소멸시효를 5년으로 정하고 있는바, 본 채권은 변제기인 2024. 9. 15.로부터 5년이 경과한 시점에 시효로 소멸할 예정입니다.\n\n2. 일부 변제\n피고는 2025. 1. 10. 원고에게 10,000,000원을 변제하였으므로(을 제3호증 송금내역), 청구원인 사실 중 잔존 채무 4,000만원이라는 부분은 부인합니다.",
      },
      {
        title: "입증방법",
        body:
          "1. 을 제1호증     동업계약서\n1. 을 제2호증     출자금 송금 메모\n1. 을 제3호증     일부변제 송금내역",
      },
      {
        title: "맺음말",
        body:
          "2026. 5. 15.\n\n위 피고 소송대리인\n법무법인 정의\n담당변호사   김지영\n\n서울동부지방법원 민사5단독 귀중",
      },
    ],
  },
  citationDb: "상법 §47(보조적 상행위), §64(상사시효), 민법 §492(상계), §536(동시이행항변권), 민사소송법 §256(답변서)",
};

/* ──────────────────────────────────────────────────────────────── */
/* 5. 항소이유서 — korean-appeal-skill                               */
/* ──────────────────────────────────────────────────────────────── */

const appeal: BriefSkill = {
  slug: "korean-appeal-skill",
  name: "항소이유서",
  englishName: "Appellate Brief",
  category: "민사",
  tagline: "1심 판결의 사실·법리 오류 지적",
  description:
    "민사·형사 항소이유서를 작성합니다. 1심 판결의 사실인정 오류, 법리 오해, 양형부당을 체계적으로 주장합니다.",
  icon: "📈",
  toneGuide: `- "원심은 ~ 판단하였으나, 이는 ~ 위법하다" 구조 반복.
- 항소이유는 ①사실오인 ②법리오해 ③채증법칙 위반 ④양형부당 순으로 정리.
- 1심 판결문의 페이지·줄을 명시해 인용.`,
  checklist: [
    { label: "사건번호·1심 판결문 특정", required: true },
    { label: "항소취지 (원판결 취소·청구인용·환송)", required: true },
    { label: "항소이유 1 — 사실오인", required: false },
    { label: "항소이유 2 — 법리오해", required: false },
    { label: "항소이유 3 — 채증법칙 위반", required: false },
    { label: "항소이유 4 — 양형부당 (형사)", required: false },
    { label: "결론", required: true },
  ],
  fields: [
    { group: "사건", name: "caseNumber", label: "항소심 사건번호", type: "text", required: true, placeholder: "2026나1234" },
    { group: "사건", name: "originalCase", label: "1심 사건번호", type: "text", required: true, placeholder: "2025가단9876" },
    { group: "사건", name: "originalRuling", label: "1심 판결 요지", type: "textarea", required: true, hint: "주문·이유의 핵심" },
    { group: "사건", name: "court", label: "항소심 재판부", type: "text", required: true, placeholder: "서울고등법원 제5민사부" },
    { group: "당사자", name: "appellantName", label: "항소인", type: "text", required: true },
    { group: "당사자", name: "appellantRole", label: "항소인 지위", type: "select", required: true, options: ["원고", "피고", "피고인"] },
    { group: "당사자", name: "appelleeName", label: "피항소인", type: "text", required: true },
    { group: "이유", name: "factualError", label: "사실오인 사유", type: "textarea" },
    { group: "이유", name: "legalError", label: "법리오해 사유", type: "textarea" },
    { group: "이유", name: "evidenceError", label: "채증법칙 위반 사유", type: "textarea" },
    { group: "이유", name: "sentencingError", label: "양형부당 사유 (형사)", type: "textarea" },
    { group: "관할·대리", name: "firm", label: "법무법인", type: "text", required: true },
    { group: "관할·대리", name: "counsel", label: "담당변호사", type: "text", required: true },
  ],
  followUpQuestions: [
    "1심 판결문에서 가장 결정적으로 다투고 싶은 판단 1개를 알려주세요.",
    "1심에서 제출하지 못한 새로운 증거가 있나요?",
    "유사 쟁점의 대법원 또는 동급 판례를 기억하시나요?",
  ],
  outputSections: [
    { title: "사건의 표시", hint: "항소심·1심 사건번호, 당사자" },
    { title: "항소취지", hint: "원판결 취소·청구인용 요청" },
    { title: "항소이유", hint: "①사실오인 ②법리오해 ③채증법칙 위반 ④양형부당 순으로" },
    { title: "결론", hint: "원판결 취소 및 환송·자판 요청" },
    { title: "입증방법", hint: "을 제O호증의 N (새 증거)" },
    { title: "맺음말", hint: "일자·법무법인·담당변호사·재판부" },
  ],
  example: {
    title: "대여금 청구 항소이유서 — 항소인 박민수",
    scenario:
      "1심에서 동업출자금 항변이 받아들여져 원고 일부 기각. 항소인은 동업계약서가 사후에 작성된 것으로 신빙성이 없고, 1심이 채증법칙을 위반하였다고 주장.",
    inputs: {
      caseNumber: "2026나1234",
      originalCase: "2026가단12345",
      originalRuling:
        "1심은 5,000만원 중 2,000만원을 동업출자금으로 인정하여 원고 청구를 일부 기각하고, 잔존 대여금 2,000만원만 인용함.",
      court: "서울고등법원 제5민사부",
      appellantName: "박민수",
      appellantRole: "원고",
      appelleeName: "김영호",
      factualError:
        "1심이 인정한 동업계약서(을 제1호증)는 피고가 분쟁 발생 이후인 2025.12.경 사후 작성한 것으로, 작성일자·서명 필체·종이 노화도가 위조 의심을 강하게 시사함에도 1심은 이를 진정성립 인정.",
      legalError:
        "1심은 차용증(갑 제1호증) 명문 기재('금 5,000만원을 변제기 6개월로 대여')를 무시하고 이를 동업출자금으로 변경 해석하였는바, 이는 처분문서 해석에 관한 대법원 판례(대법원 2002. 6. 28. 선고 2001다49814 판결)에 반함.",
      evidenceError:
        "1심은 피고 측 증인 1명의 진술만으로 동업관계를 인정하였는데, 위 증인은 피고의 사업 동업자로서 이해관계가 있어 신빙성이 떨어짐. 반면 원고가 제출한 카카오톡 대화(갑 제4호증) 중 피고가 '곧 빌린 돈 갚겠다'고 한 부분은 의도적으로 누락 평가.",
      sentencingError: "",
      firm: "법무법인 정의",
      counsel: "김지영",
    },
    flags: [
      { label: "처분문서 우위 원칙", detail: "차용증 명문 기재는 다른 증거로 번복하기 어려움 — 대법원 2001다49814 인용 필수." },
      { label: "위조 의심 — 감정 신청 검토", detail: "필적·종이 노화도 사실조회 또는 감정 신청 가능." },
      { label: "항소이유서 제출기한", detail: "민사 항소장 송달일로부터 20일 — 도과 시 항소 기각." },
    ],
    sections: [
      {
        title: "사건의 표시",
        body:
          "사건번호  2026나1234 대여금\n항  소  인  박민수 (1심 원고)\n피항소인  김영호 (1심 피고)\n재  판  부  서울고등법원 제5민사부\n\n위 사건에 관하여 항소인의 소송대리인은 다음과 같이 항소이유를 개진합니다.",
      },
      {
        title: "항소취지",
        body:
          "1. 원판결을 취소한다.\n2. 피고는 원고에게 금 40,000,000원 및 이에 대하여 2025. 1. 11.부터 다 갚는 날까지 연 12%의 비율로 계산한 돈을 지급하라.\n3. 소송비용은 1, 2심 모두 피고가 부담한다.\n라는 판결을 구합니다.",
      },
      {
        title: "항소이유",
        body:
          "1. 사실오인의 점\n원심은 피고가 제출한 동업계약서(을 제1호증)를 진정성립 있는 것으로 인정하여 2,000만원을 동업출자금으로 판단하였습니다.\n\n그러나 위 동업계약서는 ① 작성일자가 2024. 3. 10.로 기재되어 있으나 본 분쟁이 발생한 2025. 11. 이후에 비로소 등장하였고, ② 종이의 노화도·필체의 잉크 변색 정도가 1년 이상 경과한 문서와 일치하지 않으며(원심 변론기일 검증결과 참조), ③ 동업계약상 핵심사항인 손익분배비율·해산조건 조항이 누락되어 있어, 사후 작성된 위조문서로 보아야 합니다.\n\n원심은 위와 같은 의심 정황을 모두 도외시한 채 피고 측 증인 1인의 진술만으로 진정성립을 인정하였는바, 이는 명백한 사실오인입니다.\n\n2. 법리오해의 점\n원심은 차용증(갑 제1호증)에 \"금 5,000만원을 변제기 6개월로 대여\"라고 명확히 기재되어 있음에도 그 중 2,000만원 부분을 동업출자금으로 변경 해석하였습니다.\n\n대법원은 \"처분문서는 그 진정성립이 인정되는 이상 그 기재 내용을 부인할 만한 분명하고도 수긍할 수 있는 반증이 없는 한 그 기재 내용에 따른 의사표시의 존재 및 내용을 인정하여야 한다\"고 일관되게 판시하고 있습니다(대법원 2002. 6. 28. 선고 2001다49814 판결).\n\n원심은 위 법리에 반하여 처분문서의 명문 기재를 합리적 근거 없이 무시하였는바, 이는 처분문서 해석에 관한 법리를 오해한 위법이 있습니다.\n\n3. 채증법칙 위반의 점\n원심이 동업관계 인정의 핵심 근거로 삼은 피고 측 증인 김OO은 피고와 사업상 동업관계에 있어 본 사건 결과에 직접적 이해관계가 있는 자로서, 그 진술의 신빙성이 현저히 떨어집니다.\n\n반면 원고가 제출한 카카오톡 대화(갑 제4호증) 중 피고가 \"곧 빌린 돈 갚겠다\"고 명시적으로 인정한 부분이 있음에도 원심은 이를 양형 또는 부수적 사정으로 평가절하하였는바, 이는 자유심증주의의 한계를 벗어난 채증법칙 위반에 해당합니다.",
      },
      {
        title: "결론",
        body:
          "이상 살펴본 바와 같이 원판결에는 사실오인·법리오해·채증법칙 위반의 위법이 있어 그대로 유지될 수 없습니다.\n\n부디 귀 재판부께서 원판결을 취소하고 항소인의 청구를 전부 인용하여 주시기 바랍니다.",
      },
      {
        title: "입증방법",
        body:
          "1. 갑 제5호증     필적 감정촉탁 회신서\n1. 갑 제6호증     동업계약서 진정성립 부인 진술서\n1. 갑 제7호증     카카오톡 대화 전체본",
      },
      {
        title: "맺음말",
        body:
          "2026. 5. 15.\n\n위 항소인 소송대리인\n법무법인 정의\n담당변호사   김지영\n\n서울고등법원 제5민사부 귀중",
      },
    ],
  },
  citationDb: "민사소송법 §390(항소), §396(항소이유서), 대법원 2002. 6. 28. 선고 2001다49814 판결(처분문서)",
};

/* ──────────────────────────────────────────────────────────────── */

export const BRIEF_SKILLS: BriefSkill[] = [
  civilComplaint,
  criminalDefense,
  divorcePetition,
  objection,
  appeal,
];

export function getBriefSkill(slug: string): BriefSkill | null {
  return BRIEF_SKILLS.find((s) => s.slug === slug) ?? null;
}
