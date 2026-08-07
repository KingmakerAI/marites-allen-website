"use client";

import Image from "next/image";
import { useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { emailOk } from "@/lib/site-data";

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
