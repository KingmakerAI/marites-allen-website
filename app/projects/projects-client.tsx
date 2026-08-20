"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cms } from "@/lib/cms/cms-attr";
import type { ProjectsCopy } from "@/lib/cms/page-copy-types";

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

export default function ProjectsPage({ copy }: { copy: ProjectsCopy }) {
  const PROJECTS = copy.items;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const cats = useMemo(() => {
    const c: string[] = [];
    PROJECTS.forEach((p) => {
      if (!c.includes(p.category)) c.push(p.category);
    });
    return c.sort();
  }, [PROJECTS]);

  const filters = ["All", ...cats];
  const active = PROJECTS.find((p) => p.id === activeId) || null;
  const activeIndex = active ? PROJECTS.findIndex((p) => p.id === active.id) : -1;
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
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#e6c680" }} {...cms("projects.kicker")}>
                {copy.kicker}
              </div>
              <h1
                className="font-display"
                style={{ fontWeight: 700, fontSize: "clamp(30px,4.4vw,46px)", margin: "12px 0" }}
                {...cms("projects.title")}
              >
                {copy.title}
              </h1>
              <p style={{ fontSize: 16, color: "#c7ddd2", maxWidth: 640, margin: 0 }} {...cms("projects.body")}>
                {copy.body}
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
                    .map((p) => {
                      const itemIndex = PROJECTS.findIndex((row) => row.id === p.id);
                      return (
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
                            {...cms(`projects.items.${itemIndex}.name`)}
                          >
                            {p.name}
                          </h3>
                        </div>
                        <p
                          style={{ fontSize: 13.5, lineHeight: 1.55, color: "#6b7268", margin: "0 0 14px" }}
                          {...cms(`projects.items.${itemIndex}.summary`)}
                        >
                          {p.summary}
                        </p>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#c69a3e" }}>Read article →</span>
                      </button>
                      );
                    })}
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
            {...cms(`projects.items.${activeIndex}.category`)}
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
            {...cms(`projects.items.${activeIndex}.name`)}
          >
            {active.name}
          </h1>
          <p
            style={{ fontSize: 17, lineHeight: 1.75, color: "#333", margin: "0 0 18px" }}
            {...cms(`projects.items.${activeIndex}.body1`)}
          >
            {active.body1}
          </p>
          <p
            style={{ fontSize: 17, lineHeight: 1.75, color: "#333", margin: "0 0 18px" }}
            {...cms(`projects.items.${activeIndex}.body2`)}
          >
            {active.body2}
          </p>
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
