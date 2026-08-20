import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SignupForm } from "@/components/signup-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cms } from "@/lib/cms/cms-attr";
import { getCachedPageCopy, getCachedPricing, getCachedServices, getCachedSettings } from "@/lib/cms/content";
import { formatServicePrice } from "@/lib/cms/map-services";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getCachedPageCopy();
  return pageMetadata({
    title: copy.book.seoTitle,
    description: copy.book.seoDescription,
    path: "/book",
    keywords: ["book Feng Shui consultation", "Marites Allen booking", "consultation coming soon"]
  });
}

export default async function BookPage() {
  const [settings, services, pricing, pageCopy] = await Promise.all([
    getCachedSettings(),
    getCachedServices(),
    getCachedPricing(),
    getCachedPageCopy()
  ]);
  const book = pageCopy.book;
  const whatsapp = settings.contact.whatsapp || "639209509390";
  const email = settings.contact.email || "sales@frigga.co.uk";
  const featured = services.filter((s) => s.featured).slice(0, 3);
  const listed = featured.length ? featured : services.slice(0, 3);

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
            {...cms("book.kicker")}
          >
            {book.kicker}
          </div>
          <h1
            className="font-display"
            style={{
              fontWeight: 700,
              fontSize: "clamp(32px,5vw,52px)",
              lineHeight: 1.12,
              margin: "0 0 16px"
            }}
            {...cms("book.title")}
          >
            {book.title}
          </h1>
          <p
            style={{
              fontSize: "clamp(16px,2vw,19px)",
              lineHeight: 1.65,
              color: "#c7ddd2",
              margin: "0 auto 28px",
              maxWidth: 560
            }}
            {...cms("book.intro")}
          >
            {book.intro}
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
              {...cms("book.formTitle")}
            >
              {book.formTitle}
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#c7ddd2", margin: "0 0 16px" }} {...cms("book.formBody")}>
              {book.formBody}
            </p>
            <SignupForm
              kind="booking-waitlist"
              source="book"
              showName
              showPhone
              showNotes
              notesLabel="What are you looking for?"
              extraFields={[
                {
                  name: "service",
                  label: "Consultation",
                  required: true,
                  placeholder: "Choose a consultation",
                  options: [
                    ...services.map((s) => ({ value: s.name, label: s.name })),
                    { value: "Not sure yet", label: "Not sure yet" }
                  ]
                }
              ]}
              submitLabel={book.submitLabel}
              successTitle={book.successTitle}
              successBody={book.successBody}
              variant="dark"
            />
            <p
              style={{ fontSize: 13, lineHeight: 1.6, color: "#c7ddd2", margin: "18px 0 12px" }}
              {...cms("book.preferTalkHeading")}
            >
              {book.preferTalkHeading}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <a
                href={`https://wa.me/${whatsapp}`}
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
                {...cms("book.whatsappLabel")}
              >
                {book.whatsappLabel}
              </a>
              <a
                href={`mailto:${email}?subject=Consultation%20enquiry`}
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
                Email {email}
              </a>
            </div>
          </div>

          {listed.length > 0 && (
            <div style={{ textAlign: "left", maxWidth: 520, margin: "0 auto 28px" }}>
              {listed.map((s) => {
                const price = pricing.find((p) => p.serviceId === s.id);
                const priceLabel = formatServicePrice(price);
                return (
                  <div key={s.id} style={{ color: "#c7ddd2", marginBottom: 10, fontSize: 14 }}>
                    <strong style={{ color: "#fff" }}>{s.name}</strong>
                    {priceLabel ? <span style={{ color: "#e6c680" }}> · {priceLabel}</span> : null}
                    <div>{s.description}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link href="/destara" style={{ color: "#e6c680", fontWeight: 700, fontSize: 14 }}>
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
