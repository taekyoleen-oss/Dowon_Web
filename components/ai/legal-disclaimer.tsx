import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Standard footer on every AI tool. PRD §6.3 #1, §9.1.
 * MUST be present on screens that surface AI responses.
 */
export function LegalDisclaimer({ className }: { className?: string }) {
  return (
    <aside
      role="note"
      className={cn(
        "rounded-sm bg-paper-2 border border-paper-3 p-4 lg:p-5",
        "flex gap-3",
        className
      )}
    >
      <ShieldCheck size={18} aria-hidden className="shrink-0 mt-0.5 text-gold-deep" />
      <div>
        <p className="font-mono text-[11px] uppercase tracking-label text-gold-deep">
          LEGAL NOTICE
        </p>
        <p className="mt-2 font-serif-ko text-[13.5px] text-ink-soft leading-base">
          본 도구가 제공하는 정보는 일반적인 안내이며, 구체적 사건에 대한 법률 자문이
          아닙니다. 승소 가능성·결과를 단정하지 않습니다. 실제 사건은 변호사와의
          상담을 통해 진행하시기 바랍니다. (변호사법 제23조 광고 규제 준수)
        </p>
      </div>
    </aside>
  );
}
