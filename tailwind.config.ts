import type { Config } from "tailwindcss";

/**
 * Dowon Law — Tailwind Config
 * Mirrors the design tokens in app/globals.css (PRD Section 4).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "24px",
        lg: "60px",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        paper:    "var(--color-paper)",
        "paper-2": "var(--color-paper-2)",
        "paper-3": "var(--color-paper-3)",
        ink:      "var(--color-ink)",
        "ink-soft": "var(--color-ink-soft)",
        "ink-mute": "var(--color-ink-mute)",
        gold:        "var(--color-gold)",
        "gold-bright": "var(--color-gold-bright)",
        "gold-deep":   "var(--color-gold-deep)",
        rust:    "var(--color-rust)",
        forest:  "var(--color-forest)",
        night:   "var(--color-night)",
        "night-2": "var(--color-night-2)",
        bg:       "var(--bg)",
        "bg-elevated": "var(--bg-elevated)",
        border:   "var(--border)",
        text:     "var(--text)",
        "text-soft": "var(--text-soft)",
        "text-mute": "var(--text-mute)",
        accent:        "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        cta:           "var(--cta)",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Noto Serif KR", "serif"],
        "serif-ko": ["var(--font-noto-serif-kr)", "var(--font-cormorant)", "serif"],
        "sans-ko": ["var(--font-pretendard)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      letterSpacing: {
        tight:  "-0.02em",
        normal: "0",
        label:  "0.18em",
        wide:   "0.05em",
      },
      lineHeight: {
        tight: "1.2",
        base:  "1.75",
        loose: "1.9",
      },
      borderRadius: {
        none: "0",
        sm:   "2px",
        md:   "4px",
        pill: "9999px",
      },
      boxShadow: {
        1:     "0 1px 2px rgba(26, 24, 20, 0.06)",
        2:     "0 4px 12px rgba(26, 24, 20, 0.08)",
        paper: "0 20px 40px -20px rgba(26, 24, 20, 0.18)",
      },
      spacing: {
        "section-mobile":  "64px",
        "section-tablet":  "96px",
        "section-desktop": "128px",
      },
      maxWidth: {
        narrow: "720px",
        base:   "1080px",
        wide:   "1280px",
      },
      transitionTimingFunction: {
        "out-curve":   "cubic-bezier(0.16, 1, 0.3, 1)",
        "inout-curve": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      transitionDuration: {
        fast:    "180ms",
        base:    "320ms",
        slow:    "600ms",
        reveal:  "900ms",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "letter-fade-in": {
          from: { opacity: "0", transform: "translateY(0.2em)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "letter-fade-in": "letter-fade-in 900ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
