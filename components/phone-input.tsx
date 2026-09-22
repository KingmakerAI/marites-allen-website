"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES, countryFlag, findCountry, type Country } from "@/lib/countries";
import { darkInput } from "@/components/country-select";

type Props = {
  countryCode: string;
  nationalNumber: string;
  onCountryChange: (code: string, country: Country | undefined) => void;
  onNumberChange: (value: string) => void;
  error?: string;
  id?: string;
};

export function PhoneInput({
  countryCode,
  nationalNumber,
  onCountryChange,
  onNumberChange,
  error,
  id = "phone"
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = findCountry(countryCode) || findCountry("PH");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div>
      <div
        ref={rootRef}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(118px, 138px) 1fr",
          gap: 8
        }}
      >
        <div style={{ position: "relative" }}>
          <button
            type="button"
            aria-label="Country calling code"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{
              ...darkInput,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
              padding: "11px 10px",
              cursor: "pointer",
              borderColor: error ? "rgba(255,150,150,0.7)" : darkInput.border
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              <span aria-hidden>{countryFlag(selected?.code || "PH")}</span>{" "}
              {selected?.dial || "+63"}
            </span>
            <span style={{ color: "#e6c680", fontSize: 11 }}>▾</span>
          </button>
          {open && (
            <div
              role="listbox"
              style={{
                position: "absolute",
                zIndex: 40,
                left: 0,
                width: 280,
                top: "calc(100% + 6px)",
                maxHeight: 260,
                overflow: "hidden",
                background: "#143d31",
                border: "1px solid rgba(230,198,128,0.4)",
                borderRadius: 12,
                boxShadow: "0 16px 40px rgba(0,0,0,0.35)"
              }}
            >
              <div style={{ padding: 10, borderBottom: "1px solid rgba(230,198,128,0.2)" }}>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search code…"
                  style={{ ...darkInput, background: "#0f3126" }}
                />
              </div>
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {filtered.map((c) => (
                  <button
                    key={`${c.code}-${c.dial}`}
                    type="button"
                    role="option"
                    onClick={() => {
                      onCountryChange(c.code, c);
                      setOpen(false);
                      setQuery("");
                    }}
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      background: c.code === countryCode ? "rgba(230,198,128,0.12)" : "transparent",
                      border: 0,
                      color: "#f4f0e6",
                      fontSize: 13,
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <span aria-hidden>{countryFlag(c.code)}</span>
                    <span style={{ flex: 1 }}>{c.name}</span>
                    <span style={{ color: "#e6c680" }}>{c.dial}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <input
          id={id}
          name="phoneNational"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="Enter your phone number"
          value={nationalNumber}
          onChange={(e) => onNumberChange(e.target.value.replace(/[^\d\s-]/g, ""))}
          style={{
            ...darkInput,
            borderColor: error ? "rgba(255,150,150,0.7)" : darkInput.border
          }}
        />
      </div>
    </div>
  );
}

export function isValidNationalPhone(national: string): boolean {
  const digits = national.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 15;
}

export function formatE164(dial: string, national: string): string {
  const digits = national.replace(/\D/g, "");
  const code = dial.replace(/\D/g, "");
  return `+${code}${digits}`;
}
