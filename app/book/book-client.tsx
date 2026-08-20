"use client";

import Link from "next/link";
import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import {
  ARRANGEMENT_OPTS,
  BOOK_CATEGORIES,
  BOOK_MODES,
  BOOK_PRODUCTS,
  BOOK_SERVICES
} from "@/lib/booking-data";
import {
  emailOk,
  GUARANTEES,
  localOf,
  makeWeekdayDates,
  TIME_SLOTS
} from "@/lib/site-data";

type Person = { name: string; dob: string; time: string; place: string };

function BookPageInner() {
  const searchParams = useSearchParams();
  const queryKey = `${searchParams.get("bespoke")}|${searchParams.get("service")}`;
  const [querySeen, setQuerySeen] = useState(queryKey);
  const [view, setView] = useState<"instant" | "custom">(
    searchParams.get("service") === "home" || searchParams.get("service") === "business" ? "custom" : "instant"
  );
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [product, setProduct] = useState<string | null>(
    searchParams.get("service") === "personal" ? "fullreading" : null
  );
  const [mode, setMode] = useState<string | null>(null);
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [contactMethod, setContactMethod] = useState("Email");
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [instantFor, setInstantFor] = useState("Personal");
  const [pay, setPay] = useState("card");
  const [confirmed, setConfirmed] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const [bespoke, setBespoke] = useState(searchParams.get("bespoke") === "1");
  const [bespokeSubmitted, setBespokeSubmitted] = useState(false);
  const [bespokeName, setBespokeName] = useState("");
  const [bespokeEmail, setBespokeEmail] = useState("");
  const [bespokeMobile, setBespokeMobile] = useState("");
  const [bespokeNotes, setBespokeNotes] = useState("");

  const [customCategory, setCustomCategory] = useState<number | null>(null);
  const [customService, setCustomService] = useState<string | null>(null);
  const [inqName, setInqName] = useState("");
  const [inqMobile, setInqMobile] = useState("");
  const [inqEmail, setInqEmail] = useState("");
  const [inqPurpose, setInqPurpose] = useState("");
  const [people, setPeople] = useState<Person[]>([{ name: "", dob: "", time: "", place: "" }]);
  const [inqPropertyAddress, setInqPropertyAddress] = useState("");
  const [inqCompanyName, setInqCompanyName] = useState("");
  const [inqEventType, setInqEventType] = useState("");
  const [arrangement, setArrangement] = useState<string[]>([]);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inqRef, setInqRef] = useState<string | null>(null);

  const dates = useMemo(() => makeWeekdayDates(8), []);

  if (querySeen !== queryKey) {
    setQuerySeen(queryKey);
    if (searchParams.get("bespoke") === "1") {
      setBespoke(true);
      setView("instant");
    }
    const svc = searchParams.get("service");
    if (svc === "personal") setProduct("fullreading");
    if (svc === "home" || svc === "business") setView("custom");
  }

  const prod = BOOK_PRODUCTS.find((p) => p.id === product) || null;
  const modeObj = BOOK_MODES.find((m) => m.id === mode) || null;
  const dateObj = dates.find((d) => d.key === dateKey);
  const slotObj = TIME_SLOTS.find((t) => t.label === time);
  const hasSlot = !!(dateObj && slotObj);
  const slotFull = hasSlot ? `${dateObj!.wd}, ${dateObj!.mo} ${dateObj!.d}` : "";
  const slotLocal = hasSlot ? localOf(dateObj!.dt, slotObj!.h, slotObj!.mi) : "";
  const detailsReady = !!(name && emailOk(email) && phone);
  const disabledMap: Record<number, boolean> = {
    1: !product,
    2: !mode,
    3: !(dateKey && time),
    4: !detailsReady
  };
  const labelMap: Record<number, string> = {
    1: "Continue",
    2: "Continue",
    3: "Continue",
    4: "Confirm Booking"
  };

  const tabs = [1, 2, 3, 4].map((n, i) => {
    const labels = ["Session", "Purpose", "Date & Time", "Your Details"];
    const active = step === n;
    const done = maxStep > n && step !== n;
    const reachable = n <= maxStep;
    return { n, label: labels[i], active, done, reachable };
  });

  const advance = () => {
    if (confirmed) {
      setStep(1);
      setMaxStep(1);
      setProduct(null);
      setMode(null);
      setDateKey(null);
      setTime(null);
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setPay("card");
      setRef(null);
      setConfirmed(false);
      return;
    }
    if (step < 4) {
      const ns = step + 1;
      setStep(ns);
      setMaxStep((m) => Math.max(m, ns));
      return;
    }
    if (step === 4) {
      setConfirmed(true);
      setRef("MA-" + Math.random().toString(36).slice(2, 8).toUpperCase());
    }
  };

  const chosen = BOOK_SERVICES.find((s) => s.id === customService) || null;
  const visibleServices =
    customCategory == null ? BOOK_SERVICES : BOOK_SERVICES.filter((s) => s.cat === customCategory);

  const sel = (on: boolean) => ({
    bg: on ? "#f5ecd6" : "#fffdf8",
    border: on ? "#c69a3e" : "rgba(20,61,49,0.12)",
    dotBorder: on ? "#1a4d3e" : "#cdd8d0",
    dotBg: on ? "#1a4d3e" : "transparent"
  });

  return (
    <div className="page-shell page-enter">
      <SiteHeader compact bookAsLabel />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(16px,2.5vw,28px) clamp(18px,4vw,40px)" }}>
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#c69a3e" }}>
            Consultations
          </div>
          <h1 className="font-display" style={{ fontWeight: 700, fontSize: "clamp(20px,2.6vw,28px)", color: "#143d31", margin: "6px 0" }}>
            Book an instant session, or request a tailored consultation
          </h1>
          <p style={{ fontSize: 13.5, color: "#5f6b60", margin: 0 }}>
            Three sessions are ready to book online right now. For property, business, corporate and event engagements,
            share your details and Marites&apos; team will follow up.
          </p>
        </div>

        {view === "instant" && (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 14 }}>
              {GUARANTEES.map((g) => (
                <span
                  key={g}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#fffdf8",
                    border: "1px solid rgba(20,61,49,0.1)",
                    borderRadius: 99,
                    padding: "5px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#3d5348"
                  }}
                >
                  <span style={{ color: "#c69a3e" }}>✦</span>
                  {g}
                </span>
              ))}
            </div>

            <div
              style={{
                background: "#fffdf8",
                border: "1px solid rgba(20,61,49,0.1)",
                borderRadius: 20,
                boxShadow: "0 30px 70px -30px rgba(20,60,45,0.4)",
                overflow: "hidden"
              }}
            >
              {confirmed ? (
                <div style={{ padding: "clamp(28px,5vw,52px)", textAlign: "center" }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "#1a4d3e",
                      color: "#e6c680",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      fontSize: 28
                    }}
                  >
                    ✓
                  </div>
                  <h3 className="font-display" style={{ fontWeight: 700, fontSize: 26, color: "#143d31", margin: "0 0 8px" }}>
                    You&apos;re booked!
                  </h3>
                  <p style={{ fontSize: 14, color: "#6b7268", maxWidth: 420, margin: "0 auto 20px", lineHeight: 1.6 }}>
                    A booking confirmation has been sent to <strong style={{ color: "#143d31" }}>{email}</strong>.
                  </p>
                  <div
                    style={{
                      display: "inline-block",
                      background: "#eef3ef",
                      border: "1px solid rgba(20,61,49,0.12)",
                      borderRadius: 13,
                      padding: "12px 24px",
                      marginBottom: 20
                    }}
                  >
                    <div style={{ fontSize: 11, color: "#6b7268" }}>Booking reference</div>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: 21, color: "#1a4d3e", letterSpacing: 1 }}>
                      {ref}
                    </div>
                  </div>
                  <div>
                    <button type="button" onClick={advance} style={primaryBtn}>
                      Book another session
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      padding: "10px clamp(16px,3vw,24px)",
                      borderBottom: "1px solid rgba(20,61,49,0.1)",
                      background: "#f9f5ec"
                    }}
                  >
                    {tabs.map((t) => (
                      <button
                        type="button"
                        key={t.n}
                        onClick={() => t.reachable && setStep(t.n)}
                        style={{
                          flex: "1 1 110px",
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                          padding: "8px 10px",
                          borderRadius: 10,
                          background: t.active ? "#fff" : "transparent",
                          cursor: t.reachable ? "pointer" : "default",
                          border: 0
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: t.active || t.done ? "#1a4d3e" : "#e3ddd0",
                            color: t.active || t.done ? "#e6c680" : "#8a8a80",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700
                          }}
                        >
                          {t.done ? "✓" : t.n}
                        </div>
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: t.active ? "#143d31" : t.reachable ? "#5f6b60" : "#a8a89e"
                          }}
                        >
                          {t.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 440px", minWidth: 300, padding: "clamp(14px,2vw,20px)" }}>
                      {step === 1 && (
                        <div>
                          <h3 className="font-display" style={{ fontWeight: 600, fontSize: 18, color: "#143d31", margin: "0 0 2px" }}>
                            Choose your session
                          </h3>
                          <p style={{ fontSize: 13, color: "#6b7268", margin: "0 0 12px" }}>Three sessions, ready to book online today.</p>
                          {BOOK_PRODUCTS.map((p) => {
                            const s = sel(product === p.id);
                            return (
                              <button
                                type="button"
                                key={p.id}
                                onClick={() => {
                                  setProduct(p.id);
                                  setStep((st) => Math.max(2, st));
                                  setMaxStep((m) => Math.max(m, 2));
                                }}
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  gap: 12,
                                  alignItems: "center",
                                  background: s.bg,
                                  border: `2px solid ${s.border}`,
                                  borderRadius: 12,
                                  padding: 12,
                                  marginBottom: 8,
                                  cursor: "pointer",
                                  textAlign: "left"
                                }}
                              >
                                <div
                                  className="font-display"
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    border: "1.5px solid #c69a3e",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: 14,
                                    color: "#1a4d3e",
                                    flexShrink: 0
                                  }}
                                >
                                  {p.letter}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                                    <span className="font-display" style={{ fontWeight: 600, fontSize: 15, color: "#143d31" }}>
                                      {p.title}
                                    </span>
                                    {p.popular && (
                                      <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "#1a4d3e", background: "#e6c680", borderRadius: 99, padding: "1px 7px" }}>
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: 12, color: "#6b7268", marginTop: 1 }}>{p.desc}</div>
                                  <div style={{ fontSize: 12, color: "#8a8a80", marginTop: 4 }}>{p.duration}</div>
                                </div>
                              </button>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => setView("custom")}
                            style={{
                              width: "100%",
                              display: "flex",
                              gap: 12,
                              alignItems: "center",
                              background: "#f4efe3",
                              border: "2px dashed rgba(20,61,49,0.25)",
                              borderRadius: 12,
                              padding: 12,
                              cursor: "pointer",
                              textAlign: "left"
                            }}
                          >
                            <div
                              className="font-display"
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                border: "1.5px solid #c69a3e",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: 18,
                                color: "#1a4d3e"
                              }}
                            >
                              +
                            </div>
                            <div>
                              <span className="font-display" style={{ fontWeight: 600, fontSize: 15, color: "#143d31" }}>
                                Request a Custom Consultation
                              </span>
                              <div style={{ fontSize: 12, color: "#6b7268", marginTop: 1 }}>
                                Property, business, corporate, weddings, dates and more.
                              </div>
                            </div>
                          </button>
                        </div>
                      )}

                      {step === 2 && (
                        <div>
                          <h3 className="font-display" style={{ fontWeight: 600, fontSize: 18, color: "#143d31", margin: "0 0 2px" }}>
                            What&apos;s the purpose of this consultation?
                          </h3>
                          <p style={{ fontSize: 13, color: "#6b7268", margin: "0 0 12px" }}>
                            This helps us prepare the right guidance for your session.
                          </p>
                          {BOOK_MODES.map((m) => {
                            const s = sel(mode === m.id);
                            return (
                              <button
                                type="button"
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                style={{
                                  width: "100%",
                                  background: s.bg,
                                  border: `2px solid ${s.border}`,
                                  borderRadius: 12,
                                  padding: "11px 12px",
                                  marginBottom: 8,
                                  cursor: "pointer",
                                  textAlign: "left"
                                }}
                              >
                                <div className="font-display" style={{ fontWeight: 600, fontSize: 15, color: "#143d31" }}>
                                  {m.title}
                                  {m.recommended && (
                                    <span style={{ marginLeft: 8, fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "#1a4d3e", background: "#e6c680", borderRadius: 99, padding: "1px 7px" }}>
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: 12, color: "#6b7268", marginTop: 1 }}>{m.desc}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {step === 3 && (
                        <div>
                          <h3 className="font-display" style={{ fontWeight: 600, fontSize: 18, color: "#143d31", margin: "0 0 2px" }}>
                            Pick a date &amp; time
                          </h3>
                          <p style={{ fontSize: 13, color: "#6b7268", margin: "0 0 12px" }}>
                            Times are shown in <strong>Manila (GMT+8)</strong>; your local time is calculated automatically.
                          </p>
                          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8a8a80", marginBottom: 7 }}>
                            Date
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(64px,1fr))", gap: 8 }}>
                            {dates.map((d) => {
                              const on = dateKey === d.key;
                              return (
                                <button
                                  type="button"
                                  key={d.key}
                                  onClick={() => setDateKey(d.key)}
                                  style={{
                                    textAlign: "center",
                                    border: `2px solid ${on ? "#1a4d3e" : "rgba(20,61,49,0.12)"}`,
                                    background: on ? "#1a4d3e" : "#fffdf8",
                                    borderRadius: 10,
                                    padding: "8px 0",
                                    cursor: "pointer"
                                  }}
                                >
                                  <div style={{ fontSize: 10, fontWeight: 700, color: on ? "#bcd3c8" : "#8a8a80" }}>{d.wd}</div>
                                  <div className="font-display" style={{ fontWeight: 700, fontSize: 18, color: on ? "#e6c680" : "#143d31" }}>
                                    {d.d}
                                  </div>
                                  <div style={{ fontSize: 9, color: on ? "#bcd3c8" : "#8a8a80" }}>{d.mo}</div>
                                </button>
                              );
                            })}
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8a8a80", margin: "14px 0 7px" }}>
                            Time
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))", gap: 8 }}>
                            {TIME_SLOTS.map((t) => {
                              const on = time === t.label;
                              return (
                                <button
                                  type="button"
                                  key={t.label}
                                  onClick={() => setTime(t.label)}
                                  style={{
                                    textAlign: "center",
                                    border: `2px solid ${on ? "#1a4d3e" : "rgba(20,61,49,0.12)"}`,
                                    background: on ? "#1a4d3e" : "#fffdf8",
                                    color: on ? "#fff" : "#143d31",
                                    borderRadius: 10,
                                    padding: "9px 4px",
                                    cursor: "pointer",
                                    fontSize: 13.5,
                                    fontWeight: 600
                                  }}
                                >
                                  {t.label}
                                </button>
                              );
                            })}
                          </div>
                          {hasSlot && (
                            <div
                              style={{
                                marginTop: 12,
                                background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                                borderRadius: 12,
                                padding: "11px 14px",
                                color: "#fff",
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                gap: 8
                              }}
                            >
                              <div>
                                <div style={{ fontSize: 10, color: "#9fbcb0", textTransform: "uppercase" }}>Your appointment</div>
                                <div className="font-display" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>
                                  {slotFull}
                                </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ color: "#e6c680", fontWeight: 700, fontSize: 14 }}>{time} Manila</div>
                                <div style={{ color: "#c7ddd2", fontSize: 12 }}>= {slotLocal} your time</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {step === 4 && (
                        <div>
                          <h3 className="font-display" style={{ fontWeight: 600, fontSize: 18, color: "#143d31", margin: "0 0 2px" }}>
                            Your details
                          </h3>
                          <p style={{ fontSize: 13, color: "#6b7268", margin: "0 0 12px" }}>
                            Name, email &amp; phone are required. The rest helps Marites prepare.
                          </p>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
                            <Field label="Full name" value={name} onChange={setName} placeholder="Your full name" />
                            <Field label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
                            <Field label="Phone / Viber / WhatsApp" value={phone} onChange={setPhone} placeholder="+63 900 000 0000" type="tel" />
                            <div>
                              <label style={labelStyle}>Preferred contact</label>
                              <select value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} style={fieldStyle}>
                                <option>Email</option>
                                <option>Phone call</option>
                                <option>WhatsApp</option>
                                <option>Viber</option>
                              </select>
                            </div>
                            <Field label="Date of birth (optional)" value={dob} onChange={setDob} type="date" />
                            <Field label="Time of birth (optional)" value={birthTime} onChange={setBirthTime} type="time" />
                            <Field label="Place of birth (optional)" value={birthPlace} onChange={setBirthPlace} placeholder="City, country" />
                            <Field label="Current city (optional)" value={currentLocation} onChange={setCurrentLocation} placeholder="Where you live now" />
                          </div>
                          <div style={{ marginTop: 10 }}>
                            <label style={labelStyle}>Who is this for? (optional)</label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                              {["Personal", "For another person", "Couple or family", "Company or organisation"].map((f) => {
                                const on = instantFor === f;
                                return (
                                  <button
                                    type="button"
                                    key={f}
                                    onClick={() => setInstantFor(f)}
                                    style={{
                                      cursor: "pointer",
                                      padding: "7px 13px",
                                      borderRadius: 99,
                                      fontSize: 12,
                                      fontWeight: 700,
                                      background: on ? "#1a4d3e" : "#f9f5ec",
                                      color: on ? "#e6c680" : "#3d5348",
                                      border: `1.5px solid ${on ? "#1a4d3e" : "rgba(20,61,49,0.15)"}`
                                    }}
                                  >
                                    {f}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div style={{ marginTop: 10 }}>
                            <label style={labelStyle}>Notes (optional)</label>
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ ...fieldStyle, resize: "vertical" }} />
                          </div>
                          <div style={{ marginTop: 12 }}>
                            <label style={labelStyle}>Payment preference</label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                              {[
                                { id: "card", title: "Card", desc: "Visa, Mastercard, Amex" },
                                { id: "bank", title: "Bank transfer", desc: "BPI / BDO" }
                              ].map((p) => {
                                const s = sel(pay === p.id);
                                return (
                                  <button
                                    type="button"
                                    key={p.id}
                                    onClick={() => setPay(p.id)}
                                    style={{
                                      background: s.bg,
                                      border: `2px solid ${s.border}`,
                                      borderRadius: 12,
                                      padding: 12,
                                      cursor: "pointer",
                                      textAlign: "left"
                                    }}
                                  >
                                    <div style={{ fontWeight: 700, color: "#143d31" }}>{p.title}</div>
                                    <div style={{ fontSize: 12, color: "#6b7268" }}>{p.desc}</div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <aside
                      className="omSummary"
                      style={{
                        flex: "0 1 280px",
                        minWidth: 240,
                        borderLeft: "1px solid rgba(20,61,49,0.12)",
                        background: "#f9f5ec",
                        padding: "clamp(14px,2vw,20px)"
                      }}
                    >
                      <div className="omSummaryInner" style={{ position: "sticky", top: 80 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#8a8a80", marginBottom: 10 }}>
                          Summary
                        </div>
                        <Row k="Session" v={prod?.title || "—"} />
                        <Row k="Purpose" v={modeObj?.title || "—"} />
                        <Row k="Date" v={hasSlot ? slotFull : "—"} />
                        <Row k="Time" v={hasSlot ? `${time} Manila` : "—"} />
                        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                          {step > 1 && (
                            <button type="button" onClick={() => setStep((s) => s - 1)} style={secondaryBtn}>
                              Back
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={disabledMap[step]}
                            onClick={advance}
                            style={{
                              ...primaryBtn,
                              flex: 1,
                              opacity: disabledMap[step] ? 0.4 : 1,
                              pointerEvents: disabledMap[step] ? "none" : "auto"
                            }}
                          >
                            {labelMap[step]}
                          </button>
                        </div>
                        <p style={{ fontSize: 11, color: "#8a8a80", marginTop: 10, lineHeight: 1.5 }}>
                          Frontend prototype — payment and email confirmation are not connected yet.
                        </p>
                      </div>
                    </aside>
                  </div>
                </div>
              )}
            </div>

            {!confirmed && (
              <div style={{ marginTop: 18 }}>
                {!bespoke ? (
                  <button
                    type="button"
                    onClick={() => setBespoke(true)}
                    style={{
                      width: "100%",
                      background: "linear-gradient(120deg,#1a4d3e,#0f3126)",
                      border: "1px solid rgba(230,198,128,0.3)",
                      borderRadius: 16,
                      padding: "18px 22px",
                      color: "#fff",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#e6c680" }}>
                      Private advisory
                    </div>
                    <div className="font-display" style={{ fontWeight: 600, fontSize: 18, marginTop: 4 }}>
                      Need a bespoke engagement? Enquire privately →
                    </div>
                  </button>
                ) : (
                  <div style={{ background: "#fffdf8", border: "1px solid rgba(20,61,49,0.12)", borderRadius: 16, padding: 22 }}>
                    {!bespokeSubmitted ? (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                          <h3 className="font-display" style={{ margin: 0, color: "#143d31", fontSize: 20 }}>
                            Bespoke enquiry
                          </h3>
                          <button type="button" onClick={() => setBespoke(false)} style={{ border: 0, background: "transparent", cursor: "pointer", color: "#6b7268" }}>
                            Close
                          </button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
                          <Field label="Name" value={bespokeName} onChange={setBespokeName} />
                          <Field label="Email" value={bespokeEmail} onChange={setBespokeEmail} type="email" />
                          <Field label="Mobile" value={bespokeMobile} onChange={setBespokeMobile} />
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <label style={labelStyle}>What do you need?</label>
                          <textarea value={bespokeNotes} onChange={(e) => setBespokeNotes(e.target.value)} rows={3} style={{ ...fieldStyle, resize: "vertical" }} />
                        </div>
                        <button
                          type="button"
                          onClick={() => bespokeName && emailOk(bespokeEmail) && setBespokeSubmitted(true)}
                          style={{
                            ...primaryBtn,
                            marginTop: 12,
                            opacity: bespokeName && emailOk(bespokeEmail) ? 1 : 0.5
                          }}
                        >
                          Send enquiry
                        </button>
                      </>
                    ) : (
                      <div style={{ textAlign: "center", padding: 20 }}>
                        <div className="font-display" style={{ fontSize: 22, color: "#143d31", fontWeight: 700 }}>
                          Enquiry received
                        </div>
                        <p style={{ color: "#5f6b60" }}>We&apos;ll follow up at {bespokeEmail} shortly.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {view === "custom" && (
          <div style={{ background: "#fffdf8", border: "1px solid rgba(20,61,49,0.1)", borderRadius: 20, padding: "clamp(18px,3vw,28px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <div>
                <h2 className="font-display" style={{ margin: 0, color: "#143d31", fontSize: 24 }}>
                  Custom consultation request
                </h2>
                <p style={{ margin: "6px 0 0", color: "#5f6b60", fontSize: 14 }}>
                  Choose a service and share details. Frontend prototype — no email backend yet.
                </p>
              </div>
              <button type="button" onClick={() => setView("instant")} style={secondaryBtn}>
                ← Back to instant booking
              </button>
            </div>

            {inquirySubmitted ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div className="font-display" style={{ fontSize: 26, color: "#143d31", fontWeight: 700 }}>
                  Inquiry sent
                </div>
                <p style={{ color: "#5f6b60" }}>
                  Reference <strong>{inqRef}</strong> · we&apos;ll reply to {inqEmail}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setInquirySubmitted(false);
                    setCustomService(null);
                    setInqRef(null);
                  }}
                  style={{ ...primaryBtn, marginTop: 12 }}
                >
                  Submit another
                </button>
              </div>
            ) : !chosen ? (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  <button
                    type="button"
                    onClick={() => setCustomCategory(null)}
                    style={chip(customCategory === null)}
                  >
                    All
                  </button>
                  {BOOK_CATEGORIES.map((c, i) => (
                    <button type="button" key={c} onClick={() => setCustomCategory(i)} style={chip(customCategory === i)}>
                      {c.replace(/^\d+\.\s*/, "")}
                    </button>
                  ))}
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {visibleServices.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setCustomService(s.id)}
                      style={{
                        textAlign: "left",
                        background: "#f9f5ec",
                        border: "1px solid rgba(20,61,49,0.12)",
                        borderRadius: 14,
                        padding: 16,
                        cursor: "pointer"
                      }}
                    >
                      <div className="font-display" style={{ fontWeight: 600, fontSize: 17, color: "#143d31" }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: 13.5, color: "#5f6b60", marginTop: 6, lineHeight: 1.5 }}>{s.shortDesc}</div>
                      <div style={{ fontSize: 12, color: "#8a8a80", marginTop: 8 }}>Ideal for: {s.idealFor}</div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <button type="button" onClick={() => setCustomService(null)} style={{ ...secondaryBtn, marginBottom: 14 }}>
                  ← All services
                </button>
                <h3 className="font-display" style={{ color: "#143d31", fontSize: 22, margin: "0 0 8px" }}>
                  {chosen.title}
                </h3>
                <p style={{ color: "#5f6b60", fontSize: 14, lineHeight: 1.6 }}>{chosen.shortDesc}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10, marginTop: 16 }}>
                  <Field label="Full name" value={inqName} onChange={setInqName} />
                  <Field label="Email" value={inqEmail} onChange={setInqEmail} type="email" />
                  <Field label="Mobile" value={inqMobile} onChange={setInqMobile} />
                </div>
                {chosen.flags.birth && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontWeight: 700, color: "#143d31", marginBottom: 8 }}>People & birth details</div>
                    {people.map((p, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 8, marginBottom: 8 }}>
                        <input placeholder="Name" value={p.name} onChange={(e) => updatePerson(i, "name", e.target.value)} style={fieldStyle} />
                        <input type="date" value={p.dob} onChange={(e) => updatePerson(i, "dob", e.target.value)} style={fieldStyle} />
                        <input type="time" value={p.time} onChange={(e) => updatePerson(i, "time", e.target.value)} style={fieldStyle} />
                        <input placeholder="Birth place" value={p.place} onChange={(e) => updatePerson(i, "place", e.target.value)} style={fieldStyle} />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => people.length < 20 && setPeople([...people, { name: "", dob: "", time: "", place: "" }])}
                      style={{ ...secondaryBtn, marginTop: 4 }}
                    >
                      + Add person
                    </button>
                  </div>
                )}
                {chosen.flags.property && (
                  <div style={{ marginTop: 12 }}>
                    <Field label="Property address / location" value={inqPropertyAddress} onChange={setInqPropertyAddress} />
                  </div>
                )}
                {chosen.flags.company && (
                  <div style={{ marginTop: 12 }}>
                    <Field label="Company name" value={inqCompanyName} onChange={setInqCompanyName} />
                  </div>
                )}
                {chosen.flags.event && (
                  <div style={{ marginTop: 12 }}>
                    <Field label="Event type / date range" value={inqEventType} onChange={setInqEventType} />
                  </div>
                )}
                <div style={{ marginTop: 12 }}>
                  <label style={labelStyle}>Preferred arrangement</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {ARRANGEMENT_OPTS.map((a) => {
                      const on = arrangement.includes(a);
                      return (
                        <button
                          type="button"
                          key={a}
                          onClick={() =>
                            setArrangement((arr) => (arr.includes(a) ? arr.filter((x) => x !== a) : [...arr, a]))
                          }
                          style={chip(on)}
                        >
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <label style={labelStyle}>Purpose / notes</label>
                  <textarea value={inqPurpose} onChange={(e) => setInqPurpose(e.target.value)} rows={3} style={{ ...fieldStyle, resize: "vertical" }} />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (inqName && emailOk(inqEmail)) {
                      setInquirySubmitted(true);
                      setInqRef("INQ-" + Math.random().toString(36).slice(2, 7).toUpperCase());
                    }
                  }}
                  style={{
                    ...primaryBtn,
                    marginTop: 16,
                    opacity: inqName && emailOk(inqEmail) ? 1 : 0.5
                  }}
                >
                  {chosen.cta}
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <Link href="/" style={{ fontSize: 14, fontWeight: 700, color: "#143d31" }}>
            ← Back to home
          </Link>
          {" · "}
          <Link href="/booking-experience" style={{ fontSize: 14, fontWeight: 600, color: "#5f6b60" }}>
            Mobile booking preview
          </Link>
        </div>
      </div>
    </div>
  );

  function updatePerson(i: number, field: keyof Person, val: string) {
    setPeople((prev) => {
      const next = prev.slice();
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={fieldStyle} />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8, fontSize: 13 }}>
      <span style={{ color: "#8a8a80" }}>{k}</span>
      <span style={{ color: "#143d31", fontWeight: 600, textAlign: "right" }}>{v}</span>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#3d5348",
  marginBottom: 4
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: "#f9f5ec",
  border: "1.5px solid #cdd8d0",
  borderRadius: 10,
  padding: "10px 12px",
  fontFamily: "Lato, system-ui, sans-serif",
  fontSize: 14,
  color: "#2a2a28"
};

const primaryBtn: React.CSSProperties = {
  background: "linear-gradient(160deg,#1a4d3e,#143d31)",
  color: "#fff",
  fontSize: 14,
  fontWeight: 700,
  padding: "12px 26px",
  borderRadius: 11,
  border: 0,
  cursor: "pointer"
};

const secondaryBtn: React.CSSProperties = {
  background: "#fff",
  color: "#143d31",
  fontSize: 13,
  fontWeight: 700,
  padding: "11px 16px",
  borderRadius: 11,
  border: "1px solid rgba(20,61,49,0.18)",
  cursor: "pointer"
};

function chip(on: boolean): React.CSSProperties {
  return {
    cursor: "pointer",
    padding: "7px 13px",
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 700,
    background: on ? "#1a4d3e" : "#f9f5ec",
    color: on ? "#e6c680" : "#3d5348",
    border: `1.5px solid ${on ? "#1a4d3e" : "rgba(20,61,49,0.15)"}`
  };
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="page-shell" style={{ padding: 40 }}>Loading booking…</div>}>
      <BookPageInner />
    </Suspense>
  );
}
