"use client";

import { useCms } from "@/components/cms-provider";

export const DEFAULT_LOGO_SRC = "/images/brand/marites-allen-logo.png";
export const DEFAULT_MARK_SRC = "/images/brand/marites-allen-mark.png";

type Props = {
  height?: number;
  mark?: boolean;
  maxWidth?: number | string;
  fluid?: boolean;
};

export function BrandLogo({ height = 38, mark = false, maxWidth, fluid = false }: Props) {
  const { settings } = useCms();
  const src = mark ? DEFAULT_MARK_SRC : settings?.general.logoUrl || DEFAULT_LOGO_SRC;
  return (
    // Static brand asset; next/image not required for a small SVG-like PNG.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Marites Allen"
      height={fluid ? undefined : height}
      style={{
        height: fluid ? "auto" : height,
        width: fluid ? "100%" : "auto",
        display: "block",
        maxWidth: maxWidth ?? (fluid ? "100%" : "min(58vw, 280px)"),
        objectFit: "contain"
      }}
    />
  );
}
