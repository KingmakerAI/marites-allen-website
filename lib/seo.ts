import type { Metadata } from "next";
import { FAQ_DATA, SOCIAL_LINKS } from "@/lib/site-data";

export const SITE_URL = "https://maritesallen.com";
export const SITE_NAME = "Marites Allen";
export const SITE_TAGLINE = "The Feng Shui Queen";
export const DEFAULT_OG_IMAGE = "/opengraph-image";
export const PERSON_IMAGE = "/images/zip/marites-1.webp";
export const BRAND_ICON = "/images/brand/icon-512.png";
export const BRAND_LOGO = "/images/brand/marites-allen-logo.png";
export const BRAND_MARK = "/images/brand/marites-allen-mark.png";

export const SITE_KEYWORDS = [
  "Marites Allen",
  "Feng Shui Queen",
  "Feng Shui Philippines",
  "Feng Shui consultation",
  "BaZi destiny reading",
  "Chinese astrology",
  "annual Feng Shui forecast",
  "Fire Horse 2026",
  "Ghost Month Feng Shui",
  "Destara AI",
  "Frigga Charmed Life",
  "home Feng Shui",
  "business Feng Shui",
  "Manila Feng Shui master",
  "online Feng Shui consultation"
];

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
  image?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
  ogTitle,
  ogDescription,
  noIndex = false,
  type = "website",
  image = DEFAULT_OG_IMAGE
}: PageSeoInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const fullTitle = title.includes(SITE_NAME) ? title : undefined;

  return {
    title: fullTitle ? { absolute: fullTitle } : title,
    description,
    keywords: [...SITE_KEYWORDS, ...keywords],
    alternates: {
      canonical: path
    },
    openGraph: {
      title: ogTitle || (fullTitle ? fullTitle : `${title} | ${SITE_NAME}`),
      description: ogDescription || description,
      url,
      siteName: SITE_NAME,
      type,
      locale: "en_PH",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${SITE_TAGLINE}`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle || (fullTitle ? fullTitle : `${title} | ${SITE_NAME}`),
      description: ogDescription || description,
      images: [image]
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
          }
        }
  };
}

export const PERSON_SAME_AS = [
  ...SOCIAL_LINKS.map((s) => s.href),
  "https://destara.app",
  "https://www.frigga.com.ph",
  "https://www.frigga.co.uk",
  "https://www.frigga-usa.com"
];

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Marites Allen",
    alternateName: ["The Feng Shui Queen", "Feng Shui Queen"],
    jobTitle: "Feng Shui Master, Author, Speaker",
    description:
      "Internationally recognized Feng Shui master offering private consultations, BaZi destiny readings, annual forecasts, and Destara AI guidance.",
    url: SITE_URL,
    image: `${SITE_URL}${PERSON_IMAGE}`,
    sameAs: PERSON_SAME_AS,
    knowsAbout: [
      "Feng Shui",
      "BaZi",
      "Chinese Astrology",
      "Destiny Analysis",
      "Auspicious Date Selection",
      "Business Feng Shui",
      "Home Feng Shui"
    ],
    nationality: "Filipino",
    worksFor: {
      "@type": "Organization",
      name: "Frigga Charmed Life",
      url: "https://www.frigga.com.ph"
    }
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: SITE_URL,
    description:
      "Official website of Marites Allen — book Feng Shui consultations, explore Destara AI, annual forecasts, events, and Frigga Charmed Life.",
    image: `${SITE_URL}${BRAND_ICON}`,
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en"
  };
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: "Marites Allen Feng Shui Consultations",
    image: `${SITE_URL}${PERSON_IMAGE}`,
    logo: `${SITE_URL}${BRAND_LOGO}`,
    url: `${SITE_URL}/book`,
    description:
      "One-on-one Feng Shui and BaZi destiny consultations with Marites Allen, online worldwide and in person in Metro Manila.",
    provider: { "@id": `${SITE_URL}/#person` },
    areaServed: ["PH", "GB", "US", "Worldwide"],
    serviceType: [
      "Personal Destiny Reading",
      "Home Feng Shui Consultation",
      "Office Feng Shui Consultation",
      "Business Strategy Consultation"
    ],
    availableLanguage: ["English", "Filipino"],
    priceRange: "$$",
    telephone: "+639209509390",
    email: "sales@frigga.co.uk",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Taguig",
      addressRegion: "Metro Manila",
      addressCountry: "PH"
    }
  };
}

export function faqJsonLd(items = FAQ_DATA) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? SITE_URL : `${SITE_URL}${item.path}`
    }))
  };
}

export const PUBLIC_ROUTES = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/book", changeFrequency: "weekly" as const, priority: 0.95 },
  { path: "/booking-experience", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/destara", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/events", changeFrequency: "weekly" as const, priority: 0.85 },
  { path: "/forecast", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/frigga", changeFrequency: "weekly" as const, priority: 0.85 },
  { path: "/media", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/projects", changeFrequency: "monthly" as const, priority: 0.7 }
];
