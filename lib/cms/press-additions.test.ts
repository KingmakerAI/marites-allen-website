import { describe, expect, it } from "vitest";
import fallback from "./cms-fallback.json";
import additions from "./press-additions.json";

describe("2026 Fire Sheep press additions", () => {
  it("lists the new stories newest first and does not repeat a URL", () => {
    const added = additions.articles;
    expect(added).toHaveLength(11);
    const stamps = added.map((article) => article.year * 10000 + article.month * 100 + (article.day || 0));
    const sorted = [...stamps].sort((a, b) => b - a);
    expect(stamps).toEqual(sorted);

    const urls = added.map((article) => article.externalUrl);
    expect(new Set(urls).size).toBe(urls.length);

    const fallbackUrls = fallback.articles.map((article) => article.externalUrl);
    for (const url of urls) {
      expect(fallbackUrls.filter((item) => item === url)).toHaveLength(1);
    }
    expect(fallbackUrls.slice(0, urls.length)).toEqual(urls);

    const imageIds = new Set(additions.media.map((asset) => asset.id));
    expect(added[0].featuredImageId).toBeNull();
    for (const article of added.slice(1)) {
      expect(imageIds.has(article.featuredImageId || "")).toBe(true);
    }
    for (const asset of additions.media) {
      expect(asset.path.startsWith("/images/media/")).toBe(true);
      expect(asset.mimeType).toBe("image/webp");
    }
  });
});
