"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DESTARA_BENEFITS,
  FAQ_DATA,
  FRIGGA_BROWSE,
  FRIGGA_REGIONS,
  GUARANTEES,
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
  const comingKicker = extras?.comingKicker || "Book today";
  const comingHeading = extras?.comingHeading || "Send your consultation enquiry";
  const comingBody =
    extras?.comingBody ||
    "Tell us what you need and the team will follow up. Payment is arranged privately after your enquiry is reviewed.";
  const comingCta = extras?.comingCta || "Book Consultation";
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
              <Image src="/images/zip/frigga-site.webp" alt="The Frigga Charmed Life online store" width={760} height={480} sizes="(max-width: 768px) 100vw, 560px" style={{ display: "block", width: "100%", height: "auto" }} />
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
            {closing?.ctaLabel || "Book Consultation"}
          </Link>
        </div>
      </section>

    </>
  );
}
