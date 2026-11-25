import early from "@/data/early-media.json";

export type EarlyMediaItem = {
  id: string;
  title: string;
  outlet: string;
  pubDate: string;
  forecastYear: number;
  url: string;
  type: string;
  confidence: string;
  dedupe: string;
};

const items = (early as { items: EarlyMediaItem[] }).items;

export function earlyMediaItems() {
  return items;
}

/** Fixes update a record already in the archive. They are not appended again. */
export function earlyItemAlreadyRecorded(item: EarlyMediaItem) {
  const flag = item.dedupe.trim();
  return /^duplicate\b/i.test(flag) || /^updates\b/i.test(flag);
}

export function publicationParts(date: string) {
  const [year = "", month = "", day = ""] = date.split("-");
  return {
    year: Number(year) || 0,
    month: Number(month) || 0,
    day: Number(day) || 0
  };
}
