import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  Scale,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { ContractReviewForm } from "@/components/tools/contract-review-form";

export const metadata = { title: "영문 계약서 1차 검토 — 내부망" };

export default function AdminContractReviewPage() {
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
        Contract Pre-Review
      </h1>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">
        영문 계약서 1차 검토 어시스턴트
      </p>
      <p className="mt-6 max-w-prose font-serif-ko text-body-lg text-ink-soft leading-base">
        영문 SPA·JV·License·NDA·MSA를 업로드하면 양 당사자 의무를 한·영으로 정리하고, 준거법·관할·
        손해배상 한도·일방 해지권 등 위험 조항을 등급별로 플래깅합니다. 정식 자문 의뢰 전 검토
        포인트를 빠르게 추출해 내부 의사결정에 활용합니다.
        <span className="block mt-2 text-ink-mute">
          본 결과는 사전 정리이며 법률 자문이 아닙니다. 실제 계약 체결 전에는 변호사 직접 검토가
          필요합니다.
        </span>
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3 max-w-5xl">
        <ValueCard
          icon={FileText}
          title="긴 계약서도 한 번에"
          body="Claude Opus의 긴 컨텍스트로 수백 페이지 SPA·JV 계약을 분할 없이 통째로 분석합니다."
        />
        <ValueCard
          icon={AlertTriangle}
          title="위험 조항 가시화"
          body="준거법·전속관할·손해배상 한도·일방 해지권 등 한국 당사자에게 불리한 조항을 Critical/High/Medium으로 분류합니다."
        />
        <ValueCard
          icon={Scale}
          title="한국법 교차 검토"
          body="약관규제법·공정거래법·외국환거래법 등 한국법 측면에서 추가 검토가 필요한 부분을 따로 정리합니다."
        />
      </div>

      <div className="mt-12 rounded-md border border-paper-3 bg-paper-2 p-6 lg:p-8 max-w-5xl">
        <p className="font-mono text-[11px] uppercase tracking-label text-gold inline-flex items-center gap-1.5">
          <BookOpen size={12} aria-hidden /> 사용 방법
        </p>
        <h2 className="mt-3 font-serif-ko text-h2 font-semibold text-ink">
          세 단계로 끝나는 1차 검토
        </h2>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          <Step
            n="01"
            title="계약서 업로드"
            body="PDF (최대 25MB) 또는 본문 텍스트 (최대 ~100k 토큰)를 입력합니다."
          />
          <Step
            n="02"
            title="AI 1차 분석"
            body="30초~2분 내에 메타·의무·위험 조항·한국법 검토 포인트가 정리됩니다."
          />
          <Step
            n="03"
            title="결과 활용"
            body="Markdown으로 복사해 내부 검토에 활용하거나 자문서 작성에 바로 인용합니다."
          />
        </ol>
      </div>

      <div className="mt-12 max-w-7xl">
        <ContractReviewForm />
      </div>
    </div>
  );
}

function ValueCard({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-md border border-paper-3 bg-paper p-5">
      <div className="inline-flex items-center justify-center h-10 w-10 rounded-sm bg-paper-2 text-gold-deep">
        <Icon size={18} aria-hidden />
      </div>
      <h3 className="mt-4 font-serif-ko text-[16px] font-semibold text-ink leading-snug">
        {title}
      </h3>
      <p className="mt-2 font-serif-ko text-[13.5px] text-ink-soft leading-base">
        {body}
      </p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li>
      <p className="font-mono text-[10.5px] uppercase tracking-label text-gold-deep">
        STEP {n}
      </p>
      <h3 className="mt-1 font-serif-ko text-[16px] font-semibold text-ink leading-snug">
        {title}
      </h3>
      <p className="mt-2 font-serif-ko text-[13.5px] text-ink-soft leading-base">
        {body}
      </p>
    </li>
  );
}
