import { unstable_cache } from "next/cache";
import { CMS_TAGS, getPageCopy, getPageBySlug, listEvents, listFaqs, listHomeSections, listNavigation, listPages, listPricing, listServices, listTestimonials, publishedArticles, getSettings } from "./repo";
import { ensureSeeded } from "./seed";
import type { SiteSettings } from "./types";
import { FAQ_DATA, FRIGGA_SOCIAL_LINKS, SOCIAL_LINKS, TESTIMONIALS } from "../site-data";
import { isReservedPageSlug } from "./reserved-slugs";

function withSeed<T>(fn: () => T) {
  ensureSeeded();
  return fn();
}

const fallbackSettings = (): SiteSettings => ({
  general: { siteName: "Marites Allen", tagline: "The Feng Shui Queen", logoUrl: "/images/brand/marites-allen-logo.png" },
  contact: {
    email: "sales@frigga.co.uk",
    emailSecondary: "connect@frigga.co.uk",
    phone: "+63 920 950 9390",
    phoneSecondary: "+63 939 351 6424",
    whatsapp: "639209509390"
  },
  social: SOCIAL_LINKS.map((s) => ({ id: s.id, label: s.label, handle: s.handle, href: s.href })),
  friggaSocial: FRIGGA_SOCIAL_LINKS.map((s) => ({ id: s.id, label: s.label, handle: s.handle, href: s.href })),
  seoDefaults: {
    title: "Marites Allen | The Feng Shui Queen",
    description: "Private Feng Shui consultations with Marites Allen.",
    ogImage: "/opengraph-image"
  },
  business: { bookingUrl: "/book", currency: "USD", comingSoonLabel: "Coming Soon", bookCtaLabel: "Book Consultation · Coming Soon →" }
});

export const getCachedSettings = unstable_cache(
  async () => withSeed(() => getSettings() || fallbackSettings()),
  ["cms-settings"],
  { tags: [CMS_TAGS.settings] }
);

export const getCachedNav = unstable_cache(
  async () => withSeed(() => listNavigation().filter((n) => n.enabled)),
  ["cms-nav"],
  { tags: [CMS_TAGS.nav] }
);

export const getCachedArticles = unstable_cache(
  async () => withSeed(() => publishedArticles()),
  ["cms-articles"],
  { tags: [CMS_TAGS.articles] }
);

export const getCachedEvents = unstable_cache(
  async () => withSeed(() => listEvents(true)),
  ["cms-events"],
  { tags: [CMS_TAGS.events] }
);

export const getCachedServices = unstable_cache(
  async () => withSeed(() => listServices().filter((s) => s.active)),
  ["cms-services"],
  { tags: [CMS_TAGS.services] }
);

export const getCachedPricing = unstable_cache(
  async () => withSeed(() => listPricing().filter((p) => p.active)),
  ["cms-pricing"],
  { tags: [CMS_TAGS.services] }
);

export const getCachedTestimonials = unstable_cache(
  async () =>
    withSeed(() => {
      const rows = listTestimonials().filter((t) => t.featured);
      return rows.length ? rows : TESTIMONIALS.map((t, i) => ({ ...t, id: `t-${i}`, featured: true, sortOrder: i }));
    }),
  ["cms-testimonials"],
  { tags: [CMS_TAGS.home] }
);

export const getCachedFaqs = unstable_cache(
  async () =>
    withSeed(() => {
      const rows = listFaqs().filter((f) => f.showOnHome);
      return rows.length
        ? rows
        : FAQ_DATA.map((f, i) => ({ id: `faq-${i}`, question: f.q, answer: f.a, showOnHome: true, sortOrder: i }));
    }),
  ["cms-faqs"],
  { tags: [CMS_TAGS.home] }
);

export const getCachedHome = unstable_cache(
  async () => withSeed(() => listHomeSections().filter((s) => s.enabled)),
  ["cms-home"],
  { tags: [CMS_TAGS.home] }
);

export const getCachedPageCopy = unstable_cache(
  async () => withSeed(() => getPageCopy()),
  ["cms-page-copy"],
  { tags: [CMS_TAGS.pageCopy] }
);

export const getCachedPublishedPages = unstable_cache(
  async () =>
    withSeed(() =>
      listPages().filter((p) => p.status === "published" && !isReservedPageSlug(p.slug))
    ),
  ["cms-pages"],
  { tags: [CMS_TAGS.pages] }
);

export const getCachedPageBySlug = (slug: string) =>
  unstable_cache(
    async () => withSeed(() => getPageBySlug(slug, true)),
    ["cms-page", slug],
    { tags: [CMS_TAGS.pages] }
  )();
