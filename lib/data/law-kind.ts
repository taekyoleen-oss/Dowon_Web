/**
 * Shared helpers for the legal_provisions table — distinguishes statutes
 * (법률·시행령·시행규칙·특별법) from administrative rules (감독규정·세칙·고시·
 * 예규) and formats article labels per Korean legal citation convention.
 *
 * Statute and admrul rows share one table and one match RPC, so detection
 * is name-based. The two namespaces use different article-number
 * conventions, which is why the formatter forks on kind.
 */
export type LawKind = "statute" | "admrul";

export function classifyLaw(name: string): LawKind {
  if (/(법|법률|시행령|시행규칙|특별법)$/.test(name)) return "statute";
  return "admrul";
}

/**
 * Render an article_number into its display label.
 *
 *   Statute "40"   → "제40조"
 *   Statute "85-4" → "제85조의4"   (Article 85-4, inserted between 85 and 86)
 *   Admrul "1-2"   → "제1-2조"     (Chapter 1, Article 2 — 감독규정 convention)
 *   Admrul "1-2-2" → "제1-2조의2"  (Chapter 1, Article 2-2)
 */
export function formatArticleLabel(num: string, kind: LawKind): string {
  if (kind === "admrul") {
    // Trailing segment after the LAST "-" is the 조의 branch, if there are
    // at least 3 segments. Two-segment numbers are chapter-article only.
    const parts = num.split("-");
    if (parts.length >= 3) {
      const branch = parts.pop()!;
      return `제${parts.join("-")}조의${branch}`;
    }
    return `제${num}조`;
  }
  // Statute: "-" separates the 조의 branch.
  const [base, branch] = num.split("-");
  return branch ? `제${base}조의${branch}` : `제${base}조`;
}
