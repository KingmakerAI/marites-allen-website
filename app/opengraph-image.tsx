import { ImageResponse } from "next/og";

export const alt = "Marites Allen — The Feng Shui Queen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg,#0f3126 0%,#06140f 55%,#143d31 100%)",
          color: "#fff",
          fontFamily: "Georgia, serif"
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#e6c680"
          }}
        >
          Official Site
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
              color: "#fff"
            }}
          >
            Marites Allen
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "#e6c680",
              letterSpacing: 2
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
              lineHeight: 1.4,
              marginTop: 8
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