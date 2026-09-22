"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  DESTARA_BENEFITS,
  FAQ_DATA,
  FRIGGA_BROWSE,
  FRIGGA_REGIONS,
  HOME_SERVICES,
  SPEAKING_CLIENTS,
  TESTIMONIALS
} from "@/lib/site-data";
import type { HomeExtrasCopy } from "@/lib/cms/page-copy-types";
import { cms } from "@/lib/cms/cms-attr";

type HomeFaq = { q: string; a: string };
type HomeQuote = { name: string; role: string; text: string; initial: string };
type HomeClosing = { heading: string; body: string; ctaLabel: string; ctaHref: string };

export default function HomeBelowFold({
  faqs: faqInput,
  services,
  testimonials,
  closing,
  extras,
  showServices = true
}: {
  faqs?: HomeFaq[];
  services?: typeof HOME_SERVICES;
  testimonials?: HomeQuote[];
  closing?: HomeClosing;
  extras?: HomeExtrasCopy;
  showServices?: boolean;
}) {
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const faqSource = faqInput?.length ? faqInput : FAQ_DATA;
  const serviceSource = services?.length ? services : HOME_SERVICES;
  const selectedService =
    serviceSource.find((s) => s.id === (selectedServiceId || serviceSource[0]?.id)) || serviceSource[0];
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

  useEffect(() => {
    if (!servicesMenuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setServicesMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [servicesMenuOpen]);

  return (
    <>
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
              <Image src={aboutImageUrl} alt="Marites Allen" fill sizes="(max-width: 900px) 100vw, 420px" style={{ objectFit: "cover", objectPosition: "50% 15%" }} />
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
                  <Image src="/images/zip/destara-app.webp" alt="The Destara app" fill sizes="(max-width: 768px) 70vw, 290px" style={{ objectFit: "cover", objectPosition: "top center" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section id="frigga" style={{ background: "#fbfaf8", borderTop: "1px solid rgba(0,0,0,0.07)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
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
              <Image src="/images/zip/frigga-site.webp" alt="The Frigga Charmed Life online store" width={760} height={480} sizes="(max-width: 768px) 100vw, 560px" style={{ display: "block", width: "100%", height: "auto" }} />
            </a>
          </div>
        </div>
      </section>
      {showServices ? (
      <section id="services" style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(34px,4.5vw,56px) clamp(18px,4vw,40px)" }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 26px" }}>
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

        {selectedService ? (
          <div
            style={{
              border: "1px solid rgba(20,61,49,0.12)",
              borderRadius: 20,
              overflow: "visible",
              background: "#fffdf8",
              boxShadow: "0 18px 44px -24px rgba(20,60,45,0.45)"
            }}
          >
            <div
              style={{
                background: "linear-gradient(155deg,#1a4d3e 0%,#0f3126 100%)",
                padding: "20px clamp(16px,3vw,24px)",
                borderRadius: "20px 20px 0 0",
                position: "relative"
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                  color: "rgba(230,198,128,0.85)",
                  marginBottom: 12
                }}
              >
                Choose a consultation
              </div>

              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={servicesMenuOpen}
                aria-label="Choose a consultation"
                onClick={() => setServicesMenuOpen((v) => !v)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                  background: "#e6c680",
                  color: "#143d31",
                  border: 0,
                  borderRadius: 12,
                  padding: "14px 14px 14px 16px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  boxShadow: "0 8px 20px -10px rgba(0,0,0,0.45)"
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <span
                    className="font-display"
                    style={{
                      flexShrink: 0,
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: "#143d31",
                      color: "#e6c680",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 14
                    }}
                  >
                    {selectedService.num}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 11, fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 2 }}>
                      {servicesMenuOpen ? "Close list" : "Browse options"}
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: 15,
                        fontWeight: 700,
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {selectedService.title}
                    </span>
                  </span>
                </span>
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#143d31",
                    color: "#e6c680",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 16,
                    transform: servicesMenuOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.18s ease"
                  }}
                >
                  ▾
                </span>
              </button>

              {servicesMenuOpen ? (
                <div
                  role="listbox"
                  aria-label="Consultation options"
                  style={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    top: "calc(100% - 8px)",
                    zIndex: 20,
                    maxHeight: 300,
                    overflowY: "auto",
                    background: "#fffdf8",
                    border: "1px solid rgba(20,61,49,0.16)",
                    borderRadius: 14,
                    boxShadow: "0 22px 48px -18px rgba(0,0,0,0.4)"
                  }}
                >
                  {serviceSource.map((s, idx) => {
                    const active = s.id === selectedService.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          setSelectedServiceId(s.id);
                          setServicesMenuOpen(false);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "13px 14px",
                          background: active ? "rgba(26,77,62,0.08)" : "transparent",
                          border: 0,
                          borderBottom:
                            idx === serviceSource.length - 1 ? 0 : "1px solid rgba(20,61,49,0.08)",
                          color: "#143d31",
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: "inherit"
                        }}
                      >
                        <span
                          className="font-display"
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            border: `1.5px solid ${active ? "#c69a3e" : "rgba(20,61,49,0.2)"}`,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#1a4d3e",
                            flexShrink: 0
                          }}
                        >
                          {s.num}
                        </span>
                        <span style={{ flex: 1, fontSize: 14, fontWeight: active ? 700 : 600, lineHeight: 1.35 }}>
                          {s.title}
                        </span>
                        {active ? <span style={{ color: "#1a4d3e", fontWeight: 700 }}>✓</span> : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div style={{ padding: "clamp(20px,3vw,28px)" }}>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "#5f6b60", margin: "0 0 18px" }}>
                {selectedService.tagline}
              </p>
              {selectedService.includes.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "grid", gap: 9 }}>
                  {selectedService.includes.map((inc) => (
                    <li key={inc} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 14, color: "#3d4a41" }}>
                      <span style={{ color: "#1a4d3e", fontWeight: 700, marginTop: 1 }}>✓</span>
                      {inc}
                    </li>
                  ))}
                </ul>
              ) : null}
              {selectedService.duration ? (
                <div style={{ fontSize: 13, color: "#6b6862", marginBottom: 16 }}>{selectedService.duration}</div>
              ) : null}
              <Link
                href={`/book?service=${selectedService.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  textAlign: "center",
                  background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "15px 28px",
                  borderRadius: 12
                }}
              >
                Book this consultation →
              </Link>
            </div>
          </div>
        ) : null}
      </section>
      ) : null}

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
            {closing?.ctaLabel || "Book Consultation"}
          </Link>
        </div>
      </section>

    </>
  );
}
