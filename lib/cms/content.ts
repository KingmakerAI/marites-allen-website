import { unstable_cache } from "next/cache";
import { CMS_TAGS, getPageCopy, getPageBySlug, listEvents, listFaqs, listHomeSections, listNavigation, listPages, listPricing, listServices, listTestimonials, publishedArticles, getSettings } from "./repo";
import { ensureSeeded } from "./seed";
import type { SiteSettings } from "./types";
import { FAQ_DATA, FRIGGA_SOCIAL_LINKS, SOCIAL_LINKS } from "../site-data";
import { isReservedPageSlug } from "./reserved-slugs";

async function withSeed<T>(fn: () => T | Promise<T>) {
  await ensureSeeded();
  return await fn();
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
  business: { bookingUrl: "/book", currency: "USD", comingSoonLabel: "Book Consultation", bookCtaLabel: "Book Consultation" }
});

export const getCachedSettings = unstable_cache(
  async () => withSeed(async () => (await getSettings()) || fallbackSettings()),
  ["cms-settings"],
  { revalidate: 300, tags: [CMS_TAGS.settings] }
);

export const getCachedNav = unstable_cache(
  async () => withSeed(async () => (await listNavigation()).filter((n) => n.enabled)),
  ["cms-nav"],
  { revalidate: 300, tags: [CMS_TAGS.nav] }
);

export const getCachedArticles = unstable_cache(
  async () => withSeed(() => publishedArticles()),
  ["cms-articles"],
  { revalidate: 300, tags: [CMS_TAGS.articles] }
);

export const getCachedEvents = unstable_cache(
  async () => withSeed(() => listEvents(true)),
  ["cms-events"],
  { revalidate: 300, tags: [CMS_TAGS.events] }
);

export const getCachedServices = unstable_cache(
  async () => withSeed(async () => (await listServices()).filter((s) => s.active)),
  ["cms-services"],
  { revalidate: 300, tags: [CMS_TAGS.services] }
);

export const getCachedPricing = unstable_cache(
  async () => withSeed(async () => (await listPricing()).filter((p) => p.active)),
  ["cms-pricing"],
  { revalidate: 300, tags: [CMS_TAGS.services] }
);

export const getCachedTestimonials = unstable_cache(
  async () =>
    withSeed(async () => {
      return (await listTestimonials()).filter((t) => t.featured && t.consentOnFile);
    }),
  ["cms-testimonials"],
  { revalidate: 300, tags: [CMS_TAGS.home] }
);

export const getCachedFaqs = unstable_cache(
  async () =>
    withSeed(async () => {
      const rows = (await listFaqs()).filter((f) => f.showOnHome);
      return rows.length
        ? rows
        : FAQ_DATA.map((f, i) => ({ id: `faq-${i}`, question: f.q, answer: f.a, showOnHome: true, sortOrder: i }));
    }),
  ["cms-faqs"],
  { revalidate: 300, tags: [CMS_TAGS.home] }
);

export const getCachedHome = unstable_cache(
  async () => withSeed(async () => (await listHomeSections()).filter((s) => s.enabled)),
  ["cms-home"],
  { revalidate: 300, tags: [CMS_TAGS.home] }
);

export const getCachedPageCopy = unstable_cache(
  async () => withSeed(() => getPageCopy()),
  ["cms-page-copy"],
  { revalidate: 300, tags: [CMS_TAGS.pageCopy] }
);

export const getCachedPublishedPages = unstable_cache(
  async () =>
    withSeed(async () =>
      (await listPages()).filter((p) => p.status === "published" && !isReservedPageSlug(p.slug))
    ),
  ["cms-pages"],
  { revalidate: 300, tags: [CMS_TAGS.pages] }
);

export const getCachedPageBySlug = (slug: string) =>
  unstable_cache(
    async () => withSeed(() => getPageBySlug(slug, true)),
    ["cms-page", slug],
    { revalidate: 300, tags: [CMS_TAGS.pages] }
  )();
