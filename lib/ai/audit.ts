/**
 * AI audit logging — PRD §6.3 (감사 로그) and §9.4 (감사 로그 1년 이상 보관).
 *
 * Every public AI tool MUST call recordAudit at request boundary.
 * Falls back to console log when Supabase is not configured (dev).
 */
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";

export type AuditEntry = {
  toolName: string;
  userId?: string | null;
  input: unknown;
  output: unknown;
  tokensUsed?: number;
  durationMs: number;
};

export async function recordAudit(entry: AuditEntry) {
  if (!hasSupabaseConfig()) {
    console.log("[ai:audit:noop]", entry.toolName, {
      durationMs: entry.durationMs,
      tokensUsed: entry.tokensUsed,
    });
    return;
  }
  const supabase = getServerSupabase();
  const { error } = await supabase.from("ai_audit_logs").insert({
    tool_name: entry.toolName,
    user_id: entry.userId ?? null,
    input: entry.input as object,
    output: entry.output as object,
    tokens_used: entry.tokensUsed ?? null,
    duration_ms: entry.durationMs,
  });
  if (error) console.error("[ai:audit:error]", error);
}

/** Wrap an async fn with timing + audit recording. */
export async function withAudit<T>(
  toolName: string,
  input: unknown,
  fn: () => Promise<{ output: T; tokensUsed?: number }>
): Promise<T> {
  const t0 = Date.now();
  try {
    const { output, tokensUsed } = await fn();
    await recordAudit({
      toolName,
      input,
      output,
      tokensUsed,
      durationMs: Date.now() - t0,
    });
    return output;
  } catch (e) {
    await recordAudit({
      toolName,
      input,
      output: { error: e instanceof Error ? e.message : String(e) },
      durationMs: Date.now() - t0,
    });
    throw e;
  }
}
