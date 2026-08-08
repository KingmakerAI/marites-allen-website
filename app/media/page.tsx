import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import MediaClient from "./media-client";

export const metadata: Metadata = pageMetadata({
  title: "Media & Press",
  description:
    "Press coverage, TV interviews, and media features featuring Marites Allen — Forbes, Tatler, ANC, ABS-CBN, Manila Bulletin, and more. Download the press kit.",
  path: "/media",
  keywords: [
    "Marites Allen press",
    "Feng Shui Queen interview",
    "media kit",
    "TV guesting Feng Shui"
  ]
});

export default function MediaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Media", path: "/media" }
        ])}
      />
      <MediaClient />
    </>
  );
}
