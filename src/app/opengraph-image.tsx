import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.name} — ${SITE.tagline}`;

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1a1012 0%, #3d1620 100%)",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#E0AEB4",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          {SITE.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, color: "#F2EAE8", maxWidth: 900 }}>
            {SITE.tagline}
          </div>
          <div
            style={{
              marginTop: 36,
              width: 120,
              height: 2,
              background: "#B76E79",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
