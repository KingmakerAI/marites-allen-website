"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CountryFlag } from "@/components/country-flag";
import { darkInput, orderedCountries } from "@/components/country-select";
import { COUNTRIES, findCountry, type Country } from "@/lib/countries";

type MenuPos = { top: number; left: number; width: number; maxHeight: number };

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
  const [menuPos, setMenuPos] = useState<MenuPos | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = countryCode ? findCountry(countryCode) : undefined;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orderedCountries(COUNTRIES);
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [query]);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) {
      setMenuPos(null);
      return;
    }

    function place() {
      const rect = buttonRef.current!.getBoundingClientRect();
      const gap = 6;
      const menuWidth = Math.min(300, Math.max(rect.width, 260), window.innerWidth - 24);
      const preferred = 280;
      const spaceBelow = window.innerHeight - rect.bottom - gap - 8;
      const spaceAbove = rect.top - gap - 8;
      const openUp = spaceBelow < 180 && spaceAbove > spaceBelow;
      const maxHeight = Math.min(preferred, Math.max(160, openUp ? spaceAbove : spaceBelow));
      const top = openUp ? rect.top - gap - maxHeight : rect.bottom + gap;
      let left = rect.left;
      if (left + menuWidth > window.innerWidth - 12) {
        left = Math.max(12, window.innerWidth - menuWidth - 12);
      }
      setMenuPos({
        top: Math.max(8, top),
        left,
        width: menuWidth,
        maxHeight
      });
    }

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
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

  const menu =
    open &&
    menuPos &&
    createPortal(
      <div
        ref={menuRef}
        role="listbox"
        style={{
          position: "fixed",
          zIndex: 1000,
          top: menuPos.top,
          left: menuPos.left,
          width: menuPos.width,
          maxHeight: menuPos.maxHeight,
          overflow: "hidden",
          background: "#143d31",
          border: "1px solid rgba(230,198,128,0.4)",
          borderRadius: 12,
          boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ padding: 10, borderBottom: "1px solid rgba(230,198,128,0.2)", flexShrink: 0 }}>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search code..."
            aria-label="Search calling codes"
            className="enquiry-field"
            style={{ ...darkInput, background: "#0f3126" }}
          />
        </div>
        <div style={{ overflowY: "auto", WebkitOverflowScrolling: "touch", flex: 1 }}>
          {filtered.map((c) => (
            <button
              key={`${c.code}-${c.dial}`}
              type="button"
              role="option"
              aria-selected={c.code === countryCode}
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
              <CountryFlag code={c.code} title={c.name} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {c.name}
              </span>
              <span style={{ color: "#e6c680", flexShrink: 0 }}>{c.dial}</span>
            </button>
          ))}
        </div>
      </div>,
      document.body
    );

  return (
    <div>
      <div
        ref={rootRef}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(120px, 140px) 1fr",
          gap: 8
        }}
      >
        <div style={{ position: "relative" }}>
          <button
            ref={buttonRef}
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
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                color: selected ? "#f4f0e6" : "rgba(244,240,230,0.55)"
              }}
            >
              {selected ? (
                <>
                  <CountryFlag code={selected.code} title={selected.name} size={16} />
                  {selected.dial}
                </>
              ) : (
                <>
                  <CountryFlag size={16} /> Code
                </>
              )}
            </span>
            <span style={{ color: "#e6c680", fontSize: 11 }}>▾</span>
          </button>
          {menu}
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
          className="enquiry-field"
          style={{
            ...darkInput,
            background: "#214c40",
            backgroundColor: "#214c40",
            color: "#f8f4ea",
            WebkitTextFillColor: "#f8f4ea",
            caretColor: "#f8f4ea",
            colorScheme: "dark",
            borderColor: error ? "rgba(255,150,150,0.7)" : "rgba(230,198,128,0.5)"
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
