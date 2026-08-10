import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Booking Experience — Coming Soon",
  description:
    "Online booking for Marites Allen consultations is coming soon. Visit the Book page for enquire options.",
  path: "/booking-experience",
  noIndex: true
});

export default function BookingExperiencePage() {
  redirect("/book");
}
