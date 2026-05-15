import { Calculator, Briefcase, TrendingUp } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SubrogationCheckForm } from "@/components/tools/subrogation-check-form";
import { ToolIntro } from "@/components/tools/tool-intro";

export const metadata = {
  title: "구상 가능성 자가진단 (AI)",
  description: "사고·당사자·손해 정보를 입력하면 구상 가능성과 예상 회수율을 안내합니다.",
};

export default function SubrogationCheckPage() {
  return (
    <>
      <section className="section-y">
        <Container size="wide">
          <ToolIntro
            eyebrow={{ index: 6, label: "AI · SUBROGATION CHECK" }}
            displayTitle="Subrogation Check"
            subtitle="구상 가능성 자가진단"
            lead={
              <>
                <strong className="text-ink">보험사·손해사정 실무진</strong>을 위한 빠른 진단
                도구입니다. 사고 정보를 입력하면 구상 가능성과 예상 회수율, 권장 액션을
                안내합니다.
              </>
            }
            caveat="본 결과는 일반 정보이며 법률 자문이 아닙니다. 위임 여부 최종 결정은 법무팀·외부 자문 검토 후 진행해 주세요."
            values={[
              {
                icon: Calculator,
                title: "구상 가능성 등급",
                body: "사고 유형·당사자 관계·손해 규모를 종합해 High/Medium/Low로 등급화합니다.",
              },
              {
                icon: TrendingUp,
                title: "예상 회수율",
                body: "유사 사건 데이터를 기반으로 예상 회수율 범위를 안내해 비용 대비 효익 판단을 돕습니다.",
              },
              {
                icon: Briefcase,
                title: "권장 액션",
                body: "외부 위임·자체 처리·포기 중 어느 경로가 효율적인지 추천하고, 위임 시 도원 채권회수팀으로 바로 연결합니다.",
              },
            ]}
            steps={[
              {
                n: "01",
                title: "사고 정보 입력",
                body: "사고 유형, 당사자, 손해 금액, 보험 종류 등을 정리해 입력합니다.",
              },
              {
                n: "02",
                title: "AI 진단 결과 확인",
                body: "구상 가능성 등급, 예상 회수율, 권장 액션이 정리됩니다.",
              },
              {
                n: "03",
                title: "위임 결정",
                body: "위임이 효율적이라고 판단되면 도원 채권회수팀으로 바로 의뢰하실 수 있습니다.",
              },
            ]}
            examples={[
              "구상 위임 vs 자체 처리 의사결정 시 1차 판단",
              "소액 다건 사고의 위임 우선순위 매기기",
              "공동불법행위자에 대한 구상권 행사 가능성 검토",
              "장기 미해결 사건의 회수 가능성 재진단",
            ]}
          />
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="wide">
          <SubrogationCheckForm />
        </Container>
      </section>
    </>
  );
}
