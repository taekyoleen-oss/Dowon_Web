import Link from "next/link";
import {
  ArrowRight,
  Scale,
  Calculator,
  FileSearch,
  Gavel,
  Shield,
  Briefcase,
  FileText,
  type LucideIcon,
} from "lucide-react";

export const metadata = { title: "내부망 업무 — 어드민" };

type InternalTool = {
  href: string;
  icon: LucideIcon;
  name: string;
  en: string;
  desc: string;
  audience: string;
  badge?: string;
};

type InternalSection = {
  key: string;
  index: string;
  title: string;
  en: string;
  icon: LucideIcon;
  desc: string;
  tools: InternalTool[];
};

const sections: InternalSection[] = [
  {
    key: "insurance-business",
    index: "01",
    title: "보험사·기업 자문",
    en: "Insurance & Corporate Advisory",
    icon: Briefcase,
    desc: "보험사·손해사정·기업 자문 실무진을 위한 1차 분석 도구입니다. 외부 노출 없이 사무소 인증 사용자만 접근합니다.",
    tools: [
      {
        href: "/admin/internal/contract-review",
        icon: Scale,
        name: "영문 계약서 1차 검토",
        en: "EN Contract Review",
        desc: "SPA·JV·License·NDA 등 영문 계약서를 통째로 분석해 위험 조항·한국법 검토 포인트를 정리합니다.",
        audience: "B2B · 기업 자문",
        badge: "Claude Opus",
      },
      {
        href: "/admin/internal/subrogation-check",
        icon: Calculator,
        name: "구상 가능성 자가진단",
        en: "Subrogation Check",
        desc: "사고 정보를 입력하면 구상 가능성 등급·예상 회수율·권장 액션을 안내합니다.",
        audience: "보험사 · 손해사정 실무진",
      },
      {
        href: "/admin/internal/policy-reader",
        icon: FileSearch,
        name: "약관 분석",
        en: "Policy Reader",
        desc: "약관·증권 PDF에서 보장 항목과 면책 사유를 구조화해 추출합니다.",
        audience: "보험사 내부 사용자",
      },
    ],
  },
  {
    key: "civil-complaint",
    index: "02",
    title: "민사 소장 지원",
    en: "Civil Complaint Drafting",
    icon: FileText,
    desc: "원고·피고 정보, 사실관계, 청구취지를 입력하면 한국 법원 양식에 맞춘 민사 소장 초안을 작성합니다.",
    tools: [
      {
        href: "/admin/briefs/korean-civil-complaint-skill",
        icon: FileText,
        name: "민사 소장 작성",
        en: "Civil Complaint Composer",
        desc: "대여금·매매대금·손해배상 등 청구 유형별 체크리스트, 갑호증 정리, 인지대·송달료 자동 계산까지 포함됩니다.",
        audience: "민사 담당 변호사",
        badge: "Skill",
      },
    ],
  },
  {
    key: "criminal-defense",
    index: "03",
    title: "형사 변론요지서 지원",
    en: "Criminal Defense Brief",
    icon: Gavel,
    desc: "공소사실 요지, 인부 의견, 쟁점, 양형 자료를 입력하면 형사 변론요지서 초안을 작성합니다.",
    tools: [
      {
        href: "/admin/briefs/korean-criminal-defense-skill",
        icon: Gavel,
        name: "형사 변론요지서 작성",
        en: "Criminal Defense Composer",
        desc: "공소사실 정리, 쟁점별 변론, 양형 사유, 합의·반성·초범 등 표준 양형 요소를 구조화합니다.",
        audience: "형사 담당 변호사",
        badge: "Skill",
      },
    ],
  },
];

export default function AdminInternalLanding() {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-label text-gold">
        INTERNAL · 내부망 업무
      </p>
      <h1 className="mt-3 font-display italic text-[clamp(36px,5vw,56px)] text-ink leading-tight">
        Internal Workspace
      </h1>
      <p className="mt-2 font-serif-ko text-h3 text-ink-soft">
        도원 변호사·실무진 전용 AI 도구
      </p>
      <p className="mt-6 max-w-prose font-serif-ko text-body-lg text-ink-soft leading-base">
        외부에 노출되지 않는 내부 업무 도구입니다. 보험사·기업 자문, 민사 소장, 형사 변론요지서
        작성에 활용되며, 사용 내역은 AI 감사 로그에 남습니다.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-sm border border-paper-3 bg-paper-2 px-4 py-2 max-w-prose">
        <Shield size={14} className="text-gold-deep" aria-hidden />
        <p className="font-mono text-[11px] uppercase tracking-label text-ink-soft">
          ADMIN ONLY · 외부 노출 없음
        </p>
      </div>

      <div className="mt-14 space-y-16">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <section key={s.key}>
              <div className="flex items-baseline justify-between gap-6 border-b border-paper-3 pb-4">
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-gold-deep" aria-hidden />
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-label text-gold">
                      {s.index}
                    </span>
                    <h2 className="mt-1 font-serif-ko text-h2 font-semibold text-ink">
                      {s.title}
                    </h2>
                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                      {s.en}
                    </p>
                  </div>
                </div>
                <p className="font-display italic text-[clamp(28px,3.5vw,40px)] text-ink leading-none">
                  {s.tools.length}
                  <span className="ml-1 font-serif-ko text-h3 text-ink-soft not-italic">
                    개
                  </span>
                </p>
              </div>

              <p className="mt-4 max-w-[42em] font-serif-ko text-body text-ink-soft leading-base">
                {s.desc}
              </p>

              <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {s.tools.map((t) => {
                  const ToolIcon = t.icon;
                  return (
                    <li key={t.href} className="group">
                      <Link
                        href={t.href}
                        className="relative block h-full rounded-md border border-paper-3 bg-paper p-6 transition-all duration-base ease-out-curve hover:border-ink hover:shadow-md"
                      >
                        <span
                          aria-hidden
                          className="absolute left-6 top-0 h-[2px] w-[30px] bg-gold"
                        />

                        <div className="flex items-start justify-between gap-4">
                          <div className="inline-flex items-center justify-center h-11 w-11 rounded-sm bg-paper-2 text-gold-deep group-hover:bg-gold-deep group-hover:text-paper transition-colors">
                            <ToolIcon size={20} aria-hidden />
                          </div>
                          {t.badge && (
                            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-sm bg-ink text-paper font-mono text-[10px] uppercase tracking-label">
                              {t.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-5 font-serif-ko text-[18px] font-semibold text-ink leading-snug">
                          {t.name}
                        </h3>
                        <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-label text-ink-mute">
                          {t.en}
                        </p>

                        <p className="mt-4 font-serif-ko text-[13.5px] text-ink-soft leading-base">
                          {t.desc}
                        </p>

                        <p className="mt-5 pt-4 border-t border-paper-3 font-mono text-[11px] uppercase tracking-label text-ink-mute">
                          {t.audience}
                        </p>

                        <span className="mt-4 inline-flex items-center gap-1.5 font-sans-ko text-[13.5px] font-medium text-gold-deep group-hover:text-ink transition-colors">
                          열기
                          <ArrowRight
                            size={14}
                            aria-hidden
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
