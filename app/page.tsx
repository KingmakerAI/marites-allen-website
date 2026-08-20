import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { getCachedFaqs, getCachedHome, getCachedPageCopy, getCachedPricing, getCachedServices, getCachedSettings, getCachedTestimonials } from "@/lib/cms/content";
import { mapServicesForHome } from "@/lib/cms/map-services";
import { HOME_SERVICES } from "@/lib/site-data";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";
import HomeClient from "./home-client";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSettings();
  return pageMetadata({
    title: settings.seoDefaults.title || `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      settings.seoDefaults.description ||
      "Book private Feng Shui consultations with Marites Allen — BaZi destiny readings, home & business audits, Destara AI, 2026 Fire Horse forecasts, and Frigga Charmed Life charms.",
    path: "/",
    ogTitle: settings.seoDefaults.title || `${SITE_NAME} | ${SITE_TAGLINE}`,
    ogDescription:
      settings.seoDefaults.description ||
      "Transform your luck, home and destiny with authentic Feng Shui guidance from the Philippines' Feng Shui Queen.",
    image: settings.seoDefaults.ogImage || undefined
  });
}

export default async function HomePage() {
  const [faqs, testimonials, sections, pageCopy, services, pricing] = await Promise.all([
    getCachedFaqs(),
    getCachedTestimonials(),
    getCachedHome(),
    getCachedPageCopy(),
    getCachedServices(),
    getCachedPricing()
  ]);
  const heroSection = sections.find((s) => s.blockType === "hero" && s.enabled);
  const statsSection = sections.find((s) => s.blockType === "stats" && s.enabled);
  const servicesSection = sections.find((s) => s.blockType === "services" && s.enabled);
  const closingSection = sections.find((s) => s.blockType === "closing" && s.enabled);
  const jsonItems = (servicesSection?.payload.items as typeof HOME_SERVICES | undefined) || HOME_SERVICES;
  const items = servicesSection ? mapServicesForHome(services, pricing, jsonItems) : [];
  const heroPayload = (heroSection?.payload || {}) as Record<string, string>;

  return (
    <>
      <JsonLd
        data={faqJsonLd(faqs.map((f) => ({ q: f.question, a: f.answer })))}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" }
        ])}
      />
      <HomeClient
        faqs={faqs.map((f) => ({ q: f.question, a: f.answer }))}
        services={items}
        testimonials={testimonials}
        hero={{
          heading: heroPayload.heading || "Transform your luck, home & destiny",
          subheading: heroPayload.subheading || "",
          highlight: heroPayload.highlight,
          ctaLabel: heroPayload.ctaLabel || "Book Consultation · Coming Soon →",
          ctaHref: heroPayload.ctaHref || "/book",
          chartCtaLabel: heroPayload.chartCtaLabel || "Free Destiny Chart",
          rating: heroPayload.rating || "4.9 · 1,200+ verified reviews",
          imageUrl: heroPayload.imageUrl || "/images/zip/marites-1.webp",
          imageAlt: heroPayload.imageAlt || "Marites Allen, Feng Shui Master"
        }}
        stats={(statsSection?.payload.items as Array<{ value: string; label: string }>) || undefined}
        closing={
          closingSection
            ? {
                heading: String(closingSection.payload.heading || ""),
                body: String(closingSection.payload.body || ""),
                ctaLabel: String(closingSection.payload.ctaLabel || ""),
                ctaHref: String(closingSection.payload.ctaHref || "/book")
              }
            : undefined
        }
        extras={pageCopy.home}
        showServices={Boolean(servicesSection)}
      />
    </>
  );
}
