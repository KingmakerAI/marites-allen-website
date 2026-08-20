"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { submitSignupAction } from "@/app/signup/actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  CHART_PERKS,
  DESTARA_BENEFITS,
  emailOk,
  FAQ_DATA,
  FRIGGA_BROWSE,
  FRIGGA_REGIONS,
  GUARANTEES,
  HOME_SERVICES,
  SPEAKING_CLIENTS,
  TESTIMONIALS,
  zodiacFromYear,
  zodiacNote
} from "@/lib/site-data";
import type { HomeExtrasCopy } from "@/lib/cms/page-copy-types";
import { cms } from "@/lib/cms/cms-attr";

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
  faqs: faqInput,
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
  const [openFaq, setOpenFaq] = useState(0);

  const leadYear = leadDob ? parseInt(leadDob.slice(0, 4), 10) : null;
  const leadSign = leadYear ? zodiacFromYear(leadYear) : "";
  const leadReady = !!(leadDob && emailOk(leadEmail));
  const faqSource = faqInput?.length ? faqInput : FAQ_DATA;
  const serviceSource = services?.length ? services : HOME_SERVICES;
  const quoteSource = testimonials?.length ? testimonials : TESTIMONIALS;
  const aboutKicker = extras?.aboutKicker || "Meet Marites Allen";
  const aboutHeading = extras?.aboutHeading || "The name the world trusts for Feng Shui";
  const aboutBody =
    extras?.aboutBody ||
    "Dubbed the Real Feng Shui Queen, Marites Allen is the first Filipina Master in Feng Shui, guiding business leaders, celebrities and families for over three decades from Manila to London.";
  const aboutCta = extras?.aboutCta || "Read her full story →";
  const speakingLabel = extras?.speakingLabel || "Corporate clients & speaking engagements";
  const speakingClients = extras?.speakingClients?.length ? extras.speakingClients : SPEAKING_CLIENTS;
  const destaraBenefits = extras?.destaraBenefits?.length ? extras.destaraBenefits : DESTARA_BENEFITS;
  const friggaBrowse = extras?.friggaBrowse?.length ? extras.friggaBrowse : FRIGGA_BROWSE;
  const friggaRegions = extras?.friggaRegions?.length ? extras.friggaRegions : FRIGGA_REGIONS;
  const aboutImageUrl = extras?.aboutImageUrl || "/images/zip/marites-2.webp";
  const pressLabel = extras?.pressLabel || "As featured in";
  const pressBadge = extras?.pressBadge || "Forbes · Tatler · ANC";
  const pressNames = extras?.pressNames?.length
    ? extras.pressNames
    : ["Forbes", "Tatler", "Manila Bulletin", "Manila Times", "ANC"];
  const destaraBadge1 = extras?.destaraBadge1 || "New";
  const destaraBadge2 = extras?.destaraBadge2 || "Beta testing now";
  const destaraHeading = extras?.destaraHeading || "The future of Feng Shui, in your pocket";
  const destaraBody =
    extras?.destaraBody ||
    "Destara is an AI Destiny Guide trained on 30 years of Marites Allen's Feng Shui expertise. It's free to use, with no email and no sign-up. Just open it and ask.";
  const destaraCta = extras?.destaraCta || "Try Destara free →";
  const destaraMore = extras?.destaraMore || "Learn more";
  const destaraUrl = extras?.destaraUrl || "https://destara.app";
  const servicesKicker = extras?.servicesKicker || "Consultations";
  const servicesHeading = extras?.servicesHeading || "Guidance for every turning point";
  const servicesBody =
    extras?.servicesBody ||
    "Every session is one-on-one with Marites, online or in person. Each one includes a personalized analysis, a written action plan, and a follow-up window.";
  const bespokeKicker = extras?.bespokeKicker || "For estates, family offices & business leaders";
  const bespokeHeading = extras?.bespokeHeading || "Bespoke Advisory, scoped around what you need";
  const bespokeCta = extras?.bespokeCta || "Enquire privately →";
  const comingKicker = extras?.comingKicker || "Coming soon";
  const comingHeading = extras?.comingHeading || "Online booking is on the way";
  const comingBody =
    extras?.comingBody ||
    "Private consultations with Marites Allen will open for booking here shortly. Enquire anytime while we finish the experience.";
  const comingCta = extras?.comingCta || "View Coming Soon →";
  const guarantees = extras?.guarantees?.length ? extras.guarantees : GUARANTEES;
  const friggaHeading = extras?.friggaHeading || "Shop your lucky items for the year";
  const friggaBody =
    extras?.friggaBody ||
    "Marites Allen's own line of charms, amulets, planners and almanacs, so the guidance from your consultation travels with you every day.";
  const friggaCta = extras?.friggaCta || "Shop Frigga";
  const friggaShopUrl = friggaRegions[0]?.url || "https://www.frigga.com.ph";

  const faqs = useMemo(
    () =>
      faqSource.map((f, i) => ({
        ...f,
        open: openFaq === i,
        icon: openFaq === i ? "−" : "+"
      })),
    [openFaq, faqSource]
  );

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
                      Consultation · Coming Soon →
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
                {hero?.ctaLabel || "Book Consultation · Coming Soon →"}
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

      <section id="about" style={{ background: "#efe8d8" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "clamp(48px,7vw,72px) clamp(18px,4vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(28px,5vw,50px)",
            alignItems: "center"
          }}
        >
          <div style={{ flex: "0 1 260px", minWidth: 220 }}>
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 24px 50px -24px rgba(20,60,45,0.5)",
                aspectRatio: "4/5",
                maxWidth: 280,
                position: "relative"
              }}
            >
              <Image src={aboutImageUrl} alt="Marites Allen" fill style={{ objectFit: "cover", objectPosition: "50% 15%" }} />
            </div>
          </div>
          <div style={{ flex: "1 1 340px", minWidth: 280 }}>
            <div
              style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#4a4740" }}
              {...cms("home.aboutKicker")}
            >
              {aboutKicker}
            </div>
            <h2
              className="font-display"
              style={{ fontWeight: 700, fontSize: "clamp(22px,2.8vw,30px)", color: "#143d31", margin: "10px 0 12px" }}
              {...cms("home.aboutHeading")}
            >
              {aboutHeading}
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#4d5850", margin: "0 0 18px" }} {...cms("home.aboutBody")}>
              {aboutBody}
            </p>
            <Link
              href="/about"
              style={{
                display: "inline-block",
                background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                padding: "12px 24px",
                borderRadius: 10
              }}
              {...cms("home.aboutCta")}
            >
              {aboutCta}
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: "#fffdf8", borderTop: "1px solid rgba(20,61,49,0.08)", borderBottom: "1px solid rgba(20,61,49,0.08)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px clamp(18px,4vw,40px)", textAlign: "center" }}>
          <div
            style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#4a4740", marginBottom: 12 }}
            {...cms("home.speakingLabel")}
          >
            {speakingLabel}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(14px,3vw,28px)" }}>
            {speakingClients.map((c, i) => (
              <span key={c} className="font-display" style={{ fontSize: 16, color: "#5f6b60" }} {...cms(`home.speakingClients.${i}`)}>
                {c}
              </span>
            ))}
          </div>
          <Link href="/projects" style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 700, color: "#143d31" }}>
            See all projects &amp; collaborations →
          </Link>
        </div>
      </section>

      <section id="destara" style={{ background: "linear-gradient(160deg,#0f3126,#06140f)", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "clamp(34px,4.5vw,56px) clamp(18px,4vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(24px,3.5vw,44px)",
            alignItems: "center",
            position: "relative",
            zIndex: 2
          }}
        >
          <div style={{ flex: "1 1 360px", minWidth: 300 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 12 }}>
              {destaraBadge1 ? (
                <span
                  style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#0f3126", background: "#e6c680", borderRadius: 99, padding: "4px 12px" }}
                  {...cms("home.destaraBadge1")}
                >
                  {destaraBadge1}
                </span>
              ) : null}
              {destaraBadge2 ? (
                <span
                  style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#e6c680", border: "1px solid rgba(230,198,128,0.5)", borderRadius: 99, padding: "3px 11px" }}
                  {...cms("home.destaraBadge2")}
                >
                  {destaraBadge2}
                </span>
              ) : null}
            </div>
            <h2
              className="font-display"
              style={{ fontWeight: 700, fontSize: "clamp(26px,3.6vw,40px)", lineHeight: 1.12, margin: "0 0 14px" }}
              {...cms("home.destaraHeading")}
            >
              {destaraHeading}
            </h2>
            <p
              style={{ fontSize: 16, lineHeight: 1.65, color: "#bcd3c8", margin: "0 0 22px", maxWidth: 520 }}
              {...cms("home.destaraBody")}
            >
              {destaraBody}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 26, maxWidth: 560 }}>
              {destaraBenefits.map((b, i) => (
                <div key={b.title} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                  <span style={{ color: "#e6c680", fontWeight: 700, flexShrink: 0 }}>✦</span>
                  <span>
                    <span
                      style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#fff" }}
                      {...cms(`home.destaraBenefits.${i}.title`)}
                    >
                      {b.title}
                    </span>
                    <span
                      style={{ display: "block", fontSize: 13, lineHeight: 1.5, color: "#a9c6ba", marginTop: 2 }}
                      {...cms(`home.destaraBenefits.${i}.desc`)}
                    >
                      {b.desc}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 11, alignItems: "center" }}>
              <a
                href={destaraUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: "linear-gradient(160deg,#e6c680,#c69a3e)", color: "#143d31", fontSize: 15, fontWeight: 700, padding: "15px 30px", borderRadius: 99 }}
                {...cms("home.destaraCta")}
              >
                {destaraCta}
              </a>
              <Link
                href="/destara"
                style={{ border: "1.5px solid rgba(255,255,255,0.35)", color: "#fff", fontSize: 15, fontWeight: 700, padding: "15px 24px", borderRadius: 99 }}
                {...cms("home.destaraMore")}
              >
                {destaraMore}
              </Link>
            </div>
          </div>
          <div style={{ flex: "0 1 300px", minWidth: 250, display: "flex", justifyContent: "center" }}>
            <div style={{ perspective: 1500, width: "100%", maxWidth: 290 }}>
              <div
                className="om3d"
                style={{
                  position: "relative",
                  width: "100%",
                  transform: "rotateY(-14deg) rotateX(6deg)",
                  borderRadius: 52,
                  background: "linear-gradient(145deg,#3b4046 0%,#14171a 22%,#0a0c0e 50%,#20242a 78%,#4a5057 100%)",
                  padding: 11,
                  boxShadow: "0 50px 90px -28px rgba(0,0,0,0.8)"
                }}
              >
                <div style={{ position: "relative", borderRadius: 42, overflow: "hidden", background: "#04120d", aspectRatio: "626/1078" }}>
                  <Image src="/images/zip/destara-app.png" alt="The Destara app" fill style={{ objectFit: "cover", objectPosition: "top center" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showServices ? (
      <section id="services" style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(34px,4.5vw,56px) clamp(18px,4vw,40px)" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 26px" }}>
          <div
            style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#4a4740" }}
            {...cms("home.servicesKicker")}
          >
            {servicesKicker}
          </div>
          <h2
            className="font-display"
            style={{ fontWeight: 700, fontSize: "clamp(24px,3vw,32px)", color: "#143d31", margin: "10px 0 12px" }}
            {...cms("home.servicesHeading")}
          >
            {servicesHeading}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#5f6b60", margin: 0 }} {...cms("home.servicesBody")}>
            {servicesBody}
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 22 }}>
          {serviceSource.map((s) => (
            <div
              key={s.id}
              style={{
                background: "#fffdf8",
                border: "1px solid rgba(20,61,49,0.1)",
                borderRadius: 20,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 12px 30px -18px rgba(20,60,45,0.35)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div
                  className="font-display"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    border: "1.5px solid #c69a3e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#1a4d3e"
                  }}
                >
                  {s.num}
                </div>
                {s.popular && (
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: "#1a4d3e", background: "#e6c680", borderRadius: 99, padding: "3px 10px" }}>
                    Most booked
                  </span>
                )}
              </div>
              <h3 className="font-display" style={{ fontWeight: 600, fontSize: 21, color: "#143d31", margin: "18px 0 8px" }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#6b7268", margin: "0 0 16px" }}>{s.tagline}</p>
              {s.includes.length > 0 ? (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: "#4a4740", marginBottom: 8 }}>
                    You&apos;ll receive
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px", display: "grid", gap: 7, flex: 1 }}>
                    {s.includes.map((inc) => (
                      <li key={inc} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13.5, color: "#3d4a41" }}>
                        <span style={{ color: "#1a4d3e", fontWeight: 700 }}>✓</span>
                        {inc}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div style={{ flex: 1 }} />
              )}
              <div style={{ fontSize: 13, color: "#6b6862", marginBottom: 16 }}>{s.duration}</div>
              <Link
                href={`/book?service=${s.id}`}
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: 13,
                  borderRadius: 11
                }}
              >
                Book this consultation
              </Link>
            </div>
          ))}
        </div>
        <Link
          href="/book?bespoke=1"
          style={{
            marginTop: 22,
            background: "linear-gradient(120deg,#1a4d3e,#0f3126)",
            border: "1px solid rgba(230,198,128,0.3)",
            borderRadius: 16,
            padding: "20px 26px",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div
              style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#e6c680" }}
              {...cms("home.bespokeKicker")}
            >
              {bespokeKicker}
            </div>
            <div
              className="font-display"
              style={{ fontWeight: 600, fontSize: 19, color: "#fff", marginTop: 4 }}
              {...cms("home.bespokeHeading")}
            >
              {bespokeHeading}
            </div>
          </div>
          <span
            style={{ background: "#e6c680", color: "#143d31", fontWeight: 700, padding: "12px 24px", borderRadius: 10, flexShrink: 0 }}
            {...cms("home.bespokeCta")}
          >
            {bespokeCta}
          </span>
        </Link>
      </section>
      ) : null}

      <section id="book" style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(34px,4.5vw,56px) clamp(18px,4vw,40px)" }}>
        <div
          style={{
            background: "linear-gradient(155deg,#1a4d3e,#0f3126)",
            borderRadius: 24,
            padding: "clamp(28px,3.6vw,42px)",
            textAlign: "center",
            boxShadow: "0 30px 70px -30px rgba(20,60,45,0.5)"
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#e6c680" }} {...cms("home.comingKicker")}>
            {comingKicker}
          </div>
          <h2
            className="font-display"
            style={{ fontWeight: 700, fontSize: "clamp(24px,3vw,32px)", color: "#fff", margin: "10px 0 12px" }}
            {...cms("home.comingHeading")}
          >
            {comingHeading}
          </h2>
          <p style={{ fontSize: 16, color: "#c7ddd2", margin: "0 auto 28px", maxWidth: 520 }} {...cms("home.comingBody")}>
            {comingBody}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 30 }}>
            {guarantees.map((g, i) => (
              <span
                key={g}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 99,
                  padding: "8px 15px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#e7efe9"
                }}
                {...cms(`home.guarantees.${i}`)}
              >
                <span style={{ color: "#e6c680" }}>✦</span>
                {g}
              </span>
            ))}
          </div>
          <Link
            href="/book"
            style={{
              display: "inline-block",
              background: "linear-gradient(160deg,#e6c680,#c69a3e)",
              color: "#143d31",
              fontSize: 16,
              fontWeight: 700,
              padding: "16px 34px",
              borderRadius: 12
            }}
            {...cms("home.comingCta")}
          >
            {comingCta}
          </Link>
        </div>
      </section>

      <section id="reviews" style={{ background: "#efe8d8" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(34px,4.5vw,54px) clamp(18px,4vw,40px)" }}>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 26px" }}>
            <div style={{ color: "#5c4408", fontSize: 16, letterSpacing: 2 }}>★★★★★</div>
            <h2 className="font-display" style={{ fontWeight: 700, fontSize: "clamp(24px,3vw,32px)", color: "#143d31", margin: "10px 0 0" }}>
              Testimonials
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {quoteSource.map((q) => (
              <div
                key={q.name}
                style={{
                  background: "#fffdf8",
                  border: "1px solid rgba(20,61,49,0.1)",
                  borderRadius: 18,
                  padding: 26,
                  boxShadow: "0 12px 30px -20px rgba(20,60,45,0.3)"
                }}
              >
                <div style={{ color: "#5c4408", fontSize: 14, letterSpacing: 1, marginBottom: 12 }}>★★★★★</div>
                <p className="font-display" style={{ fontStyle: "italic", fontSize: 17, lineHeight: 1.55, color: "#2f3d35", margin: "0 0 18px" }}>
                  {q.text}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div
                    className="font-display"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: "#1a4d3e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      color: "#e6c680"
                    }}
                  >
                    {q.initial}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#143d31" }}>{q.name}</div>
                    <div style={{ fontSize: 12, color: "#6b6862" }}>{q.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#fbfaf8", borderTop: "1px solid rgba(0,0,0,0.07)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "clamp(34px,4.5vw,54px) clamp(18px,4vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(24px,3.5vw,44px)",
            alignItems: "center"
          }}
        >
          <div style={{ flex: "1 1 360px", minWidth: 300 }}>
            <Image src="/images/zip/frigga-logo.png" alt="Frigga, Charmed Life" width={132} height={48} style={{ width: "100%", maxWidth: 132, height: "auto", marginBottom: 14 }} />
            <h2
              className="font-display"
              style={{ fontWeight: 400, fontSize: "clamp(21px,2.6vw,30px)", lineHeight: 1.25, margin: "0 0 10px", color: "#1c1c1c" }}
              {...cms("home.friggaHeading")}
            >
              {friggaHeading}
            </h2>
            <p
              style={{ fontSize: 14.5, lineHeight: 1.7, color: "#6b6862", margin: "0 0 16px", maxWidth: 440 }}
              {...cms("home.friggaBody")}
            >
              {friggaBody}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
              {friggaBrowse.map((b, i) => (
                <a
                  key={b.label}
                  href={"url" in b && b.url ? b.url : "href" in b ? b.href : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", border: "1px solid rgba(0,0,0,0.14)", padding: "7px 14px", fontSize: 12.5, fontWeight: 600, color: "#1c1c1c", background: "#fff" }}
                  {...cms(`home.friggaBrowse.${i}.label`)}
                >
                  {b.label}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 11, alignItems: "center" }}>
              <a
                href={friggaShopUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-block", background: "#1c1c1c", color: "#fff", fontSize: 11.5, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", padding: "14px 32px" }}
                {...cms("home.friggaCta")}
              >
                {friggaCta}
              </a>
              {friggaRegions.map((r, i) => (
                <a
                  key={r.domain}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12.5, fontWeight: 600, color: "#4a4740" }}
                  {...cms(`home.friggaRegions.${i}.domain`)}
                >
                  {r.domain}
                </a>
              ))}
            </div>
          </div>
          <div style={{ flex: "0 1 380px", minWidth: 260, perspective: 1400 }}>
            <a
              className="om3d"
              href={friggaShopUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                transform: "rotateX(8deg) rotateY(-10deg)",
                borderRadius: 9,
                overflow: "hidden",
                boxShadow: "0 34px 60px -28px rgba(0,0,0,0.4)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#3d3835", padding: "7px 11px" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
                <span style={{ flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "4px 11px", fontSize: 10.5, color: "#d9d2cd", marginLeft: 5 }}>
                  frigga.com.ph
                </span>
              </div>
              <Image src="/images/zip/frigga-site.png" alt="The Frigga Charmed Life online store" width={760} height={480} style={{ display: "block", width: "100%", height: "auto" }} />
            </a>
          </div>
        </div>
      </section>

      <section id="faq" style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(34px,4.5vw,56px) clamp(18px,4vw,40px)" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#4a4740" }}>
            Questions
          </div>
          <h2 className="font-display" style={{ fontWeight: 700, fontSize: "clamp(24px,3vw,32px)", color: "#143d31", margin: "10px 0 0" }}>
            Everything you might be wondering
          </h2>
        </div>
        {faqs.map((f, i) => (
          <button
            type="button"
            key={f.q}
            onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
            style={{
              width: "100%",
              textAlign: "left",
              background: "#fffdf8",
              border: "1px solid rgba(20,61,49,0.1)",
              borderRadius: 14,
              padding: "20px 22px",
              marginBottom: 12,
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <span className="font-display" style={{ fontWeight: 600, fontSize: 17, color: "#143d31" }}>
                {f.q}
              </span>
              <span style={{ flexShrink: 0, fontSize: 22, color: "#143d31", lineHeight: 1 }}>{f.icon}</span>
            </div>
            {f.open && <p style={{ fontSize: 15, lineHeight: 1.65, color: "#5f6b60", margin: "14px 0 0" }}>{f.a}</p>}
          </button>
        ))}
      </section>

      <section style={{ background: "linear-gradient(160deg,#1a4d3e,#0f3126)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(32px,4vw,50px) clamp(18px,4vw,40px)", textAlign: "center" }}>
          <h2 className="font-display" style={{ fontWeight: 700, fontSize: "clamp(28px,4vw,44px)", color: "#fff", margin: "0 0 12px" }}>
            {closing?.heading || "Ready to align with your best year yet?"}
          </h2>
          <p style={{ fontSize: 17, color: "#c7ddd2", margin: "0 auto 28px", maxWidth: 560 }}>
            {closing?.body ||
              "Join over a million people who have turned to Marites Allen for clarity, prosperity and peace of mind."}
          </p>
          <Link
            href={closing?.ctaHref || "/book"}
            style={{
              display: "inline-block",
              background: "linear-gradient(160deg,#e6c680,#c69a3e)",
              color: "#143d31",
              fontSize: 17,
              fontWeight: 700,
              padding: "17px 38px",
              borderRadius: 12
            }}
          >
            {closing?.ctaLabel || "Book Consultation · Coming Soon →"}
          </Link>
        </div>
      </section>

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
