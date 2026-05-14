import { ImageResponse } from "next/og";
import { getLawyerBySlug, practiceAreaLabels } from "@/lib/data/lawyers";

export const runtime = "nodejs";
export const alt = "법무법인 도원 변호사 프로필";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#F5EFE4";
const INK = "#1A1814";
const INK_SOFT = "#3D3830";
const INK_MUTE = "#6B6258";
const GOLD = "#B8924A";

export default function LawyerOg({ params }: { params: { slug: string } }) {
  const lawyer = getLawyerBySlug(params.slug);
  if (!lawyer) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", background: PAPER }} />,
      { ...size }
    );
  }
  const areas = lawyer.practiceAreas
    .slice(0, 3)
    .map((p) => practiceAreaLabels[p])
    .join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
        }}
      >
        {/* Left: label + name + role + areas */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "72px 64px",
          }}
        >
          <div
            style={{
              fontSize: 16,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: GOLD,
              fontFamily: "monospace",
            }}
          >
            DOWON · LAWYER
          </div>

          <div
            style={{
              marginTop: 56,
              fontStyle: "italic",
              fontSize: 56,
              color: INK_MUTE,
              fontFamily: "serif",
            }}
          >
            {lawyer.nameEn}
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 92,
              fontWeight: 700,
              color: INK,
              fontFamily: "serif",
              lineHeight: 1,
              letterSpacing: -1,
            }}
          >
            {lawyer.nameKo}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              color: INK_SOFT,
            }}
          >
            {lawyer.role}
          </div>

          <div
            style={{
              marginTop: "auto",
              paddingTop: 24,
              borderTop: `1px solid ${INK}`,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 14,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: INK_MUTE,
                fontFamily: "monospace",
              }}
            >
              PRACTICE AREAS
            </div>
            <div style={{ fontSize: 22, color: INK }}>{areas || "—"}</div>
          </div>
        </div>

        {/* Right: brand block */}
        <div
          style={{
            width: 380,
            background: INK,
            color: PAPER,
            padding: "72px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontStyle: "italic",
              fontSize: 56,
              fontFamily: "serif",
              lineHeight: 1.05,
            }}
          >
            Dowon Law
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#C8BFAD",
              lineHeight: 1.45,
            }}
          >
            보험·의료·기업 자문 통합 모델 로펌
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 14,
              letterSpacing: 2,
              color: "#9C937F",
            }}
          >
            www.dowonlaw.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
