"use client";

import Image from "next/image";
import { useState } from "react";
import type { YearVideo } from "@/lib/ma-videos";

const FIRST = 12;

function YoutubeThumb({ item }: { item: YearVideo }) {
  const [play, setPlay] = useState(false);
  if (!item.youtubeId) return <LinkCard item={item} />;
  if (play) {
    return (
      <div className="archive-item" style={{ padding: 0, overflow: "hidden" }}>
        <iframe
          title={item.title}
          src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?rel=0`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          style={{ display: "block", width: "100%", aspectRatio: "16 / 9", border: 0 }}
        />
        <p style={{ margin: 0, padding: "12px 16px", fontSize: 14, color: "#3d4a41" }}>
          <strong style={{ display: "block", color: "#143d31" }}>{item.title}</strong>
          <span style={{ color: "#5f6b60" }}>{item.outlet}</span>
        </p>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: 0,
        border: "1px solid rgba(20,61,49,0.1)",
        borderRadius: 14,
        background: "#fffdf8",
        boxShadow: "0 10px 24px -20px rgba(20,60,45,0.35)",
        cursor: "pointer",
        overflow: "hidden"
      }}
    >
      <span style={{ display: "block", position: "relative", aspectRatio: "16 / 9", background: "#143d31" }}>
        <Image
          src={`https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`}
          alt=""
          width={480}
          height={270}
          sizes="(max-width: 800px) 100vw, 800px"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(246,241,231,0.94)",
            color: "#143d31",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22
          }}
        >
          ▶
        </span>
      </span>
      <span style={{ display: "block", padding: "12px 16px" }}>
        <strong style={{ display: "block", color: "#143d31", fontSize: 15, lineHeight: 1.35 }}>{item.title}</strong>
        <span style={{ display: "block", marginTop: 4, color: "#5f6b60", fontSize: 13 }}>
          {item.outlet}
          {item.date ? ` · ${item.date}` : ""}
        </span>
      </span>
    </button>
  );
}

function LinkCard({ item }: { item: YearVideo }) {
  return (
    <article className="archive-item">
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {item.title}
      </a>
      <p style={{ margin: "6px 0 0", fontSize: 13, color: "#5f6b60" }}>
        {item.outlet}
        {item.platform ? ` · ${item.platform}` : ""}
        {item.date ? ` · ${item.date}` : ""}
      </p>
    </article>
  );
}

export function YearVideos({ items }: { items: YearVideo[] }) {
  const [open, setOpen] = useState(false);
  if (!items.length) return null;
  const hidden = items.length > FIRST && !open;
  const shown = hidden ? items.slice(0, FIRST) : items;
  return (
    <section style={{ marginTop: 36 }}>
      <h2 className="font-display" style={{ color: "#143d31", fontSize: 28, margin: "0 0 14px" }}>
        Videos
      </h2>
      <div style={{ display: "grid", gap: 12 }}>
        {shown.map((item) =>
          item.youtubeId ? (
            <YoutubeThumb key={item.url} item={item} />
          ) : (
            <LinkCard key={item.url} item={item} />
          )
        )}
      </div>
      {hidden ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            marginTop: 14,
            background: "transparent",
            border: "1px solid rgba(125,92,28,0.45)",
            color: "var(--gold-ink)",
            fontWeight: 700,
            borderRadius: 999,
            padding: "10px 18px",
            cursor: "pointer"
          }}
        >
          Show all {items.length}
        </button>
      ) : null}
    </section>
  );
}

export function UndatedMediaList({ items }: { items: YearVideo[] }) {
  if (!items.length) return null;
  return (
    <section style={{ marginTop: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <h3 className="font-display" style={{ fontWeight: 700, fontSize: "clamp(26px,3.2vw,34px)", color: "var(--gold-ink)", margin: 0 }}>
          Undated
        </h3>
        <div style={{ flex: 1, height: 1, background: "rgba(20,61,49,0.15)" }} />
        <span style={{ fontSize: 12, color: "#8a8a80" }}>{items.length}</span>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {items.map((item) => (
          <LinkCard key={item.url} item={item} />
        ))}
      </div>
    </section>
  );
}
