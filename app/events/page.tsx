import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata, SITE_URL } from "@/lib/seo";
import EventsClient from "./events-client";

export const metadata: Metadata = pageMetadata({
  title: "Events & Speaking",
  description:
    "Upcoming Marites Allen events — Ghost Month Facebook Live, exclusive meet & greet cleansing rituals, Chinese New Year countdown, and corporate speaking engagements.",
  path: "/events",
  keywords: ["Marites Allen events", "Ghost Month live", "Feng Shui speaking", "meet and greet Makati"]
});

const eventsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Event",
      name: "Exclusive In Person Meet & Greet — Catch Up & Cleansing Ritual",
      description:
        "Be ready for Ghost Month with Marites Allen. Protection today brings peace, luck and clarity tomorrow. Strictly for confirmed attendees only.",
      startDate: "2026-08-08T14:00:00+08:00",
      endDate: "2026-08-08T17:00:00+08:00",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: "Acceler8 Rockwell",
        address: {
          "@type": "PostalAddress",
          streetAddress: "5th Floor, Phinma Plaza, 39 Plaza Drive, Rockwell Center",
          addressLocality: "Makati City",
          addressCountry: "PH"
        }
      },
      organizer: {
        "@type": "Person",
        name: "Marites Allen",
        url: SITE_URL
      },
      image: [`${SITE_URL}/images/events/meet-greet-cleansing-ritual.png`],
      url: `${SITE_URL}/events`
    },
    {
      "@type": "Event",
      name: "Ghost Month 2026: Tips, Insights & Reminders",
      description:
        "Join Marites Allen for common sense, tradition, and Feng Shui guidance for a safe, harmonious and prosperous Ghost Month season.",
      startDate: "2026-08-01T15:00:00+08:00",
      endDate: "2026-08-01T17:00:00+08:00",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "VirtualLocation",
        url: "https://www.facebook.com/MaritesAllen168/"
      },
      organizer: {
        "@type": "Person",
        name: "Marites Allen",
        url: SITE_URL
      },
      image: [`${SITE_URL}/images/events/ghost-month-2026-live.png`],
      url: `${SITE_URL}/events`
    }
  ]
};

export default function EventsPage() {
  return (
    <>
      <JsonLd data={eventsJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" }
        ])}
      />
      <EventsClient />
    </>
  );
}
