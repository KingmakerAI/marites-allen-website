import type { Metadata } from "next";
import { BookEnquirySection } from "@/components/book-enquiry-section";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FALLBACK_CONSULTATION_OPTIONS } from "@/lib/countries";
import { MESSENGER_URL } from "@/lib/privacy";
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
        style={{
          background: "linear-gradient(165deg,#0f3126 0%,#06140f 100%)",
          color: "#fff",
          borderBottom: "1px solid rgba(230,198,128,0.15)"
        }}
      >
        <BookEnquirySection
          kicker={book.kicker}
          title={book.title}
          intro={book.intro}
          introSecondary={book.introSecondary}
          consultationOptions={consultationOptions}
          whatsappUrl={`https://wa.me/${whatsapp}`}
          messengerUrl={MESSENGER_URL}
          preferTalkHeading={book.preferTalkHeading}
          whatsappLabel={book.whatsappLabel}
          messengerLabel="Facebook Messenger →"
          submitHint={book.submitHint}
        />
      </section>

      <SiteFooter />

      <style>{`
        .book-shell {
          max-width: 1180px;
          margin: 0 auto;
          padding: 32px clamp(16px, 3vw, 36px) 40px;
          display: grid;
          grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.2fr);
          gap: clamp(24px, 3.5vw, 40px);
          align-items: start;
          min-height: calc(100vh - 88px);
        }
        .book-shell--success {
          grid-template-columns: 1fr;
          justify-items: center;
          align-items: center;
          min-height: calc(100vh - 88px);
        }
        .book-intro {
          position: sticky;
          top: 96px;
          padding-top: 18px;
        }
        .book-form-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(230,198,128,0.25);
          border-radius: 16px;
          padding: 24px 22px 20px;
          text-align: left;
          max-height: calc(100vh - 112px);
          overflow-y: auto;
          overscroll-behavior: contain;
          width: 100%;
        }
        .book-shell--success .book-form-card {
          max-width: 560px;
          max-height: none;
          overflow: visible;
          padding: 36px 28px 28px;
        }
        @media (max-width: 960px) {
          .book-shell {
            grid-template-columns: 1fr;
            min-height: auto;
            padding-top: 24px;
            padding-bottom: 28px;
          }
          .book-shell--success {
            min-height: calc(100vh - 120px);
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
            padding: 20px 16px;
          }
          .book-shell--success .book-form-card {
            padding: 28px 18px 22px;
          }
        }
      `}</style>
    </div>
  );
}
