import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PolicyReader } from "@/components/tools/policy-reader";

export const metadata = {
  title: "약관 분석 — 내부망",
  robots: { index: false, follow: false },
};

export default function AdminPolicyReaderPage() {
  return (
    <div>
      <Link
        href="/admin/internal"
        className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-label text-ink-mute hover:text-ink"
      >
        <ArrowLeft size={11} aria-hidden /> 내부망 업무
      </Link>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-label text-gold">
        INTERNAL · 보험사·기업 자문
      </p>
      <h1 className="mt-3 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-tight">
        Policy Reader
      </h1>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">약관 분석</p>
      <p className="mt-6 max-w-prose font-serif-ko text-body-lg text-ink-soft leading-base">
        약관·증권 PDF에서 보장 항목·면책 사유를 구조화해 추출합니다. 업로드된 PDF는 분석 후
        24시간 내 자동 삭제됩니다.
      </p>

      <div className="mt-12 max-w-7xl">
        <PolicyReader />
      </div>
    </div>
  );
}
