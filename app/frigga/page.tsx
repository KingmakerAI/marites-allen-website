import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FRIGGA_SOCIAL_LINKS } from "@/lib/site-data";
import { breadcrumbJsonLd, pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Frigga Charmed Life",
  description:
    "Shop Marites Allen's Frigga Charmed Life — Feng Shui charms, amulets, planners, almanacs and lucky fashion across the Philippines, UK, and USA stores.",
  path: "/frigga",
  keywords: [
    "Frigga Charmed Life",
    "Feng Shui charms",
    "Feng Shui amulets",
    "Feng Shui planner 2026",
    "frigga.com.ph"
  ]
});

const SHOPS = [
  { flag: "🇵🇭", label: "frigga.com.ph", url: "https://www.frigga.com.ph" },
  { flag: "🇬🇧", label: "frigga.co.uk", url: "https://www.frigga.co.uk" },
  { flag: "🇺🇸", label: "frigga-usa.com", url: "https://www.frigga-usa.com" }
];

const COLLECTIONS = [
  { id: "wealth", title: "Wealth Amulets", desc: "Coins, ingots and wealth deities to activate abundance." },
  { id: "love", title: "Love & Harmony", desc: "Peach Blossom charms and pairs for relationships." },
  { id: "health", title: "Health & Longevity", desc: "Wu Lou, Medicine Buddha and metal cures." },
  { id: "career", title: "Career & Success", desc: "Mystic knots and dragon motifs for advancement." },
  { id: "protection", title: "Protection", desc: "Shields, rhino and elephant charms to deflect harm." },
  { id: "travel", title: "Travel & Mentors", desc: "Amulets to attract helpful people and safe passage." },
  { id: "jewellery", title: "Charmed Jewellery", desc: "Bracelets, rings and pendants worn daily." },
  { id: "home", title: "Home & Décor", desc: "Scarves, wraps and pieces that dress your space." }
];

const GUIDE_PERKS = [
  "The full annual forecast for all 12 signs",
  "Auspicious dates for major decisions",
  "Month-by-month Flying Star guidance",
  "Recommended cures and enhancers"
];

const brandJsonLd = {
  "@context": "https://schema.org",
  "@type": "Brand",
  name: "Frigga Charmed Life",
  url: `${SITE_URL}/frigga`,
  logo: `${SITE_URL}/images/zip/frigga-logo.png`,
  sameAs: FRIGGA_SOCIAL_LINKS.map((s) => s.href),
  founder: {
    "@type": "Person",
    name: "Marites Allen",
    url: SITE_URL
  }
};

export default function FriggaPage() {
  return (
    <div className="page-shell page-enter">
      <JsonLd data={brandJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Frigga Charmed Life", path: "/frigga" }
        ])}
      />
      <SiteHeader />

      <section
        style={{
          background: "linear-gradient(160deg,#7d1b52,#4d0f33)",
          color: "#fff",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -50,
            right: "8%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(230,198,128,0.28),transparent 70%)"
          }}
        />
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "clamp(30px,4vw,48px) clamp(18px,4vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(28px,4vw,52px)",
            alignItems: "center",
            position: "relative",
            zIndex: 2
          }}
        >
          <div style={{ flex: "1 1 380px", minWidth: 290 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#e6c680" }}>
              The brand
            </div>
            <h1
              className="font-display"
              style={{ fontWeight: 700, fontSize: "clamp(30px,4.4vw,50px)", lineHeight: 1.12, margin: "12px 0 14px" }}
            >
              Frigga Charmed Life
            </h1>
            <p
              style={{
                fontSize: "clamp(15px,1.5vw,17.5px)",
                lineHeight: 1.7,
                color: "#f0dce8",
                margin: "0 0 24px",
                maxWidth: 540
              }}
            >
              Marites Allen&apos;s own line of Feng Shui charms, amulets, planners and almanacs, designed so the
              guidance from a consultation can travel with you every day. Each piece is created around authentic Feng
              Shui principles rather than decoration alone.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a
                href="https://www.frigga.com.ph"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "linear-gradient(160deg,#e6c680,#c69a3e)",
                  color: "#4d0f33",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "14px 28px",
                  borderRadius: 99
                }}
              >
                Shop Frigga →
              </a>
              <a
                href="#collections"
                style={{
                  border: "1.5px solid rgba(255,255,255,0.45)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "14px 26px",
                  borderRadius: 99
                }}
              >
                Browse collections
              </a>
            </div>
          </div>
          <div style={{ flex: "0 1 360px", minWidth: 250 }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4/3",
                borderRadius: 18,
                overflow: "hidden",
                border: "2px solid rgba(230,198,128,0.4)",
                background: "rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 28
              }}
            >
              <Image
                src="/images/zip/frigga-logo.png"
                alt="Frigga Charmed Life"
                width={320}
                height={200}
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </section>

      <div style={{ background: "#efe8d8", borderBottom: "1px solid rgba(20,61,49,0.08)" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "18px clamp(18px,4vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(14px,3vw,34px)"
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#a3946f" }}>
            Shop by region
          </span>
          {SHOPS.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, fontWeight: 600, color: "#7d1b52" }}
            >
              {s.flag} {s.label}
            </a>
          ))}
        </div>
      </div>

      <section id="collections" style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(30px,4vw,46px) clamp(18px,4vw,40px)" }}>
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto clamp(28px,4vw,40px)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#c69a3e" }}>
            Collections
          </div>
          <h2
            className="font-display"
            style={{ fontWeight: 700, fontSize: "clamp(22px,2.8vw,30px)", color: "#143d31", margin: "10px 0" }}
          >
            Charms for every intention
          </h2>
          <p style={{ fontSize: 15.5, color: "#6b6b66", margin: 0 }}>
            Each collection targets a specific area of luck, chosen to match your chart and the year&apos;s energies.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 18 }}>
          {COLLECTIONS.map((c) => (
            <div
              key={c.id}
              style={{
                background: "#fffdf8",
                border: "1px solid rgba(20,61,49,0.1)",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 10px 26px -20px rgba(20,60,45,0.35)"
              }}
            >
              <div
                style={{
                  aspectRatio: "1/1",
                  background: "linear-gradient(145deg,#f4eee3,#efe0d0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 24
                }}
              >
                <span className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "#7d1b52", opacity: 0.35 }}>
                  {c.title.split(" ")[0]}
                </span>
              </div>
              <div style={{ padding: 18 }}>
                <h3 className="font-display" style={{ fontWeight: 600, fontSize: 17, color: "#143d31", margin: "0 0 6px" }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "#6b7268", margin: "0 0 12px" }}>{c.desc}</p>
                <a
                  href="https://www.frigga.com.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 13, fontWeight: 700, color: "#7d1b52" }}
                >
                  Shop collection →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#fdf6e3" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "clamp(30px,4vw,46px) clamp(18px,4vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(24px,3.5vw,44px)",
            alignItems: "center"
          }}
        >
          <div style={{ flex: "1 1 340px", minWidth: 280 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#c1272d" }}>
              Annual guides
            </div>
            <h2
              style={{
                fontFamily: "Lato, system-ui, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(22px,2.8vw,32px)",
                color: "#2c2c2c",
                lineHeight: 1.25,
                margin: "10px 0 14px"
              }}
            >
              The Feng Shui Planner &amp; Almanac
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#4a4a46", margin: "0 0 18px" }}>
              Published every year ahead of the Lunar New Year, the Planner and Almanac carry the full forecast,
              auspicious dates, and month-by-month guidance so you can plan the year with intention.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "grid", gap: 9 }}>
              {GUIDE_PERKS.map((g) => (
                <li key={g} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 14.5, color: "#3d4a41" }}>
                  <span style={{ color: "#c1272d", fontWeight: 700 }}>✓</span>
                  {g}
                </li>
              ))}
            </ul>
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
                padding: "14px 30px",
                borderRadius: 99
              }}
            >
              SHOP NOW →
            </a>
          </div>
          <div style={{ flex: "1 1 340px", minWidth: 270 }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4/3",
                background: "#fffdf8",
                borderRadius: 14,
                border: "1px solid rgba(125,27,82,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 32
              }}
            >
              <Image
                src="/images/zip/frigga-logo.png"
                alt="Frigga planner and almanac"
                width={280}
                height={180}
                style={{ width: "70%", height: "auto", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(30px,4vw,46px) clamp(18px,4vw,40px)" }}>
        <div
          style={{
            background: "#fffdf8",
            border: "1px solid rgba(20,61,49,0.1)",
            borderRadius: 20,
            padding: "clamp(26px,4vw,44px)",
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
              style={{ fontWeight: 700, fontSize: "clamp(22px,2.8vw,30px)", color: "#143d31", margin: "0 0 8px" }}
            >
              Also available on
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "#5f6b60", margin: "0 0 14px" }}>
              Find Frigga Charmed Life on your preferred marketplace.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <span style={{ background: "#f4eee3", borderRadius: 99, padding: "9px 18px", fontSize: 14, fontWeight: 700, color: "#7d1b52" }}>
                Shopee · Frigga Charmed Life
              </span>
              <span style={{ background: "#f4eee3", borderRadius: 99, padding: "9px 18px", fontSize: 14, fontWeight: 700, color: "#7d1b52" }}>
                Lazada · Frigga Charmed Life
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
              {FRIGGA_SOCIAL_LINKS.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#7d1b52",
                    color: "#fff",
                    borderRadius: 99,
                    padding: "9px 16px",
                    fontSize: 13,
                    fontWeight: 700
                  }}
                >
                  {s.label} {s.handle.startsWith("@") ? s.handle : ""}
                </a>
              ))}
            </div>
          </div>
          <Link
            href="/book"
            style={{
              background: "linear-gradient(160deg,#1a4d3e,#143d31)",
              color: "#fff",
              fontSize: 15.5,
              fontWeight: 700,
              padding: "15px 28px",
              borderRadius: 12,
              whiteSpace: "nowrap"
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
