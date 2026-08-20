"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { useCms } from "@/components/cms-provider";
import { FRIGGA_SOCIAL_LINKS, SOCIAL_LINKS } from "@/lib/site-data";

type Props = {
  variant?: "full" | "minimal";
};

export function SiteFooter({ variant = "full" }: Props) {
  const { settings, nav } = useCms();
  const social = settings?.social?.length ? settings.social : SOCIAL_LINKS;
  const friggaSocial = settings?.friggaSocial?.length ? settings.friggaSocial : FRIGGA_SOCIAL_LINKS;
  const footerNav = nav.filter((n) => n.location === "footer" && n.enabled);
  const contact = settings?.contact;
  const tagline = settings?.general.tagline || "FENG SHUI QUEEN";

  if (variant === "minimal") {
    return (
      <footer
        style={{
          borderTop: "1px solid rgba(20,61,49,0.1)",
          padding: "28px clamp(18px,4vw,40px)",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
          alignItems: "center",
          background: "#efe8d8"
        }}
      >
        <div>
          <BrandLogo height={28} maxWidth={220} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
          {social.slice(0, 4).map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: "#5f6b60", fontWeight: 600 }}
            >
              {s.label}
            </a>
          ))}
          <div style={{ fontSize: 12, color: "#6b6862" }}>© 2026 Marites Allen. All rights reserved.</div>
        </div>
      </footer>
    );
  }

  return (
    <footer style={{ background: "#0c2a20" }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "48px clamp(18px,4vw,40px)",
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          justifyContent: "space-between"
        }}
      >
        <div style={{ flex: "1 1 260px" }}>
          <div
            style={{
              display: "inline-block",
              background: "#efe8d8",
              borderRadius: 12,
              padding: "12px 14px 10px"
            }}
          >
            <BrandLogo height={34} maxWidth={240} />
          </div>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#e6c680",
              marginTop: 4
            }}
          >
            {tagline.toUpperCase()}
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#9fbcb0", margin: "14px 0 0", maxWidth: 280 }}>
            Official channels for live sessions, forecasts, and brand updates from Marites Allen and Frigga Charmed
            Life.
          </p>
        </div>
        <div style={{ flex: "0 1 auto" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#e6c680",
              marginBottom: 12
            }}
          >
            Explore
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {(footerNav.length
              ? footerNav
              : [
                  { id: "a", label: "About", href: "/about", external: false },
                  { id: "p", label: "Projects", href: "/projects", external: false },
                  { id: "e", label: "Events", href: "/events", external: false },
                  { id: "f", label: "Annual Forecast", href: "/forecast", external: false },
                  { id: "d", label: "Destara AI", href: "/destara", external: false },
                  { id: "m", label: "Media", href: "/media", external: false },
                  { id: "b", label: "Book · Coming Soon", href: "/book", external: false }
                ]
            ).map((item) =>
              item.external || item.href.startsWith("http") ? (
                <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" style={{ color: "#c7ddd2", fontSize: 14 }}>
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{ color: item.href === "/book" ? "#e6c680" : "#c7ddd2", fontSize: 14, fontWeight: item.href === "/book" ? 700 : 400 }}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>
        <div style={{ flex: "0 1 auto" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#e6c680",
              marginBottom: 12
            }}
          >
            Contact
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14, color: "#c7ddd2" }}>
            <a href={`mailto:${contact?.email || "sales@frigga.co.uk"}`} style={{ color: "#c7ddd2" }}>
              {contact?.email || "sales@frigga.co.uk"}
            </a>
            <a href={`mailto:${contact?.emailSecondary || "connect@frigga.co.uk"}`} style={{ color: "#c7ddd2" }}>
              {contact?.emailSecondary || "connect@frigga.co.uk"}
            </a>
            <a
              href={`https://wa.me/${contact?.whatsapp || "639209509390"}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#c7ddd2" }}
            >
              WhatsApp · {contact?.phone || "+63 920 950 9390"}
            </a>
            <span>{contact?.phoneSecondary || "+63 939 351 6424"}</span>
            <a href="https://destara.app" target="_blank" rel="noopener noreferrer" style={{ color: "#c7ddd2" }}>
              destara.app
            </a>
            <div style={{ marginTop: 16 }}>
              <Link href="/book" style={{ color: "#e6c680", fontWeight: 700, fontSize: 14 }}>
                Book a consultation →
              </Link>
            </div>
          </div>
        </div>
        <div style={{ flex: "1 1 220px", minWidth: 200 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#e6c680",
              marginBottom: 12
            }}
          >
            Follow Marites
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
            {social.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#c7ddd2" }}
                title={s.handle}
              >
                {s.label}
                <span style={{ color: "#7fa093", fontSize: 12, marginLeft: 6 }}>{s.handle.startsWith("@") ? s.handle : ""}</span>
              </a>
            ))}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#e6c680",
              margin: "22px 0 12px"
            }}
          >
            Frigga Charmed Life
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
            {friggaSocial.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#c7ddd2" }}
                title={s.handle}
              >
                {s.label}
                <span style={{ color: "#7fa093", fontSize: 12, marginLeft: 6 }}>
                  {s.handle.startsWith("@") ? s.handle : ""}
                </span>
              </a>
            ))}
            <a
              href="https://www.frigga.com.ph"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#c7ddd2" }}
            >
              Shop · frigga.com.ph
            </a>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "16px clamp(18px,4vw,40px)",
            fontSize: 12,
            color: "#7fa093",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <span>© 2026 Marites Allen. Secure booking · SSL encrypted · Free reschedule up to 48h.</span>
          <Link
            href="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(230,198,128,0.3)",
              color: "#e6c680",
              fontSize: 11.5,
              fontWeight: 700,
              padding: "7px 14px",
              borderRadius: 8,
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
