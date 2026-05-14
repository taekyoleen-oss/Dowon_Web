import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import { embed, hasOpenAIConfig } from "@/lib/ai/openai";
import { withAudit } from "@/lib/ai/audit";
import { checkRateLimit } from "@/lib/ai/rate-limit";

export const runtime = "nodejs";
// Embedding + RPC + audit insert can take a few seconds on cold start.
export const maxDuration = 30;

/**
 * Focused statute Q&A — only searches legal_provisions (no cases/columns).
 *
 * Differs from /api/ai/library-search:
 *   - Returns more results (default 15, max 30) so users can scan the
 *     relevant article list
 *   - Returns FULL article_body, not a 160-char snippet
 *   - Supports optional law_name filter for "{this specific law}에서…"
 *     style questions
 *   - Skips the Claude rerank step — laws are short enough that pure
 *     cosine ranking is fine
 */
const bodySchema = z.object({
  query: z.string().min(1).max(500),
  top_k: z.number().min(1).max(30).default(15),
  law_name: z.string().optional(),
});

type LawRow = {
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

export async function POST(req: Request) {
  const limited = await checkRateLimit(req, "search");
  if (limited) return limited;

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!hasOpenAIConfig() || !hasSupabaseConfig()) {
    return NextResponse.json({
      results: [],
      message: "검색 인프라가 설정되지 않았습니다.",
    });
  }

  // Wrap the whole pipeline so any failure (embed timeout, RPC error,
  // audit insert) returns a JSON body. Without this, an uncaught throw
  // bubbles to Next.js as a 500 with empty body, which the client
  // sees as "Unexpected end of JSON input".
  try {
    const result = await withAudit("laws-search", body, async () => {
      const qEmbedding = await embed(body.query);
      const supabase = getServerSupabase();

      // Over-fetch when filtering by law_name so the filter doesn't
      // starve the result list to fewer than top_k items.
      const fetchN = body.law_name ? body.top_k * 5 : body.top_k * 2;

      const rpc = await supabase.rpc("match_legal_provisions", {
        query_embedding: qEmbedding,
        match_count: Math.min(fetchN, 50),
      });
      if (rpc.error) {
        throw new Error(`match_legal_provisions failed: ${rpc.error.message}`);
      }

      let rows = (rpc.data ?? []) as LawRow[];
      if (body.law_name) {
        rows = rows.filter((r) => r.law_name === body.law_name);
      }
      rows = rows
        .filter((r) => typeof r.similarity === "number" && r.similarity > 0.2)
        .slice(0, body.top_k);

      const results = rows.map((r) => ({
        id: r.id,
        law_name: r.law_name,
        article_number: r.article_number,
        article_title: r.article_title ?? "",
        article_body: r.article_body,
        enforcement_date: r.enforcement_date,
        similarity: Number(r.similarity?.toFixed(3) ?? 0),
        source_url: r.source_url,
      }));

      return { output: { results } };
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("[laws-search] failed:", e);
    return NextResponse.json(
      {
        results: [],
        error:
          e instanceof Error
            ? e.message
            : "검색 중 알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
