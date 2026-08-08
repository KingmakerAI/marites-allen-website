import Image from "next/image";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { breadcrumbJsonLd, pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Destara AI — Destiny Guide",
  description:
    "Destara is Marites Allen's AI Destiny Guide — daily Feng Shui guidance, personal forecasts, and practical tips trained on 30 years of expertise. Free to try at destara.app.",
  path: "/destara",
  keywords: ["Destara AI", "Feng Shui AI", "destiny app", "daily Feng Shui guide"]
});

const sectionTitle: CSSProperties = {
  fontWeight: 600,
  fontSize: 24,
  color: "#143d31",
  margin: "0 0 12px",
  borderBottom: "1px solid rgba(20,61,49,0.12)",
  paddingBottom: 8
};

const bodyText: CSSProperties = {
  fontSize: 16,
  lineHeight: 1.75,
  color: "#333",
  margin: 0
};

const metaRows = [
  { label: "Developer", value: "Marites Allen" },
  { label: "Platforms", value: "Web, iOS, Android" },
  { label: "Launch", value: "2026" },
  { label: "Languages", value: "50+" }
];

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Destara",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web, iOS, Android",
  url: "https://destara.app",
  description:
    "AI Destiny Guide trained on 30 years of Marites Allen Feng Shui expertise — daily guidance, personal forecasts, and practical tips.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  },
  author: {
    "@type": "Person",
    name: "Marites Allen",
    url: SITE_URL
  }
};

export default function DestaraPage() {
  return (
    <div className="page-shell page-enter">
      <JsonLd data={softwareJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Destara AI", path: "/destara" }
        ])}
      />
      <SiteHeader />

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "clamp(28px,4vw,48px) clamp(18px,4vw,40px) 0"
        }}
      >
        <div style={{ fontSize: 12, color: "#8a8a80", letterSpacing: 0.2 }}>Destara (application)</div>
        <h1
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: "clamp(30px,4.4vw,46px)",
            color: "#143d31",
            margin: "8px 0 0",
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
          padding: "28px clamp(18px,4vw,40px) 64px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: "clamp(28px,4vw,48px)"
        }}
      >
        <article style={{ flex: "2 1 480px", minWidth: 280, maxWidth: 680 }}>
          <p style={{ ...bodyText, marginBottom: 32 }}>
            <strong>Destara</strong> is an AI-powered Destiny Guide created with Feng Shui master Marites Allen. Launched
            in 2026 for the Year of the Fire Horse, it draws on more than thirty years of her practice to offer personal
            guidance rooted in Chinese astrology and Feng Shui.
          </p>

          <section style={{ marginBottom: 32 }}>
            <h2 className="font-display" style={sectionTitle}>
              Overview
            </h2>
            <p style={bodyText}>
              Destara makes Marites Allen&apos;s guidance available between formal consultations. It is not a generic
              chatbot. The app is built around Feng Shui and Chinese astrology, so the advice stays grounded in an
              established practice instead of open-ended speculation.
            </p>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 className="font-display" style={sectionTitle}>
              Features
            </h2>
            <ul
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: "#333",
                paddingLeft: 22,
                margin: 0,
                display: "grid",
                gap: 10
              }}
            >
              <li>Personalized BaZi and zodiac-based readings</li>
              <li>Real-time auspicious date suggestions</li>
              <li>Tailored Feng Shui cures and recommendations</li>
              <li>Available day and night in more than 50 languages</li>
            </ul>
          </section>

          <figure style={{ margin: "0 0 36px", textAlign: "center" }}>
            <div style={{ width: "100%", maxWidth: 260, margin: "0 auto" }}>
              <div
                style={{
                  borderRadius: 36,
                  background: "linear-gradient(145deg,#3b4046 0%,#14171a 40%,#4a5057 100%)",
                  padding: 10,
                  boxShadow: "0 36px 64px -28px rgba(0,0,0,0.4)"
                }}
              >
                <div
                  style={{
                    borderRadius: 28,
                    overflow: "hidden",
                    background: "#04120d",
                    lineHeight: 0
                  }}
                >
                  <Image
                    src="/images/zip/destara-app.png"
                    alt="Destara app home screen with today's forecast"
                    width={626}
                    height={1078}
                    sizes="260px"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              </div>
            </div>
            <figcaption
              style={{
                marginTop: 14,
                fontSize: 13,
                lineHeight: 1.5,
                color: "#6b7268"
              }}
            >
              Destara home screen with your daily forecast
            </figcaption>
          </figure>

          <section style={{ marginBottom: 32 }}>
            <h2 className="font-display" style={sectionTitle}>
              Availability
            </h2>
            <p style={bodyText}>
              Use Destara on the web at{" "}
              <a href="https://destara.app" target="_blank" rel="noopener noreferrer">
                destara.app
              </a>
              . It is also available on iOS and Android.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={sectionTitle}>
              How it complements consultations
            </h2>
            <p style={bodyText}>
              Destara supports Marites Allen&apos;s practice; it does not replace it. Use the app for everyday guidance,
              then book a one-on-one session for deeper work such as home audits or major business decisions.
            </p>
          </section>
        </article>

        <aside style={{ flex: "1 1 260px", minWidth: 260, maxWidth: 320, width: "100%" }}>
          <div
            style={{
              background: "#f4efe3",
              border: "1px solid rgba(20,61,49,0.15)",
              borderRadius: 6,
              position: "sticky",
              top: 96,
              overflow: "hidden"
            }}
          >
            <div
              className="font-display"
              style={{
                background: "#e7ddc0",
                padding: "12px 16px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: 16,
                color: "#143d31"
              }}
            >
              Destara
            </div>

            <div style={{ padding: "20px 18px 22px" }}>
              <Image
                src="/images/zip/destara-logo.png"
                alt="Destara"
                width={1600}
                height={515}
                unoptimized
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 0 20px"
                }}
              />

              <dl style={{ margin: "0 0 20px", display: "grid", gap: 12 }}>
                {metaRows.map((row) => (
                  <div key={row.label}>
                    <dt
                      style={{
                        fontSize: 11,
                        color: "#6b7268",
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                        marginBottom: 3
                      }}
                    >
                      {row.label}
                    </dt>
                    <dd
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.4,
                        color: "#2a2a28",
                        fontWeight: 600
                      }}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

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
                  padding: "13px 14px",
                  fontSize: 14,
                  fontWeight: 700
                }}
              >
                Open Destara.app →
              </a>
            </div>
          </div>
        </aside>
      </div>

      <SiteFooter variant="minimal" />
    </div>
  );
}
