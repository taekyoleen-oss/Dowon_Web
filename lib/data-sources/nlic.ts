/**
 * 국가법령정보 OPEN API 클라이언트.
 *
 * Portal: https://open.law.go.kr
 * Docs: 회원가입 후 마이페이지 → OPEN API 가이드.
 *
 * 인증키(OC)는 본인이 정한 사용자 ID입니다. 토큰이 아니라 식별자라,
 * NEXT_PUBLIC_ prefix 없이 서버 사이드에서만 호출합니다. 일일 호출
 * 한도(기본 1,000회) 보호를 위해 fetch에 Next.js 캐시를 답니다.
 *
 * 본 클라이언트는 raw API 응답을 그대로 돌려줍니다. 적재(ingest) 시
 * 응답을 평탄화(flatten)해 Supabase에 저장합니다 — scripts/ingest-nlic.ts
 * 참조.
 */

const BASE = "http://www.law.go.kr/DRF";

const oc = () => {
  const v = process.env.NLIC_API_KEY;
  if (!v) {
    throw new Error(
      "NLIC_API_KEY missing — set it in .env.local with the OC value " +
        "from open.law.go.kr."
    );
  }
  return v;
};

// ── Types — minimal, matching the bits we actually use ─────────────

export type NlicLawHit = {
  법령ID: string;
  법령명한글: string;
  법령구분명: string;
  소관부처명?: string;
  시행일자?: string;
  공포일자?: string;
  공포번호?: string;
  법령상세링크?: string;
};

type NlicHo = { 호번호?: string; 호내용?: string };
type NlicHang = {
  항번호?: string;
  항내용?: string;
  호?: NlicHo | NlicHo[];
};

export type NlicArticle = {
  조문번호?: string;
  조문가지번호?: string | number;
  조문제목?: string;
  조문내용?: string;
  // NLIC returns a single object when there's only one sub-element,
  // an array when there are many. asArray() normalises this.
  항?: NlicHang | NlicHang[];
};

/** Coerce NLIC's "single object or array" fields into an array. */
function asArray<T>(v: T | T[] | undefined | null): T[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

export type NlicLawBody = {
  법령?: {
    기본정보?: {
      법령ID?: string;
      법령명_한글?: string;
      시행일자?: string;
      공포일자?: string;
      공포번호?: string;
      법령구분?: string;
      소관부처?: { content?: string };
    };
    조문?: { 조문단위?: NlicArticle | NlicArticle[] };
  };
};

export type NlicPrecHit = {
  판례일련번호: string;
  사건명: string;
  사건번호?: string;
  선고일자?: string;
  법원명?: string;
  판결유형?: string;
  사건종류명?: string;
  판례상세링크?: string;
};

// ── Public functions ──────────────────────────────────────────────

/**
 * Generic search across NLIC targets.
 * @param target  "law" | "prec" | "admrul" | "expc" | "detc" | ...
 *
 * NLIC sometimes drops requests with transient network errors. We retry
 * once after a short backoff before bubbling the failure up.
 */
async function search(
  target: string,
  params: Record<string, string>,
  opts: { display?: number; page?: number } = {}
) {
  const url = new URL(`${BASE}/lawSearch.do`);
  url.searchParams.set("OC", oc());
  url.searchParams.set("target", target);
  url.searchParams.set("type", "JSON");
  url.searchParams.set("display", String(opts.display ?? 100));
  if (opts.page) url.searchParams.set("page", String(opts.page));
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "user-agent": "DowonWeb/1.0 (https://www.dowonlaw.com)" },
        next: { revalidate: 60 * 60 * 24 },
      });
      if (!res.ok) {
        throw new Error(`NLIC ${target} search ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      if (attempt === 1) throw e;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  // Unreachable — TypeScript doesn't know the loop always returns/throws.
  throw new Error(`NLIC ${target} search exhausted retries`);
}

/**
 * Search laws by name. NLIC's `lawSearch.do` defaults to full-text
 * search (`search=2`) — given "보험업법" it returns every law whose
 * BODY mentions any of those tokens, which produced the earlier
 * 유료도로법·도로정비촉진법 ingest. The `search=1` switch restricts
 * the query to the law-name field only, which is what we actually
 * want. (Confirmed working — the response carries `section: "lawNm"`.)
 *
 * We do NOT filter by 법령구분 (rrClsCd) — early experiments showed
 * the code we tried (010201) filtered out 법률 entirely, returning
 * totalCnt=0. The resolver in scripts/ingest-nlic.ts already prefers
 * hits whose 법령구분명 includes "법률" over 시행령·시행규칙, so the
 * downstream sort handles the noise.
 */
export async function searchLaws(name: string, display = 100) {
  return search(
    "law",
    {
      query: name,
      search: "1", // 1 = 법령명, 2 = 본문 (default)
    },
    { display }
  );
}

export async function searchPrecedents(query: string, display = 30) {
  return search("prec", { query }, { display });
}

/** Fetch a law's full text by MST (법령마스터ID) or ID. */
export async function fetchLawBody(
  identifier: { MST: string } | { ID: string }
): Promise<NlicLawBody> {
  const url = new URL(`${BASE}/lawService.do`);
  url.searchParams.set("OC", oc());
  url.searchParams.set("target", "law");
  url.searchParams.set("type", "JSON");
  if ("MST" in identifier) url.searchParams.set("MST", identifier.MST);
  else url.searchParams.set("ID", identifier.ID);

  const res = await fetch(url, {
    headers: { "user-agent": "DowonWeb/1.0 (https://www.dowonlaw.com)" },
    // Statute text changes rarely — weekly cache is plenty
    next: { revalidate: 60 * 60 * 24 * 7 },
  });
  if (!res.ok) throw new Error(`NLIC law body ${res.status}`);
  return res.json();
}

/** Fetch a single precedent's full body by serial number (판례일련번호). */
export async function fetchPrecedentBody(serial: string) {
  const url = new URL(`${BASE}/lawService.do`);
  url.searchParams.set("OC", oc());
  url.searchParams.set("target", "prec");
  url.searchParams.set("type", "JSON");
  url.searchParams.set("ID", serial);

  const res = await fetch(url, {
    headers: { "user-agent": "DowonWeb/1.0 (https://www.dowonlaw.com)" },
    next: { revalidate: 60 * 60 * 24 * 30 }, // precedents are immutable
  });
  if (!res.ok) throw new Error(`NLIC prec body ${res.status}`);
  return res.json();
}

/**
 * Normalise a law body response into flat per-article rows ready for
 * embedding. The API returns nested 조문 / 항 / 호 — we flatten to
 * (법령ID, 조문번호, 조문제목, 조문본문) tuples.
 *
 * Robustness notes:
 *  - 조문단위 / 항 / 호 each return as a bare object when there's only
 *    one — asArray() handles that.
 *  - 조문가지번호 = 0 / "0" / "" all mean "no branch" (i.e. 제12조,
 *    not 제12조의2). We treat them as absent.
 *  - Articles with neither 조문내용 nor 항/호 content are skipped (they
 *    appear in the response for deleted/reserved article slots).
 *  - Within a single law, duplicate (조문번호 + 가지) are de-duped —
 *    NLIC occasionally returns the same article twice for historical/
 *    transitional reasons, which would otherwise blow up the upsert
 *    with "ON CONFLICT DO UPDATE command cannot affect row a second time".
 */
export function flattenLawArticles(body: NlicLawBody): Array<{
  lawId: string;
  lawName: string;
  promulgationDate?: string;
  enforcementDate?: string;
  articleNumber: string;
  articleTitle: string;
  articleBody: string;
}> {
  const law = body.법령;
  if (!law) return [];
  const info = law.기본정보 ?? {};
  const lawId = info.법령ID ?? "";
  const lawName = info.법령명_한글 ?? "";
  if (!lawId || !lawName) return [];

  const articles = asArray(law.조문?.조문단위);
  const rows: ReturnType<typeof flattenLawArticles> = [];
  const seen = new Set<string>();

  for (const a of articles) {
    const branchRaw = a.조문가지번호;
    const branchStr = branchRaw == null ? "" : String(branchRaw).trim();
    const hasBranch = branchStr !== "" && branchStr !== "0";
    const baseNum = String(a.조문번호 ?? "").trim();
    if (!baseNum) continue;
    const num = hasBranch ? `${baseNum}-${branchStr}` : baseNum;

    if (seen.has(num)) continue;
    seen.add(num);

    // Flatten 항 → 호 tree into newline-joined lines
    const hangLines = asArray(a.항)
      .map((h) => {
        const hoLines = asArray(h.호)
          .map((o) => `  ${o.호번호 ?? ""} ${o.호내용 ?? ""}`.trim())
          .filter(Boolean);
        const head = `${h.항번호 ?? ""} ${h.항내용 ?? ""}`.trim();
        return [head, ...hoLines].filter(Boolean).join("\n");
      })
      .filter(Boolean);

    const articleBody = [a.조문내용 ?? "", ...hangLines]
      .filter((s) => s && s.trim())
      .join("\n");

    if (!articleBody.trim()) continue;

    rows.push({
      lawId,
      lawName,
      promulgationDate: info.공포일자,
      enforcementDate: info.시행일자,
      articleNumber: num,
      articleTitle: a.조문제목 ?? "",
      articleBody,
    });
  }

  return rows;
}
