"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { submitSignupAction } from "@/app/signup/actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CHART_PERKS, emailOk, HOME_SERVICES, zodiacFromYear, zodiacNote } from "@/lib/site-data";
import type { HomeExtrasCopy } from "@/lib/cms/page-copy-types";
import { cms } from "@/lib/cms/cms-attr";

const HomeBelowFold = dynamic(() => import("./home-below-fold"), {
  loading: () => <div style={{ minHeight: 480 }} aria-hidden />
});

type HomeFaq = { q: string; a: string };
type HomeQuote = { name: string; role: string; text: string; initial: string };
type HomeHero = {
  heading: string;
  subheading: string;
  highlight?: string;
  ctaLabel: string;
  ctaHref: string;
  chartCtaLabel: string;
  rating: string;
  imageUrl: string;
  imageAlt: string;
};
type HomeStat = { value: string; label: string };
type HomeClosing = { heading: string; body: string; ctaLabel: string; ctaHref: string };

export default function HomePage({
  faqs,
  services,
  testimonials,
  hero,
  stats,
  closing,
  extras,
  showServices = true
}: {
  faqs?: HomeFaq[];
  services?: typeof HOME_SERVICES;
  testimonials?: HomeQuote[];
  hero?: HomeHero;
  stats?: HomeStat[];
  closing?: HomeClosing;
  extras?: HomeExtrasCopy;
  showServices?: boolean;
}) {
  const [chartOpen, setChartOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadDob, setLeadDob] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSent, setLeadSent] = useState(false);
  const [leadPending, setLeadPending] = useState(false);
  const [leadError, setLeadError] = useState("");

  const leadYear = leadDob ? parseInt(leadDob.slice(0, 4), 10) : null;
  const leadSign = leadYear ? zodiacFromYear(leadYear) : "";
  const leadReady = !!(leadDob && emailOk(leadEmail));
  const pressLabel = extras?.pressLabel || "As featured in";
  const pressBadge = extras?.pressBadge || "Forbes · Tatler · ANC";
  const pressNames = extras?.pressNames?.length
    ? extras.pressNames
    : ["Forbes", "Tatler", "Manila Bulletin", "Manila Times", "ANC"];

  return (
    <div className="page-shell page-enter">
      <SiteHeader />

      {chartOpen && (
        <div
          onClick={() => setChartOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(10,26,20,0.7)",
            backdropFilter: "blur(3px)",
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
              maxWidth: 900,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              overflowX: "hidden",
              background: "#fffdf8",
              borderRadius: 20,
              boxShadow: "0 40px 90px -20px rgba(0,0,0,0.5)",
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            <button
              type="button"
              onClick={() => setChartOpen(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.35)",
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
            <div
              style={{
                flex: "1 1 320px",
                minWidth: 280,
                background: "linear-gradient(155deg,#1a4d3e,#0f3126)",
                padding: "clamp(28px,4vw,48px)",
                color: "#fff"
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#e6c680" }}>
                Free · No obligation
              </div>
              <h2 className="font-display" style={{ fontWeight: 700, fontSize: "clamp(24px,3.2vw,34px)", lineHeight: 1.15, margin: "12px 0" }}>
                Get your free Destiny Chart
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "#c7ddd2", margin: "0 0 20px", maxWidth: 400 }}>
                Enter your birth details and we&apos;ll send you a personalized snapshot of your Chinese zodiac and this
                year&apos;s energies. It&apos;s a good first step before a full consultation.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                {CHART_PERKS.map((p) => (
                  <li key={p} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#e7efe9" }}>
                    <span style={{ color: "#e6c680", fontWeight: 700 }}>✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div
              style={{
                flex: "1 1 320px",
                minWidth: 280,
                background: "#f9f5ec",
                padding: "clamp(24px,3.5vw,40px)",
                display: "flex",
                alignItems: "center"
              }}
            >
              <div style={{ width: "100%" }}>
                {!leadSent ? (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14 }}>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#3d5348", marginBottom: 6 }}>
                          Full name
                        </label>
                        <input
                          type="text"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="Your name"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#3d5348", marginBottom: 6 }}>
                          Date of birth
                        </label>
                        <input type="date" value={leadDob} onChange={(e) => setLeadDob(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#3d5348", marginBottom: 6 }}>
                          Time of birth
                        </label>
                        <input type="time" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} style={inputStyle} />
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#3d5348", marginBottom: 6 }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          placeholder="you@email.com"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    {leadError && (
                      <div style={{ color: "#8b2e2e", fontSize: 13, marginBottom: 8 }}>{leadError}</div>
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        if (!leadReady || leadPending) return;
                        setLeadError("");
                        setLeadPending(true);
                        const result = await submitSignupAction({
                          kind: "destiny-chart",
                          source: "home",
                          email: leadEmail,
                          name: leadName,
                          fields: { dob: leadDob, time: leadTime, sign: leadSign }
                        });
                        setLeadPending(false);
                        if (!result.ok) {
                          setLeadError(result.error);
                          return;
                        }
                        setLeadSent(true);
                      }}
                      style={{
                        marginTop: 16,
                        width: "100%",
                        textAlign: "center",
                        background: "linear-gradient(160deg,#e6c680,#c69a3e)",
                        color: "#143d31",
                        borderRadius: 12,
                        padding: 15,
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: leadReady && !leadPending ? "pointer" : "default",
                        opacity: leadReady && !leadPending ? 1 : 0.5,
                        border: 0
                      }}
                    >
                      {leadPending ? "Sending…" : "Send me my Destiny Chart"}
                    </button>
                    <div style={{ fontSize: 12, color: "#6b6862", textAlign: "center", marginTop: 10 }}>
                      We respect your privacy. No spam, and you can unsubscribe anytime.
                    </div>
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
                        fontSize: 28
                      }}
                    >
                      ✓
                    </div>
                    <h3 className="font-display" style={{ fontWeight: 700, fontSize: 24, color: "#143d31", margin: "0 0 6px" }}>
                      You&apos;re a {leadSign}!
                    </h3>
                    <p style={{ fontSize: 15, color: "#5f6b60", margin: "0 0 16px", lineHeight: 1.55 }}>
                      Your full Destiny Chart is on its way to <strong style={{ color: "#143d31" }}>{leadEmail}</strong>.{" "}
                      {zodiacNote(leadSign)}
                    </p>
                    <Link
                      href="/book"
                      style={{
                        display: "inline-block",
                        background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 700,
                        padding: "13px 26px",
                        borderRadius: 11
                      }}
                    >
                      Book Consultation
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div id="top" />

      {/* HERO */}
      <section style={{ background: "linear-gradient(165deg,#1a4d3e 0%,#0f3126 100%)", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: -60,
            right: "8%",
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(198,154,62,0.28),transparent 70%)"
          }}
        />
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "clamp(44px,6vw,80px) clamp(18px,4vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(24px,3.5vw,44px)",
            alignItems: "center",
            position: "relative",
            zIndex: 2
          }}
        >
          <div style={{ flex: "1 1 380px", minWidth: 300 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(230,198,128,0.14)",
                border: "1px solid rgba(230,198,128,0.35)",
                borderRadius: 99,
                padding: "6px 14px"
              }}
            >
              <span style={{ color: "#e6c680", fontSize: 13 }}>★★★★★</span>
              <span style={{ color: "#f2ede1", fontSize: 12, fontWeight: 600 }}>
                {hero?.rating || "4.9 · 1,200+ verified reviews"}
              </span>
            </div>
            <h1
              className="font-display"
              style={{
                fontWeight: 700,
                fontSize: "clamp(34px,5vw,58px)",
                lineHeight: 1.08,
                color: "#fff",
                margin: "20px 0 16px"
              }}
            >
              {hero?.heading || "Transform your luck, home & destiny"}
            </h1>
            <p style={{ fontSize: "clamp(16px,1.6vw,19px)", lineHeight: 1.6, color: "#c7ddd2", margin: "0 0 12px", maxWidth: 520 }}>
              {hero?.subheading || (
                <>
                  Private consultations with <strong style={{ color: "#e6c680" }}>the Philippines&apos; Feng Shui Queen</strong>, the
                  first Filipina Master in Feng Shui, who has advised business leaders and families from Manila to London.
                </>
              )}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 28 }}>
              <Link
                href={hero?.ctaHref || "/book"}
                style={{
                  background: "linear-gradient(160deg,#e6c680,#c69a3e)",
                  color: "#143d31",
                  fontSize: 16,
                  fontWeight: 700,
                  padding: "16px 30px",
                  borderRadius: 12,
                  boxShadow: "0 14px 28px -10px rgba(198,154,62,0.6)"
                }}
              >
                {hero?.ctaLabel || "Book Consultation"}
              </Link>
              <button
                type="button"
                onClick={() => setChartOpen(true)}
                style={{
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "15px 24px",
                  borderRadius: 12,
                  background: "transparent",
                  cursor: "pointer"
                }}
              >
                {hero?.chartCtaLabel || "Free Destiny Chart"}
              </button>
            </div>
            <div
              style={{
                display: "flex",
                gap: "clamp(20px,4vw,44px)",
                marginTop: 40,
                paddingTop: 26,
                borderTop: "1px solid rgba(255,255,255,0.14)"
              }}
            >
              {(
                stats?.length
                  ? stats
                  : [
                      { value: "30+", label: "Years" },
                      { value: "100+", label: "Countries" },
                      { value: "10K+", label: "Companies" },
                      { value: "1M+", label: "Clients" }
                    ]
              ).map((item) => (
                <div key={item.label}>
                  <div className="font-display" style={{ fontWeight: 700, fontSize: "clamp(24px,3vw,32px)", color: "#e6c680" }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: 12, letterSpacing: 0.5, color: "#9fbcb0", textTransform: "uppercase" }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: "0 1 420px", minWidth: 280, position: "relative" }}>
            <div
              style={{
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                border: "2px solid rgba(230,198,128,0.4)",
                boxShadow: "0 40px 70px -20px rgba(0,0,0,0.6)",
                aspectRatio: "4/5"
              }}
            >
              <Image
                src={hero?.imageUrl || "/images/zip/marites-1.webp"}
                alt={hero?.imageAlt || "Marites Allen, Feng Shui Master"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 420px"
                style={{ objectFit: "cover", objectPosition: "50% 16%" }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -18,
                left: -18,
                background: "#fffdf8",
                borderRadius: 14,
                padding: "14px 18px",
                boxShadow: "0 20px 40px -14px rgba(0,0,0,0.4)",
                maxWidth: 230
              }}
            >
              <div style={{ fontSize: 12, color: "#6b6862" }} {...cms("home.pressLabel")}>
                {pressLabel}
              </div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 16, color: "#143d31" }} {...cms("home.pressBadge")}>
                {pressBadge}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Link href="/media" style={{ display: "block", background: "#efe8d8", borderBottom: "1px solid rgba(20,61,49,0.08)" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "18px clamp(18px,4vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(16px,4vw,44px)"
          }}
        >
          <span
            style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#4a4740" }}
            {...cms("home.pressLabel")}
          >
            {pressLabel}
          </span>
          {pressNames.map((name, i) => (
            <span
              key={name}
              className="font-display"
              style={{ fontSize: name === "Tatler" ? 19 : 17, color: "#63583a", fontStyle: name === "Tatler" ? "italic" : "normal" }}
              {...cms(`home.pressNames.${i}`)}
            >
              {name}
            </span>
          ))}
          <span style={{ fontSize: 12, fontWeight: 700, color: "#143d31" }}>See all press →</span>
        </div>
      </Link>

      <HomeBelowFold
        faqs={faqs}
        services={services}
        testimonials={testimonials}
        closing={closing}
        extras={extras}
        showServices={showServices}
      />

      <SiteFooter />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#fffdf8",
  border: "1.5px solid #cdd8d0",
  borderRadius: 11,
  padding: "12px 14px",
  fontFamily: "Lato, system-ui, sans-serif",
  fontSize: 16,
  color: "#2a2a28"
};

