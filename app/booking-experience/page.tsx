"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EXP_MODES, EXP_SERVICES } from "@/lib/booking-data";
import { emailOk, localOf, makeWeekdayDates, TIME_SLOTS } from "@/lib/site-data";

export default function BookingExperiencePage() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [pay, setPay] = useState("card");
  const [ref, setRef] = useState<string | null>(null);

  const dates = useMemo(() => makeWeekdayDates(6), []);
  const svc = EXP_SERVICES.find((s) => s.id === service) || null;
  const modeObj = EXP_MODES.find((m) => m.id === mode) || null;
  const dateObj = dates.find((d) => d.key === dateKey);
  const slotObj = TIME_SLOTS.find((t) => t.label === time);
  const price =
    svc && modeObj ? Math.round(svc.priceNum * modeObj.mult) : svc?.priceNum ?? null;

  const titles = ["", "Choose consultation", "How you'll meet", "Date & time", "Your details", "Review & reserve", "Confirmed"];

  const canAdvance =
    step === 0 ||
    (step === 1 && !!service) ||
    (step === 2 && !!mode) ||
    (step === 3 && !!dateKey && !!time) ||
    (step === 4 && !!name && emailOk(email)) ||
    step === 5;

  const advance = () => {
    if (step === 5) {
      setRef("BK-" + Math.random().toString(36).slice(2, 8).toUpperCase());
      setStep(6);
      return;
    }
    if (step < 5 && canAdvance) setStep(step + 1);
  };

  return (
    <div className="page-shell page-enter" style={{ background: "#e8e2d4", minHeight: "100vh", padding: "28px 16px 60px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center", marginBottom: 20 }}>
        <Link href="/book" style={{ fontSize: 13, fontWeight: 700, color: "#143d31" }}>
          ← Full booking page
        </Link>
        <h1 className="font-display" style={{ fontSize: 28, color: "#143d31", margin: "12px 0 6px" }}>
          Booking experience
        </h1>
        <p style={{ fontSize: 14, color: "#5f6b60", margin: 0 }}>
          Mobile preview of a shorter booking flow. Frontend prototype only.
        </p>
      </div>

      <div
        style={{
          maxWidth: 390,
          margin: "0 auto",
          background: "#1a1a1a",
          borderRadius: 36,
          padding: 12,
          boxShadow: "0 40px 80px -30px rgba(0,0,0,0.45)"
        }}
      >
        <div
          style={{
            background: "#f6f1e7",
            borderRadius: 28,
            overflow: "hidden",
            minHeight: 640,
            display: "flex",
            flexDirection: "column",
            position: "relative"
          }}
        >
          <div style={{ padding: "14px 16px 8px", textAlign: "center", borderBottom: "1px solid rgba(20,61,49,0.08)" }}>
            <div className="font-display" style={{ fontWeight: 700, fontSize: 15, color: "#143d31", letterSpacing: 1 }}>
              MARITES ALLEN
            </div>
            <div style={{ fontSize: 11, color: "#8a8a80" }}>{titles[step] || "Welcome"}</div>
          </div>

          <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
            {step === 0 && (
              <div>
                <div style={{ position: "relative", height: 180, borderRadius: 18, overflow: "hidden", marginBottom: 14 }}>
                  <Image src="/images/zip/marites-1.webp" alt="Marites Allen" fill style={{ objectFit: "cover", objectPosition: "50% 15%" }} />
                </div>
                <h2 className="font-display" style={{ fontSize: 24, color: "#143d31", margin: "0 0 8px" }}>
                  Fewer taps to your consultation
                </h2>
                <p style={{ fontSize: 14, color: "#5f6b60", lineHeight: 1.55, margin: "0 0 16px" }}>
                  Choose a session, pick a slot, and reserve — all in one flowing mobile experience.
                </p>
                {EXP_SERVICES.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      background: "#fffdf8",
                      border: "1px solid rgba(20,61,49,0.1)",
                      borderRadius: 14,
                      padding: 14,
                      marginBottom: 10
                    }}
                  >
                    <div className="font-display" style={{ fontWeight: 600, color: "#143d31" }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7268" }}>{s.tagline}</div>
                    <div style={{ fontWeight: 700, color: "#1a4d3e", marginTop: 6 }}>From ${s.priceNum}</div>
                  </div>
                ))}
              </div>
            )}

            {step === 1 &&
              EXP_SERVICES.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setService(s.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: service === s.id ? "#f5ecd6" : "#fffdf8",
                    border: `2px solid ${service === s.id ? "#c69a3e" : "rgba(20,61,49,0.12)"}`,
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    cursor: "pointer"
                  }}
                >
                  <div className="font-display" style={{ fontWeight: 600, color: "#143d31" }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#5f6b60" }}>${s.priceNum}</div>
                </button>
              ))}

            {step === 2 &&
              EXP_MODES.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: mode === m.id ? "#f5ecd6" : "#fffdf8",
                    border: `2px solid ${mode === m.id ? "#c69a3e" : "rgba(20,61,49,0.12)"}`,
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    cursor: "pointer"
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#143d31" }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7268" }}>{m.mult === 1 ? "Included" : "+30% in person"}</div>
                </button>
              ))}

            {step === 3 && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
                  {dates.map((d) => (
                    <button
                      type="button"
                      key={d.key}
                      onClick={() => setDateKey(d.key)}
                      style={{
                        borderRadius: 10,
                        padding: 8,
                        border: `2px solid ${dateKey === d.key ? "#1a4d3e" : "rgba(20,61,49,0.12)"}`,
                        background: dateKey === d.key ? "#1a4d3e" : "#fff",
                        color: dateKey === d.key ? "#e6c680" : "#143d31",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ fontSize: 10 }}>{d.wd}</div>
                      <div className="font-display" style={{ fontWeight: 700, fontSize: 18 }}>
                        {d.d}
                      </div>
                    </button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {TIME_SLOTS.map((t) => (
                    <button
                      type="button"
                      key={t.label}
                      onClick={() => setTime(t.label)}
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        border: `2px solid ${time === t.label ? "#1a4d3e" : "rgba(20,61,49,0.12)"}`,
                        background: time === t.label ? "#1a4d3e" : "#fff",
                        color: time === t.label ? "#fff" : "#143d31",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                {dateObj && slotObj && (
                  <p style={{ fontSize: 12, color: "#5f6b60", marginTop: 10 }}>
                    {dateObj.wd} {dateObj.mo} {dateObj.d} · {time} Manila = {localOf(dateObj.dt, slotObj.h, slotObj.mi)} local
                  </p>
                )}
              </div>
            )}

            {step === 4 && (
              <div style={{ display: "grid", gap: 10 }}>
                <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} style={inp} />
                <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inp} />
                <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={inp} />
                <textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ ...inp, resize: "vertical" }} />
              </div>
            )}

            {step === 5 && (
              <div>
                <div style={{ background: "#fffdf8", borderRadius: 14, padding: 16, border: "1px solid rgba(20,61,49,0.1)" }}>
                  <Line k="Service" v={svc?.title || "—"} />
                  <Line k="Mode" v={modeObj?.title || "—"} />
                  <Line k="When" v={dateObj && time ? `${dateObj.mo} ${dateObj.d} · ${time}` : "—"} />
                  <Line k="Name" v={name || "—"} />
                  <Line k="Total" v={price != null ? `$${price}` : "—"} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                  {["card", "bank"].map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPay(p)}
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        border: `2px solid ${pay === p ? "#c69a3e" : "rgba(20,61,49,0.12)"}`,
                        background: pay === p ? "#f5ecd6" : "#fff",
                        fontWeight: 700,
                        color: "#143d31",
                        cursor: "pointer"
                      }}
                    >
                      {p === "card" ? "Card" : "Bank"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div style={{ textAlign: "center", paddingTop: 40 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#1a4d3e",
                    color: "#e6c680",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                    fontSize: 26
                  }}
                >
                  ✓
                </div>
                <h3 className="font-display" style={{ fontSize: 24, color: "#143d31", margin: "0 0 8px" }}>
                  Reserved
                </h3>
                <p style={{ color: "#5f6b60", fontSize: 14 }}>Reference {ref}</p>
                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setService(null);
                    setMode(null);
                    setDateKey(null);
                    setTime(null);
                    setName("");
                    setEmail("");
                    setPhone("");
                    setNotes("");
                    setRef(null);
                  }}
                  style={{
                    marginTop: 16,
                    background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                    color: "#fff",
                    border: 0,
                    borderRadius: 12,
                    padding: "12px 20px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Start over
                </button>
              </div>
            )}
          </div>

          {step < 6 && (
            <div
              style={{
                padding: 12,
                borderTop: "1px solid rgba(20,61,49,0.1)",
                display: "flex",
                gap: 8,
                background: "#fffdf8"
              }}
            >
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  style={{
                    flex: "0 0 auto",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1px solid rgba(20,61,49,0.18)",
                    background: "#fff",
                    fontWeight: 700,
                    color: "#143d31",
                    cursor: "pointer"
                  }}
                >
                  Back
                </button>
              )}
              <button
                type="button"
                disabled={!canAdvance}
                onClick={() => (step === 0 ? setStep(1) : advance())}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  border: 0,
                  background: "linear-gradient(160deg,#e6c680,#c69a3e)",
                  color: "#143d31",
                  fontWeight: 700,
                  cursor: canAdvance ? "pointer" : "default",
                  opacity: canAdvance ? 1 : 0.45
                }}
              >
                {step === 0 ? "Start booking" : step === 5 ? "Confirm reservation" : "Continue"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8, fontSize: 13 }}>
      <span style={{ color: "#8a8a80" }}>{k}</span>
      <span style={{ color: "#143d31", fontWeight: 600, textAlign: "right" }}>{v}</span>
    </div>
  );
}

const inp: React.CSSProperties = {
  width: "100%",
  background: "#fff",
  border: "1.5px solid #cdd8d0",
  borderRadius: 12,
  padding: "12px 14px",
  fontSize: 15,
  fontFamily: "Lato, system-ui, sans-serif",
  color: "#2a2a28"
};
