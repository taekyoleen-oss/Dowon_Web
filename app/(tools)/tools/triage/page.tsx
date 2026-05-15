import { Compass, ListChecks, Users } from "lucide-react";
import { Container } from "@/components/layout/container";
import { TriageChat } from "@/components/tools/triage-chat";
import { ToolIntro } from "@/components/tools/tool-intro";

export const metadata = {
  title: "사건 유형 진단 (AI)",
  description: "자연어로 상황을 설명하면 사건 유형·필요 자료·예상 절차를 안내합니다.",
};

export default function TriagePage() {
  return (
    <>
      <section className="section-y">
        <Container size="wide">
          <ToolIntro
            eyebrow={{ index: 2, label: "AI · TRIAGE" }}
            displayTitle="Case Triage"
            subtitle="사건 유형 안내"
            lead={
              <>
                상황을 자연어로 설명해 주세요. 사건 유형, 필요한 자료, 예상 절차, 적합한 변호사
                분야를 안내해 드립니다. <strong className="text-ink">처음 변호사를 만나기
                전 방향을 잡는 데</strong> 도움이 됩니다.
              </>
            }
            caveat="본 안내는 일반 정보이며 법률 자문이 아닙니다. 결과는 사건의 모든 측면을 다루지 않을 수 있습니다."
            values={[
              {
                icon: Compass,
                title: "사건 유형 분류",
                body: "보험 분쟁·의료 분쟁·민사·구상 등 큰 카테고리로 먼저 분류해 드립니다. 어디서 시작해야 할지 모를 때 유용합니다.",
              },
              {
                icon: ListChecks,
                title: "필요한 자료 안내",
                body: "사건 유형별로 변호사가 검토할 때 필요한 자료를 미리 알려드려, 첫 상담 전 준비를 도와드립니다.",
              },
              {
                icon: Users,
                title: "적합한 변호사 분야",
                body: "도원 내 어떤 분야의 변호사가 적합한지 안내해 드려, 곧장 해당 분야 상담 신청으로 이어가실 수 있습니다.",
              },
            ]}
            steps={[
              {
                n: "01",
                title: "상황 설명",
                body: "사고나 분쟁 상황을 그대로 한국어로 입력하세요. 길이 제한 없습니다.",
              },
              {
                n: "02",
                title: "AI의 분류 결과 확인",
                body: "사건 유형, 예상 절차, 필요 자료가 정리됩니다. 추가 질문이 있으면 그대로 이어가실 수 있습니다.",
              },
              {
                n: "03",
                title: "상담 신청 또는 정보 정리",
                body: "방향이 잡혔다면 바로 상담 신청, 더 정리하고 싶다면 [사건 정보 정리] 도구로 이동하실 수 있습니다.",
              },
            ]}
            examples={[
              "보험사가 보험금 지급을 거절했는데 다툴 만한지 모를 때",
              "병원 치료 중 사고가 발생했는데 누구를 상대로 다투어야 할지 모를 때",
              "교통사고 합의금을 제시받았는데 적정한지 가늠하고 싶을 때",
              "구상 청구를 받았는데 어떻게 대응해야 할지 막막할 때",
            ]}
          />
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="wide">
          <TriageChat />
        </Container>
      </section>
    </>
  );
}
