import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Booking Experience",
  description:
    "Consultation enquiry for Marites Allen. Visit the Book page to send your details — payment is arranged offline.",
  path: "/booking-experience",
  noIndex: true
});

export default function BookingExperiencePage() {
  redirect("/book");
}
