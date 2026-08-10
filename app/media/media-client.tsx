"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { emailOk } from "@/lib/site-data";

const PRESS_RAW = [
  {
    year: 2026,
    m: 2,
    month: "Feb",
    outlet: "Manila Times",
    quote: "Destara AI: a long-planned Destiny App bridging ancient wisdom and modern technology.",
    cta: "Read article",
    url: "https://www.manilatimes.net"
  },
  {
    year: 2026,
    m: 1,
    month: "Jan",
    outlet: "Manila Bulletin",
    quote: "Discover your luck: the Feng Shui Queen's 2026 animal sign forecast.",
    cta: "Read article",
    url: "https://mb.com.ph/2026/01/28/romance-and-opportunity-in-2026-feng-shui-insights-from-marites-allen"
  },
  {
    year: 2026,
    m: 1,
    month: "Jan",
    outlet: "Marites Allen Live",
    quote: "What the Fire Horse 2026 will change in everyone's life.",
    cta: "Watch",
    url: "https://maritesallen.com/marites-allen-show/"
  },
  {
    year: 2025,
    m: 12,
    month: "Dec",
    outlet: "Marites Allen Live",
    quote: "Preparing for 2026: what the Fire Horse brings.",
    cta: "Watch",
    url: "https://maritesallen.com/marites-allen-show/"
  },
  {
    year: 2025,
    m: 10,
    month: "Oct",
    outlet: "Marites Allen (blog)",
    quote: "Mark your calendars: the Supermoon season of 2025.",
    cta: "Read post",
    url: "https://maritesallen.com/presss/mark-your-calendars-the-supermoon-season-of-2025/"
  },
  {
    year: 2025,
    m: 2,
    month: "Feb",
    outlet: "Daily Tribune",
    quote: "How to make the most of the new lunar year.",
    cta: "Read article",
    url: "https://maritesallen.com/presss/how-to-make-the-most-of-new-lunar-year/"
  },
  {
    year: 2025,
    m: 1,
    month: "Jan",
    outlet: "Inquirer.net",
    quote: "Feng shui expert advises beauty queens to be 'like a snake' this Chinese New Year.",
    cta: "Read article",
    url: "https://maritesallen.com/presss/chinese-new-year-feng-shui-expert-advises-beauty-queens-to-be-like-a-snake/"
  },
  {
    year: 2025,
    m: 1,
    month: "Jan",
    outlet: "NewsWatch Interviews",
    quote: "Feng Shui expert Marites Allen on the Year of the Wooden Snake.",
    cta: "Watch",
    url: "https://www.youtube.com/watch?v=r27QpjNfhfk"
  },
  {
    year: 2023,
    m: 12,
    month: "Dec",
    outlet: "The Daily Tribune",
    quote: "How the feng shui expert lives life to the full.",
    cta: "Read feature",
    url: "https://tribune.net.ph/2023/12/17/marites-allenhow-the-feng-shui-expertlives-life-to-the-full"
  },
  {
    year: 2023,
    m: 1,
    month: "Jan",
    outlet: "Boy Abunda · The Interviewer",
    quote: "Marites Allen, Philippine Feng Shui Queen.",
    cta: "Watch",
    url: "https://www.youtube.com/watch?v=mswSQ7Utz1s"
  },
  {
    year: 2022,
    m: 2,
    month: "Feb",
    outlet: "Metro.Style",
    quote: "Metro chats with Marites Allen.",
    cta: "Read interview",
    url: "https://maritesallen.com"
  },
  {
    year: 2022,
    m: 1,
    month: "Jan",
    outlet: "Tatler Asia",
    quote: "Filipina Feng Shui Master Marites Allen's guide to a harmonious home.",
    cta: "Read feature",
    url: "https://www.tatlerasia.com"
  },
  {
    year: 2021,
    m: 6,
    month: "Jun",
    outlet: "Marites Allen",
    quote: "Journey to Feng Shui.",
    cta: "Watch",
    url: "https://www.youtube.com/watch?v=kfPKazF19jw"
  },
  {
    year: 2021,
    m: 3,
    month: "Mar",
    outlet: "Absolutely Magazines",
    quote: "Everything you need to know about Feng Shui, from the expert.",
    cta: "Read interview",
    url: "https://maritesallen.com"
  },
  {
    year: 2020,
    m: 1,
    month: "Jan",
    outlet: "ABS-CBN · The Bottomline",
    quote: "Predictions for each Chinese zodiac sign.",
    cta: "Watch",
    url: "https://www.youtube.com/watch?v=xfLMTQCr3og"
  },
  {
    year: 2017,
    m: 11,
    month: "Nov",
    outlet: "Media Conference · Marco Polo",
    quote: "Why 2018 is a prosperous year.",
    cta: "Watch",
    url: "https://www.youtube.com/watch?v=4RPYGf1oY_4"
  }
];

const VIDEOS = [
  {
    source: "Boy Abunda · The Interviewer",
    date: "Jan 2023",
    title: "Marites Allen, Philippine Feng Shui Queen (Live Replay)",
    badge: "334K views",
    yt: "mswSQ7Utz1s"
  },
  {
    source: "NewsWatch Interviews",
    date: "Jan 2025",
    title: "Feng Shui Expert Marites Allen on the Year of the Wooden Snake",
    badge: "TV",
    yt: "r27QpjNfhfk"
  },
  {
    source: "ABS-CBN · The Bottomline",
    date: "2020",
    title: "Predictions for Each Chinese Zodiac Sign",
    badge: "TV",
    yt: "xfLMTQCr3og"
  },
  {
    source: "Media Conference · Marco Polo",
    date: "2017",
    title: "Why 2018 is a Prosperous Year",
    badge: "International",
    yt: "4RPYGf1oY_4"
  },
  {
    source: "Marites Allen",
    date: "2021",
    title: "Journey to Feng Shui",
    badge: "Feature",
    yt: "kfPKazF19jw"
  },
  {
    source: "Boy Abunda · The Interviewer",
    date: "Jan 2023",
    title: "Marites Allen, Philippine Feng Shui Queen",
    badge: "TV",
    yt: "60M_0OOtfHU"
  }
];

export default function MediaPage() {
  const [pressName, setPressName] = useState("");
  const [pressOutlet, setPressOutlet] = useState("");
  const [pressEmail, setPressEmail] = useState("");
  const [pressSent, setPressSent] = useState(false);
  const [pressModalOpen, setPressModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const pressReady = !!(pressName && emailOk(pressEmail));

  const groupedPress = useMemo(() => {
    const years: number[] = [];
    PRESS_RAW.forEach((p) => {
      if (!years.includes(p.year)) years.push(p.year);
    });
    years.sort((a, b) => b - a);
    return years.map((y) => {
      const items = PRESS_RAW.filter((p) => p.year === y).sort((a, b) => b.m - a.m);
      return {
        year: String(y),
        id: `y${y}`,
        items,
        label: `${items.length} ${items.length === 1 ? "feature" : "features"}`
      };
    });
  }, []);

  return (
    <div className="page-shell page-enter">
      {videoModalOpen && activeVideoId && (
        <div
          onClick={() => {
            setVideoModalOpen(false);
            setActiveVideoId(null);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 210,
            background: "rgba(6,20,15,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "100%", maxWidth: 920 }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                borderRadius: 14,
                overflow: "hidden",
                background: "#000"
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title="Video"
                style={{ width: "100%", height: "100%", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                type="button"
                onClick={() => {
                  setVideoModalOpen(false);
                  setActiveVideoId(null);
                }}
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  border: 0,
                  cursor: "pointer"
                }}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {pressModalOpen && (
        <div
          onClick={() => setPressModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 220,
            background: "rgba(6,20,15,0.78)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "#fffdf8",
              borderRadius: 18,
              padding: "clamp(24px,4vw,34px)",
              maxWidth: 440,
              width: "100%",
              boxShadow: "0 40px 90px -20px rgba(0,0,0,0.5)"
            }}
          >
            <button
              type="button"
              onClick={() => setPressModalOpen(false)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.08)",
                color: "#3d5348",
                border: 0,
                cursor: "pointer"
              }}
            >
              ×
            </button>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#c69a3e" }}>
              For press &amp; media
            </div>
            <h2 className="font-display" style={{ fontWeight: 700, fontSize: 22, color: "#143d31", margin: "8px 0 6px" }}>
              Download the free press kit
            </h2>
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "#6b7268", margin: "0 0 18px" }}>
              Register your details and we&apos;ll email you the full kit.
            </p>
            <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
              <input
                type="text"
                value={pressName}
                onChange={(e) => setPressName(e.target.value)}
                placeholder="Full name"
                style={{
                  background: "#f9f5ec",
                  border: "1.5px solid #cdd8d0",
                  borderRadius: 10,
                  padding: "11px 13px",
                  fontFamily: "Lato, system-ui, sans-serif",
                  color: "#2a2a28"
                }}
              />
              <input
                type="text"
                value={pressOutlet}
                onChange={(e) => setPressOutlet(e.target.value)}
                placeholder="Outlet / publication"
                style={{
                  background: "#f9f5ec",
                  border: "1.5px solid #cdd8d0",
                  borderRadius: 10,
                  padding: "11px 13px",
                  fontFamily: "Lato, system-ui, sans-serif",
                  color: "#2a2a28"
                }}
              />
              <input
                type="email"
                value={pressEmail}
                onChange={(e) => setPressEmail(e.target.value)}
                placeholder="you@email.com"
                style={{
                  background: "#f9f5ec",
                  border: "1.5px solid #cdd8d0",
                  borderRadius: 10,
                  padding: "11px 13px",
                  fontFamily: "Lato, system-ui, sans-serif",
                  color: "#2a2a28"
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (pressReady) {
                  setPressSent(true);
                  setPressModalOpen(false);
                }
              }}
              style={{
                width: "100%",
                textAlign: "center",
                background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                color: "#fff",
                borderRadius: 11,
                padding: 13,
                fontSize: 15,
                fontWeight: 700,
                cursor: pressReady ? "pointer" : "default",
                opacity: pressReady ? 1 : 0.5,
                pointerEvents: pressReady ? "auto" : "none",
                border: 0
              }}
            >
              Get the press kit
            </button>
          </div>
        </div>
      )}

      <SiteHeader />

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(24px,3vw,32px) clamp(18px,4vw,40px) 0" }}>
        <div
          style={{
            background: "linear-gradient(120deg,#1a4d3e,#0f3126)",
            borderRadius: 14,
            padding: "14px 20px",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <span style={{ color: "#e6c680", fontSize: 15 }}>✦</span>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                Free Press Kit for media
              </div>
              <div style={{ fontSize: 12.5, color: "#9fbcb0" }}>
                Bio, high-res photos, fact sheet &amp; past coverage.
              </div>
            </div>
          </div>
          {!pressSent ? (
            <button
              type="button"
              onClick={() => setPressModalOpen(true)}
              style={{
                background: "#e6c680",
                color: "#143d31",
                fontSize: 13.5,
                fontWeight: 700,
                padding: "10px 18px",
                borderRadius: 9,
                cursor: "pointer",
                flexShrink: 0,
                whiteSpace: "nowrap",
                border: 0
              }}
            >
              Download press kit →
            </button>
          ) : (
            <span style={{ fontSize: 13, fontWeight: 700, color: "#e6c680", flexShrink: 0 }}>
              ✓ Sent to {pressEmail}
            </span>
          )}
        </div>
      </section>

      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "clamp(32px,4vw,48px) clamp(18px,4vw,40px) clamp(48px,7vw,80px)"
        }}
      >
        <h1
          className="font-display"
          style={{ fontWeight: 700, fontSize: "clamp(26px,3.2vw,36px)", color: "#143d31", margin: "0 0 6px" }}
        >
          Media &amp; Press
        </h1>
        <p style={{ fontSize: 15, color: "#5f6b60", margin: "0 0 22px", maxWidth: 640, lineHeight: 1.6 }}>
          Press coverage, interviews, and features with Marites Allen — newest first.
        </p>
        <h2
          className="font-display"
          style={{ fontWeight: 700, fontSize: "clamp(18px,2.2vw,24px)", color: "#143d31", margin: "0 0 6px" }}
        >
          Article directory
        </h2>
        <p style={{ fontSize: 14.5, color: "#6b7268", margin: "0 0 18px" }}>
          Jump to a year:
        </p>

        <div
          style={{
            position: "sticky",
            top: 72,
            zIndex: 20,
            background: "rgba(246,241,231,0.95)",
            backdropFilter: "blur(8px)",
            padding: "12px 0",
            marginBottom: 8,
            borderBottom: "1px solid rgba(20,61,49,0.1)"
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {groupedPress.map((y) => (
              <a
                key={y.id}
                href={`#${y.id}`}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1a4d3e",
                  background: "#fffdf8",
                  border: "1.5px solid rgba(20,61,49,0.15)",
                  borderRadius: 99,
                  padding: "7px 15px"
                }}
              >
                {y.year} <span style={{ color: "#a3946f", fontWeight: 400 }}>({y.items.length})</span>
              </a>
            ))}
          </div>
        </div>

        {groupedPress.map((g) => (
          <div key={g.id} id={g.id} style={{ paddingTop: 24, scrollMarginTop: 150 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <h3
                className="font-display"
                style={{ fontWeight: 700, fontSize: "clamp(26px,3.2vw,34px)", color: "#c69a3e", margin: 0 }}
              >
                {g.year}
              </h3>
              <div style={{ flex: 1, height: 1, background: "rgba(20,61,49,0.15)" }} />
              <span style={{ fontSize: 12, color: "#8a8a80", whiteSpace: "nowrap" }}>{g.label}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {g.items.map((p) => (
                <a
                  key={`${p.outlet}-${p.month}-${p.quote.slice(0, 24)}`}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 14,
                    alignItems: "baseline",
                    background: "#fffdf8",
                    border: "1px solid rgba(20,61,49,0.1)",
                    borderRadius: 14,
                    padding: "16px 20px",
                    boxShadow: "0 8px 22px -18px rgba(20,60,45,0.3)"
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#a3946f", minWidth: 56 }}>{p.month}</span>
                  <span style={{ flex: "1 1 340px", minWidth: 220 }}>
                    <span
                      className="font-display"
                      style={{
                        display: "block",
                        fontWeight: 600,
                        fontSize: 16.5,
                        color: "#143d31",
                        lineHeight: 1.35
                      }}
                    >
                      {p.quote}
                    </span>
                    <span style={{ display: "block", fontSize: 13, color: "#6b7268", marginTop: 4 }}>{p.outlet}</span>
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#c69a3e", whiteSpace: "nowrap" }}>
                    {p.cta} →
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section style={{ background: "#12362a", color: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(32px,4vw,50px) clamp(18px,4vw,40px)" }}>
          <h2
            className="font-display"
            style={{ fontWeight: 700, fontSize: "clamp(21px,2.6vw,28px)", margin: "0 0 6px" }}
          >
            Television &amp; video
          </h2>
          <p style={{ fontSize: 15, color: "#a9c6ba", margin: "0 0 20px" }}>
            Including recurring segments on <strong style={{ color: "#e6c680" }}>Marites Allen Live</strong>, her weekly
            Feng Shui broadcast.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {VIDEOS.map((v) => (
              <button
                key={`${v.yt}-${v.title}`}
                type="button"
                onClick={() => {
                  setActiveVideoId(v.yt);
                  setVideoModalOpen(true);
                }}
                style={{
                  display: "block",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(230,198,128,0.2)",
                  borderRadius: 16,
                  overflow: "hidden",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: 0,
                  color: "inherit"
                }}
              >
                <div style={{ aspectRatio: "16/9", position: "relative", background: "#0f3126" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${v.yt}/hqdefault.jpg`}
                    alt={v.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg,rgba(15,49,38,0.05),rgba(15,49,38,0.35))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "rgba(230,198,128,0.92)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" fill="#143d31" />
                      </svg>
                    </div>
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: "#0f3126",
                      background: "#e6c680",
                      borderRadius: 6,
                      padding: "3px 8px"
                    }}
                  >
                    {v.badge}
                  </span>
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ fontSize: 12, color: "#9fbcb0", marginBottom: 5 }}>
                    {v.source} · {v.date}
                  </div>
                  <div className="font-display" style={{ fontWeight: 600, fontSize: 16, color: "#fff", lineHeight: 1.3 }}>
                    {v.title}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(32px,4vw,50px) clamp(18px,4vw,40px)" }}>
        <div
          style={{
            background: "#fffdf8",
            border: "1px solid rgba(20,61,49,0.1)",
            borderRadius: 22,
            padding: "clamp(28px,4vw,48px)",
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ flex: "1 1 320px" }}>
            <h2
              className="font-display"
              style={{ fontWeight: 700, fontSize: "clamp(24px,3vw,32px)", color: "#143d31", margin: "0 0 8px" }}
            >
              Media &amp; press enquiries
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "#5f6b60", margin: 0 }}>
              For interviews, features, speaking engagements and the annual Chinese New Year forecast, get in touch
              with the team.
            </p>
            <div style={{ marginTop: 16, fontSize: 15, color: "#3d4a41" }}>
              <div style={{ marginBottom: 4 }}>
                ✉ <a href="mailto:sales@frigga.co.uk">sales@frigga.co.uk</a>
              </div>
              <div>☎ +63 920 950 9390 · +63 939 351 6424</div>
            </div>
          </div>
          <Link
            href="/book"
            style={{
              background: "linear-gradient(160deg,#1a4d3e,#143d31)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              padding: "16px 30px",
              borderRadius: 12
            }}
          >
            Book Consultation · Coming Soon →
          </Link>
        </div>
      </section>

      <SiteFooter variant="minimal" />
    </div>
  );
}
