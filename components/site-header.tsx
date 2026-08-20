"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { useCms } from "@/components/cms-provider";

type Props = {
  compact?: boolean;
  bookAsLabel?: boolean;
};

const FALLBACK_NAV = [
  { id: "about", label: "About", href: "/about", external: false },
  { id: "destara", label: "Destara AI", href: "/destara", external: false },
  { id: "frigga", label: "Frigga", href: "https://www.frigga.com.ph", external: true },
  { id: "projects", label: "Projects", href: "/projects", external: false },
  { id: "events", label: "Events", href: "/events", external: false },
  { id: "media", label: "Media", href: "/media", external: false }
];

function ForecastDrop() {
  const { forecastYears } = useCms();
  return (
    <span className="navlink navdrop">
      Annual Forecast ▾
      <span className="navmenu">
        <span>
          {forecastYears.map((y) => (
            <Link key={y.year} href={`/forecast?year=${y.year}`}>
              {y.label}
            </Link>
          ))}
        </span>
      </span>
    </span>
  );
}

export function SiteHeader({ compact = false, bookAsLabel = false }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }
  const { nav, settings, forecastYears } = useCms();
  const headerItems = nav.filter((n) => n.location === "header" && n.enabled);
  const bookItem = headerItems.find((n) => n.href === "/book");
  const menuItems = (headerItems.length ? headerItems : FALLBACK_NAV).filter((n) => n.href !== "/book");
  const bookHref = bookItem?.href || settings?.business.bookingUrl || "/book";
  const tagline = (settings?.general.tagline || "FENG SHUI QUEEN").toUpperCase();
  const bookLabel = bookItem?.label || settings?.business.bookCtaLabel || settings?.business.comingSoonLabel || "Coming Soon";

  const active = (href: string) => (pathname === href ? " active" : "");
  const hasForecast = menuItems.some((i) => i.href.startsWith("/forecast"));

  const renderItem = (item: (typeof menuItems)[number]) =>
    item.external || item.href.startsWith("http") ? (
      <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" className="navlink">
        {item.label}
      </a>
    ) : (
      <Link key={item.id} href={item.href} className={`navlink${active(item.href)}`}>
        {item.label}
      </Link>
    );

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
        <Link href="/" className="site-brand" style={{ display: "flex", flexDirection: "column", lineHeight: 1, minWidth: 0 }}>
          <BrandLogo height={compact ? 32 : 40} />
          <span
            className="brandTag"
            style={{
              fontSize: 9,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              color: "#c69a3e",
              marginTop: 5
            }}
          >
            {tagline}
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
          {menuItems.map((item, idx) => (
            <span key={item.id} style={{ display: "contents" }}>
              {renderItem(item)}
              {!hasForecast && idx === 2 ? <ForecastDrop /> : null}
            </span>
          ))}
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
            {bookLabel}
          </span>
        ) : (
          <Link
            href={bookHref}
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
            title={bookLabel}
          >
            {bookLabel}
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
        {menuItems.map((item) =>
          item.external || item.href.startsWith("http") ? (
            <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer">
              {item.label}
            </a>
          ) : (
            <Link key={item.id} href={item.href}>
              {item.label}
            </Link>
          )
        )}
        <div className="grpLabel">Annual Forecast</div>
        {forecastYears.map((y) => (
          <Link key={y.year} href={`/forecast?year=${y.year}`} className="sub">
            {y.label}
          </Link>
        ))}
        <Link href={bookHref} className="cta" title={bookLabel}>
          {bookLabel}
        </Link>
      </div>
    </header>
  );
}
