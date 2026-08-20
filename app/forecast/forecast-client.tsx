"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cms } from "@/lib/cms/cms-attr";
import type { ForecastCopy } from "@/lib/cms/page-copy-types";

const LO_SHU = ["9", "5", "7", "8", "", "3", "4", "6", "2"];

const COMPASS = [
  { label: "SOUTH", top: "4.5%", left: "50%", rot: "0deg" },
  { label: "SOUTHWEST", top: "15%", left: "84%", rot: "45deg" },
  { label: "WEST", top: "50%", left: "95.5%", rot: "90deg" },
  { label: "NORTHWEST", top: "85%", left: "84%", rot: "135deg" },
  { label: "NORTH", top: "95.5%", left: "50%", rot: "180deg" },
  { label: "NORTHEAST", top: "85%", left: "16%", rot: "225deg" },
  { label: "EAST", top: "50%", left: "4.5%", rot: "270deg" },
  { label: "SOUTHEAST", top: "15%", left: "16%", rot: "315deg" }
];

const SHOPS = [
  { region: "🇵🇭 Philippines & Asia:", label: "www.frigga.com.ph", url: "https://www.frigga.com.ph" },
  { region: "🇪🇺 UK & Europe:", label: "www.frigga.co.uk", url: "https://www.frigga.co.uk" },
  { region: "🇺🇸 USA & Canada:", label: "www.frigga-usa.com", url: "https://www.frigga-usa.com" }
];

function isKnownYear(y: string | null, years: ForecastCopy["years"]): y is string {
  return !!y && years.some((row) => row.year === y);
}

export function ForecastClient({ copy }: { copy: ForecastCopy }) {
  const years = copy.years;
  const zodiacs = copy.zodiacs;
  const starDefs = copy.stars;
  const searchParams = useSearchParams();
  const urlYear = searchParams.get("year");
  const yearFromUrl = isKnownYear(urlYear, years) ? urlYear : copy.defaultYear;
  const [year, setYear] = useState(yearFromUrl);
  const [urlSeen, setUrlSeen] = useState(yearFromUrl);
  if (urlSeen !== yearFromUrl) {
    setUrlSeen(yearFromUrl);
    setYear(yearFromUrl);
  }
  const [activeSign, setActiveSign] = useState<string | null>(null);
  const [openStar, setOpenStar] = useState(0);
  const meta = years.find((row) => row.year === year) || years[0];
  const yearIndex = Math.max(
    0,
    years.findIndex((row) => row.year === meta?.year)
  );
  const active = useMemo(() => zodiacs.find((z) => z.id === activeSign) || null, [activeSign, zodiacs]);
  const activeZodiacIndex = active ? zodiacs.findIndex((z) => z.id === active.id) : -1;
  if (!meta) return null;

  return (
    <div className="page-shell page-enter">
      <SiteHeader />

      <div style={{ background: "#efe8d8", borderBottom: "1px solid rgba(20,61,49,0.08)" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "12px clamp(18px,4vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center"
          }}
        >
          {years
            .slice()
            .sort((a, b) => Number(b.year) - Number(a.year))
            .map((row) => {
              const yi = years.findIndex((y) => y.year === row.year);
              return (
              <Link
                key={row.year}
                href={`/forecast?year=${row.year}`}
                onClick={() => {
                  setYear(row.year);
                  setActiveSign(null);
                }}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "8px 14px",
                  borderRadius: 99,
                  background: year === row.year ? "#c1272d" : "#fffdf8",
                  color: year === row.year ? "#fff" : "#3d5348",
                  border: `1.5px solid ${year === row.year ? "#c1272d" : "rgba(20,61,49,0.15)"}`
                }}
                {...cms(`forecast.years.${yi}.year`)}
              >
                {row.year}
              </Link>
              );
            })}
        </div>
      </div>

      <section
        style={{
          position: "relative",
          background: "radial-gradient(120% 100% at 50% 40%, #d4262b 0%, #a81a20 55%, #7d1216 100%)",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "clamp(28px,4vw,44px) clamp(18px,4vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(20px,3vw,40px)",
            alignItems: "center",
            position: "relative",
            zIndex: 2
          }}
        >
          <div style={{ flex: "0 1 300px", minWidth: 210, alignSelf: "flex-end" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "3/4" }}>
              <Image
                src="/images/zip/marites-1.webp"
                alt="Marites Allen"
                fill
                sizes="300px"
                style={{ objectFit: "cover", objectPosition: "50% 15%" }}
              />
            </div>
          </div>
          <div style={{ flex: "1 1 380px", minWidth: 280, textAlign: "center", padding: "clamp(16px,3vw,32px) 0" }}>
            <h1
              className="font-display"
              style={{
                fontWeight: 700,
                fontSize: "clamp(30px,4.4vw,50px)",
                lineHeight: 1.12,
                color: "#ffe1b0",
                margin: "0 0 16px",
                textShadow: "0 2px 18px rgba(90,10,12,0.5)"
              }}
            >
              {year}: The <span {...cms(`forecast.years.${yearIndex}.label`)}>{meta.label}</span>
            </h1>
            <p
              style={{
                fontSize: "clamp(15px,1.4vw,17.5px)",
                lineHeight: 1.65,
                color: "#ffeada",
                margin: "0 auto",
                maxWidth: 560
              }}
              {...cms(`forecast.years.${yearIndex}.intro`)}
            >
              {meta.intro}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 24 }}>
              <a
                href="#forecast"
                style={{
                  background: "#fff",
                  color: "#a81a20",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "14px 26px",
                  borderRadius: 99
                }}
              >
                Read the forecast
              </a>
              <Link
                href="/book"
                style={{
                  border: "1.5px solid rgba(255,255,255,0.55)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "14px 24px",
                  borderRadius: 99
                }}
              >
                Coming Soon
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="forecast"
        style={{
          position: "relative",
          background: "radial-gradient(90% 120% at 15% 50%, #c62328 0%, #a81a20 45%, #8d1418 100%)",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "clamp(30px,4vw,46px) clamp(18px,4vw,40px)",
            position: "relative",
            zIndex: 2
          }}
        >
          <h2
            style={{
              fontFamily: "Lato, system-ui, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(22px,2.8vw,30px)",
              lineHeight: 1.2,
              color: "#fff",
              textAlign: "center",
              margin: "0 0 clamp(26px,3.5vw,38px)"
            }}
          >
            {year} the <span {...cms(`forecast.years.${yearIndex}.label`)}>{meta.label}</span>:
            <br />A Period of Growth and Renewal
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(20px,3vw,36px)",
              alignItems: "stretch",
              justifyContent: "center"
            }}
          >
            <div style={{ flex: "1 1 420px", minWidth: 290, background: "#fff", padding: "clamp(24px,3.5vw,38px)" }}>
              <p
                style={{ fontSize: 16, lineHeight: 1.65, color: "#2a2a28", fontWeight: 700, margin: "0 0 16px" }}
                {...cms(`forecast.years.${yearIndex}.lead`)}
              >
                {meta.lead}
              </p>
              <p
                style={{ fontSize: 15.5, lineHeight: 1.7, color: "#4a4a46", margin: "0 0 14px" }}
                {...cms(`forecast.years.${yearIndex}.body1`)}
              >
                {meta.body1}
              </p>
              <p
                style={{ fontSize: 15.5, lineHeight: 1.7, color: "#4a4a46", margin: "0 0 22px" }}
                {...cms(`forecast.years.${yearIndex}.body2`)}
              >
                {meta.body2}
              </p>
              <div style={{ textAlign: "center" }}>
                <Link
                  href="/book"
                  style={{
                    display: "inline-block",
                    background: "#c1272d",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    padding: "13px 30px",
                    borderRadius: 99
                  }}
                >
                  Read more →
                </Link>
              </div>
            </div>
            <div
              style={{
                flex: "0 1 280px",
                minWidth: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div style={{ width: "100%", maxWidth: 280 }}>
                <div style={{ background: "#c1272d", padding: 5 }}>
                  <div
                    style={{
                      background: "linear-gradient(160deg,#fbe4e4,#f6cfd0)",
                      padding: "14px 12px 16px",
                      textAlign: "center"
                    }}
                  >
                    <div className="font-display" style={{ fontSize: 11, letterSpacing: 1, color: "#a81a20", fontWeight: 700 }}>
                      ✕✕ MARITES ALLEN
                    </div>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: 15, color: "#a81a20", marginTop: 2 }}>
                      FENG SHUI FORECAST
                    </div>
                    <div className="font-display" style={{ fontSize: 11.5, color: "#a81a20", fontStyle: "italic" }} {...cms(`forecast.years.${yearIndex}.label`)}>
                      {meta.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "Lato, system-ui, sans-serif",
                        fontWeight: 900,
                        fontSize: 26,
                        color: "#c1272d",
                        lineHeight: 1,
                        marginTop: 16
                      }}
                      {...cms(`forecast.years.${yearIndex}.animal`)}
                    >
                      {meta.animal.toUpperCase()}
                    </div>
                    <div style={{ fontFamily: "Lato, system-ui, sans-serif", fontSize: 20, color: "#c1272d" }}>{year}</div>
                    <div style={{ fontSize: 12, color: "#a81a20", marginTop: 8 }} {...cms(`forecast.years.${yearIndex}.element`)}>
                      {meta.element}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(30px,4vw,46px) clamp(18px,4vw,40px)" }}>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto clamp(28px,4vw,40px)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#c1272d" }}>
              Feng Shui Forecast {year}
            </div>
            <h2
              className="font-display"
              style={{ fontWeight: 700, fontSize: "clamp(22px,2.8vw,30px)", color: "#8d1418", margin: "10px 0" }}
            >
              Find your sign
            </h2>
            <p style={{ fontSize: 15.5, color: "#6b6b66", margin: 0 }}>
              Select your Chinese zodiac animal to see what the{" "}
              <span {...cms(`forecast.years.${yearIndex}.label`)}>{meta.label}</span> holds for you.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "clamp(12px,1.8vw,20px)" }}>
            {zodiacs.map((z, zi) => (
              <button
                key={z.id}
                type="button"
                onClick={() => setActiveSign(z.id)}
                style={{
                  cursor: "pointer",
                  background: "#c1272d",
                  padding: 4,
                  boxShadow: "0 12px 28px -18px rgba(140,20,24,0.65)",
                  border: 0
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(160deg,#fbe4e4,#f6cfd0)",
                    padding: "11px 9px 13px",
                    textAlign: "center"
                  }}
                >
                  <div className="font-display" style={{ fontSize: 8.5, letterSpacing: "0.8px", color: "#a81a20", fontWeight: 700 }}>
                    ✕✕ MARITES ALLEN
                  </div>
                  <div className="font-display" style={{ fontWeight: 700, fontSize: 11.5, color: "#a81a20", marginTop: 1 }}>
                    FENG SHUI FORECAST
                  </div>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      margin: "10px auto",
                      background: "#c1272d",
                      color: "#ffe1b0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 18
                    }}
                  >
                    {z.sign.slice(0, 1)}
                  </div>
                  <div
                    style={{
                      fontFamily: "Lato, system-ui, sans-serif",
                      fontWeight: 900,
                      fontSize: "clamp(16px,1.7vw,21px)",
                      color: "#c1272d",
                      lineHeight: 1
                    }}
                    {...cms(`forecast.zodiacs.${zi}.sign`)}
                  >
                    {z.sign.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: "Lato, system-ui, sans-serif", fontSize: "clamp(13px,1.3vw,16px)", color: "#c1272d" }}>
                    {year}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#fdf6e3" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "clamp(28px,3.6vw,44px) clamp(18px,4vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(24px,3.5vw,44px)",
            alignItems: "center"
          }}
        >
          <div style={{ flex: "1 1 360px", minWidth: 280 }}>
            <h2
              style={{
                fontFamily: "Lato, system-ui, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(21px,2.6vw,29px)",
                color: "#2c2c2c",
                lineHeight: 1.25,
                margin: "0 0 14px"
              }}
            >
              Why Wait? Perfect for Gifting or Elevating Your Luck in {year}!
            </h2>
            <div style={{ width: 56, height: 3, background: "#1a4d8f", marginBottom: 18 }} />
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#4a4a46", margin: "0 0 20px" }}>
              Grab your essential Feng Shui tools while stocks last and prepare for a prosperous year ahead.
            </p>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#2c2c2c", marginBottom: 10 }}>Shop Conveniently at</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20, paddingLeft: 6 }}>
              {SHOPS.map((s) => (
                <div key={s.url} style={{ fontSize: 15, color: "#4a4a46" }}>
                  {s.region}{" "}
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "#1a5fb4", fontWeight: 600 }}>
                    {s.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 380px", minWidth: 290, textAlign: "center" }}>
            <a
              href="https://www.frigga.com.ph"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#e8271f",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                padding: "14px 34px",
                borderRadius: 99
              }}
            >
              SHOP NOW →
            </a>
          </div>
        </div>
      </section>

      <section id="flyingstar" style={{ background: "linear-gradient(150deg,#eef6e4,#e2f0d6)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(28px,3.6vw,44px) clamp(18px,4vw,40px)" }}>
          <h2
            style={{
              fontFamily: "Lato, system-ui, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(22px,2.8vw,30px)",
              color: "#2c2c2c",
              textAlign: "center",
              margin: "0 0 clamp(26px,3.5vw,38px)"
            }}
          >
            Flying Star for {year}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,36px)", alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 380px", minWidth: 280 }}>
              <div style={{ background: "#fff", padding: "clamp(14px,2vw,22px)" }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gridTemplateRows: "repeat(3,1fr)",
                      border: "2px solid #e8b0b0"
                    }}
                  >
                    {LO_SHU.map((n, i) => (
                      <div
                        key={i}
                        style={{
                          border: "1px solid #f2d4d4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Lato, system-ui, sans-serif",
                            fontWeight: 900,
                            fontSize: "clamp(26px,4.4vw,52px)",
                            color: "#e01f26",
                            lineHeight: 1
                          }}
                        >
                          {n}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "clamp(26px,3.4vw,42px) solid #e01f26",
                      pointerEvents: "none"
                    }}
                  />
                  {COMPASS.map((c) => (
                    <span
                      key={c.label}
                      style={{
                        position: "absolute",
                        top: c.top,
                        left: c.left,
                        transform: `translate(-50%,-50%) rotate(${c.rot})`,
                        fontFamily: "Lato, system-ui, sans-serif",
                        fontWeight: 900,
                        fontSize: "clamp(9px,1.05vw,13px)",
                        letterSpacing: "0.5px",
                        color: "#fff",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {c.label}
                    </span>
                  ))}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      width: "26%",
                      height: "26%",
                      borderRadius: "50%",
                      background: "#e01f26",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Lato, system-ui, sans-serif",
                        fontWeight: 900,
                        fontSize: "clamp(30px,4.8vw,58px)",
                        color: "#fff",
                        lineHeight: 1
                      }}
                    >
                      1
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: "1 1 380px", minWidth: 280, display: "flex", flexDirection: "column", gap: 6 }}>
              {starDefs.map((s, i) => {
                const open = openStar === i;
                return (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => setOpenStar(open ? -1 : i)}
                    style={{
                      background: open ? "#fff" : "#f2f2f2",
                      border: "1px solid rgba(0,0,0,0.06)",
                      padding: "14px 18px",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#2c2c2c" }} {...cms(`forecast.stars.${i}.title`)}>
                        {s.title}
                      </span>
                      <span
                        style={{
                          flexShrink: 0,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "#1a5fb4",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          lineHeight: 1
                        }}
                      >
                        {open ? "−" : "+"}
                      </span>
                    </div>
                    {open && (
                      <p
                        style={{ fontSize: 14, lineHeight: 1.6, color: "#4a4a46", margin: "10px 0 0" }}
                        {...cms(`forecast.stars.${i}.text`)}
                      >
                        {s.text}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {active && (
        <div
          onClick={() => setActiveSign(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 220,
            background: "rgba(60,8,10,0.8)",
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
              background: "#fff",
              borderRadius: 16,
              maxWidth: 520,
              width: "100%",
              maxHeight: "88vh",
              overflowY: "auto",
              boxShadow: "0 40px 90px -20px rgba(0,0,0,0.55)"
            }}
          >
            <button
              type="button"
              onClick={() => setActiveSign(null)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.1)",
                color: "#8d1418",
                border: 0,
                cursor: "pointer",
                zIndex: 2
              }}
            >
              ×
            </button>
            <div style={{ background: "linear-gradient(150deg,#c62328,#8d1418)", padding: "26px 28px", color: "#fff" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#ffd79a" }}>
                Feng Shui Forecast {year}
              </div>
              <div
                style={{
                  fontFamily: "Lato, system-ui, sans-serif",
                  fontWeight: 900,
                  fontSize: 32,
                  lineHeight: 1.05,
                  marginTop: 6
                }}
                {...cms(`forecast.zodiacs.${activeZodiacIndex}.sign`)}
              >
                {active.sign.toUpperCase()}
              </div>
              <div
                style={{ fontSize: 13, color: "#ffdcc8", marginTop: 4 }}
                {...cms(`forecast.zodiacs.${activeZodiacIndex}.years`)}
              >
                {active.years}
              </div>
            </div>
            <div style={{ padding: "24px 28px 28px" }}>
              <p
                style={{ fontSize: 16, lineHeight: 1.7, color: "#3a3a36", margin: "0 0 18px" }}
                {...cms(`forecast.zodiacs.${activeZodiacIndex}.text`)}
              >
                {active.text}
              </p>
              <div
                style={{
                  background: "#fdf3f3",
                  borderLeft: "3px solid #c1272d",
                  padding: "14px 16px",
                  marginBottom: 20
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "#a81a20",
                    marginBottom: 4
                  }}
                >
                  Focus for the year
                </div>
                <div
                  style={{ fontSize: 14.5, color: "#4a4a46", lineHeight: 1.55 }}
                  {...cms(`forecast.zodiacs.${activeZodiacIndex}.focus`)}
                >
                  {active.focus}
                </div>
              </div>
              <Link
                href="/book"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#c1272d",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: 14,
                  borderRadius: 99
                }}
              >
                Coming Soon →
              </Link>
            </div>
          </div>
        </div>
      )}

      <section style={{ background: "#f6f1e7" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "clamp(30px,4vw,46px) clamp(18px,4vw,40px)",
            textAlign: "center"
          }}
        >
          <h2
            className="font-display"
            style={{ fontWeight: 700, fontSize: "clamp(22px,2.8vw,30px)", color: "#143d31", margin: "0 0 12px" }}
          >
            Get your personal {year} reading
          </h2>
          <p style={{ fontSize: 16, color: "#5f6b60", maxWidth: 560, margin: "0 auto 26px" }}>
            A general forecast is a starting point. A personal consultation reveals what the{" "}
            <span {...cms(`forecast.years.${yearIndex}.animal`)}>{meta.animal}</span> year means specifically for you.
          </p>
          <Link
            href="/book"
            style={{
              display: "inline-block",
              background: "linear-gradient(160deg,#1a4d3e,#143d31)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              padding: "15px 30px",
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
