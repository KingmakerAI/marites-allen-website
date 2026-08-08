import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import BookingExperienceClient from "./booking-experience-client";

export const metadata: Metadata = pageMetadata({
  title: "Booking Experience",
  description:
    "See how booking a Marites Allen consultation works — transparent steps, scheduling, and a refined client experience from inquiry to confirmation.",
  path: "/booking-experience",
  keywords: ["consultation booking flow", "Feng Shui appointment experience"]
});

export default function BookingExperiencePage() {
  return <BookingExperienceClient />;
}
