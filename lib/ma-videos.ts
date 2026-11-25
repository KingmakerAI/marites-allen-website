import archive from "@/data/forecast-archive.json";
import videos from "@/data/ma-videos.json";

export type MaVideo = {
  title: string;
  channel_or_outlet: string;
  platform: string;
  date: string;
  url: string;
  year_bucket: string;
  type: string;
  url_check: string;
  media_kind: string;
};

export type YearVideo = {
  title: string;
  outlet: string;
  date: string;
  url: string;
  platform: string;
  youtubeId: string | null;
};

const items = videos as MaVideo[];

type ArchiveUrlSource = {
  years: Array<{
    features: Array<{ url?: string | null }>;
    events: Array<{ source?: string | null }>;
  }>;
  pressCons: Array<{ coverage?: Array<{ url?: string | null }> }>;
  otherMedia: Array<{ url?: string | null }>;
};

function normUrl(value: string) {
  return value
    .trim()
    .replace(/\/+$/, "")
    .replace(/^http:\/\//i, "https://")
    .replace(/^https:\/\/www\./i, "https://")
    .toLowerCase();
}

export function youtubeId(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }
    if (host.endsWith("youtube.com")) {
      const watch = parsed.searchParams.get("v");
      if (watch) return watch;
      const parts = parsed.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((part) => ["embed", "shorts", "live", "v"].includes(part));
      if (marker >= 0 && parts[marker + 1]) return parts[marker + 1];
    }
  } catch {
    return null;
  }
  return null;
}

function canon(url: string) {
  const id = youtubeId(url);
  if (id) return `youtube:${id}`;
  return normUrl(url);
}

function archiveUrls() {
  const data = archive as ArchiveUrlSource;
  const urls = new Set<string>();
  const add = (url?: string | null) => {
    if (url) urls.add(canon(url));
  };
  for (const year of data.years) {
    for (const feature of year.features) add(feature.url);
    for (const event of year.events) add(event.source);
  }
  for (const press of data.pressCons) {
    for (const item of press.coverage || []) add(item.url);
  }
  for (const item of data.otherMedia) add(item.url);
  return urls;
}

/** Oct 1 through Feb 3 belongs to the forecast year that lunar year is introducing. */
export function forecastYearFromDate(iso: string) {
  const [year, month, day] = iso.split("-").map((part) => Number(part));
  if (!year || !month || !day) return null;
  if (month >= 10) return year + 1;
  if (month === 1 || (month === 2 && day <= 3)) return year;
  return null;
}

function bucketYear(bucket: string) {
  const year = Number(bucket.slice(0, 4));
  return Number.isFinite(year) && year > 1900 ? year : null;
}

function is2026PressCon(item: MaVideo) {
  if (!item.date.startsWith("2026-")) return false;
  const [, month, day] = item.date.split("-").map((part) => Number(part));
  const title = item.title.toLowerCase();
  const press = item.type === "presscon" || title.includes("press conference") || title.includes("press con");
  if (!press) return false;
  if (month === 10 && day === 12) return true;
  if (month === 11) return true;
  return false;
}

export function assignForecastYear(item: MaVideo) {
  if (!item.date) return null;
  if (is2026PressCon(item)) return 2027;
  const shifted = forecastYearFromDate(item.date);
  if (shifted) return shifted;
  return bucketYear(item.year_bucket);
}

const knownArchive = archiveUrls();

function kept(item: MaVideo) {
  if (item.url_check === "404") return false;
  if (!item.url) return false;
  if (knownArchive.has(canon(item.url))) return false;
  return true;
}

const seen = new Set<string>();
const fresh = items.filter((item) => {
  if (!kept(item)) return false;
  const key = canon(item.url);
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

function toCard(item: MaVideo): YearVideo {
  return {
    title: item.title,
    outlet: item.channel_or_outlet,
    date: item.date,
    url: item.url,
    platform: item.platform,
    youtubeId: item.platform === "YouTube" ? youtubeId(item.url) : null
  };
}

export function videosForYear(year: number) {
  return fresh
    .filter((item) => item.media_kind === "video" && assignForecastYear(item) === year)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(toCard);
}

export function videoCountsByYear() {
  const counts = new Map<number, number>();
  for (const item of fresh) {
    if (item.media_kind !== "video") continue;
    const year = assignForecastYear(item);
    if (!year) continue;
    counts.set(year, (counts.get(year) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[0] - a[0]);
}

export function undatedMedia() {
  return fresh
    .filter((item) => !item.date)
    .map(toCard);
}
