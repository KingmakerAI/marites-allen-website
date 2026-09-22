"use client";

import { useEffect, useRef, useState } from "react";
import { darkInput } from "@/components/country-select";

type Props = {
  id?: string;
  value: string;
  options: string[];
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
  compact?: boolean;
};

export function DarkSelect({
  id,
  value,
  options,
  placeholder = "Select…",
  error,
  onChange,
  compact = false
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
        onClick={() => setOpen((v) => !v)}
        style={{
          ...darkInput,
          padding: compact ? "9px 40px 9px 12px" : "11px 40px 11px 13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          cursor: "pointer",
          textAlign: "left",
          background: "#214c40",
          color: value ? "#f8f4ea" : "rgba(248,244,234,0.62)",
          borderColor: error ? "rgba(255,150,150,0.7)" : "rgba(230,198,128,0.5)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)"
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: value ? 600 : 500
          }}
        >
          {value || placeholder}
        </span>
        <span style={{ color: "#e6c680", fontSize: 12, flexShrink: 0 }}>▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            zIndex: 60,
            left: 0,
            right: 0,
            top: "calc(100% + 6px)",
            maxHeight: 260,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            background: "#143d31",
            border: "1px solid rgba(230,198,128,0.45)",
            borderRadius: 12,
            boxShadow: "0 16px 40px rgba(0,0,0,0.4)"
          }}
        >
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "11px 14px",
                  border: 0,
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: 1.4,
                  fontFamily: "Lato, system-ui, sans-serif",
                  color: "#f8f4ea",
                  background: selected ? "rgba(230,198,128,0.18)" : "transparent"
                }}
                onMouseEnter={(e) => {
                  if (!selected) e.currentTarget.style.background = "rgba(230,198,128,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = selected ? "rgba(230,198,128,0.18)" : "transparent";
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
