import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  Scale,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow, Button } from "@/components/ui";
import { ContractReviewForm } from "@/components/tools/contract-review-form";

export const metadata = {
  title: "영문 계약서 1차 검토 (AI · B2B)",
  description:
    "기업 고객을 위한 영문 계약서 1차 검토 어시스턴트. SPA, JV, License, NDA 등 영문 계약서를 통째로 분석해 위험 조항, 한국법 관점 검토 포인트, 변호사 검토 필수 항목을 안내합니다. 본 도구는 법률 자문이 아닙니다.",
};

export default function ContractReviewPage() {
  return (
    <>
      <section className="section-y">
        <Container size="wide">
          {/* breadcrumb */}
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-label text-ink-mute hover:text-ink"
          >
            <ArrowLeft size={11} aria-hidden /> AI 도구 전체 보기
          </Link>

          <Eyebrow index={5} className="mt-6">
            AI · CONTRACT REVIEW
          </Eyebrow>
          <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
            Contract Pre-Review
          </h1>
          <p className="mt-3 font-serif-ko text-h2 text-ink">
            영문 계약서 1차 검토 어시스턴트
          </p>
          <p className="mt-8 max-w-[40em] font-serif-ko text-body-lg text-ink-soft leading-base">
            영문 SPA·JV·License·NDA·MSA를 통째로 업로드하시면, AI가 양 당사자 의무를 한·영으로
            병기해 정리하고, 준거법·관할·손해배상 한도·일방 해지권 같은 위험 조항을 등급별로
            플래깅합니다. 정식 자문 의뢰 전에 어떤 부분이 문제일 가능성이 큰지 미리 보실 수
            있습니다.
            <br />
            <span className="text-ink-mute">
              본 결과는 사전 정리이며 법률 자문이 아닙니다. 실제 계약 체결 전에는 변호사 검토가
              필요합니다.
            </span>
          </p>

          {/* Value props for first-time visitors */}
          <div className="mt-10 grid gap-4 md:grid-cols-3 max-w-5xl">
            <ValueCard
              icon={FileText}
              title="긴 계약서도 한 번에"
              body="Claude Opus의 긴 컨텍스트로 수백 페이지 SPA·JV 계약을 분할 없이 통째로 분석합니다. PDF 또는 텍스트 붙여넣기 모두 지원합니다."
            />
            <ValueCard
              icon={AlertTriangle}
              title="위험 조항 가시화"
              body="준거법·전속관할·손해배상 한도·일방 해지권·IP 양도 등 한국 당사자에게 불리해질 수 있는 조항을 Critical/High/Medium 등급으로 분류합니다."
            />
            <ValueCard
              icon={Scale}
              title="한국법 교차 검토"
              body="약관규제법·공정거래법·외국환거래법 등 한국법 측면에서 추가 검토가 필요한 부분을 따로 정리해 드립니다."
            />
          </div>

          {/* How it works */}
          <div className="mt-14 rounded-md border border-paper-3 bg-paper-2 p-6 lg:p-8 max-w-5xl">
            <p className="label-mono text-gold inline-flex items-center gap-1.5">
              <BookOpen size={12} aria-hidden /> 사용 방법
            </p>
            <h2 className="mt-3 font-serif-ko text-h2 font-semibold text-ink">
              세 단계로 끝나는 1차 검토
            </h2>
            <ol className="mt-6 grid gap-5 md:grid-cols-3">
              <Step
                n="01"
                title="계약서 업로드"
                body="PDF를 드래그 앤 드롭하거나, 본문을 텍스트로 직접 붙여넣으세요. PDF는 25MB까지, 텍스트는 약 100,000 토큰까지 지원합니다."
              />
              <Step
                n="02"
                title="AI 1차 분석"
                body="30초~2분 내에 계약 유형, 양 당사자 의무, 위험 조항, 한국법 관점, 변호사 검토 필수 항목이 정리됩니다."
              />
              <Step
                n="03"
                title="결과 검토 → 자문 의뢰"
                body="Markdown으로 결과를 복사해 사내 검토에 활용하거나, 위험 조항을 짚어 바로 도원 자문 의뢰로 이어가실 수 있습니다."
              />
            </ol>
          </div>

          {/* Use cases */}
          <div className="mt-10 max-w-5xl">
            <p className="label-mono text-gold">활용 예시</p>
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {[
                "해외 거래처와의 SPA·MSA 1차 검토",
                "외국 라이선서가 보낸 License Agreement 사전 분석",
                "JV / Shareholders' Agreement 위험 조항 가시화",
                "NDA 양식 빠른 스크리닝 (수십 건 일괄)",
                "외국 본사가 송부한 본사 표준 계약 검토 전 준비",
                "M&A Due Diligence 진행 중 대량 계약 분류",
              ].map((u, i) => (
                <li
                  key={i}
                  className="font-serif-ko text-[14px] text-ink-soft leading-base"
                >
                  <span className="text-gold-deep mr-1.5">·</span>
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="wide">
          <ContractReviewForm />
        </Container>
      </section>

      <section className="section-y">
        <Container size="base" className="text-center">
          <Eyebrow>NEXT</Eyebrow>
          <h2 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
            정식 자문이 필요하시면
          </h2>
          <p className="mt-5 mx-auto max-w-xl font-serif-ko text-body-lg text-ink-soft">
            1차 검토 결과를 가지고 도원 기업 자문팀에 의뢰하시면, 위험 조항 협상안과 한국법
            대응 전략을 함께 제공해 드립니다.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/contact/enterprise" variant="primary" size="lg">
              기업 자문 의뢰
            </Button>
            <Button href="/practice/advisory" variant="secondary" size="lg">
              기업 자문 분야 보기
            </Button>
          </div>
        </Container>
      </section>
    </>
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
