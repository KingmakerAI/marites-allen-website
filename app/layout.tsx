import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://maritesallen.com"),
  title: {
    default: "Marites Allen | The Feng Shui Queen",
    template: "%s | Marites Allen"
  },
  description:
    "Private Feng Shui consultations, BaZi destiny readings, Destara AI, annual forecasts, and Frigga charms with internationally recognized Master Marites Allen.",
  openGraph: {
    title: "Marites Allen | The Feng Shui Queen",
    description:
      "Transform your luck, home and destiny with authentic Feng Shui guidance.",
    url: "https://maritesallen.com",
    siteName: "Marites Allen",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Marites Allen | The Feng Shui Queen",
    description:
      "Private consultations, Destara AI, and annual forecasts from the Feng Shui Queen."
  },
  alternates: {
    canonical: "/"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marites Allen",
  alternateName: "The Feng Shui Queen",
  jobTitle: "Feng Shui Master, Author, Speaker",
  url: "https://maritesallen.com",
  sameAs: [
    "https://www.facebook.com/MaritesAllen168/",
    "https://www.instagram.com/maritesallen/",
    "https://www.youtube.com/channel/UCDrwKncdOeMKG3dt6vk2QLg"
  ],
  knowsAbout: [
    "Feng Shui",
    "BaZi",
    "Destiny Analysis",
    "Auspicious Date Selection",
    "Business Feng Shui"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
