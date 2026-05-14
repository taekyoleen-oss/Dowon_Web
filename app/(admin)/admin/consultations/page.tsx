import Link from "next/link";
import { Sparkles, Search } from "lucide-react";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";

export const metadata = { title: "상담 신청 — 어드민" };

type Row = {
  id: string;
  persona: string;
  status: string;
  contact_info: Record<string, unknown>;
  case_summary: string;
  intake_session_id: string | null;
  created_at: string;
};

const PAGE_SIZE = 50;

const personaLabel: Record<string, string> = {
  insurer: "보험사·손해사정사",
  enterprise: "기업 자문",
  medical: "의료분쟁",
  personal: "개인 사건",
};

// Status values aren't enforced server-side yet — these match what's
// emitted by the form actions and what /admin/consultations/[id] sets.
const STATUS_VALUES = ["new", "in_progress", "responded", "closed"];

async function getRows(opts: {
  persona: string | null;
  status: string | null;
  q: string | null;
}): Promise<{ rows: Row[]; total: number }> {
  if (!hasSupabaseConfig()) return { rows: [], total: 0 };
  const supabase = getServerSupabase();
  let query = supabase
    .from("consultation_requests")
    .select(
      "id, persona, status, contact_info, case_summary, intake_session_id, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);
  if (opts.persona) query = query.eq("persona", opts.persona);
  if (opts.status) query = query.eq("status", opts.status);
  if (opts.q) {
    // case_summary is the only large text column. contact_info is jsonb
    // and harder to ilike-search from PostgREST without an RPC. Keep
    // search scoped to the summary for now.
    query = query.ilike("case_summary", `%${opts.q}%`);
  }
  const { data, error, count } = await query;
  if (error) {
    console.error("[admin/consultations]", error);
    return { rows: [], total: 0 };
  }
  return { rows: (data as Row[]) ?? [], total: count ?? 0 };
}

export default async function ConsultationsAdmin({
  searchParams,
}: {
  searchParams: { persona?: string; status?: string; q?: string };
}) {
  const persona = searchParams.persona ?? null;
  const status = searchParams.status ?? null;
  const q = searchParams.q?.trim() || null;
  const { rows, total } = await getRows({ persona, status, q });
  const filterActive = !!(persona || status || q);

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-label text-gold">CONSULTATIONS</p>
      <h1 className="mt-3 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-tight">
        Inbox
      </h1>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">
        {filterActive
          ? `필터 적용 ${rows.length.toLocaleString("ko-KR")}건 (최대 ${PAGE_SIZE}건)`
          : `최근 ${rows.length.toLocaleString("ko-KR")}건${total > PAGE_SIZE ? ` / 전체 ${total.toLocaleString("ko-KR")}건` : ""}`}
      </p>

      {/* Filters — server-side via URL params */}
      <form className="mt-8 grid gap-3 border-y border-paper-3 py-5 md:grid-cols-[1fr_auto_auto_auto_auto]">
        <div>
          <label
            htmlFor="q"
            className="block font-mono text-[11px] uppercase tracking-label text-ink-mute mb-1.5"
          >
            검색 (사건 개요)
          </label>
          <div className="relative">
            <Search
              size={15}
              aria-hidden
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute"
            />
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q ?? ""}
              placeholder="예: 음주, 무보험차상해, 의료사고…"
              className="w-full rounded-sm border border-paper-3 bg-paper pl-9 pr-3 py-2 font-serif-ko text-[14px] text-ink placeholder:text-ink-mute focus:border-ink focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="persona"
            className="block font-mono text-[11px] uppercase tracking-label text-ink-mute mb-1.5"
          >
            페르소나
          </label>
          <select
            id="persona"
            name="persona"
            defaultValue={persona ?? ""}
            className="w-full rounded-sm border border-paper-3 bg-paper px-3 py-2 font-serif-ko text-[14px] text-ink focus:border-ink focus:outline-none"
          >
            <option value="">전체</option>
            {Object.entries(personaLabel).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="status"
            className="block font-mono text-[11px] uppercase tracking-label text-ink-mute mb-1.5"
          >
            상태
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status ?? ""}
            className="w-full rounded-sm border border-paper-3 bg-paper px-3 py-2 font-serif-ko text-[14px] text-ink focus:border-ink focus:outline-none"
          >
            <option value="">전체</option>
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="rounded-sm border border-ink bg-ink px-4 py-2 font-sans-ko text-[13px] font-medium text-paper hover:bg-night"
          >
            적용
          </button>
        </div>
        <div className="flex items-end">
          {filterActive && (
            <Link
              href="/admin/consultations"
              className="font-mono text-[11px] uppercase tracking-label text-ink-mute hover:text-ink pb-2"
            >
              초기화
            </Link>
          )}
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="mt-10 border border-dashed border-paper-3 rounded-md p-12 text-center">
          <p className="font-serif-ko text-h3 text-ink-soft">
            {filterActive
              ? "조건에 맞는 상담이 없습니다."
              : "표시할 상담이 없습니다."}
          </p>
          {!filterActive && (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-label text-ink-mute">
              Supabase 환경변수 설정과 폼 제출 발생 후 자동으로 채워집니다.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-paper-3">
                <th className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-label text-ink-mute">접수일</th>
                <th className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-label text-ink-mute">출처</th>
                <th className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-label text-ink-mute">페르소나</th>
                <th className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-label text-ink-mute">연락처</th>
                <th className="text-left py-3 pr-4 font-mono text-[11px] uppercase tracking-label text-ink-mute">사건 개요</th>
                <th className="text-left py-3 font-mono text-[11px] uppercase tracking-label text-ink-mute">상태</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const contact = r.contact_info as Record<string, unknown>;
                const name = String(
                  contact.contactName ?? contact.patientName ?? contact.applicantName ?? "—"
                );
                return (
                  <tr key={r.id} className="border-b border-paper-3 align-top hover:bg-paper-2 transition-colors">
                    <td className="py-4 pr-4 font-mono text-[12px] text-ink-mute">
                      <Link href={`/admin/consultations/${r.id}`} className="block">
                        {r.created_at.slice(0, 10)}
                      </Link>
                    </td>
                    <td className="py-4 pr-4">
                      <Link href={`/admin/consultations/${r.id}`} className="block">
                        {r.intake_session_id ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-gold-deep text-paper font-mono text-[10px] uppercase tracking-label">
                            <Sparkles size={10} aria-hidden /> AI INTAKE
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] uppercase tracking-label text-ink-mute">FORM</span>
                        )}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 font-serif-ko text-[14px] text-ink">
                      <Link href={`/admin/consultations/${r.id}`} className="block">
                        {personaLabel[r.persona] ?? r.persona}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 font-serif-ko text-[14px] text-ink-soft">
                      <Link href={`/admin/consultations/${r.id}`} className="block">
                        {name}
                        <br />
                        <span className="font-mono text-[11px] text-ink-mute">
                          {String(contact.phone ?? "")}
                        </span>
                      </Link>
                    </td>
                    <td className="py-4 pr-4 font-serif-ko text-[14px] text-ink-soft leading-base">
                      <Link href={`/admin/consultations/${r.id}`} className="block">
                        <span className="line-clamp-3">{r.case_summary}</span>
                      </Link>
                    </td>
                    <td className="py-4 font-mono text-[11px] uppercase tracking-label text-ink">
                      <Link href={`/admin/consultations/${r.id}`} className="block">
                        {r.status}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
