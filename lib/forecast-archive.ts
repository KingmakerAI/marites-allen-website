import archive from "@/data/forecast-archive.json";
import type { Article } from "@/lib/cms/types";

export type ArchiveFeature = {
  title: string;
  outlet: string;
  date: string;
  url: string | null;
  type: string;
  status: string;
};

export type ArchiveEvent = {
  title: string;
  date: string;
  venue: string | null;
  source: string | null;
  status: string;
};

export type ArchiveYear = {
  year: number;
  animal: string;
  title: string;
  summary: string;
  events: ArchiveEvent[];
  features: ArchiveFeature[];
};

export type PressCon = {
  date: string;
  title: string;
  venue: string | null;
  status: string;
  coverage: ArchiveFeature[];
};

type ArchiveFile = {
  years: ArchiveYear[];
  pressCons: PressCon[];
  otherMedia: ArchiveFeature[];
};

const data = archive as ArchiveFile;

const WRITTEN = new Set(["article", "online", "book"]);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const EVENTS_HERO_INTRO =
  "Welcome the Year of the Fire Sheep 2027: forecasts, press events and the Chinese New Year Countdown at Manila House, 5 February 2027.";

export const STALE_EVENTS_INTRO =
  "Live sessions and private gatherings for Ghost Month preparation, cleansing, and guidance.";

export function eventsIntro(intro: string | undefined) {
  if (!intro || intro === STALE_EVENTS_INTRO) return EVENTS_HERO_INTRO;
  return intro;
}

export function forecastYears() {
  return [...data.years].sort((a, b) => b.year - a.year);
}

export function forecastYear(year: number) {
  return forecastYears().find((row) => row.year === year) || null;
}

export function forecastNavYears() {
  return forecastYears().slice(0, 4).map((row) => ({
    year: String(row.year),
    label: `${row.year} · Year of the ${row.animal}`,
    href: `/annual-forecast/${row.year}`
  }));
}

export function pressConferences() {
  return data.pressCons;
}

export function dateValue(date: string) {
  const [year, month, day] = date.split("-").map((part) => Number(part) || 0);
  return year * 10000 + (month || 1) * 100 + (day || 1);
}

export function formatArchiveDate(date: string) {
  const [year, month, day] = date.split("-");
  if (!year) return date;
  if (!month) return year;
  const monthName = MONTHS[Number(month) - 1] || month;
  if (!day) return `${monthName} ${year}`;
  return `${Number(day)} ${monthName} ${year}`;
}

export function splitFeatures(features: ArchiveFeature[]) {
  const byNewest = (a: ArchiveFeature, b: ArchiveFeature) => dateValue(b.date) - dateValue(a.date);
  const written = features.filter((item) => WRITTEN.has(item.type)).sort(byNewest);
  const broadcast = features.filter((item) => !WRITTEN.has(item.type)).sort(byNewest);
  return { written, broadcast };
}

export function otherMediaItems() {
  return data.otherMedia;
}

function normTitle(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function normUrl(value: string) {
  return value
    .trim()
    .replace(/\/+$/, "")
    .replace(/^http:\/\//i, "https://")
    .replace(/^https:\/\/www\./i, "https://")
    .toLowerCase();
}

function parts(date: string) {
  const [year, month] = date.split("-");
  return { year: Number(year) || new Date().getFullYear(), month: Number(month) || 1 };
}

function slug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
  return base || "item";
}

export function extraMediaArticles(existing: Article[]): Article[] {
  const titles = new Set(existing.map((row) => normTitle(row.title)));
  const urls = new Set(existing.map((row) => (row.externalUrl ? normUrl(row.externalUrl) : "")).filter(Boolean));
  const added: Article[] = [];
  for (const item of data.otherMedia) {
    const titleKey = normTitle(item.title);
    const urlKey = item.url ? normUrl(item.url) : "";
    if ((urlKey && urls.has(urlKey)) || (titleKey && titles.has(titleKey))) continue;
    if (urlKey) urls.add(urlKey);
    if (titleKey) titles.add(titleKey);
    const when = parts(item.date);
    const id = `other-media-${slug(item.title)}`;
    const watch = item.type === "tv" || item.type === "radio" || item.type === "video";
    const placeholder = item.status === "placeholder" || !item.url;
    added.push({
      id,
      slug: id,
      title: item.title,
      excerpt: item.title,
      body: `<p>${item.title}</p>`,
      featuredImageId: null,
      author: "Marites Allen",
      categoryId: watch ? "cat-tv" : "cat-press",
      tags: placeholder ? ["placeholder"] : [],
      outlet: item.outlet,
      externalUrl: item.url || "",
      ctaLabel: watch ? "Watch" : "Read",
      year: when.year,
      month: when.month,
      status: "published",
      publishedAt: item.date || null,
      seoTitle: item.title.slice(0, 70),
      seoDescription: item.title.slice(0, 180),
      updatedAt: "2026-11-25T00:00:00.000Z"
    });
  }
  return added;
}
