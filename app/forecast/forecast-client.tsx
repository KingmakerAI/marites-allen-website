"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type YearKey = "2024" | "2025" | "2026" | "2027";

const YEARS: Record<
  YearKey,
  { animal: string; label: string; element: string; cny: string; intro: string; lead: string; body1: string; body2: string }
> = {
  "2027": {
    animal: "Sheep",
    label: "Year of the Fire Sheep",
    element: "Fire (Yin)",
    cny: "February 6, 2027",
    intro:
      "In the Year of the Fire Sheep, the pace softens and attention turns inward. After the momentum of the Fire Horse, 2027 rewards consolidation, care and creative work. With expert guidance from Marites Allen, discover how to protect what you have built and grow it gently.",
    lead: "Chinese New Year 2027 begins on February 6, 2027, ushering in the Year of the Fire Sheep.",
    body1:
      "The Sheep brings gentleness, artistry and diplomacy. Where 2026 rewarded speed and visibility, 2027 favours refinement: nurturing relationships, consolidating gains, and tending to health and home.",
    body2:
      "Fire keeps warmth and passion in play, but channelled through the Sheep it becomes creative rather than competitive. A strong year for the arts, hospitality, care work and anything built on trust."
  },
  "2026": {
    animal: "Horse",
    label: "Year of the Fire Horse",
    element: "Fire (Yang)",
    cny: "February 4, 2026",
    intro:
      "In the Year of the Fire Horse, harness the energy of renewal, wisdom, and growth. With expert guidance from Marites Allen, the leading Feng Shui consultant, discover how to elevate your health, wealth, love, and career through powerful Feng Shui practices. Embrace the year ahead with confidence and balance. Marites Allen is here to help you transform your life.",
    lead: "Chinese New Year 2026 begins on February 4, 2026, ushering in the Year of the Fire Horse.",
    body1:
      "The year of the Fire Horse is characterized by speed, dynamism, and charisma. Where 2025 favored deep planning and strategy, 2026 rewards action, visibility, and movement. It is a time for individuals and organizations to launch projects, expand their influence, and showcase talents on bigger stages.",
    body2:
      "Fire is expressive and passionate; the Horse is associated with freedom, travel, and ambition. Together they favor launches, career moves, and public-facing ventures, tempered by a need to manage impulsiveness and pace yourself through a fast-moving year."
  },
  "2025": {
    animal: "Snake",
    label: "Year of the Wood Snake",
    element: "Wood (Yin)",
    cny: "January 29, 2025",
    intro:
      "The Year of the Wood Snake rewarded patience, strategy and quiet growth. Marites Allen's guidance for 2025 focused on deep planning, laying foundations that would pay off in the faster years to follow.",
    lead: "Chinese New Year 2025 began on January 29, 2025, ushering in the Year of the Wood Snake.",
    body1:
      "The Wood Snake favoured wisdom, discretion and long-range thinking. It was a year for study, restructuring and careful positioning rather than bold public moves.",
    body2:
      "Wood brought growth and flexibility to the Snake's strategic nature, making it ideal for research, education, and building relationships that would mature later."
  },
  "2024": {
    animal: "Dragon",
    label: "Year of the Wood Dragon",
    element: "Wood (Yang)",
    cny: "February 10, 2024",
    intro:
      "The Year of the Wood Dragon brought ambition, expansion and bold vision. Marites Allen's 2024 guidance centred on scaling up and stepping into greater authority.",
    lead: "Chinese New Year 2024 began on February 10, 2024, ushering in the Year of the Wood Dragon.",
    body1:
      "The Dragon is the most auspicious sign in the zodiac, associated with power, prestige and transformation. 2024 favoured big launches, leadership moves and long-held ambitions.",
    body2:
      "Wood added growth and vitality, making it a year of visible expansion: new ventures, new titles and new territory for those prepared to claim it."
  }
};

const ZODIACS = [
  {
    id: "rat",
    sign: "Rat",
    years: "1936 · 1948 · 1960 · 1972 · 1984 · 1996 · 2008 · 2020",
    text: "Flexibility and steady effort open new doors this year. Fast-moving opportunities favor those who adapt quickly rather than wait for perfect conditions.",
    focus: "Stay nimble; say yes to well-timed opportunities rather than holding out for certainty."
  },
  {
    id: "ox",
    sign: "Ox",
    years: "1937 · 1949 · 1961 · 1973 · 1985 · 1997 · 2009 · 2021",
    text: "Peach Blossom energy favors relationships and social connections. A good year to widen your network and let others see your reliability.",
    focus: "Invest in relationships and visibility, and let your consistency be noticed."
  },
  {
    id: "tiger",
    sign: "Tiger",
    years: "1938 · 1950 · 1962 · 1974 · 1986 · 1998 · 2010 · 2022",
    text: "Bold, well-timed moves are rewarded. The Fire Horse energy amplifies your natural courage, so channel it into one focused goal rather than several.",
    focus: "Pick one ambitious goal and commit fully instead of splitting your energy."
  },
  {
    id: "rabbit",
    sign: "Rabbit",
    years: "1939 · 1951 · 1963 · 1975 · 1987 · 1999 · 2011 · 2023",
    text: "A year to nurture harmony at home and protect your energy from the year's fast pace. Prioritize rest alongside ambition.",
    focus: "Guard your peace; strengthen the home before chasing outward growth."
  },
  {
    id: "dragon",
    sign: "Dragon",
    years: "1940 · 1952 · 1964 · 1976 · 1988 · 2000 · 2012 · 2024",
    text: "Long-term growth and rising influence are supported. Visibility increases, so use it deliberately rather than reactively.",
    focus: "Build durable influence; choose which stages you step onto."
  },
  {
    id: "snake",
    sign: "Snake",
    years: "1941 · 1953 · 1965 · 1977 · 1989 · 2001 · 2013 · 2025",
    text: "Quietly favorable. Wise, patient planning now compounds into lasting rewards later in the year.",
    focus: "Plan carefully early; let results accumulate rather than forcing them."
  },
  {
    id: "horse",
    sign: "Horse",
    years: "1942 · 1954 · 1966 · 1978 · 1990 · 2002 · 2014 · 2026",
    text: "Your year of visibility and momentum. Big moves are favored, but pace yourself, because the Fire Horse year burns bright and fast.",
    focus: "Move decisively, then rest deliberately. Avoid burnout in your own year."
  },
  {
    id: "sheep",
    sign: "Sheep",
    years: "1943 · 1955 · 1967 · 1979 · 1991 · 2003 · 2015",
    text: "Prosperity flows when you enhance your lucky sectors and stay disciplined with resources amid a fast-moving year.",
    focus: "Mind your resources; steady discipline beats impulsive spending."
  },
  {
    id: "monkey",
    sign: "Monkey",
    years: "1944 · 1956 · 1968 · 1980 · 1992 · 2004 · 2016",
    text: "Opportunity is abundant this year; timing and placement make the difference between a good idea and a good outcome.",
    focus: "Time your moves well, because execution matters more than ideas this year."
  },
  {
    id: "rooster",
    sign: "Rooster",
    years: "1945 · 1957 · 1969 · 1981 · 1993 · 2005 · 2017",
    text: "Romance and connection are highlighted. Align your space and schedule to make room for people, not just projects.",
    focus: "Make space for relationships alongside your ambitions."
  },
  {
    id: "dog",
    sign: "Dog",
    years: "1946 · 1958 · 1970 · 1982 · 1994 · 2006 · 2018",
    text: "Guard against friction and lean into peace-and-harmony practices, because the Horse year's pace can strain relationships if unchecked.",
    focus: "Choose harmony over being right; ease tension before it escalates."
  },
  {
    id: "boar",
    sign: "Boar",
    years: "1947 · 1959 · 1971 · 1983 · 1995 · 2007 · 2019",
    text: "A year to consolidate luck and build steady, protected abundance, even as the year's energy encourages faster action around you.",
    focus: "Consolidate and protect what you have while others rush ahead."
  }
];

const STAR_DEFS = [
  {
    title: "1 Victory (Center)",
    text: "New beginnings, career progress, and wisdom. Activate with water features or blue/black colors. Everyone in the family can take advantage of this good luck."
  },
  {
    title: "2 Illness (Northwest)",
    text: "Illness and low energy. Suppress with metal cures, Wu Lou, and Medicine Buddha charms. Dog and Boar personalities are afflicted."
  },
  {
    title: "3 Arguments (West)",
    text: "Arguments and legal disputes. Balance with red colors, fire elements, and Peace charms. Rooster-born could be short fused, be more patient and considerate to avoid misunderstanding and legal issues."
  },
  {
    title: "4 Romance & Travel (Northeast)",
    text: "Romance, creativity, study and travel luck. Enhance with water elements and Peach Blossom charms. Favorable for Ox and Tiger personalities."
  },
  {
    title: "5 Misfortune (South)",
    text: "The most troublesome star, bringing obstacles and loss. Suppress with metal cures and Five Element Pagoda. Horse-born should take extra care this year."
  },
  {
    title: "6 Windfall (North)",
    text: "Heaven luck, authority and unexpected gains. Activate with metal and gold elements. Favorable for Rat personalities."
  },
  {
    title: "7 Robbery & Violence (Southwest)",
    text: "Theft, betrayal and violence. Neutralize with water elements, Blue Rhino and Elephant charms. Sheep and Monkey personalities should be cautious."
  },
  {
    title: "8 Wealth (East)",
    text: "The most auspicious wealth star. Activate with earth and crystal elements, Wealth Deities and money charms. Rabbit personalities benefit most."
  },
  {
    title: "9 Prosperity (Southeast)",
    text: "Future prosperity, celebration and multiplication of luck. Enhance with fire elements and bright lights. Favorable for Dragon and Snake personalities."
  }
];

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

function isYearKey(y: string | null): y is YearKey {
  return !!y && y in YEARS;
}

export function ForecastClient() {
  const searchParams = useSearchParams();
  const [year, setYear] = useState<YearKey>("2026");
  const [activeSign, setActiveSign] = useState<string | null>(null);
  const [openStar, setOpenStar] = useState(0);

  useEffect(() => {
    const y = searchParams.get("year");
    if (isYearKey(y)) setYear(y);
  }, [searchParams]);

  const meta = YEARS[year];
  const active = useMemo(() => ZODIACS.find((z) => z.id === activeSign) || null, [activeSign]);

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
          {(Object.keys(YEARS) as YearKey[])
            .slice()
            .reverse()
            .map((y) => (
              <Link
                key={y}
                href={`/forecast?year=${y}`}
                onClick={() => {
                  setYear(y);
                  setActiveSign(null);
                }}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "8px 14px",
                  borderRadius: 99,
                  background: year === y ? "#c1272d" : "#fffdf8",
                  color: year === y ? "#fff" : "#3d5348",
                  border: `1.5px solid ${year === y ? "#c1272d" : "rgba(20,61,49,0.15)"}`
                }}
              >
                {y}
              </Link>
            ))}
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
              {year}: The {meta.label}
            </h1>
            <p
              style={{
                fontSize: "clamp(15px,1.4vw,17.5px)",
                lineHeight: 1.65,
                color: "#ffeada",
                margin: "0 auto",
                maxWidth: 560
              }}
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
            {year} the {meta.label}:
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
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#2a2a28", fontWeight: 700, margin: "0 0 16px" }}>
                {meta.lead}
              </p>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#4a4a46", margin: "0 0 14px" }}>{meta.body1}</p>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#4a4a46", margin: "0 0 22px" }}>{meta.body2}</p>
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
                    <div className="font-display" style={{ fontSize: 11.5, color: "#a81a20", fontStyle: "italic" }}>
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
                    >
                      {meta.animal.toUpperCase()}
                    </div>
                    <div style={{ fontFamily: "Lato, system-ui, sans-serif", fontSize: 20, color: "#c1272d" }}>{year}</div>
                    <div style={{ fontSize: 12, color: "#a81a20", marginTop: 8 }}>{meta.element}</div>
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
              Select your Chinese zodiac animal to see what the {meta.label} holds for you.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "clamp(12px,1.8vw,20px)" }}>
            {ZODIACS.map((z) => (
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
              {STAR_DEFS.map((s, i) => {
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
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#2c2c2c" }}>{s.title}</span>
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
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: "#4a4a46", margin: "10px 0 0" }}>{s.text}</p>
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
              >
                {active.sign.toUpperCase()}
              </div>
              <div style={{ fontSize: 13, color: "#ffdcc8", marginTop: 4 }}>{active.years}</div>
            </div>
            <div style={{ padding: "24px 28px 28px" }}>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#3a3a36", margin: "0 0 18px" }}>{active.text}</p>
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
                <div style={{ fontSize: 14.5, color: "#4a4a46", lineHeight: 1.55 }}>{active.focus}</div>
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
            A general forecast is a starting point. A personal consultation reveals what the {meta.animal} year means
            specifically for you.
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
