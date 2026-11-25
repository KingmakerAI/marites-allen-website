export type DatedStory = {
  year: number;
  m: number;
  outlet: string;
  kind?: string;
};

/** Newest press or television story. Video-library rows do not take the Latest slot. */
export function pickLatestStory<T extends DatedStory>(items: T[]): T | null {
  const stories = items.filter((item) => item.kind !== "video");
  return [...stories].sort((a, b) => b.year - a.year || b.m - a.m || a.outlet.localeCompare(b.outlet))[0] || null;
}
