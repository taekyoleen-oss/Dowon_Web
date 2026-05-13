import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui";
import { PolicyReader } from "@/components/tools/policy-reader";

export const metadata = {
  title: "약관 분석 (AI · 로그인 필요)",
  robots: { index: false, follow: false },
  description: "약관·증권 PDF를 업로드하면 보장 항목·면책 사유를 구조화해 추출합니다.",
};

export default function PolicyReaderPage() {
  return (
    <section className="section-y">
      <Container size="wide">
        <Eyebrow index={1}>AI · POLICY READER</Eyebrow>
        <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
          Policy Reader
        </h1>
        <p className="mt-3 font-serif-ko text-h2 text-ink">약관 분석</p>
        <p className="mt-8 max-w-[36em] font-serif-ko text-body-lg text-ink-soft leading-base">
          보험사·도원 내부 인증 사용자 전용 도구입니다. 업로드 PDF는 분석 후 24시간 내
          자동 삭제됩니다.
        </p>

        <div className="mt-12">
          <PolicyReader />
        </div>
      </Container>
    </section>
  );
}
