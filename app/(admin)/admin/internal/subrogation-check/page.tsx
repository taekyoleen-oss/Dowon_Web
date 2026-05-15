import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SubrogationCheckForm } from "@/components/tools/subrogation-check-form";

export const metadata = { title: "구상 가능성 자가진단 — 내부망" };

export default function AdminSubrogationCheckPage() {
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
        Subrogation Check
      </h1>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">구상 가능성 자가진단</p>
      <p className="mt-6 max-w-prose font-serif-ko text-body-lg text-ink-soft leading-base">
        사고 정보를 입력하면 구상 가능성 등급, 예상 회수율, 권장 액션(위임·자체 처리·포기)을
        안내합니다. 보험사·손해사정 실무진의 위임 의사결정 도구입니다.
        <span className="block mt-2 text-ink-mute">
          본 결과는 일반 정보이며 법률 자문이 아닙니다. 최종 위임 결정은 법무팀·외부 자문 검토 후
          진행해 주세요.
        </span>
      </p>

      <div className="mt-12 max-w-7xl">
        <SubrogationCheckForm />
      </div>
    </div>
  );
}
