export const RESERVED_PAGE_SLUGS = new Set([
  "about",
  "admin",
  "api",
  "apple-icon",
  "articles",
  "book",
  "booking-experience",
  "destara",
  "events",
  "favicon.ico",
  "forecast",
  "frigga",
  "home",
  "icon",
  "media",
  "opengraph-image",
  "projects",
  "robots.txt",
  "signup",
  "sitemap.xml"
]);

export function isReservedPageSlug(slug: string) {
  return RESERVED_PAGE_SLUGS.has(slug.trim().toLowerCase());
}
