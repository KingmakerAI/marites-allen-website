import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "Terms of use for maritesallen.com — website access, consultations, and content ownership.",
  path: "/terms",
  keywords: ["Marites Allen terms", "website terms of use"]
});

export default function TermsPage() {
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
              Legal
            </div>
            <h1
              className="font-display"
              style={{ fontWeight: 700, fontSize: "clamp(30px,5vw,46px)", lineHeight: 1.15, margin: "0 0 14px" }}
            >
              Terms of Use
            </h1>
            <p style={{ color: "#a8c4b6", fontSize: 14, margin: "0 0 28px" }}>
              Last updated 16 October 2026
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
                By using maritesallen.com (&quot;the Site&quot;), you agree to these terms. If you do not agree, please
                do not use the Site.
              </p>

              <h2 className="font-display" style={{ color: "#e6c680", fontSize: 20, margin: "28px 0 10px" }}>
                The Site
              </h2>
              <p style={{ margin: "0 0 10px" }}>
                The Site provides information about Marites Allen&apos;s work, products, and services, and allows you to
                submit consultation enquiries. Content is for general information and cultural guidance. It is not a
                substitute for professional medical, legal, or financial advice.
              </p>

              <h2 className="font-display" style={{ color: "#e6c680", fontSize: 20, margin: "28px 0 10px" }}>
                Consultations
              </h2>
              <p style={{ margin: "0 0 10px" }}>
                Submitting an enquiry does not create a confirmed booking until our team confirms availability and
                next steps with you. Fees, schedules, and deliverables are agreed separately for each consultation.
              </p>

              <h2 className="font-display" style={{ color: "#e6c680", fontSize: 20, margin: "28px 0 10px" }}>
                Intellectual property
              </h2>
              <p style={{ margin: "0 0 10px" }}>
                Text, images, forecasts, and other materials on the Site are owned by Marites Allen or used with
                permission. You may not copy, republish, or commercially reuse Site content without prior written
                consent, except for ordinary personal, non-commercial viewing.
              </p>

              <h2 className="font-display" style={{ color: "#e6c680", fontSize: 20, margin: "28px 0 10px" }}>
                Acceptable use
              </h2>
              <p style={{ margin: "0 0 10px" }}>
                Do not misuse the Site, attempt unauthorized access, submit harmful or false information, or use the
                Site in a way that violates applicable law.
              </p>

              <h2 className="font-display" style={{ color: "#e6c680", fontSize: 20, margin: "28px 0 10px" }}>
                Limitation of liability
              </h2>
              <p style={{ margin: "0 0 10px" }}>
                To the fullest extent permitted by law, Marites Allen is not liable for indirect or consequential loss
                arising from your use of the Site or reliance on its content. Nothing in these terms excludes liability
                that cannot be excluded under Philippine law.
              </p>

              <h2 className="font-display" style={{ color: "#e6c680", fontSize: 20, margin: "28px 0 10px" }}>
                Privacy
              </h2>
              <p style={{ margin: "0 0 10px" }}>
                How we handle personal information is described in our{" "}
                <Link href="/privacy" style={{ color: "#e6c680" }}>
                  Privacy Policy
                </Link>
                .
              </p>

              <h2 className="font-display" style={{ color: "#e6c680", fontSize: 20, margin: "28px 0 10px" }}>
                Contact
              </h2>
              <p style={{ margin: "0 0 10px" }}>
                Email:{" "}
                <a href="mailto:hello@maritesallen.com" style={{ color: "#e6c680" }}>
                  hello@maritesallen.com
                </a>
              </p>

              <p style={{ margin: "24px 0 0", fontSize: 13, color: "#8eaea0" }}>
                We may update these terms from time to time. The date above will change when we do.
              </p>
            </div>

            <div style={{ marginTop: 28 }}>
              <Link href="/" style={{ color: "#e6c680", fontWeight: 700, fontSize: 14 }}>
                ← Back to home
              </Link>
            </div>
          </div>
        </section>
      <SiteFooter />
    </div>
  );
}
