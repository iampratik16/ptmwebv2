import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";
import { getCaseStudy, getAllSlugs } from "@/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Pink Tree Media case study";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  const client = study?.client ?? SITE.name;
  const sector = study?.sector ?? "";
  const outcome = study?.oneLineOutcome ?? SITE.tagline;

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
            display: "flex",
            fontSize: 20,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#EFDCDF",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          {sector}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 80, lineHeight: 1.0, color: "#F2EAE8", maxWidth: 980 }}>
            {client}
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#b9b1a6", maxWidth: 900, fontFamily: "Helvetica, Arial, sans-serif" }}>
            {outcome}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#E0AEB4",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          {SITE.name}
        </div>
      </div>
    ),
    size,
  );
}
