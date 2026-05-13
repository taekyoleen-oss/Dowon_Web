import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";

export const metadata = { title: "AI 초안 큐 — 어드민" };

type Row = {
  id: string;
  title: string;
  case_number: string | null;
  created_at: string;
  reviewer_id: string | null;
};

async function getQueue(): Promise<Row[]> {
  if (!hasSupabaseConfig()) return [];
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("cases")
    .select("id, title, case_number, created_at, reviewer_id")
    .eq("ai_generated", true)
    .eq("is_published", false)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error(error);
    return [];
  }
  return (data as Row[]) ?? [];
}

export default async function AiQueueAdmin() {
  const rows = await getQueue();

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-label text-gold">AI QUEUE</p>
      <h1 className="mt-3 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-tight">
        Drafts pending review
      </h1>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">AI가 생성한 판례 초안 검수 큐</p>

      <p className="mt-6 font-serif-ko text-body text-ink-soft max-w-[40em] leading-base">
        판결 자동 요약 파이프라인(AI #6)이 매일 02:00에 신규 판례를 수집·요약합니다.
        변호사가 본 페이지에서 검토·승인하면 라이브러리에 자동 발행됩니다.
      </p>

      {rows.length === 0 ? (
        <div className="mt-10 border border-dashed border-paper-3 rounded-md p-12 text-center">
          <p className="font-serif-ko text-h3 text-ink-soft">대기 중인 AI 초안이 없습니다.</p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-label text-ink-mute">
            cron 파이프라인 가동 후 자동으로 채워집니다.
          </p>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-paper-3 border-y border-paper-3">
          {rows.map((r) => (
            <li
              key={r.id}
              className="py-5 grid gap-4 md:grid-cols-[110px_1fr_140px] items-baseline"
            >
              <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
                {r.created_at.slice(0, 10)}
              </p>
              <div>
                <p className="font-serif-ko text-h3 font-semibold text-ink">{r.title}</p>
                {r.case_number && (
                  <p className="mt-1 font-mono text-[11px] text-ink-mute">{r.case_number}</p>
                )}
              </div>
              <p className="font-mono text-[11px] uppercase tracking-label text-gold-deep">
                {r.reviewer_id ? "REVIEWING" : "PENDING"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
