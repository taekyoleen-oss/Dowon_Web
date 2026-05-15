import { FileText, BookOpen, Calendar } from "lucide-react";
import { Container } from "@/components/layout/container";
import { DocumentTranslatorForm } from "@/components/tools/document-translator-form";
import { ToolIntro } from "@/components/tools/tool-intro";

export const metadata = {
  title: "문서 정리 도우미 (쉬운 말 풀이)",
  description:
    "받으신 소장·답변서·결정문·합의서 PDF를 AI가 3줄 요약, 쉬운 말 풀이, 할 일, 일정으로 정리해 드립니다. 본 도구는 법률 자문이 아닙니다.",
};

export default function DocumentTranslatorPage() {
  return (
    <>
      <section className="section-y">
        <Container size="wide">
          <ToolIntro
            eyebrow={{ index: 3, label: "AI · DOCUMENT" }}
            displayTitle="What does this say?"
            subtitle="법률 문서 쉬운 말 풀이"
            lead={
              <>
                받으신 <strong className="text-ink">소장·답변서·결정문·합의서</strong>를 업로드하시면,
                AI가 3줄 요약, 법률 용어 풀이, 해야 할 일, 일정을 정리해 드립니다. 변호사를 만나기
                전에 자기 문서를 먼저 이해해 오시면 첫 상담이 훨씬 효율적입니다.
              </>
            }
            caveat="본 도구는 법률 자문이 아닌 정보 정리용입니다. 업로드한 PDF는 분석 직후 폐기되며, 주민번호·계좌·전화번호는 자동 마스킹됩니다."
            values={[
              {
                icon: FileText,
                title: "3줄로 핵심 요약",
                body: "수십 페이지짜리 문서를 누가-무엇을-언제 형태의 3줄로 정리해, 한눈에 무슨 일이 일어나고 있는지 파악할 수 있습니다.",
              },
              {
                icon: BookOpen,
                title: "법률 용어 풀이",
                body: "원고·피고·기각·인용 같은 어려운 용어를 일상 한국어로 풀어 드립니다. 변호사에게 묻기 어색했던 단어들이 정리됩니다.",
              },
              {
                icon: Calendar,
                title: "기한·일정 자동 정리",
                body: "회신 기한, 출석 일자 등 문서에 명시된 일정을 모아 캘린더 파일(.ics)로 다운로드할 수 있습니다.",
              },
            ]}
            steps={[
              {
                n: "01",
                title: "PDF 업로드",
                body: "받으신 문서 PDF를 끌어다 놓거나 클릭해서 업로드하세요. 최대 10MB까지 지원합니다.",
              },
              {
                n: "02",
                title: "30초~1분 분석",
                body: "AI가 텍스트를 추출해 개인정보를 마스킹한 뒤, 4개 섹션(요약·용어·할 일·일정)으로 정리합니다.",
              },
              {
                n: "03",
                title: "결과 활용",
                body: "Markdown으로 복사해 메모에 붙이거나, 일정을 캘린더에 추가하세요. 변호사 상담 시 그대로 활용 가능합니다.",
              },
            ]}
            examples={[
              "법원에서 받은 소장이 무슨 의미인지 모를 때",
              "상대방 답변서를 받았는데 회신 기한을 놓칠까 걱정될 때",
              "조정·화해 결정문의 효력을 이해하고 싶을 때",
              "합의서 초안을 받았는데 어떤 조항이 중요한지 모를 때",
            ]}
          />
        </Container>
      </section>

      <section className="section-y bg-paper-2">
        <Container size="wide">
          <DocumentTranslatorForm />
        </Container>
      </section>
    </>
  );
}
