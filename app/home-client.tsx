"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HOME_SERVICES } from "@/lib/site-data";
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
  const pressLabel = extras?.pressLabel || "As featured in";
  const pressBadge = extras?.pressBadge || "Forbes · Tatler · ANC";
  const pressNames = extras?.pressNames?.length
    ? extras.pressNames
    : ["Forbes", "Tatler", "Manila Bulletin", "Manila Times", "ANC"];

  return (
    <div className="page-shell page-enter">
      <SiteHeader />

      <div id="top" />

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
                bottom: -12,
                left: 18,
                background: "#fffdf8",
                borderRadius: 14,
                padding: "12px 16px",
                boxShadow: "0 16px 30px -12px rgba(0,0,0,0.35)",
                border: "1px solid rgba(20,61,49,0.1)",
                maxWidth: 220
              }}
            >
              <div
                style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#5c4408" }}
                {...cms("home.pressLabel")}
              >
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
