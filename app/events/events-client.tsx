"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { EventCountdown } from "@/components/event-countdown";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { emailOk } from "@/lib/site-data";

const FEATURED_EVENTS = [
  {
    id: "meet-greet-cleansing",
    title: "Exclusive In Person Meet & Greet — Catch Up & Cleansing Ritual",
    eyebrow: "In person · Pre-booked",
    summary:
      "Be ready for Ghost Month. Protection today brings peace, luck and clarity tomorrow. Strictly for confirmed attendees only.",
    whenLabel: "Saturday, 8 August 2026 · 2:00–5:00 PM",
    whereLabel: "Acceler8 Rockwell, 5th Floor, Phinma Plaza, Rockwell Center, Makati",
    startsAt: "2026-08-08T14:00:00+08:00",
    endsAt: "2026-08-08T17:00:00+08:00",
    image: "/images/events/meet-greet-cleansing-ritual.png",
    imageWidth: 1536,
    imageHeight: 1024,
    ctaHref: "https://wa.me/639209509390",
    ctaLabel: "Enquire on WhatsApp",
    liveHref: undefined as string | undefined,
    liveLabel: undefined as string | undefined,
    tagline: "Protect your space · Attract positive energy · Create harmony"
  },
  {
    id: "ghost-month-live",
    title: "Ghost Month 2026: Tips, Insights & Reminders",
    eyebrow: "Facebook Live",
    summary:
      "Join Marites Allen for common sense, tradition, and Feng Shui guidance for a safe, harmonious and prosperous season.",
    whenLabel: "Saturday, 1 August 2026 · 3:00 PM (PH Time)",
    whereLabel: "Facebook Live",
    startsAt: "2026-08-01T15:00:00+08:00",
    endsAt: "2026-08-01T17:00:00+08:00",
    image: "/images/events/ghost-month-2026-live.png",
    imageWidth: 1600,
    imageHeight: 800,
    ctaHref: "https://www.facebook.com/MaritesAllen168/",
    ctaLabel: "Watch on Facebook",
    liveHref: "https://www.facebook.com/MaritesAllen168/",
    liveLabel: "Watch live on Facebook",
    tagline: "Be informed. Be prepared. Be protected."
  }
];

const ENGAGEMENTS = [
  { org: "Manila House Private Club", topic: "Annual CNY Countdown & Welcoming Ritual" },
  { org: "Marco Polo Hotels", topic: "Media conference & annual forecast" },
  { org: "Citibank", topic: "Client event on prosperity and timing" },
  { org: "HSBC", topic: "Client event on the annual forecast" },
  { org: "Accenture", topic: "Corporate talk on workplace Feng Shui" },
  { org: "Unilab", topic: "Corporate talk on business timing" },
  { org: "Nestlé", topic: "Corporate session on prosperity themes" },
  { org: "McDonald's Philippines", topic: "Corporate talk on Feng Shui themes" }
];

const VIDEOS = [
  { source: "Boy Abunda · The Interviewer", title: "Marites Allen, Philippine Feng Shui Queen", yt: "mswSQ7Utz1s" },
  { source: "Media Conference · Marco Polo", title: "Why 2018 is a Prosperous Year", yt: "4RPYGf1oY_4" },
  { source: "NewsWatch Interviews", title: "Feng Shui Expert on the Year of the Wooden Snake", yt: "r27QpjNfhfk" },
  { source: "ABS-CBN · The Bottomline", title: "Predictions for Each Chinese Zodiac Sign", yt: "xfLMTQCr3og" }
];

export default function EventsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const ready = !!(name && emailOk(email));

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
                boxShadow: "0 40px 90px -20px rgba(0,0,0,0.6)",
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
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 2,
                  border: 0
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteHeader />

      <section
        style={{
          background: "linear-gradient(165deg,#0f3126 0%,#06140f 100%)",
          color: "#fff",
          borderBottom: "1px solid rgba(230,198,128,0.15)"
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(28px,4vw,48px) clamp(18px,4vw,40px)" }}>
          <div style={{ maxWidth: 720, marginBottom: 28 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                color: "#e6c680"
              }}
            >
              Upcoming & featured
            </div>
            <h1
              className="font-display"
              style={{
                fontWeight: 700,
                fontSize: "clamp(28px,4vw,42px)",
                margin: "10px 0 10px",
                lineHeight: 1.15
              }}
            >
              Events with Marites Allen
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "#c7ddd2", margin: 0 }}>
              Live sessions and private gatherings for Ghost Month preparation, cleansing, and guidance.
            </p>
          </div>

          <div style={{ display: "grid", gap: 22 }}>
            {FEATURED_EVENTS.map((event) => {
              const isExternal = event.ctaHref.startsWith("http");
              return (
                <article
                  key={event.id}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(230,198,128,0.22)",
                    borderRadius: 20,
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr)"
                  }}
                  className="eventFeatureCard"
                >
                  <div style={{ position: "relative", minHeight: 260, background: "#04120d" }}>
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={event.imageWidth}
                      height={event.imageHeight}
                      sizes="(max-width: 900px) 100vw, 55vw"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      priority={event.id === FEATURED_EVENTS[0].id}
                    />
                  </div>
                  <div
                    style={{
                      padding: "clamp(20px,3vw,32px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: 1.2,
                          textTransform: "uppercase",
                          color: "#143d31",
                          background: "#e6c680",
                          borderRadius: 99,
                          padding: "4px 10px"
                        }}
                      >
                        {event.eyebrow}
                      </span>
                      <h2
                        className="font-display"
                        style={{
                          fontWeight: 700,
                          fontSize: "clamp(20px,2.4vw,26px)",
                          margin: "12px 0 8px",
                          lineHeight: 1.25,
                          color: "#fff"
                        }}
                      >
                        {event.title}
                      </h2>
                      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#c7ddd2", margin: 0 }}>
                        {event.summary}
                      </p>
                    </div>

                    <div style={{ display: "grid", gap: 6, fontSize: 13.5, color: "#e7efe9" }}>
                      <div>
                        <strong style={{ color: "#e6c680" }}>When:</strong> {event.whenLabel}
                      </div>
                      <div>
                        <strong style={{ color: "#e6c680" }}>Where:</strong> {event.whereLabel}
                      </div>
                    </div>

                    <div style={{ fontSize: 12.5, color: "#9fbcb0", lineHeight: 1.5 }}>{event.tagline}</div>

                    <EventCountdown
                      startsAt={event.startsAt}
                      endsAt={event.endsAt}
                      liveHref={event.liveHref}
                      liveLabel={event.liveLabel}
                    />

                    <div style={{ marginTop: "auto", paddingTop: 4 }}>
                      {isExternal ? (
                        <a
                          href={event.ctaHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-block",
                            background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                            border: "1px solid rgba(230,198,128,0.35)",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 14,
                            padding: "12px 18px",
                            borderRadius: 10
                          }}
                        >
                          {event.ctaLabel} →
                        </a>
                      ) : (
                        <Link
                          href={event.ctaHref}
                          style={{
                            display: "inline-block",
                            background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                            border: "1px solid rgba(230,198,128,0.35)",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 14,
                            padding: "12px 18px",
                            borderRadius: 10
                          }}
                        >
                          {event.ctaLabel} →
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(28px,3.6vw,42px) clamp(18px,4vw,40px)" }}>
        <div
          style={{
            background: "#fffdf8",
            border: "1px solid rgba(20,61,49,0.1)",
            borderRadius: 20,
            padding: "clamp(24px,4vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            gap: 28,
            alignItems: "center",
            boxShadow: "0 16px 40px -24px rgba(20,60,45,0.4)"
          }}
        >
          <div style={{ flex: "0 1 320px", minWidth: 260 }}>
            <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "4/3", position: "relative" }}>
              <Image
                src="/images/zip/marites-3.webp"
                alt="Marites Allen event"
                fill
                sizes="320px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "#1a4d3e",
                background: "#e6c680",
                borderRadius: 99,
                padding: "3px 10px"
              }}
            >
              Signature annual event
            </span>
            <h2
              className="font-display"
              style={{ fontWeight: 600, fontSize: 24, color: "#143d31", margin: "12px 0 8px" }}
            >
              Chinese New Year Countdown &amp; Welcoming Ritual
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "#5f6b60", margin: 0 }}>
              Held annually at Manila House Private Club in BGC, Taguig, this signature event brings together members
              and guests to welcome the new zodiac year with Marites Allen&apos;s forecast and ritual.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "#efe8d8" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(28px,3.6vw,42px) clamp(18px,4vw,40px)" }}>
          <h2
            className="font-display"
            style={{ fontWeight: 700, fontSize: "clamp(24px,3.4vw,32px)", color: "#143d31", margin: "0 0 24px" }}
          >
            Speaking engagements &amp; corporate talks
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
            {ENGAGEMENTS.map((e) => (
              <div
                key={e.org}
                style={{
                  background: "#fffdf8",
                  border: "1px solid rgba(20,61,49,0.1)",
                  borderRadius: 14,
                  padding: 18
                }}
              >
                <div className="font-display" style={{ fontWeight: 600, fontSize: 16, color: "#143d31", marginBottom: 4 }}>
                  {e.org}
                </div>
                <div style={{ fontSize: 13, color: "#6b7268" }}>{e.topic}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#12362a", color: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(28px,3.6vw,42px) clamp(18px,4vw,40px)" }}>
          <h2
            className="font-display"
            style={{ fontWeight: 700, fontSize: "clamp(24px,3.4vw,32px)", margin: "0 0 24px" }}
          >
            Videos &amp; presentations
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
            {VIDEOS.map((v) => (
              <button
                key={v.yt}
                type="button"
                onClick={() => {
                  setActiveVideoId(v.yt);
                  setVideoModalOpen(true);
                }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(230,198,128,0.2)",
                  borderRadius: 14,
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
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        background: "rgba(230,198,128,0.92)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" fill="#143d31" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 12, color: "#9fbcb0", marginBottom: 4 }}>{v.source}</div>
                  <div className="font-display" style={{ fontWeight: 600, fontSize: 15, color: "#fff" }}>
                    {v.title}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(28px,3.6vw,42px) clamp(18px,4vw,40px)" }}>
        <div
          style={{
            background: "#fffdf8",
            border: "1px solid rgba(20,61,49,0.1)",
            borderRadius: 20,
            padding: "clamp(24px,4vw,40px)",
            boxShadow: "0 16px 40px -24px rgba(20,60,45,0.4)"
          }}
        >
          {!sent ? (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#c69a3e" }}>
                Book Marites to speak
              </div>
              <h2
                className="font-display"
                style={{ fontWeight: 700, fontSize: 26, color: "#143d31", margin: "10px 0 8px" }}
              >
                Enquire about a speaking engagement
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#6b7268", margin: "0 0 22px" }}>
                Tell us about your event and our team will follow up.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                  gap: 14,
                  marginBottom: 14
                }}
              >
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#3d5348", marginBottom: 5 }}>
                    Full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    style={{
                      width: "100%",
                      background: "#f9f5ec",
                      border: "1.5px solid #cdd8d0",
                      borderRadius: 10,
                      padding: "11px 13px",
                      fontFamily: "Lato, system-ui, sans-serif",
                      color: "#2a2a28"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#3d5348", marginBottom: 5 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    style={{
                      width: "100%",
                      background: "#f9f5ec",
                      border: "1.5px solid #cdd8d0",
                      borderRadius: 10,
                      padding: "11px 13px",
                      fontFamily: "Lato, system-ui, sans-serif",
                      color: "#2a2a28"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#3d5348", marginBottom: 5 }}>
                    Organization
                  </label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="Company / organization"
                    style={{
                      width: "100%",
                      background: "#f9f5ec",
                      border: "1.5px solid #cdd8d0",
                      borderRadius: 10,
                      padding: "11px 13px",
                      fontFamily: "Lato, system-ui, sans-serif",
                      color: "#2a2a28"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#3d5348", marginBottom: 5 }}>
                    Event date
                  </label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g. Feb 2027 or TBD"
                    style={{
                      width: "100%",
                      background: "#f9f5ec",
                      border: "1.5px solid #cdd8d0",
                      borderRadius: 10,
                      padding: "11px 13px",
                      fontFamily: "Lato, system-ui, sans-serif",
                      color: "#2a2a28"
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#3d5348", marginBottom: 5 }}>
                  Tell us about your event
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Event type, audience size, topic of interest…"
                  rows={3}
                  style={{
                    width: "100%",
                    background: "#f9f5ec",
                    border: "1.5px solid #cdd8d0",
                    borderRadius: 10,
                    padding: "11px 13px",
                    fontFamily: "Lato, system-ui, sans-serif",
                    color: "#2a2a28",
                    resize: "none"
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (ready) setSent(true);
                }}
                style={{
                  width: "100%",
                  textAlign: "center",
                  background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                  color: "#fff",
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: ready ? "pointer" : "default",
                  opacity: ready ? 1 : 0.5,
                  pointerEvents: ready ? "auto" : "none",
                  border: 0
                }}
              >
                Send speaking enquiry
              </button>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#1a4d3e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                  color: "#e6c680",
                  fontSize: 24,
                  fontWeight: 700
                }}
              >
                ✓
              </div>
              <h3 className="font-display" style={{ fontWeight: 700, fontSize: 22, color: "#143d31", margin: "0 0 6px" }}>
                Enquiry sent
              </h3>
              <p style={{ fontSize: 14, color: "#6b7268" }}>
                Thank you. Our team will reach out to <strong style={{ color: "#143d31" }}>{email}</strong> shortly.
              </p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter variant="minimal" />
    </div>
  );
}
