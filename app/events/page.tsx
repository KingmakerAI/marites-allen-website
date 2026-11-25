import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { getCachedEvents, getCachedPageCopy } from "@/lib/cms/content";
import { parseTalkLines, parseVideoLines } from "@/lib/cms/copy-lines";
import { FIRE_SHEEP_VIP_EVENT, FIRE_SHEEP_VIP_MEDIA } from "@/lib/events/fire-sheep-vip";
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

function eventEnded(endsAt: string, startsAt: string) {
  const end = new Date(endsAt || startsAt).getTime();
  const fallback = Number.isFinite(end) ? end : new Date(startsAt).getTime() + 3 * 60 * 60 * 1000;
  return Date.now() >= fallback;
}

export default async function EventsPage() {
  const [events, pageCopy] = await Promise.all([getCachedEvents(), getCachedPageCopy()]);
  const copy = pageCopy.eventsPage;
  const upcoming = events.filter((event) => !eventEnded(event.endsAt, event.startsAt));
  // Past events stay in the CMS but are not listed on the public page.
  const featuredEvents = upcoming.map((event) => {
    const portrait = event.id === FIRE_SHEEP_VIP_EVENT.id;
    return {
      id: event.id,
      slug: event.slug,
      title: event.title,
      eyebrow: event.eyebrow,
      summary: event.summary,
      whenLabel: event.whenLabel,
      whereLabel: event.whereLabel,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      image: event.imageUrl,
      imageWidth: portrait ? FIRE_SHEEP_VIP_MEDIA.width : 1600,
      imageHeight: portrait ? FIRE_SHEEP_VIP_MEDIA.height : 900,
      imageAlt: portrait ? FIRE_SHEEP_VIP_MEDIA.alt : event.title,
      imageFit: portrait ? ("contain" as const) : ("cover" as const),
      ctaHref: event.ctaHref,
      ctaLabel: event.ctaLabel,
      liveHref: event.liveUrl || undefined,
      liveLabel: event.liveUrl ? "Watch live" : undefined,
      tagline: event.tagline,
      ended: false
    };
  });
  const eventsJsonLd = {
    "@context": "https://schema.org",
    "@graph": upcoming.map((event) => ({
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
      url: `${SITE_URL}/events#${event.slug}`
    }))
  };

  return (
    <>
      {upcoming.length > 0 ? <JsonLd data={eventsJsonLd} /> : null}
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
