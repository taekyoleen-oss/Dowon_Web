import { MessagesSquare, FileCheck, UserPlus } from "lucide-react";
import { Container } from "@/components/layout/container";
import { IntakeChat } from "@/components/tools/intake-chat";
import { ToolIntro } from "@/components/tools/tool-intro";

export const metadata = {
  title: "사건 정보 정리 (AI 인테이크)",
  description:
    "변호사 상담 전에 사건 정보를 AI와 함께 정리해 도원에 정확히 전달합니다. 본 도구는 법률 자문이 아닙니다.",
};

export default function IntakePage() {
  return (
    <>
      <section className="section-y">
        <Container size="wide">
          <ToolIntro
            eyebrow={{ index: 1, label: "AI · INTAKE" }}
            displayTitle="Tell us your story."
            subtitle="사건 정보 정리 도우미"
            lead={
              <>
                편하게 말씀해 주세요. AI가 차례차례 질문을 드려 사건 정보를 정리하고, 마지막에
                요약을 보여드립니다. <strong className="text-ink">사용자가 직접 확인한 내용만</strong>{" "}
                도원 변호사에게 전달됩니다.
              </>
            }
            caveat="본 도구는 법률 자문이 아닌 정보 정리용입니다. 응급 상황은 119 / 1577-0199로 즉시 연락하세요."
            values={[
              {
                icon: MessagesSquare,
                title: "대화로 차근차근",
                body: "양식이 아닌 자연스러운 대화로 진행됩니다. 모르는 부분은 그냥 '잘 모르겠어요'라고 답하셔도 됩니다.",
              },
              {
                icon: FileCheck,
                title: "확인 후 전송",
                body: "정리된 요약을 직접 보시고 동의하실 때만 도원으로 전달됩니다. 임의 전송은 없습니다.",
              },
              {
                icon: UserPlus,
                title: "적합한 변호사 제안",
                body: "사건 유형에 따라 도원에서 가장 적합한 분야의 변호사를 자동으로 매칭해 안내드립니다.",
              },
            ]}
            steps={[
              {
                n: "01",
                title: "상황을 자유롭게 설명",
                body: "어떤 일이 있었는지, 언제 일어났는지 편하게 입력하세요. AI가 부족한 정보는 다시 질문드립니다.",
              },
              {
                n: "02",
                title: "AI의 후속 질문에 답",
                body: "사건 유형, 당사자, 손해 규모, 보유 자료 등 핵심 정보를 단계별로 묻습니다. 5~10분 정도 걸립니다.",
              },
              {
                n: "03",
                title: "요약 확인 → 상담 신청",
                body: "정리된 사건 요약을 확인하고, 그대로 도원 변호사에게 상담 신청을 보내실 수 있습니다.",
              },
            ]}
            examples={[
              "교통사고 후 보험사 합의 진행 중인데 다툴 부분이 있는지 정리",
              "받은 진단서·청구서 등 자료를 어떻게 보여줘야 할지 모를 때",
              "처음 변호사를 만나기 전 상담 시간을 효율적으로 쓰고 싶을 때",
              "여러 사건이 얽혀 있어 어디서부터 말해야 할지 모를 때",
            ]}
          />
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="wide">
          <IntakeChat />
        </Container>
      </section>
    </>
  );
}
