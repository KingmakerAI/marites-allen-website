"use client";

import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cms } from "@/lib/cms/cms-attr";
import type { ForecastCopy } from "@/lib/cms/page-copy-types";

const BOOK_PRODUCTS = [
  {
    id: "almanac",
    name: "Marites Allen 2027 Feng Shui Almanac",
    price: "1,299 pesos",
    ships: "from 31 Oct 2026",
    href: "https://frigga.com.ph/products/marites-allen-feng-shui-almanac-2027",
    image: "/images/books/2027/almanac.webp",
    alt: "Marites Allen 2027 Feng Shui Almanac cover"
  },
  {
    id: "planner",
    name: "Marites Allen 2027 Feng Shui Planner",
    price: "1,299 pesos",
    ships: "from 31 Oct 2026",
    href: "https://frigga.com.ph/products/marites-allen-feng-shui-planner-2027",
    image: "/images/books/2027/planner.webp",
    alt: "Marites Allen 2027 Feng Shui Planner cover"
  },
  {
    id: "guides",
    name: "Marites Allen 2027 Horoscope Guides, Rat to Boar",
    price: "899 pesos each",
    ships: "from 15 Nov 2026",
    href: "https://frigga.com.ph/products/rat-horoscope-guide-2027",
    image: "/images/books/2027/rat.webp",
    alt: "Marites Allen 2027 Horoscope Guide cover, Rat"
  }
] as const;

function guideProductUrl(signId: string) {
  return `https://frigga.com.ph/products/${signId}-horoscope-guide-2027`;
}

function isKnownYear(y: string | null, years: ForecastCopy["years"]): y is string {
  return !!y && years.some((row) => row.year === y);
}

export function ForecastClient({ copy, initialYear }: { copy: ForecastCopy; initialYear: string }) {
  const years = copy.years;
  const zodiacs = copy.zodiacs;
  const year = isKnownYear(initialYear, years) ? initialYear : copy.defaultYear;
  const meta = years.find((row) => row.year === year) || years[0];
  const yearIndex = Math.max(
    0,
    years.findIndex((row) => row.year === meta?.year)
  );
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
              {year === "2027" ? (
                <>Marites Allen 2027 Forecast, Year of the Fire Sheep</>
              ) : (
                <>
                  {year}: The <span {...cms(`forecast.years.${yearIndex}.label`)}>{meta.label}</span>
                </>
              )}
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
                Book Consultation
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
              <a
                key={z.id}
                href={guideProductUrl(z.id)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  cursor: "pointer",
                  background: "#c1272d",
                  padding: 4,
                  boxShadow: "0 12px 28px -18px rgba(140,20,24,0.65)",
                  textDecoration: "none"
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
                  <div style={{ fontFamily: "Lato, system-ui, sans-serif", fontSize: "clamp(13px,1.3vw,16px)", color: "#c1272d" }} {...cms(`forecast.zodiacs.${zi}.years`)}>
                    {z.years}
                  </div>
                  {z.focus ? (
                    <p
                      style={{
                        fontFamily: "Lato, system-ui, sans-serif",
                        fontSize: 11,
                        lineHeight: 1.35,
                        color: "#8d1418",
                        margin: "8px 4px 0",
                        minHeight: "2.7em"
                      }}
                      {...cms(`forecast.zodiacs.${zi}.focus`)}
                    >
                      {z.focus}
                    </p>
                  ) : null}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {year === "2027" ? (
      <section style={{ background: "#fdf6e3" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "clamp(28px,3.6vw,44px) clamp(18px,4vw,40px)"
          }}
        >
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
            Marites Allen 2027 Books
          </h2>
          <div style={{ width: 56, height: 3, background: "#1a4d8f", marginBottom: 22 }} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 22,
              alignItems: "start"
            }}
          >
            {BOOK_PRODUCTS.map((book) => (
              <div key={book.id} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    background: "#efe8d8",
                    borderRadius: 8,
                    overflow: "hidden"
                  }}
                >
                  <Image
                    src={book.image}
                    alt={book.alt}
                    fill
                    sizes="(max-width: 700px) 90vw, 280px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#2c2c2c" }}>{book.name}</div>
                <div style={{ fontSize: 14, color: "#4a4a46" }}>
                  {book.price}, {book.ships}
                </div>
                <a
                  href={book.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    alignSelf: "flex-start",
                    background: "#e8271f",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    padding: "12px 22px",
                    borderRadius: 99
                  }}
                >
                  Shop on frigga.com.ph
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      <section id="flying-stars" style={{ background: "#f6f1e7" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(28px,3.6vw,44px) clamp(18px,4vw,40px)" }}>
          <h2 style={{ fontFamily: "Lato, system-ui, sans-serif", fontWeight: 900, fontSize: "clamp(22px,2.8vw,30px)", color: "#143d31", margin: "0 0 14px" }}>
            Flying Stars for {year}
          </h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.7, color: "#3a3a36", margin: 0 }}>
            {year === "2027"
              ? "The stars shift on 4 February 2027, the Start of Spring. Some sectors of your home and office bring support, and some need care. The full chart, with what to place and where, is in the Marites Allen 2027 Feng Shui Almanac and the Marites Allen 2027 Horoscope Guides."
              : "The full Flying Star chart, with what to place and where, is in the Marites Allen almanac and Horoscope Guides for this year."}
          </p>
        </div>
      </section>

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
            Book Consultation
          </Link>
        </div>
      </section>

      <SiteFooter variant="minimal" />
    </div>
  );
}
