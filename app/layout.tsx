import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://maritesallen.com"),
  title: {
    default: "Marites Allen | Global Feng Shui Master",
    template: "%s | Marites Allen"
  },
  description:
    "Authentic Feng Shui consultations, BaZi readings, destiny analysis, books, events, and Destara AI guidance by internationally recognized Feng Shui Master Marites Allen.",
  openGraph: {
    title: "Marites Allen | Global Feng Shui Master",
    description:
      "Transform your life, home, and business through authentic Feng Shui and modern AI-powered guidance.",
    url: "https://maritesallen.com",
    siteName: "Marites Allen",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Marites Allen | Global Feng Shui Master",
    description:
      "Luxury Feng Shui guidance for individuals, families, and businesses worldwide."
  },
  alternates: {
    canonical: "/"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marites Allen",
  jobTitle: "Feng Shui Master, Author, Speaker",
  url: "https://maritesallen.com",
  sameAs: [
    "https://www.instagram.com/",
    "https://www.facebook.com/",
    "https://www.youtube.com/"
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
