import { readFile } from "fs/promises";
import { join } from "path";
import { ImageResponse } from "next/og";

export const alt = "Marites Allen — The Feng Shui Queen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/images/brand/marites-allen-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "linear-gradient(145deg,#0f3126 0%,#06140f 55%,#143d31 100%)",
          fontFamily: "Georgia, serif"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#efe8d8",
            borderRadius: 18,
            padding: "18px 22px",
            width: "auto"
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} height={58} alt="Marites Allen" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              color: "#e6c680",
              letterSpacing: 3,
              textTransform: "uppercase"
            }}
          >
            The Feng Shui Queen
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#c7ddd2",
              maxWidth: 820,
              lineHeight: 1.4
            }}
          >
            Private consultations · Destara AI · Annual forecasts · Frigga Charmed Life
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#9fbcb0"
          }}
        >
          <span>maritesallen.com</span>
          <span style={{ color: "#e6c680" }}>Book your consultation</span>
        </div>
      </div>
    ),
    size
  );
}
