"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FORECAST_YEARS } from "@/lib/site-data";

type Props = {
  compact?: boolean;
  bookAsLabel?: boolean;
};

export function SiteHeader({ compact = false, bookAsLabel = false }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const active = (href: string) => (pathname === href ? " active" : "");

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(246,241,231,0.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(20,61,49,0.1)"
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(18px,4vw,40px)",
          height: compact ? 56 : 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          position: "relative"
        }}
      >
        <Link href="/" style={{ display: "flex", flexDirection: "column", lineHeight: 1, minWidth: 0 }}>
          <span
            className="brandName font-display"
            style={{
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: 1,
              color: "#143d31",
              whiteSpace: "nowrap"
            }}
          >
            MARITES ALLEN
          </span>
          <span
            className="brandTag"
            style={{
              fontSize: 9,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              color: "#c69a3e",
              marginTop: 3
            }}
          >
            FENG SHUI QUEEN
          </span>
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(9px,1.5vw,17px)",
            flex: 1,
            justifyContent: "center"
          }}
        >
          <Link href="/about" className={`navlink${active("/about")}`}>
            About
          </Link>
          <Link href="/destara" className={`navlink${active("/destara")}`}>
            Destara AI
          </Link>
          <a
            href="https://www.frigga.com.ph"
            target="_blank"
            rel="noopener noreferrer"
            className="navlink"
          >
            Frigga
          </a>
          <span className="navlink navdrop">
            Annual Forecast ▾
            <span className="navmenu">
              <span>
                {FORECAST_YEARS.map((y) => (
                  <Link key={y.year} href={`/forecast?year=${y.year}`}>
                    {y.label}
                  </Link>
                ))}
              </span>
            </span>
          </span>
          <Link href="/projects" className={`navlink${active("/projects")}`}>
            Projects
          </Link>
          <Link href="/events" className={`navlink${active("/events")}`}>
            Events
          </Link>
          <Link href="/media" className={`navlink${active("/media")}`}>
            Media
          </Link>
        </nav>

        {bookAsLabel ? (
          <span
            className="bookNavBtn desktop-only"
            style={{
              background: "linear-gradient(160deg,#1a4d3e,#143d31)",
              color: "#fff",
              fontSize: 13.5,
              fontWeight: 700,
              padding: "11px 18px",
              borderRadius: 10,
              boxShadow: "0 8px 18px -8px rgba(20,60,45,0.6)",
              whiteSpace: "nowrap"
            }}
          >
            Coming Soon
          </span>
        ) : (
          <Link
            href="/book"
            className="bookNavBtn desktop-only"
            style={{
              background: "linear-gradient(160deg,#1a4d3e,#143d31)",
              color: "#fff",
              fontSize: 13.5,
              fontWeight: 700,
              padding: "11px 18px",
              borderRadius: 10,
              boxShadow: "0 8px 18px -8px rgba(20,60,45,0.6)",
              whiteSpace: "nowrap"
            }}
            title="Book Consultation — Coming Soon"
          >
            Coming Soon
          </Link>
        )}

        <button
          type="button"
          className={`omBurger${open ? " open" : ""}`}
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`omDrawer${open ? " open" : ""}`}>
        <Link href="/about">About</Link>
        <Link href="/destara">Destara AI</Link>
        <a href="https://www.frigga.com.ph" target="_blank" rel="noopener noreferrer">
          Frigga
        </a>
        <div className="grpLabel">Annual Forecast</div>
        {FORECAST_YEARS.map((y) => (
          <Link key={y.year} href={`/forecast?year=${y.year}`} className="sub">
            {y.label}
          </Link>
        ))}
        <Link href="/projects">Projects</Link>
        <Link href="/events">Events</Link>
        <Link href="/media">Media</Link>
        <Link href="/book" className="cta" title="Book Consultation — Coming Soon">
          Coming Soon
        </Link>
      </div>
    </header>
  );
}
