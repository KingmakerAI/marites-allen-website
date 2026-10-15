import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Page not found",
  description: "The page you requested could not be found on maritesallen.com.",
  path: "/404",
  noIndex: true
});

export default function NotFound() {
  return (
    <div className="page-shell page-enter">
      <SiteHeader />
        <section
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "clamp(64px,12vw,120px) clamp(18px,4vw,40px)",
            textAlign: "center"
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              color: "#5f6b60",
              margin: "0 0 12px"
            }}
          >
            404
          </p>
          <h1
            className="font-display"
            style={{
              fontWeight: 700,
              fontSize: "clamp(28px,4vw,40px)",
              color: "#143d31",
              margin: "0 0 14px"
            }}
          >
            Page not found
          </h1>
          <p style={{ fontSize: 16, color: "#5f6b60", lineHeight: 1.6, margin: "0 0 28px" }}>
            That link may be outdated, or the page may have moved. Try the home page or book a consultation.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link
              href="/"
              style={{
                background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                padding: "12px 20px",
                borderRadius: 10
              }}
            >
              Go home
            </Link>
            <Link
              href="/book"
              style={{
                border: "1px solid rgba(20,61,49,0.25)",
                color: "#143d31",
                fontWeight: 700,
                fontSize: 14,
                padding: "12px 20px",
                borderRadius: 10
              }}
            >
              Book a consultation
            </Link>
          </div>
        </section>
      <SiteFooter variant="minimal" />
    </div>
  );
}
