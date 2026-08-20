import fs from "fs";
import path from "path";
import { createHash } from "crypto";

export type DayBucket = { views: number; visitors: number };

export type AnalyticsRange = "24h" | "48h" | "week" | "month" | "year";

export type AnalyticsPoint = {
  key: string;
  label: string;
  views: number;
  visitors: number;
};

export type AnalyticsData = {
  totalViews: number;
  totalVisitors: number;
  days: Record<string, DayBucket>;
  hours: Record<string, DayBucket>;
  todayKey: string;
  todayIds: string[];
  hourKey: string;
  hourIds: string[];
};

const EMPTY: AnalyticsData = {
  totalViews: 0,
  totalVisitors: 0,
  days: {},
  hours: {},
  todayKey: "",
  todayIds: [],
  hourKey: "",
  hourIds: []
};

const BOT =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|preview|lighthouse|headless/i;

function manilaParts(date = new Date()) {
  const map: Record<string, string> = {};
  for (const part of new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date)) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  const day = `${map.year}-${map.month}-${map.day}`;
  const hour = `${day}T${map.hour}`;
  return { day, hour, hourNum: map.hour };
}

export function manilaDay(date = new Date()) {
  return manilaParts(date).day;
}

export function manilaHour(date = new Date()) {
  return manilaParts(date).hour;
}

export function getAnalyticsPath() {
  const root = process.cwd();
  return process.env.ANALYTICS_JSON_PATH || path.join(/* turbopackIgnore: true */ root, "data", "analytics.json");
}

function emptyData(): AnalyticsData {
  return structuredClone(EMPTY);
}

export function readAnalytics(): AnalyticsData {
  const file = getAnalyticsPath();
  try {
    if (!fs.existsSync(file)) return emptyData();
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Partial<AnalyticsData>;
    return {
      totalViews: Number(parsed.totalViews) || 0,
      totalVisitors: Number(parsed.totalVisitors) || 0,
      days: parsed.days && typeof parsed.days === "object" ? parsed.days : {},
      hours: parsed.hours && typeof parsed.hours === "object" ? parsed.hours : {},
      todayKey: parsed.todayKey || "",
      todayIds: Array.isArray(parsed.todayIds) ? parsed.todayIds : [],
      hourKey: parsed.hourKey || "",
      hourIds: Array.isArray(parsed.hourIds) ? parsed.hourIds : []
    };
  } catch {
    return emptyData();
  }
}

function writeAnalytics(data: AnalyticsData) {
  const file = getAnalyticsPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const payload = JSON.stringify(data);
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, payload, "utf8");
  try {
    fs.renameSync(tmp, file);
  } catch {
    try {
      fs.copyFileSync(tmp, file);
      fs.unlinkSync(tmp);
    } catch {
      fs.writeFileSync(file, payload, "utf8");
      try {
        fs.unlinkSync(tmp);
      } catch {
        /* OneDrive may lock the temp file briefly */
      }
    }
  }
}

function pruneKeyed(days: Record<string, DayBucket>, keep: number) {
  const keys = Object.keys(days).sort();
  if (keys.length <= keep) return days;
  const drop = keys.slice(0, keys.length - keep);
  const next = { ...days };
  for (const key of drop) delete next[key];
  return next;
}

function hashVisitor(id: string) {
  return createHash("sha256").update(id).digest("hex").slice(0, 12);
}

export function isBotUserAgent(ua: string) {
  return !ua || BOT.test(ua);
}

export function shouldSkipPath(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/icon" ||
    pathname === "/apple-icon" ||
    pathname === "/opengraph-image"
  );
}

export function recordVisit(input: { visitorId: string; isNewVisitor: boolean; path: string }) {
  const now = new Date();
  const day = manilaDay(now);
  const hour = manilaHour(now);
  const idHash = hashVisitor(input.visitorId);
  const data = readAnalytics();
  if (data.todayKey !== day) {
    data.todayKey = day;
    data.todayIds = [];
  }
  if (data.hourKey !== hour) {
    data.hourKey = hour;
    data.hourIds = [];
  }
  if (!data.days[day]) data.days[day] = { views: 0, visitors: 0 };
  if (!data.hours[hour]) data.hours[hour] = { views: 0, visitors: 0 };
  data.totalViews += 1;
  data.days[day].views += 1;
  data.hours[hour].views += 1;
  if (!data.todayIds.includes(idHash)) {
    data.todayIds.push(idHash);
    data.days[day].visitors += 1;
  }
  if (!data.hourIds.includes(idHash)) {
    data.hourIds.push(idHash);
    data.hours[hour].visitors += 1;
  }
  if (input.isNewVisitor) data.totalVisitors += 1;
  data.days = pruneKeyed(data.days, 400);
  data.hours = pruneKeyed(data.hours, 72);
  if (data.todayIds.length > 20000) data.todayIds = data.todayIds.slice(-15000);
  if (data.hourIds.length > 5000) data.hourIds = data.hourIds.slice(-4000);
  writeAnalytics(data);
  return data;
}

function sumDays(days: Record<string, DayBucket>, keys: string[]) {
  return keys.reduce(
    (acc, key) => {
      const row = days[key];
      if (!row) return acc;
      acc.views += row.views;
      acc.visitors += row.visitors;
      return acc;
    },
    { views: 0, visitors: 0 }
  );
}

function lastDays(count: number, from = manilaDay()) {
  const [year, month, day] = from.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, day));
  const keys: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() - i);
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
}

function lastHourKeys(count: number, from = new Date()) {
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    keys.push(manilaHour(new Date(from.getTime() - i * 3600000)));
  }
  return keys;
}

function lastMonthKeys(count: number, from = manilaDay()) {
  const [year, month] = from.split("-").map(Number);
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(year, month - 1 - i, 1));
    keys.push(d.toISOString().slice(0, 7));
  }
  return keys;
}

function hourLabel(key: string) {
  const hour = Number(key.slice(11, 13));
  const h = hour % 12 || 12;
  return `${h}${hour >= 12 ? "pm" : "am"}`;
}

function dayLabel(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  });
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-PH", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC"
  });
}

export function parseAnalyticsRange(value?: string): AnalyticsRange {
  if (value === "24h" || value === "48h" || value === "week" || value === "month" || value === "year") return value;
  return "week";
}

export const ANALYTICS_RANGES: Array<{ id: AnalyticsRange; label: string }> = [
  { id: "24h", label: "Last 24 hours" },
  { id: "48h", label: "Last 48 hours" },
  { id: "week", label: "Last 7 days" },
  { id: "month", label: "Last 30 days" },
  { id: "year", label: "Last 12 months" }
];

export function analyticsSeries(range: AnalyticsRange, data = readAnalytics()): AnalyticsPoint[] {
  if (range === "24h" || range === "48h") {
    return lastHourKeys(range === "24h" ? 24 : 48).map((key) => {
      const row = data.hours[key] || { views: 0, visitors: 0 };
      return { key, label: hourLabel(key), views: row.views, visitors: row.visitors };
    });
  }
  if (range === "year") {
    return lastMonthKeys(12).map((month) => {
      const views = Object.entries(data.days).reduce(
        (acc, [day, row]) => (day.startsWith(month) ? { views: acc.views + row.views, visitors: acc.visitors + row.visitors } : acc),
        { views: 0, visitors: 0 }
      );
      return { key: month, label: monthLabel(month), views: views.views, visitors: views.visitors };
    });
  }
  const count = range === "week" ? 7 : 30;
  return lastDays(count).reverse().map((key) => {
    const row = data.days[key] || { views: 0, visitors: 0 };
    return { key, label: dayLabel(key), views: row.views, visitors: row.visitors };
  });
}

export function bucketTimestamps(times: string[], range: AnalyticsRange): AnalyticsPoint[] {
  const counts = new Map<string, number>();
  const hourMs = range === "24h" || range === "48h";
  for (const stamp of times) {
    const date = new Date(stamp);
    if (Number.isNaN(date.getTime())) continue;
    const key = hourMs ? manilaHour(date) : range === "year" ? manilaDay(date).slice(0, 7) : manilaDay(date);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return analyticsSeries(range).map((point) => ({
    ...point,
    views: counts.get(point.key) || 0,
    visitors: counts.get(point.key) || 0
  }));
}

export function analyticsSummary(range: AnalyticsRange = "week", data = readAnalytics()) {
  const series = analyticsSeries(range, data);
  const totals = series.reduce(
    (acc, point) => {
      acc.views += point.views;
      acc.visitors += point.visitors;
      return acc;
    },
    { views: 0, visitors: 0 }
  );
  const today = manilaDay();
  const todayRow = data.days[today] || { views: 0, visitors: 0 };
  return {
    range,
    series,
    rangeVisitors: totals.visitors,
    rangeViews: totals.views,
    todayVisitors: todayRow.visitors,
    todayViews: todayRow.views,
    weekVisitors: sumDays(data.days, lastDays(7, today)).visitors,
    weekViews: sumDays(data.days, lastDays(7, today)).views,
    monthVisitors: sumDays(data.days, lastDays(30, today)).visitors,
    monthViews: sumDays(data.days, lastDays(30, today)).views,
    totalVisitors: data.totalVisitors,
    totalViews: data.totalViews
  };
}
