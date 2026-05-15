"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";

type Section = { title: string; body: string };

export function BriefExampleDownload({
  skillSlug,
  documentTitle,
  fileBase,
  sections,
  flags,
}: {
  skillSlug: string;
  documentTitle: string;
  fileBase: string;
  sections: Section[];
  flags?: { label: string; detail: string }[];
}) {
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const click = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/briefs/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillSlug,
          documentTitle,
          sections,
          flags: flags ?? [],
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileBase}_예시.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "다운로드 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={click}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-ink text-paper font-sans-ko text-[13.5px] font-medium hover:bg-night disabled:opacity-60"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        예시 .docx 다운로드
      </button>
      {err && <p className="font-mono text-[11px] text-rust">{err}</p>}
    </div>
  );
}
