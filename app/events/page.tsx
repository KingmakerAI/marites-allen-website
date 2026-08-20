import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { getCachedEvents, getCachedPageCopy } from "@/lib/cms/content";
import { parseTalkLines, parseVideoLines } from "@/lib/cms/copy-lines";
import { breadcrumbJsonLd, pageMetadata, SITE_URL } from "@/lib/seo";
import EventsClient from "./events-client";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getCachedPageCopy();
  return pageMetadata({
    title: copy.eventsPage.seoTitle,
    description: copy.eventsPage.seoDescription,
    path: "/events",
    keywords: ["Marites Allen events", "Ghost Month live", "Feng Shui speaking", "meet and greet Makati"]
  });
}

export default async function EventsPage() {
  const [events, pageCopy] = await Promise.all([getCachedEvents(), getCachedPageCopy()]);
  const copy = pageCopy.eventsPage;
  const featuredEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    eyebrow: event.eyebrow,
    summary: event.summary,
    whenLabel: event.whenLabel,
    whereLabel: event.whereLabel,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    image: event.imageUrl,
    imageWidth: 1600,
    imageHeight: 900,
    ctaHref: event.ctaHref,
    ctaLabel: event.ctaLabel,
    liveHref: event.liveUrl || undefined,
    liveLabel: event.liveUrl ? "Watch live" : undefined,
    tagline: event.tagline
  }));

  const eventsJsonLd = {
    "@context": "https://schema.org",
    "@graph": events.map((event) => ({
      "@type": "Event",
      name: event.title,
      description: event.summary,
      startDate: event.startsAt,
      endDate: event.endsAt,
      eventAttendanceMode: event.liveUrl
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: event.liveUrl
        ? { "@type": "VirtualLocation", url: event.liveUrl }
        : { "@type": "Place", name: event.venue || event.whereLabel },
      organizer: { "@type": "Person", name: "Marites Allen", url: SITE_URL },
      image: event.imageUrl ? [`${SITE_URL}${event.imageUrl}`] : undefined,
      url: `${SITE_URL}/events`
    }))
  };

  return (
    <>
      <JsonLd data={eventsJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" }
        ])}
      />
      <EventsClient
        featuredEvents={featuredEvents}
        kicker={copy.kicker}
        title={copy.title}
        intro={copy.intro}
        speakingHeading={copy.speakingHeading}
        speaking={parseTalkLines(copy.speakingLines)}
        videosHeading={copy.videosHeading}
        videos={parseVideoLines(copy.videos)}
      />
    </>
  );
}
