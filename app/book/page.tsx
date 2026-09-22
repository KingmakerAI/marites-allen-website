import type { Metadata } from "next";
import { ConsultationEnquiryForm } from "@/components/consultation-enquiry-form";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FALLBACK_CONSULTATION_OPTIONS } from "@/lib/countries";
import { MESSENGER_URL } from "@/lib/privacy";
import { cms } from "@/lib/cms/cms-attr";
import { getCachedPageCopy, getCachedServices, getCachedSettings } from "@/lib/cms/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getCachedPageCopy();
  return pageMetadata({
    title: copy.book.seoTitle,
    description: copy.book.seoDescription,
    path: "/book",
    keywords: ["book Feng Shui consultation", "Marites Allen booking", "consultation enquiry"]
  });
}

export default async function BookPage() {
  const [settings, services, pageCopy] = await Promise.all([
    getCachedSettings(),
    getCachedServices(),
    getCachedPageCopy()
  ]);
  const book = pageCopy.book;
  const whatsapp = settings.contact.whatsapp || "639209509390";

  const activeServices = services.filter((s) => s.active !== false).map((s) => s.name);
  const consultationOptions = activeServices.length ? activeServices : FALLBACK_CONSULTATION_OPTIONS;

  return (
    <div className="page-shell page-enter">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Book a Consultation", path: "/book" }
        ])}
      />
      <SiteHeader bookAsLabel />

      <section
        className="book-section"
        style={{
          background: "linear-gradient(165deg,#0f3126 0%,#06140f 100%)",
          color: "#fff",
          borderBottom: "1px solid rgba(230,198,128,0.15)"
        }}
      >
        <div className="book-shell">
          <aside className="book-intro">
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
                padding: "5px 12px",
                marginBottom: 14
              }}
              {...cms("book.kicker")}
            >
              {book.kicker}
            </div>
            <h1
              className="font-display"
              style={{
                fontWeight: 700,
                fontSize: "clamp(28px,3.4vw,42px)",
                lineHeight: 1.12,
                margin: "0 0 12px"
              }}
              {...cms("book.title")}
            >
              {book.title}
            </h1>
            <p
              style={{
                fontSize: "clamp(14px,1.5vw,16px)",
                lineHeight: 1.55,
                color: "#c7ddd2",
                margin: "0 0 10px",
                maxWidth: 420
              }}
              {...cms("book.intro")}
            >
              {book.intro}
            </p>
            {book.introSecondary ? (
              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  color: "#a8c4b6",
                  margin: 0,
                  maxWidth: 420
                }}
                {...cms("book.introSecondary")}
              >
                {book.introSecondary}
              </p>
            ) : null}
          </aside>

          <div className="book-form-card">
            <ConsultationEnquiryForm
              consultationOptions={consultationOptions}
              whatsappUrl={`https://wa.me/${whatsapp}`}
              messengerUrl={MESSENGER_URL}
              preferTalkHeading={book.preferTalkHeading}
              whatsappLabel={book.whatsappLabel}
              messengerLabel="Facebook Messenger →"
              submitHint={book.submitHint}
              compact
            />
          </div>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .book-shell {
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px clamp(16px, 3vw, 36px) 36px;
          display: grid;
          grid-template-columns: minmax(260px, 0.9fr) minmax(0, 1.2fr);
          gap: clamp(20px, 3vw, 36px);
          align-items: start;
          min-height: calc(100vh - 88px);
        }
        .book-intro {
          position: sticky;
          top: 96px;
          padding-top: 12px;
        }
        .book-form-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(230,198,128,0.25);
          border-radius: 16px;
          padding: 18px 18px 16px;
          text-align: left;
          max-height: calc(100vh - 112px);
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        @media (max-width: 960px) {
          .book-shell {
            grid-template-columns: 1fr;
            min-height: auto;
            padding-top: 24px;
            padding-bottom: 28px;
          }
          .book-intro {
            position: static;
            text-align: center;
            padding-top: 0;
          }
          .book-intro p {
            margin-left: auto;
            margin-right: auto;
          }
          .book-form-card {
            max-height: none;
            overflow: visible;
            padding: 18px 16px;
          }
        }
      `}</style>
    </div>
  );
}
