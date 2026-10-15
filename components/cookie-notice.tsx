"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "ma_cookie_consent";

export function getCookieConsent(): "accepted" | "essential" | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "accepted" || v === "essential") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);
  }, []);

  function save(value: "accepted" | "essential") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
    window.dispatchEvent(new CustomEvent("ma-cookie-consent", { detail: value }));
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 200,
        maxWidth: 520,
        margin: "0 auto",
        background: "#0f3126",
        color: "#e7efe9",
        border: "1px solid rgba(230,198,128,0.35)",
        borderRadius: 14,
        padding: "18px 20px",
        boxShadow: "0 18px 40px -18px rgba(0,0,0,0.55)",
        fontSize: 14,
        lineHeight: 1.55
      }}
    >
      <p style={{ margin: "0 0 14px" }}>
        We use a small first-party visit cookie (via <code style={{ fontSize: 12 }}>/api/visit</code>) to understand
        which pages are viewed. See our{" "}
        <Link href="/privacy" style={{ color: "#e6c680", fontWeight: 700 }}>
          Privacy Policy
        </Link>{" "}
        for details under the Data Privacy Act of 2012 (RA 10173).
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button
          type="button"
          onClick={() => save("accepted")}
          style={{
            background: "linear-gradient(160deg,#e6c680,#c69a3e)",
            color: "#143d31",
            fontWeight: 700,
            border: "none",
            borderRadius: 10,
            padding: "10px 16px",
            cursor: "pointer"
          }}
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => save("essential")}
          style={{
            background: "transparent",
            color: "#c7ddd2",
            fontWeight: 600,
            border: "1px solid rgba(199,221,210,0.35)",
            borderRadius: 10,
            padding: "10px 16px",
            cursor: "pointer"
          }}
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
