import Link from "next/link";
import { Sparkles } from "lucide-react";
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

async function getRows(): Promise<Row[]> {
  if (!hasSupabaseConfig()) return [];
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("consultation_requests")
    .select("id, persona, status, contact_info, case_summary, intake_session_id, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error(error);
    return [];
  }
  return (data as Row[]) ?? [];
}

const personaLabel: Record<string, string> = {
  insurer: "보험사·손해사정사",
  enterprise: "기업 자문",
  medical: "의료분쟁",
  personal: "개인 사건",
};

export default async function ConsultationsAdmin() {
  const rows = await getRows();

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-label text-gold">CONSULTATIONS</p>
      <h1 className="mt-3 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-tight">
        Inbox
      </h1>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">최근 상담 신청 50건</p>

      {rows.length === 0 ? (
        <div className="mt-10 border border-dashed border-paper-3 rounded-md p-12 text-center">
          <p className="font-serif-ko text-h3 text-ink-soft">표시할 상담이 없습니다.</p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-label text-ink-mute">
            Supabase 환경변수 설정과 폼 제출 발생 후 자동으로 채워집니다.
          </p>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto">
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
