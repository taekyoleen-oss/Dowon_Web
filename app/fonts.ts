import { Cormorant_Garamond, Noto_Serif_KR, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

/** Display — Cormorant Garamond (italic-friendly serif) */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

/** Korean serif body / heading */
export const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-serif-kr",
  preload: false,
});

/** UI · captions · buttons */
export const pretendard = localFont({
  src: [
    {
      path: "../public/fonts/PretendardVariable.woff2",
      style: "normal",
      weight: "45 920",
    },
  ],
  display: "swap",
  variable: "--font-pretendard",
});

/** Labels · meta */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});
