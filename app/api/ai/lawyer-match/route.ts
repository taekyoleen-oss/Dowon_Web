import { NextResponse } from "next/server";
import { z } from "zod";
import { lawyers, practiceAreaLabels, type PracticeAreaCode } from "@/lib/data/lawyers";
import { withAudit } from "@/lib/ai/audit";

export const runtime = "nodejs";

const PRACTICE_AREA_CODES: PracticeAreaCode[] = [
  "auto","long-term","fire","liability","life",
  "medical","subrogation","investigation","advisory","criminal",
];

const bodySchema = z.object({
  caseContext: z.string().min(1),
  practiceAreas: z.array(z.enum(PRACTICE_AREA_CODES as [string, ...string[]])).optional(),
  preferences: z.array(z.string()).optional(),
  limit: z.number().min(1).max(10).default(3),
});

export async function POST(req: Request) {
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await withAudit("lawyer-match", body, async () => {
    const wantsMedicalQualification =
      body.preferences?.some((p) => p.includes("의사")) ||
      body.practiceAreas?.includes("medical");

    const scored = lawyers
      .map((l) => {
        let score = 0;
        const matches: string[] = [];

        // Practice area match
        if (body.practiceAreas?.length) {
          const intersect = body.practiceAreas.filter((pa) =>
            l.practiceAreas.includes(pa as PracticeAreaCode)
          );
          if (intersect.length > 0) {
            score += 3 * intersect.length;
            matches.push(
              `${intersect.map((pa) => practiceAreaLabels[pa as PracticeAreaCode]).join("·")} 전담`
            );
          }
        }

        // Text overlap (basic; Phase 3 will use embeddings)
        const text =
          (l.bioShort + " " + l.cases.map((c) => c.issue).join(" ")).toLowerCase();
        const terms = body.caseContext.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
        const hits = terms.filter((t) => text.includes(t)).length;
        if (hits > 0) {
          score += 0.6 * hits;
          matches.push("사건 설명과 키워드 일치");
        }

        // Special qualification preference
        if (wantsMedicalQualification && l.specialQualifications?.includes("의사")) {
          score += 2.5;
          matches.push("의사 자격 보유");
        }

        // Partner weighting
        if (l.isPartner) score += 0.3;

        return { lawyer: l, score, matches };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, body.limit);

    const matches = scored.map(({ lawyer, score, matches }) => ({
      lawyer_id: lawyer.slug,
      name: lawyer.nameKo,
      match_score: Number((score / 6).toFixed(2)),
      match_reasons: matches,
      relevant_cases: lawyer.cases.slice(0, 2).map((c, i) => ({
        id: `${lawyer.slug}-case-${i}`,
        title: c.issue,
      })),
    }));

    return { output: { matches } };
  });

  return NextResponse.json(result);
}
