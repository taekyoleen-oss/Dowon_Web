import Link from "next/link";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";

export const metadata = { title: "AI 감사 로그 — 어드민" };

type Row = {
  id: string;
  tool_name: string;
  user_id: string | null;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  tokens_used: number | null;
  duration_ms: number | null;
  created_at: string;
};

const PAGE_SIZE = 50;

// Known tool names — keep in sync with /api/ai/*/route.ts recordAudit calls.
const KNOWN_TOOLS = [
  "triage",
  "intake",
  "coverage-check",
  "subrogation-check",
  "policy-analyze",
  "medical-analyze",
  "lawyer-match",
  "library-search",
];

async function getRows(opts: {
  tool: string | null;
  offset: number;
}): Promise<{ rows: Row[]; total: number }> {
  if (!hasSupabaseConfig()) return { rows: [], total: 0 };
  const supabase = getServerSupabase();
  let q = supabase
    .from("ai_audit_logs")
    .select(
      "id, tool_name, user_id, input, output, tokens_used, duration_ms, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(opts.offset, opts.offset + PAGE_SIZE - 1);
  if (opts.tool) q = q.eq("tool_name", opts.tool);
  const { data, error, count } = await q;
  if (error) {
    console.error("[admin/audit-logs]", error);
    return { rows: [], total: 0 };
  }
  return { rows: (data as Row[]) ?? [], total: count ?? 0 };
}

export default async function AuditLogsAdmin({
  searchParams,
}: {
  searchParams: { tool?: string; page?: string };
}) {
  const tool = searchParams.tool ?? null;
  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const offset = (page - 1) * PAGE_SIZE;
  const { rows, total } = await getRows({ tool, offset });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-label text-gold">AUDIT LOGS</p>
      <h1 className="mt-3 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-tight">
        AI activity
      </h1>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">
        AI 도구 호출 감사 로그 · 총 {total.toLocaleString("ko-KR")}건
      </p>

      {/* Filter — server-side via URL params */}
      <form className="mt-8 flex flex-wrap items-end gap-3 border-y border-paper-3 py-5">
        <div>
          <label
            htmlFor="tool"
            className="block font-mono text-[11px] uppercase tracking-label text-ink-mute mb-1.5"
          >
            도구
          </label>
          <select
            id="tool"
            name="tool"
            defaultValue={tool ?? ""}
            className="rounded-sm border border-paper-3 bg-paper px-3 py-2 font-serif-ko text-[14px] text-ink focus:border-ink focus:outline-none"
          >
            <option value="">전체</option>
            {KNOWN_TOOLS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-sm border border-ink bg-ink px-4 py-2 font-sans-ko text-[13px] font-medium text-paper hover:bg-night"
        >
          적용
        </button>
        {tool && (
          <Link
            href="/admin/audit-logs"
            className="font-mono text-[11px] uppercase tracking-label text-ink-mute hover:text-ink"
          >
            필터 초기화
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <div className="mt-10 border border-dashed border-paper-3 rounded-md p-12 text-center">
          <p className="font-serif-ko text-h3 text-ink-soft">
            {hasSupabaseConfig()
              ? "표시할 로그가 없습니다."
              : "Supabase 미설정 — 환경변수 설정 후 자동으로 채워집니다."}
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-paper-3">
                <th className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                  시각 (KST)
                </th>
                <th className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                  도구
                </th>
                <th className="text-right py-3 pr-4 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                  토큰
                </th>
                <th className="text-right py-3 pr-4 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                  소요(ms)
                </th>
                <th className="text-left py-3 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                  Input · Output
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-paper-3 align-top hover:bg-paper-2 transition-colors"
                >
                  <td className="py-3 pr-4 font-mono text-[12px] text-ink-soft whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString("ko-KR", {
                      timeZone: "Asia/Seoul",
                    })}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[12px] text-ink">
                    {r.tool_name}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[12px] text-ink-soft text-right">
                    {r.tokens_used ?? "—"}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[12px] text-ink-soft text-right">
                    {r.duration_ms ?? "—"}
                  </td>
                  <td className="py-3">
                    <details className="group">
                      <summary className="font-mono text-[11px] uppercase tracking-label text-ink-mute cursor-pointer hover:text-ink">
                        펼치기
                      </summary>
                      <div className="mt-2 grid gap-2 md:grid-cols-2 max-w-[680px]">
                        <pre className="overflow-x-auto rounded-sm border border-paper-3 bg-paper-2 p-3 font-mono text-[11px] text-ink-soft leading-relaxed">
                          <b className="block mb-1 text-ink">input</b>
                          {JSON.stringify(r.input ?? {}, null, 2)}
                        </pre>
                        <pre className="overflow-x-auto rounded-sm border border-paper-3 bg-paper-2 p-3 font-mono text-[11px] text-ink-soft leading-relaxed">
                          <b className="block mb-1 text-ink">output</b>
                          {JSON.stringify(r.output ?? {}, null, 2)}
                        </pre>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <nav
          aria-label="페이지"
          className="mt-8 flex items-center gap-2 font-mono text-[12px]"
        >
          {page > 1 && (
            <Link
              href={{ query: { ...searchParams, page: String(page - 1) } }}
              className="px-3 py-1.5 border border-paper-3 rounded-sm text-ink-soft hover:border-ink hover:text-ink"
            >
              ← 이전
            </Link>
          )}
          <span className="px-3 py-1.5 text-ink-mute">
            {page} / {pages}
          </span>
          {page < pages && (
            <Link
              href={{ query: { ...searchParams, page: String(page + 1) } }}
              className="px-3 py-1.5 border border-paper-3 rounded-sm text-ink-soft hover:border-ink hover:text-ink"
            >
              다음 →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
