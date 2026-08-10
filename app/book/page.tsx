import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Book a Consultation — Coming Soon",
  description:
    "Online booking for Marites Allen Feng Shui consultations is coming soon. Contact the team by WhatsApp or email to enquire in the meantime.",
  path: "/book",
  keywords: [
    "book Feng Shui consultation",
    "Marites Allen booking",
    "consultation coming soon"
  ]
});

export default function BookPage() {
  return (
    <div className="page-shell page-enter">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Book Consultation", path: "/book" }
        ])}
      />
      <SiteHeader bookAsLabel />

      <section
        style={{
          background: "linear-gradient(165deg,#0f3126 0%,#06140f 100%)",
          color: "#fff",
          borderBottom: "1px solid rgba(230,198,128,0.15)"
        }}
      >
        <div
          style={{
            maxWidth: 820,
            margin: "0 auto",
            padding: "clamp(56px,10vw,110px) clamp(18px,4vw,40px)",
            textAlign: "center"
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              color: "#143d31",
              background: "#e6c680",
              borderRadius: 99,
              padding: "6px 14px",
              marginBottom: 18
            }}
          >
            Coming soon
          </div>
          <h1
            className="font-display"
            style={{
              fontWeight: 700,
              fontSize: "clamp(32px,5vw,52px)",
              lineHeight: 1.12,
              margin: "0 0 16px"
            }}
          >
            Book Consultation
          </h1>
          <p
            style={{
              fontSize: "clamp(16px,2vw,19px)",
              lineHeight: 1.65,
              color: "#c7ddd2",
              margin: "0 auto 28px",
              maxWidth: 560
            }}
          >
            Online booking is being prepared. Private consultations with Marites Allen will open here shortly.
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(230,198,128,0.25)",
              borderRadius: 18,
              padding: "clamp(22px,3vw,32px)",
              textAlign: "left",
              maxWidth: 520,
              margin: "0 auto 28px"
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: "#e6c680",
                marginBottom: 10
              }}
            >
              Need help now?
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#c7ddd2", margin: "0 0 16px" }}>
              Enquire by WhatsApp or email and the team will assist you while booking goes live.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <a
                href="https://wa.me/639209509390"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "linear-gradient(160deg,#e6c680,#c69a3e)",
                  color: "#143d31",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "12px 18px",
                  borderRadius: 10
                }}
              >
                WhatsApp enquire →
              </a>
              <a
                href="mailto:sales@frigga.co.uk?subject=Consultation%20enquiry"
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(230,198,128,0.35)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "12px 18px",
                  borderRadius: 10
                }}
              >
                Email sales@frigga.co.uk
              </a>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link
              href="/destara"
              style={{
                color: "#e6c680",
                fontWeight: 700,
                fontSize: 14
              }}
            >
              Try Destara AI →
            </Link>
            <span style={{ color: "#5f7a6e" }}>·</span>
            <Link href="/events" style={{ color: "#e6c680", fontWeight: 700, fontSize: 14 }}>
              View events →
            </Link>
            <span style={{ color: "#5f7a6e" }}>·</span>
            <Link href="/" style={{ color: "#e6c680", fontWeight: 700, fontSize: 14 }}>
              Back home →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
