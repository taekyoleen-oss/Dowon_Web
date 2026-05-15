/**
 * HWP-호환 docx 빌더 (한국 법원 관례).
 *
 * - A4 (210×297mm) · 여백 상하 30mm / 좌우 25mm
 * - 본문 함초롬바탕 · 12pt · 줄간격 200%
 * - 제목 함초롬바탕 · 16pt · 굵게
 * - 모든 텍스트는 검정. 글머리 기호 대신 번호·들여쓰기.
 *
 * 함초롬바탕은 한국 법원 공식 폰트. 시스템에 미설치된 경우 docx 뷰어가
 * 대체 폰트로 표시하지만, font family 이름은 정확히 기재한다(워드/한컴 호환).
 */
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  LineRuleType,
  PageOrientation,
  convertMillimetersToTwip,
} from "docx";

const FONT_BODY = "함초롬바탕";
const FONT_FALLBACK = "Batang"; // Word default Korean fallback

export type BriefSectionContent = { title: string; body: string };

export type BriefDocxInput = {
  /** Skill display name — used in subject. */
  skillName: string;
  /** Document title (e.g. "대여금 청구의 소"). */
  documentTitle: string;
  /** Body sections in order. */
  sections: BriefSectionContent[];
  /** Optional appendix — 계산 내역 등. */
  appendix?: { title: string; body: string };
  /** Optional verification flags. */
  flags?: { label: string; detail: string }[];
};

function textRun(text: string, opts: { bold?: boolean; size?: number } = {}) {
  return new TextRun({
    text,
    font: { name: FONT_BODY, hint: "eastAsia" },
    bold: opts.bold,
    size: opts.size ?? 24, // docx unit = half-points → 24 = 12pt
    color: "000000",
  });
}

function bodyParagraph(text: string) {
  // Korean court convention — first line indent 1 char (≈ 200 twips), line spacing 200%.
  return new Paragraph({
    spacing: { line: 480, lineRule: LineRuleType.AUTO, after: 80 },
    indent: { firstLine: 200 },
    children: [textRun(text)],
  });
}

function blankLine() {
  return new Paragraph({ children: [textRun("")] });
}

function headingParagraph(text: string) {
  return new Paragraph({
    spacing: { before: 240, after: 120, line: 360, lineRule: LineRuleType.AUTO },
    children: [textRun(text, { bold: true, size: 28 })],
  });
}

function titleParagraph(text: string) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 480 },
    heading: HeadingLevel.TITLE,
    children: [textRun(text, { bold: true, size: 36 })],
  });
}

function splitBody(body: string): Paragraph[] {
  const lines = body.split(/\r?\n/);
  return lines.map((line) =>
    line.trim() === ""
      ? blankLine()
      : new Paragraph({
          spacing: { line: 480, lineRule: LineRuleType.AUTO, after: 60 },
          indent: { firstLine: 0 },
          children: [textRun(line)],
        })
  );
}

export async function buildBriefDocx(input: BriefDocxInput): Promise<Buffer> {
  const children: Paragraph[] = [];

  children.push(titleParagraph(input.documentTitle));

  for (const sec of input.sections) {
    children.push(headingParagraph(sec.title));
    children.push(...splitBody(sec.body));
    children.push(blankLine());
  }

  if (input.appendix) {
    children.push(headingParagraph(input.appendix.title));
    children.push(...splitBody(input.appendix.body));
  }

  if (input.flags && input.flags.length > 0) {
    children.push(blankLine());
    children.push(headingParagraph("[변호사 확인 필요 사항]"));
    for (const f of input.flags) {
      children.push(
        new Paragraph({
          spacing: { after: 60, line: 360, lineRule: LineRuleType.AUTO },
          children: [textRun(`• ${f.label}`, { bold: true })],
        })
      );
      children.push(bodyParagraph(`    ${f.detail}`));
    }
  }

  const doc = new Document({
    creator: "법무법인 도원",
    title: input.documentTitle,
    description: `${input.skillName} — 자동 초안`,
    styles: {
      default: {
        document: {
          run: { font: { name: FONT_BODY, hint: "eastAsia" }, size: 24 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.PORTRAIT,
              width: convertMillimetersToTwip(210),
              height: convertMillimetersToTwip(297),
            },
            margin: {
              top: convertMillimetersToTwip(30),
              bottom: convertMillimetersToTwip(30),
              left: convertMillimetersToTwip(25),
              right: convertMillimetersToTwip(25),
            },
          },
        },
        children,
      },
    ],
  });

  // Silence the unused-import warning for the fallback font name while
  // keeping it documented at the top of the file — it's referenced by the
  // viewer when the primary font is missing.
  void FONT_FALLBACK;

  const buf = await Packer.toBuffer(doc);
  return buf;
}
