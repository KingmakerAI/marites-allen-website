"use client";

import Image from "next/image";
import { useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { emailOk } from "@/lib/site-data";

export default function DestaraPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const ready = emailOk(email);

  return (
    <div className="page-shell page-enter">
      <SiteHeader />

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(28px,4vw,48px) clamp(18px,4vw,40px) 0" }}>
        <div style={{ fontSize: 12, color: "#8a8a80" }}>Destara (application)</div>
        <h1
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: "clamp(30px,4.4vw,46px)",
            color: "#143d31",
            margin: "6px 0 4px",
            borderBottom: "2px solid rgba(20,61,49,0.12)",
            paddingBottom: 14
          }}
        >
          Destara
        </h1>
      </div>

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 clamp(18px,4vw,40px) 60px",
          display: "flex",
          flexWrap: "wrap-reverse",
          gap: 36
        }}
      >
        <div style={{ flex: "2 1 480px", minWidth: 300 }}>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: "20px 0" }}>
            <strong>Destara</strong> is an AI-powered &quot;Destiny Guide&quot; application developed in collaboration
            with Feng Shui master Marites Allen, launched in 2026 to coincide with the Year of the Fire Horse. The app
            is trained on more than three decades of Allen&apos;s Feng Shui knowledge and practice, offering users
            personalized guidance based on Chinese astrology and Feng Shui principles.
          </p>

          <h2
            className="font-display"
            style={{
              fontWeight: 600,
              fontSize: 24,
              color: "#143d31",
              margin: "36px 0 12px",
              borderBottom: "1px solid rgba(20,61,49,0.12)",
              paddingBottom: 8
            }}
          >
            Overview
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: "0 0 16px" }}>
            Destara is designed to make Marites Allen&apos;s guidance accessible between formal consultations. Rather
            than a generic chatbot, the app is built specifically around Feng Shui and Chinese astrology, aiming to
            provide grounded, consistent guidance drawn from an established practice rather than open-ended AI
            speculation.
          </p>

          <h2
            className="font-display"
            style={{
              fontWeight: 600,
              fontSize: 24,
              color: "#143d31",
              margin: "36px 0 12px",
              borderBottom: "1px solid rgba(20,61,49,0.12)",
              paddingBottom: 8
            }}
          >
            Features
          </h2>
          <ul style={{ fontSize: 16, lineHeight: 1.85, color: "#333", paddingLeft: 22, margin: "0 0 16px" }}>
            <li>Personalized BaZi and zodiac-based readings</li>
            <li>Real-time auspicious date suggestions</li>
            <li>Tailored Feng Shui cures and recommendations</li>
            <li>Available 24 hours a day, in more than 50 languages</li>
          </ul>

          <div style={{ margin: "34px 0 8px", display: "flex", justifyContent: "center" }}>
            <div style={{ perspective: 1500, width: "100%", maxWidth: 290 }}>
              <div
                className="om3d"
                style={{
                  position: "relative",
                  width: "100%",
                  transform: "rotateY(-14deg) rotateX(6deg) rotate(0.5deg)",
                  transformStyle: "preserve-3d",
                  borderRadius: 52,
                  background:
                    "linear-gradient(145deg,#3b4046 0%,#14171a 22%,#0a0c0e 50%,#20242a 78%,#4a5057 100%)",
                  padding: 11,
                  boxShadow:
                    "0 50px 90px -28px rgba(0,0,0,0.45), 0 18px 40px -20px rgba(0,0,0,0.32), 0 0 0 1px rgba(0,0,0,0.08)"
                }}
              >
                <div
                  style={{
                    position: "relative",
                    borderRadius: 42,
                    overflow: "hidden",
                    background: "#04120d",
                    aspectRatio: "626/1078"
                  }}
                >
                  <Image
                    src="/images/zip/destara-app.png"
                    alt="The Destara app showing today's forecast"
                    fill
                    sizes="290px"
                    style={{ objectFit: "cover", objectPosition: "top center" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 11,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "30%",
                      height: 24,
                      borderRadius: 99,
                      background: "#000",
                      zIndex: 3
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", fontSize: 12.5, color: "#6b7268", marginBottom: 8 }}>
            The Destara home screen, showing your daily forecast.
          </div>

          <h2
            className="font-display"
            style={{
              fontWeight: 600,
              fontSize: 24,
              color: "#143d31",
              margin: "36px 0 12px",
              borderBottom: "1px solid rgba(20,61,49,0.12)",
              paddingBottom: 8
            }}
          >
            Availability
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: "0 0 16px" }}>
            Destara is available via web at{" "}
            <a href="https://destara.app" target="_blank" rel="noopener noreferrer">
              destara.app
            </a>
            , with iOS and Android access. Early registrants receive priority access as the app rolls out.
          </p>

          <h2
            className="font-display"
            style={{
              fontWeight: 600,
              fontSize: 24,
              color: "#143d31",
              margin: "36px 0 12px",
              borderBottom: "1px solid rgba(20,61,49,0.12)",
              paddingBottom: 8
            }}
          >
            Relationship to Marites Allen&apos;s practice
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: "0 0 16px" }}>
            Destara is positioned as a companion to, not a replacement for, Marites Allen&apos;s personal
            consultations. It provides everyday guidance while directing users toward a full one-on-one session for
            more complex questions such as home audits or major business decisions.
          </p>
        </div>

        <div style={{ flex: "1 1 280px", minWidth: 280, maxWidth: 340 }}>
          <div
            style={{
              background: "#f4efe3",
              border: "1px solid rgba(20,61,49,0.15)",
              borderRadius: 4,
              overflow: "hidden",
              position: "sticky",
              top: 96
            }}
          >
            <div
              className="font-display"
              style={{
                background: "#e7ddc0",
                padding: "10px 14px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: 16,
                color: "#143d31"
              }}
            >
              Destara
            </div>
            <div style={{ padding: 20, textAlign: "center" }}>
              <Image
                src="/images/zip/destara-logo.png"
                alt="Destara"
                width={180}
                height={80}
                style={{ width: "100%", maxWidth: 180, height: "auto", objectFit: "contain", margin: "0 auto 14px" }}
              />
              <div style={{ fontSize: 11, color: "#6b7268", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left" }}>
                Developer
              </div>
              <div style={{ fontSize: 13.5, color: "#2a2a28", margin: "2px 0 10px", textAlign: "left" }}>Marites Allen</div>
              <div style={{ fontSize: 11, color: "#6b7268", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left" }}>
                Platforms
              </div>
              <div style={{ fontSize: 13.5, color: "#2a2a28", margin: "2px 0 10px", textAlign: "left" }}>Web, iOS, Android</div>
              <div style={{ fontSize: 11, color: "#6b7268", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left" }}>
                Launch
              </div>
              <div style={{ fontSize: 13.5, color: "#2a2a28", margin: "2px 0 10px", textAlign: "left" }}>2026</div>
              <div style={{ fontSize: 11, color: "#6b7268", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left" }}>
                Languages
              </div>
              <div style={{ fontSize: 13.5, color: "#2a2a28", margin: "2px 0 14px", textAlign: "left" }}>50+</div>

              {!sent ? (
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    style={{
                      width: "100%",
                      background: "#fffdf8",
                      border: "1.5px solid #cdd8d0",
                      borderRadius: 10,
                      padding: "11px 13px",
                      fontFamily: "Lato, system-ui, sans-serif",
                      color: "#2a2a28",
                      marginBottom: 10
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (ready) setSent(true);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "center",
                      background: "linear-gradient(160deg,#e6c680,#c69a3e)",
                      color: "#143d31",
                      borderRadius: 10,
                      padding: 13,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: ready ? "pointer" : "default",
                      opacity: ready ? 1 : 0.5,
                      pointerEvents: ready ? "auto" : "none",
                      marginBottom: 10,
                      border: 0
                    }}
                  >
                    Register for early access
                  </button>
                  <a
                    href="https://destara.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      textAlign: "center",
                      border: "1.5px solid rgba(20,61,49,0.2)",
                      color: "#143d31",
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 14,
                      fontWeight: 700
                    }}
                  >
                    Download at Destara.app →
                  </a>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a4d3e", marginBottom: 8 }}>
                    You&apos;re on the list! ✦
                  </div>
                  <p style={{ fontSize: 12.5, color: "#6b7268", margin: "0 0 12px" }}>
                    We&apos;ll email {email} when early access is ready.
                  </p>
                  <a
                    href="https://destara.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                      color: "#fff",
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 14,
                      fontWeight: 700
                    }}
                  >
                    Start now at Destara.app →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter variant="minimal" />
    </div>
  );
}
