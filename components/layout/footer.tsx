import Link from "next/link";
import { Container } from "./container";

const footerSections: Array<{
  title: string;
  links: Array<{ label: string; href: string }>;
}> = [
  {
    title: "소개",
    links: [
      { label: "인사말",       href: "/about/philosophy" },
      { label: "통합 모델",     href: "/about/capability" },
      { label: "연혁",         href: "/about/history" },
      { label: "오시는 길",     href: "/about/contact" },
    ],
  },
  {
    title: "업무분야",
    links: [
      { label: "손해보험·생명보험", href: "/practice/insurance" },
      { label: "의료분쟁",          href: "/practice/medical" },
      { label: "법률자문",          href: "/practice/advisory" },
      { label: "민간조사·형사",     href: "/practice/investigation" },
      { label: "구상·합의",         href: "/practice/subrogation" },
    ],
  },
  {
    title: "부설기관",
    links: [
      { label: "민간조사센터",        href: "/centers/investigation" },
      { label: "의료분쟁지원센터",    href: "/centers/medical" },
    ],
  },
  {
    title: "상담",
    links: [
      { label: "보험사·손해사정사",   href: "/contact/insurer" },
      { label: "기업 법률자문",       href: "/contact/enterprise" },
      { label: "의료분쟁",            href: "/contact/medical" },
      { label: "개인 사건의뢰",       href: "/contact/personal" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night text-paper">
      <Container size="wide" className="py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display italic text-3xl">Dowon</span>
              <span className="font-serif-ko text-base text-paper-3">법무법인 도원</span>
            </div>
            <p className="mt-5 max-w-sm font-serif-ko text-[14.5px] leading-loose text-paper-3">
              조사 → 소송 → 구상 → 추심,<br />한 팀으로 끝냅니다.
            </p>
            <address className="mt-6 not-italic font-sans-ko text-[13.5px] leading-loose text-paper-3">
              서울특별시 서초구 서초대로55길 3, 애니빌딩 4-5층<br />
              TEL 02-3481-6540 / 02-6415-0071<br />
              FAX 02-3481-6541 / 02-6415-0072<br />
              EMAIL dowonlaw@dowonlaw.com
            </address>
          </div>

          {footerSections.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h2 className="label-mono text-gold-bright">{section.title}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-serif-ko text-[14.5px] text-paper-3 hover:text-paper transition-colors duration-fast"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-night-2 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-mono-ui text-[11px] uppercase tracking-label text-paper-3">
            © {year} Dowon Law Firm. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-6 font-sans-ko text-[12.5px] text-paper-3">
            <li><Link href="/about/contact" className="hover:text-paper">개인정보 처리방침</Link></li>
            <li><Link href="/about/contact" className="hover:text-paper">광고 표시</Link></li>
            <li><Link href="/clients" className="hover:text-paper">고객사·협력사</Link></li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
