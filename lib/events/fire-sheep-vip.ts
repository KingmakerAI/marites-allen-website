import type { CmsEvent } from "@/lib/cms/types";

/** 27 November 2026, 2:00 PM Asia/Manila. The invite stops after this instant. */
export const FIRE_SHEEP_VIP_ENDS_AT = "2026-11-27T14:00:00+08:00";

export const FIRE_SHEEP_POPUP_STORAGE_KEY = "ma-fire-sheep-vip-popup-day";

export const FIRE_SHEEP_VIP_COPY = {
  hostLine: "Marites Allen invites you. Presented by Manila House.",
  dateLabel: "Friday, 27 November 2026",
  timeLabel: "11:00 AM to 2:00 PM",
  placeLabel: "Manila House, BGC",
  venueLabel: "Manila House, BGC (Bonifacio Global City, Taguig)",
  attire: "Smart casual in shades of red, orange or yellow, with gold accessories",
  line: "Start the new year with the right intentions. See you there!",
  brands: "Marites Allen, FRIGGA, DESTARA"
} as const;

export const FIRE_SHEEP_VIP_MEDIA = {
  webp: "/events/fire-sheep-vip-preview-2026.webp",
  jpg: "/events/fire-sheep-vip-preview-2026.jpg",
  width: 1122,
  height: 1402,
  alt: "Invitation for Marites Allen's exclusive VIP preview of 2027, the Year of the Fire Sheep, presented by Manila House. Friday, 27 November 2026, 11:00 AM to 2:00 PM at Manila House, BGC. Attire is smart casual in shades of red, orange or yellow, with gold accessories."
} as const;

export const FIRE_SHEEP_VIP_EVENT: CmsEvent = {
  id: "fire-sheep-vip-preview-2026",
  title: "Exclusive VIP Preview of 2027: The Year of the Fire Sheep",
  slug: "fire-sheep-vip-preview-2026",
  eyebrow: "Invitation-only",
  summary: `${FIRE_SHEEP_VIP_COPY.hostLine} Invitation-only VIP event. Attire: ${FIRE_SHEEP_VIP_COPY.attire}. Brands: ${FIRE_SHEEP_VIP_COPY.brands}.`,
  whenLabel: `${FIRE_SHEEP_VIP_COPY.dateLabel}, ${FIRE_SHEEP_VIP_COPY.timeLabel}`,
  whereLabel: FIRE_SHEEP_VIP_COPY.venueLabel,
  startsAt: "2026-11-27T11:00:00+08:00",
  endsAt: FIRE_SHEEP_VIP_ENDS_AT,
  venue: FIRE_SHEEP_VIP_COPY.venueLabel,
  liveUrl: "",
  ctaHref: "/book",
  ctaLabel: "Enquire",
  imageUrl: FIRE_SHEEP_VIP_MEDIA.webp,
  tagline: FIRE_SHEEP_VIP_COPY.line,
  status: "published",
  sortOrder: 0
};

export function fireSheepVipHasEnded(now = Date.now()) {
  return now >= Date.parse(FIRE_SHEEP_VIP_ENDS_AT);
}

export function manilaCalendarDay(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);
}

/** Public pages only. Admin (including /adminportal) and /media are skipped. */
export function fireSheepPopupAllowed(pathname: string, now = Date.now()) {
  if (!pathname.startsWith("/")) return false;
  if (fireSheepVipHasEnded(now)) return false;
  if (pathname === "/media" || pathname.startsWith("/media/")) return false;
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/adminportal")) return false;
  return true;
}

/**
 * Adds the VIP preview when the CMS has no matching row.
 * An existing Blob event with the same id or slug is returned unchanged.
 */
export function mergeCodeEvents(events: CmsEvent[]) {
  const present = events.some(
    (event) => event.id === FIRE_SHEEP_VIP_EVENT.id || event.slug === FIRE_SHEEP_VIP_EVENT.slug
  );
  if (present) return events;
  return [FIRE_SHEEP_VIP_EVENT, ...events];
}
