"use client";

import * as React from "react";
import { BellRing, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Admin dashboard button that fires a test notification through the
 * normal notifyConsultation() pipeline. Confirms Resend (and Slack, when
 * keyed) without faking a real form submission.
 */
export function TestNotifyButton() {
  const [state, setState] = React.useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "ok"; message: string }
    | { kind: "err"; message: string }
  >({ kind: "idle" });

  const send = async () => {
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/admin/test-notify", { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ kind: "err", message: body.message ?? `오류 ${res.status}` });
        return;
      }
      setState({ kind: "ok", message: body.message ?? "발송 완료" });
    } catch (e) {
      setState({
        kind: "err",
        message: e instanceof Error ? e.message : "네트워크 오류",
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={send}
        disabled={state.kind === "loading"}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2.5 rounded-sm",
          "border border-ink bg-paper text-ink",
          "font-sans-ko text-[13.5px] font-medium",
          "hover:bg-paper-2 transition-colors",
          "disabled:opacity-60 disabled:cursor-not-allowed"
        )}
      >
        <BellRing size={14} aria-hidden />
        {state.kind === "loading" ? "발송 중..." : "테스트 알림 발송"}
      </button>

      {state.kind === "ok" && (
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-label text-forest">
          <CheckCircle2 size={13} aria-hidden /> {state.message}
        </span>
      )}
      {state.kind === "err" && (
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-label text-rust">
          <AlertCircle size={13} aria-hidden /> {state.message}
        </span>
      )}
    </div>
  );
}
