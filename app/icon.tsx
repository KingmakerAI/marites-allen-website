import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg,#143d31 0%,#0c2a20 100%)",
          color: "#e6c680",
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -2
        }}
      >
        M
      </div>
    ),
    size
  );
}
