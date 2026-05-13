"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile-only floating bar at the bottom of the viewport.
 *   - Left: tap-to-call 02-3481-6540
 *   - Right: AI intake (the Phase 4 ⭐ entry)
 *
 * Hidden on:
 *   - /admin/* (admins don't need it)
 *   - /tools/intake (already in the intake flow)
 *   - /contact/* (already on the contact form)
 */
export function MobileFloatingCta() {
  const pathname = usePathname();
  const hidden =
    pathname?.startsWith("/admin") ||
    pathname === "/tools/intake" ||
    pathname?.startsWith("/contact");

  if (hidden) return null;

  return (
    <div
      className={cn(
        "lg:hidden fixed inset-x-0 bottom-0 z-40",
        "bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85",
        "border-t border-paper-3",
        // Respect iOS safe area
        "pb-[env(safe-area-inset-bottom)]"
      )}
      role="region"
      aria-label="빠른 연락 바"
    >
      <div className="grid grid-cols-2 gap-px bg-paper-3">
        <a
          href="tel:0234816540"
          className="bg-paper flex items-center justify-center gap-2 py-3.5 font-sans-ko text-[14px] font-medium text-ink hover:bg-paper-2 transition-colors"
          aria-label="전화 02-3481-6540"
        >
          <Phone size={16} aria-hidden /> 전화
        </a>
        <Link
          href="/tools/intake"
          className="bg-gold-deep text-paper flex items-center justify-center gap-2 py-3.5 font-sans-ko text-[14px] font-medium hover:bg-gold transition-colors"
        >
          <MessageSquare size={16} aria-hidden /> AI 상담 정리
        </Link>
      </div>
    </div>
  );
}
