"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CountryFlag } from "@/components/country-flag";
import { COUNTRIES, findCountry, type Country } from "@/lib/countries";

const darkInput = {
  width: "100%",
  background: "#214c40",
  border: "1px solid rgba(230,198,128,0.5)",
  borderRadius: 10,
  padding: "11px 13px",
  fontFamily: "Lato, system-ui, sans-serif",
  fontSize: 15,
  lineHeight: 1.4,
  color: "#f8f4ea",
  colorScheme: "dark" as const
};

/** Show frequently selected countries first; keep the same dataset. */
const PRIORITY_CODES = ["PH", "GB", "US", "AU", "SG", "MY", "HK", "AE", "CA", "NZ"];

function orderedCountries(list: Country[]) {
  const priority = PRIORITY_CODES.map((code) => list.find((c) => c.code === code)).filter(Boolean) as Country[];
  const rest = list.filter((c) => !PRIORITY_CODES.includes(c.code));
  return [...priority, ...rest];
}

type MenuPos = { top: number; left: number; width: number; maxHeight: number };

type Props = {
  value: string;
  onChange: (code: string, country: Country | undefined) => void;
  error?: string;
  id?: string;
};

export function CountrySelect({ value, onChange, error, id = "country" }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPos, setMenuPos] = useState<MenuPos | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
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

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) {
      setMenuPos(null);
      return;
    }

    function place() {
      const rect = buttonRef.current!.getBoundingClientRect();
      const gap = 6;
      const preferred = 280;
      const spaceBelow = window.innerHeight - rect.bottom - gap - 8;
      const spaceAbove = rect.top - gap - 8;
      const openUp = spaceBelow < 180 && spaceAbove > spaceBelow;
      const maxHeight = Math.min(preferred, Math.max(160, openUp ? spaceAbove : spaceBelow));
      const top = openUp ? rect.top - gap - maxHeight : rect.bottom + gap;
      setMenuPos({
        top: Math.max(8, top),
        left: rect.left,
        width: rect.width,
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
            placeholder="Search countries..."
            aria-label="Search countries"
            className="enquiry-field"
            style={{ ...darkInput, background: "#0f3126" }}
          />
        </div>
        <div style={{ overflowY: "auto", WebkitOverflowScrolling: "touch", flex: 1 }}>
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
              <CountryFlag code={c.code} title={c.name} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {c.name}
              </span>
            </button>
          ))}
          {!filtered.length && (
            <div style={{ padding: 14, color: "#c7ddd2", fontSize: 13 }}>No countries match.</div>
          )}
        </div>
      </div>,
      document.body
    );

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        ref={buttonRef}
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
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {selected ? (
            <>
              <CountryFlag code={selected.code} title={selected.name} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selected.name}</span>
            </>
          ) : (
            <span style={{ color: "rgba(244,240,230,0.55)", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <CountryFlag /> Select your country
            </span>
          )}
        </span>
        <span style={{ color: "#e6c680", fontSize: 12 }}>▾</span>
      </button>
      {menu}
    </div>
  );
}

export { darkInput, orderedCountries };
