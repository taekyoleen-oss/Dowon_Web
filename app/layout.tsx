import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cormorant, notoSerifKr, pretendard, jetbrainsMono } from "./fonts";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "법무법인 도원 | Dowon Law",
    template: "%s | 법무법인 도원",
  },
  description:
    "조사 → 소송 → 구상 → 추심, 한 팀으로 끝냅니다. 보험 분쟁·의료분쟁·기업 자문 통합 모델 로펌.",
  keywords: [
    "법무법인 도원",
    "보험 분쟁",
    "의료분쟁",
    "구상",
    "민간조사",
    "기업 법률자문",
  ],
  authors: [{ name: "법무법인 도원" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "법무법인 도원",
    title: "법무법인 도원 | Dowon Law",
    description: "조사 → 소송 → 구상 → 추심, 한 팀으로 끝냅니다.",
  },
  robots: { index: true, follow: true },
};

// PRD Section 9.3 — KWCAG 2.2: do NOT set user-scalable=0
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#F5EFE4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${cormorant.variable} ${notoSerifKr.variable} ${pretendard.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-paper text-ink antialiased">
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
