"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type Project = {
  id: string;
  category: string;
  name: string;
  summary: string;
  body1: string;
  body2: string;
};

const PROJECTS: Project[] = [
  {
    id: "sm",
    category: "Retail",
    name: "SM Supermalls",
    summary: "Feng Shui consultation for major retail spaces and openings.",
    body1:
      "Marites Allen has consulted with SM Supermalls, one of the largest mall operators in the Philippines, on Feng Shui considerations for retail spaces, including layout energy flow and auspicious timing around openings and renovations.",
    body2:
      "Her work with large retail operators reflects a broader theme in her practice: applying traditional Feng Shui principles to commercial spaces where foot traffic, prosperity and customer experience are closely linked."
  },
  {
    id: "bench",
    category: "Fashion & Retail",
    name: "Bench",
    summary: "Long-standing Feng Shui guidance for one of the Philippines' leading clothing brands.",
    body1:
      "Bench founder Ben Chan has credited Feng Shui guidance from Marites Allen as part of the thinking behind the brand's growth, alongside decades of hard work building the company into a leading Philippine fashion retailer.",
    body2:
      "The relationship illustrates how Feng Shui consultation is often woven into long-term business relationships rather than one-off engagements, informing decisions over years rather than a single project."
  },
  {
    id: "manilahouse",
    category: "Hospitality",
    name: "Manila House Private Club",
    summary: "Venue for Marites Allen's annual Chinese New Year countdown and rituals.",
    body1:
      "Manila House Private Club in BGC, Taguig, hosts Marites Allen's annual Chinese New Year Countdown and Welcoming Ritual, where she shares her forecast for the incoming zodiac year with members and guests.",
    body2:
      "The venue also serves as the location for her in-person consultations, offering clients a private, members-only setting for one-on-one sessions."
  },
  {
    id: "marcopolo",
    category: "Hospitality",
    name: "Marco Polo Hotels",
    summary: "Speaking engagements and media conferences on annual Feng Shui forecasts.",
    body1:
      "Marites Allen has held media conferences and speaking engagements at Marco Polo Hotels properties, sharing her annual predictions and Feng Shui insights with press and guests ahead of the Lunar New Year.",
    body2:
      "These events are typically timed around the Chinese New Year season, combining her forecast presentations with hospitality partners seeking to mark the occasion for their guests and clients."
  },
  {
    id: "belo",
    category: "Wellness & Beauty",
    name: "Belo Essentials",
    summary: "Feng Shui guidance sought before opening new locations.",
    body1:
      "Belo Essentials CEO Cristalle Belo-Pitt has sought Marites Allen's Feng Shui guidance before opening new Belo Essentials locations, reflecting a broader practice among Philippine business leaders of consulting on auspicious timing and placement ahead of major openings.",
    body2:
      "This type of engagement, a pre-launch consultation, is one of the most common ways Marites Allen works with growing consumer brands."
  },
  {
    id: "unilab",
    category: "Corporate",
    name: "Unilab",
    summary: "Corporate speaking engagement on Feng Shui and business timing.",
    body1:
      "Marites Allen has been engaged by Unilab, one of the largest pharmaceutical companies in the Philippines, for corporate talks on Feng Shui principles as they relate to business strategy and organizational energy.",
    body2:
      "Corporate engagements of this kind typically combine an educational talk with guidance tailored to the company's specific goals for the year ahead."
  },
  {
    id: "citibank",
    category: "Finance",
    name: "Citibank",
    summary: "Speaking engagement for a financial institution audience.",
    body1:
      "Marites Allen has spoken to audiences at Citibank on Chinese astrology and Feng Shui as they relate to prosperity, timing and decision-making in a business context.",
    body2:
      "Financial institutions have been a recurring client category for her corporate speaking engagements, often around the Lunar New Year period."
  },
  {
    id: "hsbc",
    category: "Finance",
    name: "HSBC",
    summary: "Speaking engagement for a financial institution audience.",
    body1:
      "Marites Allen has presented Feng Shui and Chinese astrology insights to HSBC audiences, sharing forecasts relevant to business planning and personal decision-making for the year ahead.",
    body2:
      "These sessions are typically delivered as part of client-appreciation or new-year events hosted by the bank."
  },
  {
    id: "accenture",
    category: "Corporate",
    name: "Accenture",
    summary: "Corporate talk on Feng Shui principles and workplace energy.",
    body1:
      "Marites Allen has been engaged by Accenture for corporate talks exploring Feng Shui principles in relation to workplace environment and organizational energy.",
    body2:
      "Talks like this are often positioned as an engaging, culturally resonant addition to corporate wellness or new-year programming."
  },
  {
    id: "robinsons",
    category: "Retail",
    name: "Robinsons Malls",
    summary: "Feng Shui consultation and events for a major mall operator.",
    body1:
      "Robinsons Malls has engaged Marites Allen for Feng Shui-related consultations and public events, including forecast-sharing sessions timed around the Lunar New Year.",
    body2:
      "As with other mall partnerships, the focus is often on auspicious timing for promotions, openings and seasonal activations."
  },
  {
    id: "nestle",
    category: "Consumer Goods",
    name: "Nestlé",
    summary: "Corporate engagement on Feng Shui and prosperity themes.",
    body1:
      "Marites Allen has been engaged by Nestlé for corporate sessions on Feng Shui and prosperity themes, tailored to the company's audience and calendar.",
    body2:
      "Consumer goods companies frequently engage her around the New Year season, when interest in forecasts and prosperity guidance is highest."
  },
  {
    id: "mcdo",
    category: "Consumer Goods",
    name: "McDonald's Philippines",
    summary: "Corporate speaking engagement on Feng Shui themes.",
    body1:
      "Marites Allen has spoken at McDonald's Philippines corporate events, sharing Feng Shui and Chinese astrology insights relevant to the company's audience.",
    body2:
      "Her ability to make traditional Feng Shui concepts accessible to a broad, modern corporate audience is a recurring theme across these engagements."
  }
];

function mark(name: string) {
  const clean = name.replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/);
  const skip: Record<string, number> = {
    the: 1,
    of: 1,
    and: 1,
    private: 1,
    club: 1,
    malls: 1,
    hotels: 1,
    philippines: 1,
    supermalls: 1,
    essentials: 1
  };
  const core = clean.filter((w) => !skip[w.toLowerCase()]);
  const words = core.length ? core : clean;
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function ProjectsPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const cats = useMemo(() => {
    const c: string[] = [];
    PROJECTS.forEach((p) => {
      if (!c.includes(p.category)) c.push(p.category);
    });
    return c.sort();
  }, []);

  const filters = ["All", ...cats];
  const active = PROJECTS.find((p) => p.id === activeId) || null;
  const shown = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
  const shownCats: string[] = [];
  shown.forEach((p) => {
    if (!shownCats.includes(p.category)) shownCats.push(p.category);
  });

  return (
    <div className="page-shell page-enter">
      <SiteHeader />

      {!active ? (
        <div>
          <section style={{ background: "linear-gradient(165deg,#1a4d3e,#0f3126)", color: "#fff" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(30px,4vw,46px) clamp(18px,4vw,40px)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#e6c680" }}>
                Projects
              </div>
              <h1
                className="font-display"
                style={{ fontWeight: 700, fontSize: "clamp(30px,4.4vw,46px)", margin: "12px 0" }}
              >
                Brands &amp; collaborations
              </h1>
              <p style={{ fontSize: 16, color: "#c7ddd2", maxWidth: 640, margin: 0 }}>
                A selection of the brands, organizations and figures Marites Allen has consulted for and collaborated
                with over three decades. Click any entry to read more.
              </p>
            </div>
          </section>

          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              padding: "clamp(28px,4vw,44px) clamp(18px,4vw,40px) clamp(48px,7vw,72px)"
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "clamp(24px,3vw,34px)" }}>
              {filters.map((c) => {
                const on = filter === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFilter(c)}
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      letterSpacing: "0.3px",
                      color: on ? "#e6c680" : "#3d5348",
                      background: on ? "#1a4d3e" : "#fffdf8",
                      border: `1.5px solid ${on ? "#1a4d3e" : "rgba(20,61,49,0.15)"}`,
                      borderRadius: 99,
                      padding: "8px 16px",
                      cursor: "pointer"
                    }}
                  >
                    {c === "All" ? "All projects" : c}
                  </button>
                );
              })}
            </div>

            {shownCats.map((cat) => (
              <div key={cat} style={{ marginBottom: "clamp(28px,4vw,40px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#a3946f",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {cat}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "rgba(20,61,49,0.13)" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(272px,1fr))", gap: 14 }}>
                  {shown
                    .filter((p) => p.category === cat)
                    .map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setActiveId(p.id);
                          window.scrollTo(0, 0);
                        }}
                        style={{
                          position: "relative",
                          background: "#fffdf8",
                          border: "1px solid rgba(20,61,49,0.1)",
                          borderRadius: 16,
                          padding: 20,
                          cursor: "pointer",
                          overflow: "hidden",
                          boxShadow: "0 10px 26px -20px rgba(20,60,45,0.35)",
                          textAlign: "left"
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            background: "linear-gradient(90deg,#c69a3e,#e6c680)"
                          }}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 13 }}>
                          <div
                            className="font-display"
                            style={{
                              flexShrink: 0,
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              background: "linear-gradient(150deg,#1a4d3e,#0f3126)",
                              color: "#e6c680",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: 15,
                              letterSpacing: "0.5px"
                            }}
                          >
                            {mark(p.name)}
                          </div>
                          <h3
                            className="font-display"
                            style={{ fontWeight: 600, fontSize: 17.5, color: "#143d31", margin: 0, lineHeight: 1.25 }}
                          >
                            {p.name}
                          </h3>
                        </div>
                        <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "#6b7268", margin: "0 0 14px" }}>
                          {p.summary}
                        </p>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#c69a3e" }}>Read article →</span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(24px,3.2vw,40px) clamp(18px,4vw,40px) 70px" }}>
          <button
            type="button"
            onClick={() => setActiveId(null)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 14,
              fontWeight: 600,
              color: "#6b7268",
              cursor: "pointer",
              marginBottom: 20,
              background: "none",
              border: 0,
              padding: 0
            }}
          >
            <svg width="8" height="14" viewBox="0 0 10 17">
              <path
                d="M8.5 1.5L1.5 8.5l7 7"
                stroke="#6b7268"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All projects
          </button>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#a3946f",
              background: "#efe8d8",
              borderRadius: 99,
              padding: "3px 10px"
            }}
          >
            {active.category}
          </span>
          <h1
            className="font-display"
            style={{
              fontWeight: 700,
              fontSize: "clamp(28px,4vw,40px)",
              color: "#143d31",
              margin: "12px 0 20px",
              borderBottom: "2px solid rgba(20,61,49,0.12)",
              paddingBottom: 16
            }}
          >
            {active.name}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "#333", margin: "0 0 18px" }}>{active.body1}</p>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "#333", margin: "0 0 18px" }}>{active.body2}</p>
          <div
            style={{
              background: "#fffdf8",
              border: "1px solid rgba(20,61,49,0.12)",
              borderRadius: 16,
              padding: "22px 24px",
              marginTop: 30
            }}
          >
            <div className="font-display" style={{ fontWeight: 600, fontSize: 18, color: "#143d31", marginBottom: 8 }}>
              Want guidance like this for your brand?
            </div>
            <p style={{ fontSize: 14, color: "#5f6b60", margin: "0 0 14px" }}>
              Business, corporate and event consultations are scoped individually.
            </p>
            <Link
              href="/book?bespoke=1"
              style={{
                display: "inline-block",
                background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                padding: "12px 24px",
                borderRadius: 10
              }}
            >
              Enquire about a consultation →
            </Link>
          </div>
        </div>
      )}

      <SiteFooter variant="minimal" />
    </div>
  );
}
