import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { PersonalForm } from "@/components/contact/personal-form";

export const metadata = { title: "개인 사건 상담" };

export default function PersonalContactPage() {
  return (
    <section className="section-y">
      <Container size="narrow">
        <Eyebrow index={1}>PERSONAL CASES</Eyebrow>
        <h1 className="mt-4 font-serif-ko text-h1 text-ink font-semibold">
          개인 사건 상담
        </h1>
        <p className="mt-4 font-serif-ko text-body-lg text-ink-soft leading-base">
          1차 상담은 무료입니다. 가능한 범위에서 가장 정확한 첫 안내를 드립니다.
          상담 신청 전 사건 정보를 AI와 함께 정리하시면 변호사가 더 빠르게 응대할 수 있습니다.
        </p>

        <Link
          href="/tools/intake"
          className="mt-10 group block border border-gold rounded-md p-6 lg:p-7 transition-all duration-base hover:bg-paper-2 hover:shadow-paper"
        >
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-full bg-gold-deep flex items-center justify-center">
              <Sparkles size={18} className="text-paper" aria-hidden />
            </div>
            <div className="flex-1">
              <p className="font-mono text-[11px] uppercase tracking-label text-gold">
                AI 가이드 (권장)
              </p>
              <p className="mt-2 font-serif-ko text-h3 font-semibold text-ink group-hover:text-gold-deep transition-colors">
                AI와 함께 사건 정리하기
              </p>
              <p className="mt-3 font-serif-ko text-body text-ink-soft leading-base">
                AI 챗봇이 차례차례 질문드려 사건 정보를 정리합니다. 마지막에 정리된
                내용을 본인이 확인한 뒤 변호사에게 전달됩니다. 변호사 응대가 더 빠르고
                정확합니다.
              </p>
              <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-label text-ink group-hover:text-gold-deep">
                시작하기 <ArrowRight size={12} />
              </p>
            </div>
          </div>
        </Link>

        <div className="mt-12">
          <p className="label-mono">또는 기존 폼으로 직접 신청</p>
          <p className="mt-2 font-serif-ko text-body text-ink-soft">
            짧게 작성하고 변호사 응대 후 추가 정보를 정리하실 수 있습니다.
          </p>
          <div className="mt-6">
            <PersonalForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
