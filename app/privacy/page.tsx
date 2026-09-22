import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PRIVACY_POLICY_VERSION } from "@/lib/privacy";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Marites Allen collects and uses personal information submitted through consultation enquiries and related website forms.",
  path: "/privacy",
  keywords: ["Marites Allen privacy", "consultation enquiry privacy"]
});

export default function PrivacyPage() {
  return (
    <div className="page-shell page-enter">
      <SiteHeader />
      <section
        style={{
          background: "linear-gradient(165deg,#0f3126 0%,#06140f 100%)",
          color: "#fff",
          borderBottom: "1px solid rgba(230,198,128,0.15)"
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "clamp(48px,8vw,90px) clamp(18px,4vw,40px)"
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
            Privacy
          </div>
          <h1
            className="font-display"
            style={{ fontWeight: 700, fontSize: "clamp(30px,5vw,46px)", lineHeight: 1.15, margin: "0 0 14px" }}
          >
            Privacy Policy
          </h1>
          <p style={{ color: "#a8c4b6", fontSize: 14, margin: "0 0 28px" }}>
            Version {PRIVACY_POLICY_VERSION} · Last updated 22 September 2026
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(230,198,128,0.22)",
              borderRadius: 16,
              padding: "clamp(20px,3vw,28px)",
              color: "#c7ddd2",
              fontSize: 15,
              lineHeight: 1.7
            }}
          >
            <p style={{ marginTop: 0 }}>
              This notice explains how Marites Allen (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects and uses personal
              information when you submit a consultation enquiry or contact us through maritesallen.com.
            </p>

            <h2 className="font-display" style={{ color: "#e6c680", fontSize: 20, margin: "28px 0 10px" }}>
              What we collect
            </h2>
            <p style={{ margin: "0 0 10px" }}>
              When you submit a consultation enquiry, we may collect your name, gender (if provided), country or
              region, phone / WhatsApp number, email address, consultation preference, and the details of your
              enquiry.
            </p>

            <h2 className="font-display" style={{ color: "#e6c680", fontSize: 20, margin: "28px 0 10px" }}>
              Why we use your information
            </h2>
            <p style={{ margin: "0 0 10px" }}>
              We use enquiry information to review your request, contact you by email or WhatsApp, discuss
              availability and consultation details, and keep a record of the enquiry. This processing is necessary
              to take steps at your request before entering into a consultation arrangement, and to respond to your
              enquiry.
            </p>
            <p style={{ margin: "0 0 10px" }}>
              If you separately opt in to receive updates, announcements or offers, we will use your contact details
              for that purpose based on your consent. You may withdraw marketing consent at any time.
            </p>

            <h2 className="font-display" style={{ color: "#e6c680", fontSize: 20, margin: "28px 0 10px" }}>
              Sharing
            </h2>
            <p style={{ margin: "0 0 10px" }}>
              We do not sell your personal information. Service providers that help us operate the website or send
              email (such as hosting or email delivery providers) may process data on our behalf under appropriate
              arrangements.
            </p>

            <h2 className="font-display" style={{ color: "#e6c680", fontSize: 20, margin: "28px 0 10px" }}>
              Retention
            </h2>
            <p style={{ margin: "0 0 10px" }}>
              Enquiry records are kept for as long as needed to handle your request and for reasonable business and
              compliance purposes, after which they may be deleted or anonymised.
            </p>

            <h2 className="font-display" style={{ color: "#e6c680", fontSize: 20, margin: "28px 0 10px" }}>
              Your rights
            </h2>
            <p style={{ margin: "0 0 10px" }}>
              Depending on your location, you may have rights to access, correct, delete, or restrict processing of
              your personal information, and to object to certain processing or withdraw consent where consent is
              used. To exercise these rights, contact us using the details below.
            </p>

            <h2 className="font-display" style={{ color: "#e6c680", fontSize: 20, margin: "28px 0 10px" }}>
              Contact
            </h2>
            <p style={{ margin: "0 0 10px" }}>
              Email:{" "}
              <a href="mailto:hello@maritesallen.com" style={{ color: "#e6c680" }}>
                hello@maritesallen.com
              </a>
              <br />
              Website:{" "}
              <Link href="/" style={{ color: "#e6c680" }}>
                maritesallen.com
              </Link>
            </p>

            <p style={{ margin: "24px 0 0", fontSize: 13, color: "#8eaea0" }}>
              This page provides the privacy information presented with consultation enquiries. We may update it from
              time to time; the version date above will change when we do.
            </p>
          </div>

          <div style={{ marginTop: 28 }}>
            <Link href="/book" style={{ color: "#e6c680", fontWeight: 700, fontSize: 14 }}>
              ← Back to Book a Consultation
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
