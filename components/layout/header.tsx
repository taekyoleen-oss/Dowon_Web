"use client";

import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

type NavChild = { label: string; href: string; desc?: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

const navItems: NavItem[] = [
  {
    label: "소개",
    href: "/about",
    children: [
      { label: "개요",       href: "/about" },
      { label: "철학",       href: "/about/philosophy" },
      { label: "역량",       href: "/about/capability" },
      { label: "연혁",       href: "/about/history" },
      { label: "오시는 길",  href: "/about/contact" },
    ],
  },
  {
    label: "업무분야",
    href: "/practice",
    children: [
      { label: "개요",       href: "/practice" },
      { label: "보험 분쟁",  href: "/practice/insurance" },
      { label: "의료분쟁",   href: "/practice/medical" },
      { label: "민간조사",   href: "/practice/investigation" },
      { label: "기업자문",   href: "/practice/advisory" },
      { label: "구상",       href: "/practice/subrogation" },
    ],
  },
  {
    label: "구성원",
    href: "/people/lawyers",
    children: [
      { label: "변호사",         href: "/people/lawyers" },
      { label: "고문·전문위원",  href: "/people/fellows" },
      { label: "채권회수팀",     href: "/people/recovery" },
      { label: "경영관리팀",     href: "/people/management" },
      { label: "조직도",         href: "/people/group" },
    ],
  },
  {
    label: "부설기관",
    href: "/centers/investigation",
    children: [
      { label: "민간조사센터",      href: "/centers/investigation" },
      { label: "의료분쟁지원센터",  href: "/centers/medical" },
    ],
  },
  {
    label: "라이브러리",
    href: "/library",
    children: [
      { label: "전체",          href: "/library" },
      { label: "판례",          href: "/library/cases" },
      { label: "칼럼",          href: "/library/columns" },
      { label: "강의·미디어",   href: "/library/media" },
      { label: "AI 의미 검색",  href: "/library/search" },
    ],
  },
  {
    label: "고객사",
    href: "/clients",
    // No dropdown — single page
  },
];

const PHONE = "02-3481-6540";
const PHONE_HREF = "tel:0234816540";

/**
 * Desktop dropdown — opens on hover OR focus, closes on blur and on
 * mouse leave (with a small grace delay so users can move from the
 * trigger row to the panel without losing it).
 */
function DesktopDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = React.useRef<HTMLLIElement | null>(null);
  const hasChildren = (item.children?.length ?? 0) > 0;

  // No-children case — render as a plain link (e.g. 고객사) so the
  // chevron + empty dropdown panel don't appear.
  if (!hasChildren) {
    return (
      <li>
        <Link
          href={item.href}
          className={cn(
            "inline-flex items-center py-5",
            "font-serif-ko text-[15px] text-ink-soft",
            "transition-colors duration-fast ease-out-curve",
            "hover:text-ink focus-visible:text-ink"
          )}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  // Close when focus leaves the whole li
  const onBlurCapture = (e: React.FocusEvent<HTMLLIElement>) => {
    if (!containerRef.current) return;
    if (!containerRef.current.contains(e.relatedTarget as Node | null)) {
      setOpen(false);
    }
  };

  // ESC closes and returns focus to trigger
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <li
      ref={containerRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlurCapture={onBlurCapture}
      onKeyDown={onKeyDown}
    >
      <Link
        href={item.href}
        className={cn(
          "inline-flex items-center gap-1 py-5",
          "font-serif-ko text-[15px] text-ink-soft",
          "transition-colors duration-fast ease-out-curve",
          "hover:text-ink focus-visible:text-ink"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown
          size={13}
          aria-hidden
          className={cn(
            "text-ink-mute transition-transform duration-fast",
            open && "rotate-180"
          )}
        />
      </Link>

      {open && (
        <div
          role="menu"
          aria-label={`${item.label} 하위 메뉴`}
          className={cn(
            "absolute left-0 top-full min-w-[200px]",
            "bg-paper border border-paper-3 rounded-sm shadow-lg",
            "py-2"
          )}
        >
          <ul>
            {(item.children ?? []).map((c) => (
              <li key={c.href} role="none">
                <Link
                  role="menuitem"
                  href={c.href}
                  className={cn(
                    "block px-4 py-2.5 font-serif-ko text-[14.5px] text-ink-soft",
                    "hover:bg-paper-2 hover:text-ink focus-visible:bg-paper-2 focus-visible:text-ink",
                    "transition-colors duration-fast outline-none"
                  )}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  return (
    <>
      {/* Top utility bar — phone, hours, email. Public-facing trust signal. */}
      <div className="hidden lg:block bg-night text-paper-3 text-[12px]">
        <Container size="wide" className="flex h-9 items-center justify-end gap-6">
          <a href={PHONE_HREF} className="inline-flex items-center gap-1.5 hover:text-paper">
            <Phone size={12} aria-hidden /> {PHONE}
          </a>
          <span className="text-paper-3/70">평일 09:00–18:00</span>
          <a href="mailto:dowonlaw@dowonlaw.com" className="hover:text-paper">
            dowonlaw@dowonlaw.com
          </a>
        </Container>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50",
          "bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70",
          "border-b border-paper-3"
        )}
      >
        <Container size="wide" className="flex h-16 items-center justify-between lg:h-20">
          <Link href="/" className="flex items-center" aria-label="법무법인 도원 홈">
            <Image
              src="/brand/logo-header.png"
              alt="법무법인 도원 — DOWON LAW FIRM"
              width={353}
              height={98}
              priority
              className="h-9 w-auto lg:h-11"
            />
          </Link>

          <nav aria-label="주요 메뉴" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <DesktopDropdown key={item.href} item={item} />
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile-only phone shortcut */}
            <a
              href={PHONE_HREF}
              aria-label={`전화 ${PHONE}`}
              className={cn(
                "lg:hidden inline-flex items-center justify-center p-2",
                "text-ink hover:text-gold-deep transition-colors"
              )}
            >
              <Phone size={18} />
            </a>

            <Link
              href="/contact/personal"
              className={cn(
                "hidden lg:inline-flex",
                "items-center gap-1 px-5 py-2.5",
                "bg-gold-deep text-paper",
                "font-sans-ko text-[14px] font-medium tracking-wide",
                "rounded-sm",
                "transition-colors duration-fast ease-out-curve",
                "hover:bg-gold"
              )}
            >
              상담 신청
            </Link>

            <Link
              href="/contact/personal"
              className={cn(
                "lg:hidden inline-flex items-center px-3 py-2",
                "bg-gold-deep text-paper",
                "font-sans-ko text-[13px] font-medium",
                "rounded-sm"
              )}
            >
              상담
            </Link>

            <button
              type="button"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={open}
              className="lg:hidden inline-flex items-center justify-center p-2 text-ink"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </Container>

        {open && (
          <nav
            aria-label="모바일 메뉴"
            className="lg:hidden border-t border-paper-3 bg-paper max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <Container size="wide" className="py-2">
              <ul className="flex flex-col">
                {navItems.map((item) => {
                  const isOpen = expanded === item.href;
                  const hasChildren = (item.children?.length ?? 0) > 0;
                  return (
                    <li key={item.href} className="border-b border-paper-3 last:border-b-0">
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="flex-1 block py-3.5 font-serif-ko text-base text-ink hover:text-gold-deep"
                        >
                          {item.label}
                        </Link>
                        {hasChildren && (
                          <button
                            type="button"
                            aria-label={`${item.label} 하위 메뉴 ${isOpen ? "닫기" : "열기"}`}
                            aria-expanded={isOpen}
                            onClick={() =>
                              setExpanded((cur) => (cur === item.href ? null : item.href))
                            }
                            className="px-3 py-3.5 text-ink-mute hover:text-ink"
                          >
                            <ChevronDown
                              size={16}
                              aria-hidden
                              className={cn(
                                "transition-transform duration-fast",
                                isOpen && "rotate-180"
                              )}
                            />
                          </button>
                        )}
                      </div>
                      {hasChildren && isOpen && (
                        <ul className="pb-3 pl-3 space-y-0.5">
                          {(item.children ?? []).map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                onClick={() => setOpen(false)}
                                className="block py-2.5 pl-3 border-l border-paper-3 font-serif-ko text-[14.5px] text-ink-soft hover:text-ink hover:border-ink"
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 pt-3 border-t border-paper-3 flex items-center justify-between">
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-label text-ink"
                >
                  <Phone size={12} aria-hidden /> {PHONE}
                </a>
                <span className="font-mono text-[10px] uppercase tracking-label text-ink-mute">
                  평일 09–18시
                </span>
              </div>
            </Container>
          </nav>
        )}
      </header>
    </>
  );
}
