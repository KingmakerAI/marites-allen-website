"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  /** ISO-like local PH datetime string parsed as Asia/Manila, e.g. 2026-08-01T15:00:00+08:00 */
  startsAt: string;
  /** Optional end for live window; defaults to 3 hours after start */
  endsAt?: string;
  liveHref?: string;
  liveLabel?: string;
  accent?: "gold" | "emerald";
};

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function getParts(ms: number): Parts {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds };
}

export function EventCountdown({
  startsAt,
  endsAt,
  liveHref,
  liveLabel = "Watch live on Facebook",
  accent = "gold"
}: Props) {
  const start = useMemo(() => new Date(startsAt).getTime(), [startsAt]);
  const end = useMemo(
    () => (endsAt ? new Date(endsAt).getTime() : start + 3 * 60 * 60 * 1000),
    [endsAt, start]
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now >= start && now < end) {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(198,154,62,0.18)",
            border: "1px solid rgba(230,198,128,0.45)",
            color: "#e6c680",
            borderRadius: 999,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase"
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ff4d4d",
              boxShadow: "0 0 0 4px rgba(255,77,77,0.25)"
            }}
          />
          Live now
        </div>
        {liveHref && (
          <a
            href={liveHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "linear-gradient(160deg,#e6c680,#c69a3e)",
              color: "#143d31",
              fontWeight: 700,
              fontSize: 14,
              padding: "11px 18px",
              borderRadius: 10
            }}
          >
            {liveLabel} →
          </a>
        )}
      </div>
    );
  }

  if (now >= end) {
    return (
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: accent === "gold" ? "#c9b27a" : "#7fa093"
        }}
      >
        Event ended
      </div>
    );
  }

  const parts = getParts(start - now);
  const units: Array<[string, number]> = [
    ["Days", parts.days],
    ["Hours", parts.hours],
    ["Mins", parts.minutes],
    ["Secs", parts.seconds]
  ];

  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: accent === "gold" ? "#e6c680" : "#9fbcb0",
          marginBottom: 10
        }}
      >
        Starts in
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 8
        }}
      >
        {units.map(([label, value]) => (
          <div
            key={label}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(230,198,128,0.22)",
              borderRadius: 12,
              padding: "10px 6px",
              textAlign: "center"
            }}
          >
            <div
              className="font-display"
              style={{
                fontWeight: 700,
                fontSize: "clamp(22px,3vw,28px)",
                color: "#e6c680",
                lineHeight: 1
              }}
            >
              {String(value).padStart(2, "0")}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "#9fbcb0"
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
