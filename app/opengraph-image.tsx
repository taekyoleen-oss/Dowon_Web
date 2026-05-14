import { ImageResponse } from "next/og";

/**
 * Default OG image — served at /opengraph-image when no page-specific
 * one exists. Next.js auto-wires this into the metadata.openGraph.images
 * field for every route under app/.
 *
 * Rendered with the same brand tokens as the rest of the site:
 *   paper #F5EFE4 (cream) · ink #1A1814 · gold #B8924A
 */
export const runtime = "edge";
export const alt = "법무법인 도원 — 조사 → 소송 → 구상 → 추심, 한 팀";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#F5EFE4";
const INK = "#1A1814";
const INK_SOFT = "#3D3830";
const GOLD = "#B8924A";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PAPER,
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        {/* Top mono label */}
        <div
          style={{
            fontSize: 18,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: GOLD,
            fontFamily: "monospace",
          }}
        >
          DOWON LAW · 법무법인 도원
        </div>

        {/* Tagline + headline */}
        <div
          style={{
            marginTop: 64,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontStyle: "italic",
              fontSize: 96,
              lineHeight: 1.05,
              color: INK,
              letterSpacing: -1,
            }}
          >
            Integrated.
          </div>
          <div
            style={{
              fontSize: 36,
              lineHeight: 1.35,
              color: INK_SOFT,
              maxWidth: 880,
              fontWeight: 500,
            }}
          >
            조사 → 소송 → 구상 → 추심,
            한 팀으로 끝냅니다.
          </div>
        </div>

        {/* Footer rule + meta */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: 24,
            borderTop: `1px solid ${INK}`,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            fontSize: 20,
            color: INK_SOFT,
          }}
        >
          <span>보험 분쟁 · 의료분쟁 · 기업 자문</span>
          <span style={{ fontFamily: "monospace", letterSpacing: 2 }}>
            www.dowonlaw.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
