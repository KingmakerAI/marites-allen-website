"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { useCms } from "@/components/cms-provider";
import { FRIGGA_SOCIAL_LINKS, SOCIAL_LINKS } from "@/lib/site-data";

type Props = {
  variant?: "full" | "minimal";
};

const headingStyle = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1.6,
  textTransform: "uppercase" as const,
  color: "#e6c680",
  marginBottom: 10
};

const linkStyle = {
  color: "#c7ddd2",
  fontSize: 13,
  lineHeight: 1.35,
  textDecoration: "none" as const
};

const handleStyle = {
  color: "#7fa093",
  fontSize: 12,
  marginLeft: 6
};

const DEFAULT_EXPLORE = [
  { id: "a", label: "About", href: "/about", external: false },
  { id: "p", label: "Projects", href: "/projects", external: false },
  { id: "e", label: "Events", href: "/events", external: false },
  { id: "f", label: "Annual Forecast", href: "/forecast", external: false },
  { id: "d", label: "Destara AI", href: "/destara", external: false },
  { id: "m", label: "Media", href: "/media", external: false }
];

export function SiteFooter({ variant = "full" }: Props) {
  const { settings, nav } = useCms();
  const social = settings?.social?.length ? settings.social : SOCIAL_LINKS;
  const friggaSocial = settings?.friggaSocial?.length ? settings.friggaSocial : FRIGGA_SOCIAL_LINKS;
  const footerNav = nav.filter((n) => n.location === "footer" && n.enabled && n.href !== "/book");
  const explore = footerNav.length ? footerNav : DEFAULT_EXPLORE;
  const contact = settings?.contact;
  const tagline = settings?.general.tagline || "THE FENG SHUI QUEEN";
  const email =
    contact?.email && !/frigga/i.test(contact.email) ? contact.email : "hello@maritesallen.com";
  const phone = contact?.phone || "+63 920 950 9390";
  const phoneSecondary = contact?.phoneSecondary || "+63 939 351 6424";
  const whatsapp = contact?.whatsapp || "639209509390";

  if (variant === "minimal") {
    return (
      <footer
        style={{
          borderTop: "1px solid rgba(20,61,49,0.1)",
          padding: "18px clamp(18px,4vw,40px)",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
          alignItems: "center",
          background: "#efe8d8"
        }}
      >
        <BrandLogo height={26} maxWidth={200} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
          <Link href="/privacy" style={{ fontSize: 12, color: "#5f6b60", fontWeight: 600 }}>
            Privacy Policy
          </Link>
          <Link href="/book" style={{ fontSize: 12, color: "#143d31", fontWeight: 700 }}>
            Book a Consultation →
          </Link>
          <div style={{ fontSize: 12, color: "#6b6862" }}>© 2026 Marites Allen.</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer" style={{ background: "#0c2a20" }}>
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <div
            style={{
              display: "inline-block",
              background: "#efe8d8",
              borderRadius: 10,
              padding: "8px 10px 7px"
            }}
          >
            <BrandLogo height={28} maxWidth={200} />
          </div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1.8,
              textTransform: "uppercase",
              color: "#e6c680",
              marginTop: 8
            }}
          >
            {tagline.toUpperCase()}
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.45, color: "#9fbcb0", margin: "8px 0 0", maxWidth: 260 }}>
            Official channels for Marites Allen and Frigga Charmed Life.
          </p>
        </div>

        <div>
          <div style={headingStyle}>Explore</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {explore.map((item) =>
              item.external || item.href.startsWith("http") ? (
                <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.id} href={item.href} className="site-footer-link" style={linkStyle}>
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>

        <div>
          <div style={headingStyle}>Contact</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#c7ddd2" }}>
            <a href={`mailto:${email}`} className="site-footer-link" style={linkStyle}>
              {email}
            </a>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer-link"
              style={linkStyle}
            >
              WhatsApp · {phone}
            </a>
            <span style={{ color: "#c7ddd2" }}>{phoneSecondary}</span>
            <a
              href="https://destara.app"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer-link"
              style={linkStyle}
            >
              destara.app
            </a>
          </div>
        </div>

        <div>
          <div style={headingStyle}>Follow Marites</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {social.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-link"
                style={linkStyle}
                title={s.handle}
              >
                {s.label}
                {s.handle.startsWith("@") ? <span style={handleStyle}>{s.handle}</span> : null}
              </a>
            ))}
          </div>

          <div style={{ ...headingStyle, marginTop: 16, marginBottom: 8, fontSize: 10 }}>Frigga Charmed Life</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {friggaSocial.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-link"
                style={{ ...linkStyle, fontSize: 12.5 }}
                title={s.handle}
              >
                {s.label}
                {s.handle.startsWith("@") ? <span style={handleStyle}>{s.handle}</span> : null}
              </a>
            ))}
            <a
              href="https://www.frigga.com.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer-link"
              style={{ ...linkStyle, fontSize: 12.5 }}
            >
              Shop · frigga.com.ph
            </a>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="site-footer-bottom">
          <span>© 2026 Marites Allen.</span>
          <span style={{ color: "#5f7a6e" }}>·</span>
          <Link href="/privacy" className="site-footer-link" style={{ color: "#c7ddd2" }}>
            Privacy Policy
          </Link>
          <span style={{ color: "#5f7a6e" }}>·</span>
          <Link href="/book" style={{ color: "#e6c680", fontWeight: 700 }}>
            Book a Consultation →
          </Link>
        </div>
      </div>

      <style>{`
        .site-footer-main {
          max-width: 1160px;
          margin: 0 auto;
          padding: 48px clamp(16px, 3vw, 36px) 28px;
          display: grid;
          grid-template-columns: 1.25fr 0.85fr 1fr 1.15fr;
          gap: 28px 32px;
          align-items: start;
        }
        .site-footer-bottom {
          max-width: 1160px;
          margin: 0 auto;
          padding: 14px clamp(16px, 3vw, 36px);
          font-size: 12px;
          color: #7fa093;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          justify-content: center;
          min-height: 46px;
        }
        .site-footer-link:hover {
          color: #e6c680 !important;
        }
        @media (max-width: 900px) {
          .site-footer-main {
            grid-template-columns: 1fr 1fr;
            padding: 36px 18px 22px;
            gap: 24px 20px;
          }
        }
        @media (max-width: 560px) {
          .site-footer-main {
            grid-template-columns: 1fr;
            padding: 28px 16px 18px;
            gap: 22px;
          }
          .site-footer-brand {
            text-align: left;
          }
          .site-footer-bottom {
            justify-content: flex-start;
            gap: 8px 10px;
          }
        }
      `}</style>
    </footer>
  );
}
