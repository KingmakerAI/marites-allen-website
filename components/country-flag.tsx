"use client";

type Props = {
  code?: string;
  size?: number;
  title?: string;
};

/** Image flags — Windows often shows letter codes instead of emoji flags. */
export function CountryFlag({ code, size = 18, title }: Props) {
  if (!code || code.length !== 2) {
    return (
      <span aria-hidden style={{ fontSize: size * 0.9, lineHeight: 1 }}>
        🌐
      </span>
    );
  }

  const cc = code.toLowerCase();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${cc}.png`}
      srcSet={`https://flagcdn.com/w40/${cc}.png 1x, https://flagcdn.com/w80/${cc}.png 2x`}
      alt={title || code.toUpperCase()}
      width={size}
      height={Math.round(size * 0.75)}
      loading="lazy"
      decoding="async"
      style={{
        width: size,
        height: Math.round(size * 0.75),
        objectFit: "cover",
        borderRadius: 2,
        flexShrink: 0,
        display: "inline-block",
        verticalAlign: "middle",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.12)"
      }}
    />
  );
}
