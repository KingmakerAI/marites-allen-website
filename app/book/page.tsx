import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import BookClient from "./book-client";

export const metadata: Metadata = pageMetadata({
  title: "Book a Feng Shui Consultation",
  description:
    "Reserve a one-on-one consultation with Marites Allen. Choose Personal Destiny Reading, Home/Office Feng Shui, or Business Strategy — online worldwide or in Manila.",
  path: "/book",
  keywords: [
    "book Feng Shui consultation",
    "BaZi reading appointment",
    "Marites Allen booking",
    "online Feng Shui session"
  ]
});

export default function BookPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Book Consultation", path: "/book" }
        ])}
      />
      <BookClient />
    </>
  );
}
