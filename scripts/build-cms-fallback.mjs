/**
 * Build lib/cms/cms-fallback.json from the local articles baseline.
 * Used when private Vercel Blob downloads are paused/over quota.
 *
 * Usage: node scripts/build-cms-fallback.mjs
 */
import fs from "fs";
import path from "path";

const baselinePath = path.join("data", "baselines", "articles-baseline-LATEST.json");
if (!fs.existsSync(baselinePath)) {
  console.error("Missing", baselinePath);
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8").replace(/^\uFEFF/, ""));
const articles = Array.isArray(baseline.articles) ? baseline.articles : [];
const categories = Array.isArray(baseline.categories) ? baseline.categories : [];

const fallback = {
  _meta: {
    source: baseline.source || "articles-baseline",
    exportedAt: baseline.exportedAt || null,
    builtAt: new Date().toISOString(),
    note: "Read-only fallback when Vercel Blob content downloads return 403 (paused/over quota)."
  },
  adminUsers: [],
  sessions: [],
  pages: [],
  articles,
  categories,
  media: [],
  services: [],
  pricing: [],
  events: [],
  testimonials: [],
  faqs: [],
  navigation: [],
  settings: {
    general: {
      siteName: "Marites Allen",
      tagline: "The Feng Shui Queen",
      logoUrl: "/images/brand/marites-allen-logo.png"
    },
    contact: {
      email: "hello@maritesallen.com",
      emailSecondary: "hello@maritesallen.com",
      phone: "+63 920 950 9390",
      phoneSecondary: "+63 939 351 6424",
      whatsapp: "639209509390"
    },
    social: [],
    friggaSocial: [],
    seoDefaults: {
      title: "Marites Allen | The Feng Shui Queen",
      description: "Private Feng Shui consultations with Marites Allen.",
      ogImage: "/opengraph-image"
    },
    business: {
      bookingUrl: "/book",
      currency: "USD",
      comingSoonLabel: "Book Consultation",
      bookCtaLabel: "Book Consultation"
    }
  },
  homeSections: [],
  auditLog: [],
  signups: [],
  pageCopy: null,
  pageCopyDraft: null,
  bootstrap: {}
};

const outPath = path.join("lib", "cms", "cms-fallback.json");
fs.writeFileSync(outPath, JSON.stringify(fallback), "utf8");
console.log(
  JSON.stringify(
    {
      outPath,
      articles: articles.length,
      published: articles.filter((a) => a.status === "published").length,
      categories: categories.length,
      bytes: fs.statSync(outPath).size
    },
    null,
    2
  )
);
