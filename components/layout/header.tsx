"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

const navItems = [
  { label: "소개",       href: "/about" },
  { label: "업무분야",   href: "/practice" },
  { label: "구성원",     href: "/people/lawyers" },
  { label: "부설기관",   href: "/centers/investigation" },
  { label: "라이브러리", href: "/library" },
];

const PHONE = "02-3481-6540";
const PHONE_HREF = "tel:0234816540";

export function Header() {
  const [open, setOpen] = useState(false);

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
          <Link href="/" className="flex items-baseline gap-2" aria-label="법무법인 도원 홈">
            <span className="font-display italic text-2xl text-ink lg:text-3xl">Dowon</span>
            <span className="font-serif-ko text-sm text-ink-soft lg:text-base">법무법인 도원</span>
          </Link>

          <nav aria-label="주요 메뉴" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "font-serif-ko text-[15px] text-ink-soft",
                      "transition-colors duration-fast ease-out-curve",
                      "hover:text-ink"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
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
            className="lg:hidden border-t border-paper-3 bg-paper"
          >
            <Container size="wide" className="py-4">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 font-serif-ko text-base text-ink-soft hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
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
