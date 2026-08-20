import type { Metadata, Viewport } from "next";
import { CmsProvider } from "@/components/cms-provider";
import { JsonLd } from "@/components/json-ld";
import { VisitBeacon } from "@/components/visit-beacon";
import { getCachedNav, getCachedPageCopy, getCachedSettings } from "@/lib/cms/content";
import {
  DEFAULT_OG_IMAGE,
  personJsonLd,
  professionalServiceJsonLd,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  websiteJsonLd
} from "@/lib/seo";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#143d31",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light"
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSettings();
  const title = settings.seoDefaults.title || `${SITE_NAME} | ${SITE_TAGLINE}`;
  const description =
    settings.seoDefaults.description ||
    "Book private Feng Shui consultations with Marites Allen — BaZi destiny readings, home & business audits, Destara AI, 2026 Fire Horse forecasts, and Frigga Charmed Life charms.";
  const ogImage = settings.seoDefaults.ogImage || DEFAULT_OG_IMAGE;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`
    },
    description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Lifestyle",
    keywords: SITE_KEYWORDS,
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: "en_PH",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${SITE_TAGLINE}`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/images/brand/icon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon", sizes: "192x192", type: "image/png" },
        { url: "/images/brand/icon-512.png", sizes: "512x512", type: "image/png" }
      ],
      apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
      shortcut: "/images/brand/icon-32.png"
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, nav, pageCopy] = await Promise.all([getCachedSettings(), getCachedNav(), getCachedPageCopy()]);
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <JsonLd data={personJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={professionalServiceJsonLd()} />
        <CmsProvider settings={settings} nav={nav} forecastYears={pageCopy.forecast.navYears}>
          <VisitBeacon />
          {children}
        </CmsProvider>
      </body>
    </html>
  );
}
