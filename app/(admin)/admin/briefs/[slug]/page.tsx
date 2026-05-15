import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { BRIEF_SKILLS, getBriefSkill } from "@/lib/legal-briefs/skills";
import { BriefComposer } from "@/components/admin/brief-composer";
import { BriefExampleDownload } from "@/components/admin/brief-example-download";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const s = getBriefSkill(params.slug);
  return { title: `${s?.name ?? "서면"} — 어드민` };
}

export function generateStaticParams() {
  return BRIEF_SKILLS.map((s) => ({ slug: s.slug }));
}

export default function BriefDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { tab?: string };
}) {
  const skill = getBriefSkill(params.slug);
  if (!skill) notFound();

  const tab = searchParams.tab === "example" ? "example" : "compose";

  return (
    <div>
      <Link
        href="/admin/briefs"
        className="inline-flex items-center font-mono text-[11px] uppercase tracking-label text-ink-mute hover:text-ink"
      >
        ← 서면 스킬 목록
      </Link>

      <div className="mt-4 flex items-start gap-4">
        <span className="text-4xl" aria-hidden>
          {skill.icon}
        </span>
        <div className="flex-1">
          <p className="font-mono text-[11px] uppercase tracking-label text-gold">
            {skill.category} · {skill.englishName}
          </p>
          <h1 className="mt-2 font-display italic text-[clamp(32px,4vw,48px)] text-ink leading-tight">
            {skill.name}
          </h1>
          <p className="mt-3 max-w-prose font-serif-ko text-body-lg text-ink-soft">
            {skill.description}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-label text-ink-mute">
            skill slug: <span className="text-ink">{skill.slug}</span>
          </p>
        </div>
      </div>

      <nav aria-label="섹션" className="mt-8 flex items-center gap-1 border-b border-paper-3">
        <Link
          href={`/admin/briefs/${skill.slug}?tab=example`}
          className={
            tab === "example"
              ? "px-5 py-3 border-b-2 border-ink font-serif-ko text-[14.5px] text-ink font-semibold"
              : "px-5 py-3 border-b-2 border-transparent font-serif-ko text-[14.5px] text-ink-soft hover:text-ink"
          }
        >
          예시
        </Link>
        <Link
          href={`/admin/briefs/${skill.slug}`}
          className={
            tab === "compose"
              ? "px-5 py-3 border-b-2 border-ink font-serif-ko text-[14.5px] text-ink font-semibold"
              : "px-5 py-3 border-b-2 border-transparent font-serif-ko text-[14.5px] text-ink-soft hover:text-ink"
          }
        >
          작성하기
        </Link>
      </nav>

      <div className="mt-10">
        {tab === "example" ? (
          <ExamplePanel skill={skill} />
        ) : (
          <BriefComposer skill={skill} />
        )}
      </div>

      <ChecklistFooter skill={skill} />
    </div>
  );
}

function ExamplePanel({ skill }: { skill: ReturnType<typeof getBriefSkill> & {} }) {
  const ex = skill.example;
  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-label text-gold">
          시연 예시
        </p>
        <h2 className="mt-2 font-serif-ko text-h2 text-ink font-semibold">
          {ex.title}
        </h2>
        <p className="mt-3 max-w-prose font-serif-ko text-[15px] text-ink-soft leading-base">
          {ex.scenario}
        </p>
      </header>

      <section className="rounded-sm border border-paper-3 bg-paper-2/40 p-6">
        <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
          STEP 1 · 변호사가 자연어로 입력
        </p>
        <p className="mt-3 font-serif-ko text-[14.5px] text-ink leading-base whitespace-pre-line">
          {buildNarrative(skill, ex.inputs)}
        </p>
      </section>

      <section className="rounded-sm border border-paper-3 p-6">
        <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
          STEP 2 · 스킬이 자동 검증한 체크리스트
        </p>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {skill.checklist.map((c) => (
            <li key={c.label} className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-forest mt-0.5 shrink-0" />
              <span className="font-serif-ko text-[14px] text-ink-soft">
                {c.label}
                {c.auto && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-sm bg-paper-2 font-mono text-[10px] uppercase tracking-label text-ink-mute">
                    자동
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {ex.flags && ex.flags.length > 0 && (
        <section className="rounded-sm border border-gold-deep/40 bg-gold-deep/5 p-6">
          <p className="font-mono text-[11px] uppercase tracking-label text-gold-deep">
            STEP 3 · 변호사가 확인해야 할 사항 (Flagging)
          </p>
          <ul className="mt-3 space-y-3">
            {ex.flags.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertTriangle size={15} className="text-gold-deep mt-0.5 shrink-0" />
                <div>
                  <p className="font-serif-ko text-[14.5px] text-ink font-semibold">
                    {f.label}
                  </p>
                  <p className="mt-0.5 font-serif-ko text-[13.5px] text-ink-soft">
                    {f.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ex.calculations && ex.calculations.length > 0 && (
        <section className="rounded-sm border border-paper-3 p-6">
          <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
            STEP 4 · 인지대 · 송달료 자동 계산
          </p>
          <table className="mt-3 w-full">
            <tbody>
              {ex.calculations.map((c, i) => (
                <tr key={i} className="border-b border-paper-3 last:border-0">
                  <td className="py-2.5 pr-4 font-serif-ko text-[14px] text-ink-soft align-top">
                    {c.label}
                  </td>
                  <td className="py-2.5 pr-4 font-serif-ko text-[14px] text-ink font-semibold whitespace-nowrap align-top">
                    {c.value}
                  </td>
                  <td className="py-2.5 font-mono text-[11px] text-ink-mute align-top">
                    {c.note ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between border-b border-paper-3 pb-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
              STEP 5 · 생성된 서면 본문
            </p>
            <h3 className="mt-2 font-serif-ko text-h3 text-ink font-semibold">
              {ex.title.split(" — ")[0] ?? skill.name}
            </h3>
          </div>
          <BriefExampleDownload
            skillSlug={skill.slug}
            documentTitle={ex.title.split(" — ")[0] ?? skill.name}
            fileBase={skill.name}
            sections={ex.sections}
            flags={ex.flags}
          />
        </div>

        <div className="mt-6 space-y-6">
          {ex.sections.map((s) => (
            <div key={s.title} className="border border-paper-3 rounded-sm p-5 lg:p-6">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-ink-mute" />
                <h4 className="font-serif-ko text-[16px] text-ink font-semibold">
                  {s.title}
                </h4>
              </div>
              <pre className="mt-3 whitespace-pre-wrap font-serif-ko text-[14.5px] text-ink leading-base">
                {s.body}
              </pre>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ChecklistFooter({ skill }: { skill: ReturnType<typeof getBriefSkill> & {} }) {
  return (
    <div className="mt-16 border-t border-paper-3 pt-8 grid gap-8 lg:grid-cols-2">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
          스킬 정의 (SKILL.md 핵심)
        </p>
        <ul className="mt-3 space-y-2 font-serif-ko text-[14px] text-ink-soft">
          <li><strong className="text-ink">출력 형식.</strong> HWP 호환 docx · 함초롬바탕 · A4 · 줄간격 200%</li>
          <li><strong className="text-ink">관할 검증.</strong> 민사소송법 §3 (피고 보통재판적) 자동 확인</li>
          <li><strong className="text-ink">법령·판례.</strong> {skill.citationDb}</li>
          <li><strong className="text-ink">출력 섹션.</strong> {skill.outputSections.map((s) => s.title).join(" → ")}</li>
        </ul>
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-label text-ink-mute">
          톤 가이드
        </p>
        <pre className="mt-3 whitespace-pre-wrap font-serif-ko text-[13.5px] text-ink-soft leading-base">
          {skill.toneGuide}
        </pre>
      </div>
    </div>
  );
}

/**
 * Compose a natural-language brief from example inputs so the example panel
 * can show "what the lawyer says to Claude" without hard-coding a duplicate
 * narrative in the skill data.
 */
function buildNarrative(
  skill: ReturnType<typeof getBriefSkill> & {},
  inputs: Record<string, string | number>
): string {
  const get = (k: string) => String(inputs[k] ?? "").trim();

  if (skill.slug === "korean-civil-complaint-skill") {
    return `"${skill.name} 초안 부탁해. 원고 ${get("plaintiffName")}(${get("plaintiffAddress")})가 피고 ${get("defendantName")}(${get("defendantAddress")})한테 ${get("loanDate")}에 ${Number(inputs.principal).toLocaleString("ko-KR")}원을 빌려줬는데 ${get("dueDate")}에 변제기 도래. 차용증·계좌이체 내역 있고, ${get("partialRepaymentDate")}에 ${Number(inputs.partialRepayment).toLocaleString("ko-KR")}원만 일부변제하고 연락두절. 이자는 연 ${get("interestRate")}%로 약정. 관할은 ${get("court")}. ${get("firm")}, 담당변호사 ${get("counsel")}."`;
  }

  if (skill.slug === "korean-criminal-defense-skill") {
    return `"${skill.name} 부탁해. 사건번호 ${get("caseNumber")} ${get("charge")}, 피고인 ${get("defendantName")}. 공소사실: ${get("indictmentSummary")} 입장은 '${get("stance")}'. 쟁점: ${get("keyIssues")} 양형사유: ${get("mitigationFactors")} 피해자와의 관계: ${get("victimSettlement")}. ${get("firm")} ${get("counsel")} 변호사."`;
  }

  if (skill.slug === "korean-divorce-petition-skill") {
    return `"${skill.name} 부탁해. 원고 ${get("plaintiffName")} v. 피고 ${get("defendantName")}, 혼인신고 ${get("marriageDate")}, 별거 ${get("separationDate")}. 자녀: ${get("children")}. 이혼사유 ${get("groundsType")}. 사실관계: ${get("factSummary")} 위자료 ${Number(inputs.alimony).toLocaleString("ko-KR")}원, 재산분할: ${get("propertyDivision")} 친권자 청구: ${get("custody")}, 양육비 1인당 월 ${Number(inputs.childSupport).toLocaleString("ko-KR")}원. 관할 ${get("court")}, ${get("firm")} ${get("counsel")}."`;
  }

  if (skill.slug === "korean-objection-skill") {
    return `"${skill.name} 부탁해. 사건번호 ${get("caseNumber")} ${get("court")}, 원고 ${get("plaintiffName")} v. 피고 ${get("defendantName")}. 원고 주장: ${get("plaintiffClaim")} 입장: ${get("stance")}. 사실 반박: ${get("factualResponse")} 법률상 항변: ${get("defenses")} 새로운 사실: ${get("newFacts")} ${get("firm")} ${get("counsel")} 변호사."`;
  }

  if (skill.slug === "korean-appeal-skill") {
    return `"${skill.name} 부탁해. 항소심 ${get("caseNumber")} / 1심 ${get("originalCase")}, ${get("court")}. 항소인 ${get("appellantName")}(${get("appellantRole")}) v. 피항소인 ${get("appelleeName")}. 1심 판결: ${get("originalRuling")} 사실오인: ${get("factualError")} 법리오해: ${get("legalError")} 채증법칙 위반: ${get("evidenceError")} ${get("firm")} ${get("counsel")} 변호사."`;
  }

  return Object.entries(inputs)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}
