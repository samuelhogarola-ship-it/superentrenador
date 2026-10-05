import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = "Super Entrenador — Marketplace de entrenadores personales";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          backgroundColor: "#08090f",
          backgroundImage: "radial-gradient(circle at 78% 30%, rgba(245,166,35,0.25), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 30,
            fontWeight: 700,
            color: "#f5a623",
            letterSpacing: -0.5,
          }}
        >
          Super Entrenador
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 64,
            fontWeight: 800,
            color: "#f5f6f8",
            lineHeight: 1.08,
            maxWidth: 920,
          }}
        >
          Encuentra tu entrenador personal ideal
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            color: "#b9bcc6",
            maxWidth: 820,
          }}
        >
          {siteConfig.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
