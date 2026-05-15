/**
 * Lawyer routing — shared between /api/ai/triage and /api/ai/intake.
 *
 * The triage tool emits a matter_type (PracticeAreaCode) after classifying
 * the user's natural-language description; both surfaces want to suggest
 * the top N matching lawyers so the client can show them in the side
 * panel before the user submits.
 *
 * For richer matching (case-text overlap, special qualifications) the
 * Confirmation Modal calls /api/ai/lawyer-match. This helper is the
 * lightweight version that runs inline during streaming turns.
 */

import { lawyers, practiceAreaLabels, type PracticeAreaCode } from "@/lib/data/lawyers";

export const PRACTICE_AREA_CODES: PracticeAreaCode[] = [
  "auto", "long-term", "fire", "liability", "life",
  "medical", "subrogation", "investigation", "advisory", "criminal",
];

export type SuggestedLawyer = {
  id: string;
  name: string;
  match_reason: string;
  match_score: number;
};

/**
 * Triage matter codes (PracticeAreaCode-style) -> direct match against
 * lawyer.practiceAreas. Use matchLawyersByMatter for intake's broader
 * MatterType taxonomy.
 */
export function matchLawyers(matter: string, limit = 3): SuggestedLawyer[] {
  const isPracticeCode = (PRACTICE_AREA_CODES as string[]).includes(matter);
  const scored = lawyers
    .map((l) => {
      let score = 0;
      if (isPracticeCode && l.practiceAreas.includes(matter as PracticeAreaCode)) score += 3;
      if (matter === "medical" && l.specialQualifications?.includes("의사")) score += 2;
      if (l.isPartner) score += 0.5;
      return { l, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ l, score }) => ({
    id: l.slug,
    name: l.nameKo,
    match_reason:
      isPracticeCode && l.practiceAreas.includes(matter as PracticeAreaCode)
        ? `${practiceAreaLabels[matter as PracticeAreaCode]} 전담 변호사`
        : "관련 분야 변호사",
    match_score: Number((score / 5).toFixed(2)),
  }));
}

/**
 * Map intake's broader MatterType ("auto", "medical", "insurance",
 * "contract", "employment", "consumer", "criminal", "real_estate", "other")
 * to one or more PracticeAreaCodes, then call matchLawyers.
 */
const MATTER_TO_PRACTICE: Record<string, PracticeAreaCode[]> = {
  auto: ["auto"],
  medical: ["medical"],
  insurance: ["long-term", "life", "fire", "liability"],
  contract: ["advisory"],
  employment: ["advisory"],
  consumer: ["advisory"],
  criminal: ["criminal", "investigation"],
  real_estate: ["advisory"],
  other: [],
};

export function matchLawyersByMatter(
  matter: string | null,
  limit = 3
): SuggestedLawyer[] {
  if (!matter) return [];
  if ((PRACTICE_AREA_CODES as string[]).includes(matter)) {
    return matchLawyers(matter, limit);
  }
  const areas = MATTER_TO_PRACTICE[matter] ?? [];
  if (areas.length === 0) return [];

  const scored = lawyers
    .map((l) => {
      const overlap = areas.filter((a) => l.practiceAreas.includes(a));
      let score = 0;
      if (overlap.length > 0) score += 3 * overlap.length;
      if (matter === "medical" && l.specialQualifications?.includes("의사")) score += 2;
      if (l.isPartner) score += 0.5;
      return { l, score, overlap };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ l, score, overlap }) => ({
    id: l.slug,
    name: l.nameKo,
    match_reason:
      overlap.length > 0
        ? `${overlap.map((a) => practiceAreaLabels[a]).join("·")} 전담`
        : "관련 분야 변호사",
    match_score: Number((score / 6).toFixed(2)),
  }));
}
