export const RESERVED_PAGE_SLUGS = new Set([
  "about",
  "admin",
  "adminportal",
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
  "privacy",
  "projects",
  "robots.txt",
  "signup",
  "sitemap.xml",
  "terms",
  "cookies"
]);

export function isReservedPageSlug(slug: string) {
  return RESERVED_PAGE_SLUGS.has(slug.trim().toLowerCase());
}
