import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/json-ld";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`
  },
  description:
    "Book private Feng Shui consultations with Marites Allen — BaZi destiny readings, home & business audits, Destara AI, 2026 Fire Horse forecasts, and Frigga Charmed Life charms.",
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
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      "Transform your luck, home and destiny with authentic Feng Shui guidance from the Philippines' Feng Shui Queen.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_PH",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      "Private consultations, Destara AI, and annual forecasts from the Feng Shui Queen.",
    images: [DEFAULT_OG_IMAGE]
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
    icon: [{ url: "/icon" }],
    apple: [{ url: "/apple-icon" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={personJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={professionalServiceJsonLd()} />
        {children}
      </body>
    </html>
  );
}
