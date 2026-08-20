import "server-only";
import {
  BOOK_CATEGORIES,
  BOOK_SERVICES,
  EXP_SERVICES
} from "../booking-data";
import {
  FAQ_DATA,
  FRIGGA_SOCIAL_LINKS,
  HOME_SERVICES,
  SOCIAL_LINKS,
  TESTIMONIALS
} from "../site-data";
import { hashPassword, newId, nowIso, slugify } from "./crypto";
import { mergePageCopy } from "./page-copy-defaults";
import { mutateStore, mutateStoreIfChanged, readStore } from "./store";
import { ensureOwnerAccounts } from "./auth";
import type { Article, CmsEvent, CmsPage, SiteSettings } from "./types";

const PRESS: Array<Pick<Article, "outlet" | "excerpt" | "ctaLabel" | "externalUrl" | "year" | "month">> = [
  { year: 2026, month: 2, outlet: "Manila Times", excerpt: "Destara AI: a long-planned Destiny App bridging ancient wisdom and modern technology.", ctaLabel: "Read article", externalUrl: "https://www.manilatimes.net" },
  { year: 2026, month: 1, outlet: "Manila Bulletin", excerpt: "Discover your luck: the Feng Shui Queen's 2026 animal sign forecast.", ctaLabel: "Read article", externalUrl: "https://mb.com.ph/2026/01/28/romance-and-opportunity-in-2026-feng-shui-insights-from-marites-allen" },
  { year: 2026, month: 1, outlet: "Marites Allen Live", excerpt: "What the Fire Horse 2026 will change in everyone's life.", ctaLabel: "Watch", externalUrl: "https://maritesallen.com/marites-allen-show/" },
  { year: 2025, month: 12, outlet: "Marites Allen Live", excerpt: "Preparing for 2026: what the Fire Horse brings.", ctaLabel: "Watch", externalUrl: "https://maritesallen.com/marites-allen-show/" },
  { year: 2025, month: 10, outlet: "Marites Allen (blog)", excerpt: "Mark your calendars: the Supermoon season of 2025.", ctaLabel: "Read post", externalUrl: "https://maritesallen.com/presss/mark-your-calendars-the-supermoon-season-of-2025/" },
  { year: 2025, month: 2, outlet: "Daily Tribune", excerpt: "How to make the most of the new lunar year.", ctaLabel: "Read article", externalUrl: "https://maritesallen.com/presss/how-to-make-the-most-of-new-lunar-year/" },
  { year: 2025, month: 1, outlet: "Inquirer.net", excerpt: "Feng shui expert advises beauty queens to be 'like a snake' this Chinese New Year.", ctaLabel: "Read article", externalUrl: "https://maritesallen.com/presss/chinese-new-year-feng-shui-expert-advises-beauty-queens-to-be-like-a-snake/" },
  { year: 2025, month: 1, outlet: "NewsWatch Interviews", excerpt: "Feng Shui expert Marites Allen on the Year of the Wooden Snake.", ctaLabel: "Watch", externalUrl: "https://www.youtube.com/watch?v=r27QpjNfhfk" },
  { year: 2023, month: 12, outlet: "The Daily Tribune", excerpt: "How the feng shui expert lives life to the full.", ctaLabel: "Read feature", externalUrl: "https://tribune.net.ph/2023/12/17/marites-allenhow-the-feng-shui-expertlives-life-to-the-full" },
  { year: 2023, month: 1, outlet: "Boy Abunda · The Interviewer", excerpt: "Marites Allen, Philippine Feng Shui Queen.", ctaLabel: "Watch", externalUrl: "https://www.youtube.com/watch?v=mswSQ7Utz1s" },
  { year: 2022, month: 2, outlet: "Metro.Style", excerpt: "Metro chats with Marites Allen.", ctaLabel: "Read interview", externalUrl: "https://maritesallen.com" },
  { year: 2022, month: 1, outlet: "Tatler Asia", excerpt: "Filipina Feng Shui Master Marites Allen's guide to a harmonious home.", ctaLabel: "Read feature", externalUrl: "https://www.tatlerasia.com" },
  { year: 2021, month: 6, outlet: "Marites Allen", excerpt: "Journey to Feng Shui.", ctaLabel: "Watch", externalUrl: "https://www.youtube.com/watch?v=kfPKazF19jw" },
  { year: 2021, month: 3, outlet: "Absolutely Magazines", excerpt: "Everything you need to know about Feng Shui, from the expert.", ctaLabel: "Read interview", externalUrl: "https://maritesallen.com" },
  { year: 2020, month: 1, outlet: "ABS-CBN · The Bottomline", excerpt: "Predictions for each Chinese zodiac sign.", ctaLabel: "Watch", externalUrl: "https://www.youtube.com/watch?v=xfLMTQCr3og" },
  { year: 2017, month: 11, outlet: "Media Conference · Marco Polo", excerpt: "Why 2018 is a prosperous year.", ctaLabel: "Watch", externalUrl: "https://www.youtube.com/watch?v=4RPYGf1oY_4" }
];

const EVENTS: CmsEvent[] = [
  {
    id: "meet-greet-cleansing",
    title: "Exclusive In Person Meet & Greet — Catch Up & Cleansing Ritual",
    slug: "meet-greet-cleansing-ritual",
    eyebrow: "In person · Pre-booked",
    summary:
      "Be ready for Ghost Month. Protection today brings peace, luck and clarity tomorrow. Strictly for confirmed attendees only.",
    whenLabel: "Saturday, 8 August 2026 · 2:00–5:00 PM",
    whereLabel: "Acceler8 Rockwell, 5th Floor, Phinma Plaza, Rockwell Center, Makati",
    startsAt: "2026-08-08T14:00:00+08:00",
    endsAt: "2026-08-08T17:00:00+08:00",
    venue: "Acceler8 Rockwell",
    liveUrl: "",
    ctaHref: "https://wa.me/639209509390",
    ctaLabel: "Enquire on WhatsApp",
    imageUrl: "/images/events/meet-greet-cleansing-ritual.png",
    tagline: "Protect your space · Attract positive energy · Create harmony",
    status: "published",
    sortOrder: 1
  },
  {
    id: "ghost-month-live",
    title: "Ghost Month 2026: Tips, Insights & Reminders",
    slug: "ghost-month-2026-live",
    eyebrow: "Facebook Live",
    summary:
      "Join Marites Allen for common sense, tradition, and Feng Shui guidance for a safe, harmonious and prosperous season.",
    whenLabel: "Saturday, 1 August 2026 · 3:00 PM (PH Time)",
    whereLabel: "Facebook Live",
    startsAt: "2026-08-01T15:00:00+08:00",
    endsAt: "2026-08-01T17:00:00+08:00",
    venue: "Facebook Live",
    liveUrl: "https://www.facebook.com/MaritesAllen168/",
    ctaHref: "https://www.facebook.com/MaritesAllen168/",
    ctaLabel: "Watch on Facebook",
    imageUrl: "/images/events/ghost-month-2026-live.png",
    tagline: "Be informed. Be prepared. Be protected.",
    status: "published",
    sortOrder: 2
  }
];

const DEFAULT_PAGES: CmsPage[] = [];

const DEFAULT_SETTINGS: SiteSettings = {
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
    description:
      "Private Feng Shui consultations, BaZi destiny readings, Destara AI, annual forecasts, and Frigga charms.",
    ogImage: "/opengraph-image"
  },
  business: { bookingUrl: "/book", currency: "USD", comingSoonLabel: "Coming Soon", bookCtaLabel: "Book Consultation · Coming Soon →" }
};

const LIVE_HOME_SECTIONS = [
  {
    id: "home-hero",
    blockType: "hero",
    enabled: true,
    sortOrder: 1,
    payload: {
      heading: "Transform your luck, home & destiny",
      subheading:
        "Private consultations with the Philippines' Feng Shui Queen, the first Filipina Master in Feng Shui, who has advised business leaders and families from Manila to London.",
      highlight: "the Philippines' Feng Shui Queen",
      ctaLabel: "Book Consultation · Coming Soon →",
      ctaHref: "/book",
      chartCtaLabel: "Free Destiny Chart",
      rating: "4.9 · 1,200+ verified reviews",
      imageUrl: "/images/zip/marites-1.webp",
      imageAlt: "Marites Allen, Feng Shui Master"
    }
  },
  {
    id: "home-stats",
    blockType: "stats",
    enabled: true,
    sortOrder: 2,
    payload: {
      items: [
        { value: "30+", label: "Years" },
        { value: "100+", label: "Countries" },
        { value: "10K+", label: "Companies" },
        { value: "1M+", label: "Clients" }
      ]
    }
  },
  {
    id: "home-services",
    blockType: "services",
    enabled: true,
    sortOrder: 3,
    payload: { items: HOME_SERVICES }
  },
  {
    id: "home-closing",
    blockType: "closing",
    enabled: true,
    sortOrder: 4,
    payload: {
      heading: "Ready to align with your best year yet?",
      body: "Join over a million people who have turned to Marites Allen for clarity, prosperity and peace of mind.",
      ctaLabel: "Book Consultation · Coming Soon →",
      ctaHref: "/book"
    }
  }
];

function ensureLiveDefaults() {
  mutateStoreIfChanged((store) => {
    let changed = false;
    if (!store.homeSections) {
      store.homeSections = [];
      changed = true;
    }
    for (const section of LIVE_HOME_SECTIONS) {
      if (!store.homeSections.some((row) => row.id === section.id)) {
        store.homeSections.push(section);
        changed = true;
      }
    }
    if (store.settings) {
      if (!store.settings.business.comingSoonLabel) {
        store.settings.business.comingSoonLabel = "Coming Soon";
        changed = true;
      }
      if (!store.settings.business.bookCtaLabel) {
        store.settings.business.bookCtaLabel = "Book Consultation · Coming Soon →";
        changed = true;
      }
      if (!store.settings.general.logoUrl) {
        store.settings.general.logoUrl = "/images/brand/marites-allen-logo.png";
        changed = true;
      }
    }
    if (!store.pageCopy) {
      store.pageCopy = mergePageCopy(null);
      changed = true;
    }
    return changed;
  });
}

export function ensureSeeded() {
  const existing = readStore();
  if (!(existing.adminUsers.length && existing.articles.length && existing.settings)) {
    mutateStore((store) => {
      if (!store.adminUsers.length) {
        store.adminUsers.push({
          id: newId(),
          email: (process.env.ADMIN_EMAIL || "admin@maritesallen.com").toLowerCase(),
          passwordHash: hashPassword(process.env.ADMIN_PASSWORD || "change-this-password"),
          role: "owner",
          createdAt: nowIso(),
          lastLoginAt: null
        });
      }

      if (!store.categories.length) {
        store.categories = [
          { id: "cat-press", name: "Press", slug: "press", description: "News and magazine coverage" },
          { id: "cat-tv", name: "Television", slug: "television", description: "Broadcast interviews" },
          { id: "cat-blog", name: "Owned media", slug: "owned-media", description: "Marites Allen posts and lives" }
        ];
      }

      if (!store.articles.length) {
        store.articles = PRESS.map((item) => ({
          id: newId(),
          slug: slugify(`${item.outlet}-${item.year}-${item.month}`),
          title: item.excerpt,
          excerpt: item.excerpt,
          body: `<p>${item.excerpt}</p>`,
          featuredImageId: null,
          author: "Marites Allen",
          categoryId: item.ctaLabel === "Watch" ? "cat-tv" : "cat-press",
          tags: [],
          outlet: item.outlet,
          externalUrl: item.externalUrl,
          ctaLabel: item.ctaLabel,
          year: item.year,
          month: item.month,
          status: "published" as const,
          publishedAt: `${item.year}-${String(item.month).padStart(2, "0")}-01T00:00:00.000Z`,
          seoTitle: item.outlet,
          seoDescription: item.excerpt,
          updatedAt: nowIso()
        }));
      }

      if (!store.pages.length) store.pages = DEFAULT_PAGES;
      // Old seed created block pages for /home and /about; the real pages are designed site pages.
      store.pages = store.pages.filter((page) => page.id !== "page-home" && page.id !== "page-about");
      if (!store.events.length) store.events = EVENTS;

      if (!store.services.length) {
        store.services = BOOK_SERVICES.map((s, i) => ({
          id: s.id,
          name: s.title,
          slug: slugify(s.title),
          categoryLabel: BOOK_CATEGORIES[s.cat] || "",
          description: s.shortDesc,
          idealFor: s.idealFor,
          duration: "",
          ctaText: s.cta,
          bookingUrl: "/book",
          flags: s.flags,
          imageId: null,
          active: true,
          featured: i < 3,
          sortOrder: i + 1
        }));
      }

      if (!store.pricing.length) {
        store.pricing = EXP_SERVICES.map((s, i) => ({
          id: `price-${s.id}`,
          serviceId: s.id,
          price: s.priceNum,
          currency: "USD",
          promoPrice: null,
          note: s.tagline,
          active: true,
          sortOrder: i + 1
        }));
      }

      if (!store.testimonials.length) {
        store.testimonials = TESTIMONIALS.map((t, i) => ({
          id: `t-${i}`,
          name: t.name,
          role: t.role,
          text: t.text,
          initial: t.initial,
          featured: true,
          sortOrder: i + 1
        }));
      }

      if (!store.faqs.length) {
        store.faqs = FAQ_DATA.map((f, i) => ({
          id: `faq-${i}`,
          question: f.q,
          answer: f.a,
          showOnHome: true,
          sortOrder: i + 1
        }));
      }

      if (!store.navigation.length) {
        const header = [
          ["About", "/about", false],
          ["Destara AI", "/destara", false],
          ["Frigga", "https://www.frigga.com.ph", true],
          ["Projects", "/projects", false],
          ["Events", "/events", false],
          ["Media", "/media", false],
          ["Coming Soon", "/book", false]
        ] as const;
        store.navigation = [
          ...header.map(([label, href, external], i) => ({
            id: `nav-h-${i}`,
            label,
            href,
            external,
            parentId: null,
            enabled: true,
            sortOrder: i + 1,
            location: "header" as const
          })),
          ...[
            ["About", "/about"],
            ["Projects", "/projects"],
            ["Events", "/events"],
            ["Annual Forecast", "/forecast"],
            ["Destara AI", "/destara"],
            ["Media", "/media"],
            ["Book · Coming Soon", "/book"]
          ].map(([label, href], i) => ({
            id: `nav-f-${i}`,
            label,
            href,
            external: false,
            parentId: null,
            enabled: true,
            sortOrder: i + 1,
            location: "footer" as const
          }))
        ];
      }

      if (!store.settings) store.settings = DEFAULT_SETTINGS;
    });
  }
  ensureLiveDefaults();
  ensureOwnerAccounts();
}

ensureSeeded();
