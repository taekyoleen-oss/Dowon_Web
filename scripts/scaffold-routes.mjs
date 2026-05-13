#!/usr/bin/env node
/**
 * Scaffold placeholder pages for every route in PRD Section 3.1.
 * Idempotent — skips files that already exist.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

/** route, eyebrow, displayEn, headingKo, lead */
const routes = [
  // About
  ["(marketing)/about",                "ABOUT",              "About Dowon",         "도원 소개",       "법무법인 도원의 철학·역사·접근 방식."],
  ["(marketing)/about/philosophy",     "PHILOSOPHY",         "Philosophy",          "철학·인사말",      "도원이 지향하는 법률 서비스의 원칙."],
  ["(marketing)/about/capability",     "CAPABILITY",         "Integrated Model",    "통합 모델",        "조사 → 소송 → 구상 → 추심을 한 팀에서 끝내는 도원의 핵심 차별점."],
  ["(marketing)/about/history",        "HISTORY",            "History",             "연혁",            "도원이 걸어온 길."],
  ["(marketing)/about/contact",        "VISIT",              "Visit & Contact",     "오시는 길·문의",   "서울 서초 본사 위치와 일반 문의."],

  // Practice
  ["(marketing)/practice",                       "PRACTICE",       "Practice Areas",        "업무분야",                 "손해보험·생명보험에서 의료분쟁까지, 도원의 5대 영역."],
  ["(marketing)/practice/insurance",             "INSURANCE",      "Insurance",             "손해보험·생명보험",         "자동차·장기·화재·배상책임·생명 5개 영역의 통합 대응."],
  ["(marketing)/practice/insurance/auto",        "AUTO",           "Auto Insurance",        "자동차보험",               "교통사고·자동차 보험 분쟁 전반."],
  ["(marketing)/practice/insurance/long-term",   "LONG-TERM",      "Long-term Insurance",   "장기보험",                 "암·실손·후유장해 등 장기보험 분쟁."],
  ["(marketing)/practice/insurance/fire",        "FIRE",           "Fire Insurance",        "화재보험",                 "화재·재산상 손해 보상."],
  ["(marketing)/practice/insurance/liability",   "LIABILITY",      "Liability Insurance",   "배상책임보험",             "일반·전문직 배상책임."],
  ["(marketing)/practice/insurance/life",        "LIFE",           "Life Insurance",        "생명보험",                 "사망·재해·진단 생명보험 분쟁."],
  ["(marketing)/practice/medical",               "MEDICAL",        "Medical Disputes",      "의료분쟁",                 "의사 자격 변호사가 함께 검토하는 의료분쟁 전문 영역."],
  ["(marketing)/practice/advisory",              "ADVISORY",       "Legal Advisory",        "법률자문",                 "보험사·기업 대상 산업별 자문 서비스."],
  ["(marketing)/practice/investigation",         "INVESTIGATION",  "Investigation",         "민간조사·형사소송",         "민간조사센터와 형사 대응."],
  ["(marketing)/practice/subrogation",           "SUBROGATION",    "Subrogation",           "구상·고액보상·합의절충",    "구상권 회수와 합의 절충."],

  // People
  ["(marketing)/people",            "PEOPLE",     "People",      "구성원",          "도원을 구성하는 변호사·고문·전문위원."],
  ["(marketing)/people/lawyers",    "LAWYERS",    "Lawyers",     "변호사",          "전문분야·특수자격 필터로 적합한 변호사를 찾을 수 있습니다."],
  ["(marketing)/people/fellows",    "FELLOWS",    "Fellows",     "고문·전문위원",    "산업·실무 전문가 네트워크."],
  ["(marketing)/people/recovery",   "RECOVERY",   "Recovery",    "채권회수팀",       "판결 이후 회수까지 책임지는 팀."],
  ["(marketing)/people/management", "MANAGEMENT", "Management",  "경영관리팀",       "프로젝트·행정·고객 관리."],

  // Centers
  ["(marketing)/centers/investigation", "CENTER · INVESTIGATION", "Investigation Center", "민간조사센터",       "보험사기·위장사고 조사부터 소송 연계까지."],
  ["(marketing)/centers/medical",       "CENTER · MEDICAL",       "Medical Center",       "의료분쟁지원센터",    "의무기록 분석 → 의학 검토 → 법률 검토를 한 곳에서."],

  // Library
  ["(marketing)/library",         "LIBRARY",  "Library",        "라이브러리",         "판례·칼럼·강의를 검색·필터로 탐색."],
  ["(marketing)/library/cases",   "CASES",    "Case Briefs",    "판례",              "도원이 정리한 보험·의료·구상 판례."],
  ["(marketing)/library/columns", "COLUMNS",  "Columns",        "칼럼",              "변호사들의 약관 해석·실무 칼럼."],
  ["(marketing)/library/media",   "MEDIA",    "Media",          "강의·컨설팅",        "외부 강의·자문 미디어 자료."],
  ["(marketing)/library/search",  "SEARCH",   "Semantic Search","통합 검색",          "자연어 기반 의미 검색 (AI #2 · Phase 2)."],

  // Clients
  ["(marketing)/clients", "CLIENTS", "Clients & Partners", "고객사·협력사", "도원과 함께하는 보험사·기업·기관."],

  // Contact
  ["(marketing)/contact",            "CONTACT",            "Contact",                  "상담 신청",        "어떤 사건이신가요? 4개의 페르소나별 상담 폼을 안내합니다."],
  ["(marketing)/contact/insurer",    "B2B · INSURER",      "For Insurers",             "보험사·손해사정사", "자문계약·SIU 협업·구상 위임 요청."],
  ["(marketing)/contact/enterprise", "B2B · ENTERPRISE",   "For Enterprises",          "기업 법률자문",     "산업별 자문 계약 문의."],
  ["(marketing)/contact/medical",    "MEDICAL",            "Medical Dispute Intake",   "의료분쟁",         "의료사고 상담 — 의무기록 보유 여부 확인 포함."],
  ["(marketing)/contact/personal",   "PERSONAL",           "Personal Case Intake",     "개인 사건의뢰",     "1차 상담은 무료입니다."],

  // Tools (AI)
  ["(tools)/tools/triage",            "AI · TRIAGE",       "Case Triage",           "사건 유형 진단",    "자연어로 상황을 설명하면 사건 유형과 필요 자료를 안내합니다. (Phase 2)"],
  ["(tools)/tools/subrogation-check", "AI · SUBROGATION",  "Subrogation Check",     "구상 가능성 자가진단", "보험사 실무자용 구상 가능성 빠른 진단. (Phase 2)"],
  ["(tools)/tools/policy-reader",     "AI · POLICY",       "Policy Reader",         "약관 분석",         "PDF 약관·증권을 업로드해 조항을 분석합니다. (Phase 3 · 로그인 필요)"],
];

const dynamicRoutes = [
  // [route, eyebrow, displayEn, headingKo, lead, paramName]
  ["(marketing)/people/lawyers/[slug]", "LAWYER",  "Lawyer Profile", "변호사 상세",   "전문분야·대표 사건·관련 칼럼·판례.",   "slug"],
  ["(marketing)/library/cases/[slug]",  "CASE",    "Case Brief",     "판례 상세",     "쟁점·결론·시사점과 담당 변호사 연결.", "slug"],
  ["(marketing)/library/columns/[slug]","COLUMN",  "Column",         "칼럼 상세",     "변호사 칼럼 본문.",                 "slug"],
];

function staticPageContent({ eyebrow, displayEn, headingKo, lead }) {
  return `import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow=${JSON.stringify(eyebrow)}
      display=${JSON.stringify(displayEn)}
      heading=${JSON.stringify(headingKo)}
      lead=${JSON.stringify(lead)}
    />
  );
}
`;
}

function dynamicPageContent({ eyebrow, displayEn, headingKo, lead, paramName }) {
  return `import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function Page({
  params,
}: {
  params: { ${paramName}: string };
}) {
  return (
    <PagePlaceholder
      eyebrow=${JSON.stringify(eyebrow)}
      display=${JSON.stringify(displayEn)}
      heading={\`${headingKo} · \${params.${paramName}}\`}
      lead=${JSON.stringify(lead)}
    />
  );
}
`;
}

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function writePage(route, content) {
  const dir = join(ROOT, "app", route);
  const file = join(dir, "page.tsx");
  if (await exists(file)) {
    process.stdout.write(`  skip   ${route}/page.tsx\n`);
    return;
  }
  await mkdir(dir, { recursive: true });
  await writeFile(file, content, "utf8");
  process.stdout.write(`  create ${route}/page.tsx\n`);
}

for (const [route, eyebrow, displayEn, headingKo, lead] of routes) {
  await writePage(route, staticPageContent({ eyebrow, displayEn, headingKo, lead }));
}
for (const [route, eyebrow, displayEn, headingKo, lead, paramName] of dynamicRoutes) {
  await writePage(route, dynamicPageContent({ eyebrow, displayEn, headingKo, lead, paramName }));
}

console.log("\n✓ Route scaffolding complete.");
