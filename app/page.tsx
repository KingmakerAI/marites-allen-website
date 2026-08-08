import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";
import HomeClient from "./home-client";

export const metadata: Metadata = pageMetadata({
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description:
    "Book private Feng Shui consultations with Marites Allen — BaZi destiny readings, home & business audits, Destara AI, 2026 Fire Horse forecasts, and Frigga Charmed Life charms.",
  path: "/",
  ogTitle: `${SITE_NAME} | ${SITE_TAGLINE}`,
  ogDescription:
    "Transform your luck, home and destiny with authentic Feng Shui guidance from the Philippines' Feng Shui Queen."
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" }
        ])}
      />
      <HomeClient />
    </>
  );
}
