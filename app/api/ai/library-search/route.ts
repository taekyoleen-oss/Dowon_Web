import { NextResponse } from "next/server";
import { z } from "zod";
import { libraryItems } from "@/lib/data/library";
import { practiceAreaLabels, getLawyerBySlug, type PracticeAreaCode } from "@/lib/data/lawyers";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import { embed, hasOpenAIConfig } from "@/lib/ai/openai";
import { getAnthropic, hasAnthropicConfig, CLAUDE_MODEL } from "@/lib/ai/anthropic";
import { withAudit } from "@/lib/ai/audit";
import { checkRateLimit } from "@/lib/ai/rate-limit";

export const runtime = "nodejs";

const PRACTICE_AREA_CODES: PracticeAreaCode[] = [
  "auto","long-term","fire","liability","life",
  "medical","subrogation","investigation","advisory","criminal",
];

// Row shape returned by match_legal_provisions RPC.
type LawHit = {
  id: string;
  law_id: string;
  law_name: string;
  article_number: string;
  article_title: string | null;
  article_body: string;
  enforcement_date: string | null;
  source_url: string | null;
  similarity: number;
};

/**
 * Chapter divider rows (제N장/편/절/관 ...) carry no provisions but
 * embed close to topical queries — drop them so unified search shows
 * real articles only. Real provisions always contain a "제N조" marker.
 */
function isLawDivider(body: string): boolean {
  const t = (body ?? "").trim();
  if (!t) return true;
  return !/제\s*\d+(?:의\s*\d+)?\s*조/.test(t);
}

const bodySchema = z.object({
  query: z.string().min(1),
  filters: z
    .object({
      type: z.enum(["case", "column", "media"]).optional(),
      practice_area: z.array(z.enum(PRACTICE_AREA_CODES as [string, ...string[]])).optional(),
      lawyer: z.array(z.string()).optional(),
      year_from: z.number().optional(),
      year_to: z.number().optional(),
    })
    .optional(),
  top_k: z.number().min(1).max(50).default(10),
});

function keywordScore(item: (typeof libraryItems)[number], q: string) {
  const text =
    (item.title +
      " " +
      item.excerpt +
      " " +
      (item.issue ?? "") +
      " " +
      (item.conclusion ?? "") +
      " " +
      (item.insight ?? "")).toLowerCase();
  const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  let s = 0;
  for (const t of terms) if (text.includes(t)) s += 1;
  return s;
}

export async function POST(req: Request) {
  const limited = await checkRateLimit(req, "search");
  if (limited) return limited;

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await withAudit("library-search", body, async () => {
    // 1) Coarse candidate set — pgvector if available, else local data.
    //    We also pull statute articles from legal_provisions on the same
    //    embedding so the answer can cite 법령 alongside 칼럼·판례.
    let candidates: typeof libraryItems = [...libraryItems];
    let lawHits: LawHit[] = [];

    if (hasOpenAIConfig() && hasSupabaseConfig()) {
      try {
        const qEmbedding = await embed(body.query);
        const supabase = getServerSupabase();
        const [casesRes, columnsRes, lawsRes] = await Promise.all([
          supabase.rpc("match_cases", { query_embedding: qEmbedding, match_count: 20 }),
          supabase.rpc("match_columns", { query_embedding: qEmbedding, match_count: 20 }),
          supabase.rpc("match_legal_provisions", { query_embedding: qEmbedding, match_count: 20 }),
        ]);
        if (!casesRes.error && !columnsRes.error) {
          const merged = [...(casesRes.data ?? []), ...(columnsRes.data ?? [])];
          if (merged.length > 0) {
            const bySlug = new Map(libraryItems.map((it) => [it.slug, it]));
            candidates = merged
              .map((row: { slug: string }) => bySlug.get(row.slug))
              .filter((x): x is (typeof libraryItems)[number] => !!x);
          }
        }
        if (!lawsRes.error && lawsRes.data) {
          lawHits = (lawsRes.data as LawHit[])
            .filter((h) => typeof h.similarity === "number" && h.similarity > 0.25)
            .filter((h) => !isLawDivider(h.article_body))
            .slice(0, 6);
        }
      } catch (e) {
        console.warn("[library-search] pgvector path failed, falling back:", e);
      }
    }

    // 2) Apply filters
    let filtered = candidates;
    if (body.filters?.type) filtered = filtered.filter((it) => it.type === body.filters!.type);
    if (body.filters?.practice_area?.length) {
      filtered = filtered.filter((it) =>
        body.filters!.practice_area!.some((pa) => it.practiceAreas.includes(pa as PracticeAreaCode))
      );
    }
    if (body.filters?.lawyer?.length) {
      filtered = filtered.filter(
        (it) =>
          (it.authorSlug && body.filters!.lawyer!.includes(it.authorSlug)) ||
          it.lawyerSlugs?.some((s) => body.filters!.lawyer!.includes(s))
      );
    }
    if (body.filters?.year_from) {
      filtered = filtered.filter((it) => Number(it.publishedAt.slice(0, 4)) >= body.filters!.year_from!);
    }
    if (body.filters?.year_to) {
      filtered = filtered.filter((it) => Number(it.publishedAt.slice(0, 4)) <= body.filters!.year_to!);
    }

    // 3) Keyword scoring (always applied as a tie-breaker / fallback)
    const scored = filtered
      .map((it) => ({ it, score: keywordScore(it, body.query) }))
      .sort((a, b) => b.score - a.score);

    let top = scored.slice(0, Math.max(body.top_k, 20));

    // 4) Optional Claude rerank for top results
    if (hasAnthropicConfig() && top.length > 1) {
      try {
        const anthropic = getAnthropic();
        const list = top
          .map(({ it }, i) => `${i}. ${it.type} · ${it.title}\n   ${it.excerpt}`)
          .join("\n");
        const rerank = await anthropic.messages.create({
          model: CLAUDE_MODEL,
          max_tokens: 200,
          system:
            "You rerank legal library results for relevance to a Korean user query. " +
            "Respond ONLY with a JSON array of integer indices from most to least relevant.",
          messages: [
            {
              role: "user",
              content: `질문: ${body.query}\n\n후보:\n${list}\n\n관련성 순서로 인덱스만 JSON 배열로 반환하세요.`,
            },
          ],
        });
        const text =
          rerank.content.filter((c) => c.type === "text").map((c) => ("text" in c ? c.text : "")).join("");
        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");
        if (start >= 0 && end > start) {
          const order: number[] = JSON.parse(text.slice(start, end + 1));
          const reordered = order
            .map((i) => top[i])
            .filter((x): x is (typeof top)[number] => !!x);
          if (reordered.length > 0) top = reordered;
        }
      } catch (e) {
        console.warn("[library-search] rerank skipped:", e);
      }
    }

    top = top.slice(0, body.top_k);

    const results = top.map(({ it, score }) => {
      const lawyer = it.authorSlug
        ? getLawyerBySlug(it.authorSlug)
        : it.lawyerSlugs?.[0]
        ? getLawyerBySlug(it.lawyerSlugs[0])
        : null;
      return {
        id: it.slug,
        type: it.type,
        title: it.title,
        snippet: it.excerpt,
        relevance_score: score,
        practice_area: it.practiceAreas.map((pa) => practiceAreaLabels[pa]),
        lawyer: lawyer ? { id: lawyer.slug, name: lawyer.nameKo } : null,
        published_at: it.publishedAt,
        url:
          it.type === "case"
            ? `/library/cases/${it.slug}`
            : it.type === "column"
            ? `/library/columns/${it.slug}`
            : `/library/media#${it.slug}`,
      };
    });

    // Snippet — first ~160 chars of the article body, single-line.
    const snip = (s: string, n = 160) => {
      const flat = s.replace(/\s+/g, " ").trim();
      return flat.length > n ? `${flat.slice(0, n)}…` : flat;
    };

    const laws = lawHits.map((h) => ({
      id: h.id,
      type: "law" as const,
      law_name: h.law_name,
      article_number: h.article_number,
      article_title: h.article_title ?? "",
      snippet: snip(h.article_body),
      enforcement_date: h.enforcement_date,
      similarity: Number(h.similarity?.toFixed(3) ?? 0),
      source_url: h.source_url,
    }));

    return {
      output: {
        results,
        laws,
        related_queries: [
          `${body.query} 관련 판례`,
          `${body.query} 관련 칼럼`,
        ],
      },
    };
  });

  return NextResponse.json(result);
}
