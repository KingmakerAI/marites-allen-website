"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES, countryFlag, findCountry, type Country } from "@/lib/countries";

const darkInput = {
  width: "100%",
  background: "#1a3d33",
  border: "1px solid rgba(230,198,128,0.45)",
  borderRadius: 10,
  padding: "11px 13px",
  fontFamily: "Lato, system-ui, sans-serif",
  fontSize: 15,
  lineHeight: 1.4,
  color: "#f4f0e6",
  colorScheme: "dark" as const
};

/** Show frequently selected countries first; keep the same dataset. */
const PRIORITY_CODES = ["PH", "GB", "US", "AU", "SG", "MY", "HK", "AE", "CA", "NZ"];

function orderedCountries(list: Country[]) {
  const priority = PRIORITY_CODES.map((code) => list.find((c) => c.code === code)).filter(Boolean) as Country[];
  const rest = list.filter((c) => !PRIORITY_CODES.includes(c.code));
  return [...priority, ...rest];
}

type Props = {
  value: string;
  onChange: (code: string, country: Country | undefined) => void;
  error?: string;
  id?: string;
};

export function CountrySelect({ value, onChange, error, id = "country" }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = value ? findCountry(value) : undefined;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = !q
      ? orderedCountries(COUNTRIES)
      : COUNTRIES.filter(
          (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.dial.includes(q)
        );
    return base;
  }, [query]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Country / Region"
        onClick={() => setOpen((v) => !v)}
        style={{
          ...darkInput,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          cursor: "pointer",
          textAlign: "left",
          borderColor: error ? "rgba(255,150,150,0.7)" : darkInput.border
        }}
      >
        <span>
          {selected ? (
            <>
              <span aria-hidden style={{ marginRight: 8 }}>
                {countryFlag(selected.code)}
              </span>
              {selected.name}
            </>
          ) : (
            <span style={{ color: "rgba(244,240,230,0.55)" }}>
              <span aria-hidden>🌐</span> Select your country
            </span>
          )}
        </span>
        <span style={{ color: "#e6c680", fontSize: 12 }}>▾</span>
      </button>
      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            zIndex: 50,
            left: 0,
            right: 0,
            top: "calc(100% + 6px)",
            maxHeight: 280,
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
              placeholder="Search countries..."
              aria-label="Search countries"
              style={{ ...darkInput, background: "#0f3126" }}
            />
          </div>
          <div style={{ maxHeight: 210, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                role="option"
                aria-selected={c.code === value}
                onClick={() => {
                  onChange(c.code, c);
                  setOpen(false);
                  setQuery("");
                }}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  background: c.code === value ? "rgba(230,198,128,0.12)" : "transparent",
                  border: 0,
                  color: "#f4f0e6",
                  fontSize: 14,
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <span aria-hidden>{countryFlag(c.code)}</span>
                <span style={{ flex: 1 }}>{c.name}</span>
                <span style={{ color: "#e6c680", fontSize: 12 }}>{c.dial}</span>
              </button>
            ))}
            {!filtered.length && (
              <div style={{ padding: 14, color: "#c7ddd2", fontSize: 13 }}>No countries match.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { darkInput, orderedCountries };
