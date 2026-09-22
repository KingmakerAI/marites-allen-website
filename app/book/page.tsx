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
  const teamEmail =
    settings.contact.email && !/frigga/i.test(settings.contact.email)
      ? settings.contact.email
      : "hello@maritesallen.com";

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
              margin: "0 auto 12px",
              maxWidth: 560
            }}
            {...cms("book.intro")}
          >
            {book.intro}
          </p>
          {book.introSecondary ? (
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.65,
                color: "#a8c4b6",
                margin: "0 auto 28px",
                maxWidth: 560
              }}
              {...cms("book.introSecondary")}
            >
              {book.introSecondary}
            </p>
          ) : (
            <div style={{ marginBottom: 28 }} />
          )}

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(230,198,128,0.25)",
              borderRadius: 18,
              padding: "clamp(22px,3vw,32px)",
              textAlign: "left",
              maxWidth: 560,
              margin: "0 auto"
            }}
          >
            <ConsultationEnquiryForm
              consultationOptions={consultationOptions}
              whatsappUrl={`https://wa.me/${whatsapp}`}
              messengerUrl={MESSENGER_URL}
              emailUrl={`mailto:${teamEmail}`}
              preferTalkHeading={book.preferTalkHeading}
              whatsappLabel={book.whatsappLabel}
              messengerLabel="Facebook Messenger →"
              emailLabel={book.emailLabel || "Email Our Team →"}
              submitHint={book.submitHint}
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
