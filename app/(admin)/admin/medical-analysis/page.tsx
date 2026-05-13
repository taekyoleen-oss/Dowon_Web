import { Container } from "@/components/layout/container";

export const metadata = { title: "의무기록 분석 — 어드민" };

export default function MedicalAnalysisAdmin() {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-label text-gold">MEDICAL ANALYSIS</p>
      <h1 className="mt-3 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-tight">
        Medical Records Analyzer
      </h1>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">의무기록 사전 분석 (AI #4 · 내부 전용)</p>

      <div className="mt-8 rounded-sm bg-paper-2 border border-paper-3 p-6 max-w-3xl">
        <p className="label-mono text-rust">⚠ 의료 민감정보 처리</p>
        <p className="mt-3 font-serif-ko text-body text-ink-soft leading-base">
          본 도구는 도원 내부 변호사 전용입니다. 분석 결과는 *초안*이며 의료 자격자 검수가
          필수입니다. <code className="font-mono text-[12px] bg-paper px-1 rounded-sm">DOWON_DISABLE_EXTERNAL_AI=true</code> 환경변수가
          설정되면 외부 API 호출이 차단되고, 사내 폐쇄망 모델로 라우팅됩니다.
        </p>
      </div>

      <p className="mt-10 font-serif-ko text-body text-ink-soft max-w-[40em] leading-base">
        업로드·실행 UI는 사건 관리 시스템과 통합된 형태로 Phase 3 후반에 구현됩니다.
        API 엔드포인트 <code className="font-mono text-[12px]">POST /api/ai/medical-analyze</code>는
        현재 가용 상태입니다.
      </p>
    </div>
  );
}
