import { ShieldCheck, Scale, FileSearch } from "lucide-react";
import { Container } from "@/components/layout/container";
import { CoverageCheckForm } from "@/components/tools/coverage-check-form";
import { ToolIntro } from "@/components/tools/tool-intro";

export const metadata = {
  title: "보험금 가능성 셀프체크 (AI)",
  description:
    "약관과 사고/질병 정보를 입력하면 AI가 약관 매칭 + 보장·면책 검토 + 관련 판례를 안내합니다. 본 도구는 법률·보험 자문이 아닙니다.",
};

export default function CoverageCheckPage() {
  return (
    <>
      <section className="section-y">
        <Container size="wide">
          <ToolIntro
            eyebrow={{ index: 4, label: "AI · COVERAGE CHECK" }}
            displayTitle="Coverage Check"
            subtitle="보험금 가능성 셀프체크"
            lead={
              <>
                약관과 사고 정보를 입력하면 AI가 약관과 사고를 매칭해{" "}
                <strong className="text-ink">보장 가능성·면책 검토 대상·관련 판례</strong>를
                안내합니다. 보험금 청구 전, 또는 보험사 거절 후 다툼 여지를 가늠하는 데 활용할 수
                있습니다.
              </>
            }
            caveat="본 도구는 법률 자문이나 보험 상담이 아니며, 결과는 검토용 참고 정보입니다. 정확한 판단은 변호사·보험사 상담을 통해 확정해야 합니다."
            values={[
              {
                icon: FileSearch,
                title: "약관-사고 매칭",
                body: "보장 조항·면책 조항을 사고 상황과 자동 대조해 어느 항목이 적용될 가능성이 있는지 정리합니다.",
              },
              {
                icon: ShieldCheck,
                title: "면책 검토",
                body: "보험사가 면책을 주장할 수 있는 지점을 미리 짚어 드려, 보험사 면책 통지 전에 대응 방향을 가늠할 수 있습니다.",
              },
              {
                icon: Scale,
                title: "관련 판례 안내",
                body: "유사한 쟁점의 법원 판단을 함께 보여드려, 다툼이 발생했을 때의 일반적인 결론 흐름을 참고하실 수 있습니다.",
              },
            ]}
            steps={[
              {
                n: "01",
                title: "약관 + 사고 정보 입력",
                body: "가입하신 보험 종류, 사고/질병 내용, 청구 시도 결과 등을 정리해 입력하세요.",
              },
              {
                n: "02",
                title: "AI 매칭 결과 확인",
                body: "약관 항목별로 보장 가능성, 면책 검토 대상, 관련 판례가 정리된 결과를 받습니다.",
              },
              {
                n: "03",
                title: "다툼 결정 또는 자문 의뢰",
                body: "다툼 여지가 있다면 도원 보험 분쟁팀에 상담을 의뢰하실 수 있습니다.",
              },
            ]}
            examples={[
              "암 진단 보험금 청구가 거절됐을 때 다툼 여지 가늠",
              "자동차사고 후 자기차량손해 면책 통지를 받았을 때",
              "장기보험 면책 사유(고지의무 위반 등) 주장 시 대응 방향 검토",
              "화재보험 청구가 인과관계 부정으로 거절됐을 때",
            ]}
          />
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="wide">
          <CoverageCheckForm />
        </Container>
      </section>
    </>
  );
}
