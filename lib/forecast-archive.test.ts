import { describe, expect, it } from "vitest";
import type { Article } from "./cms/types";
import { extraMediaArticles, forecastYear, forecastYears } from "./forecast-archive";
import { pickLatestStory } from "./media-latest";

describe("forecast years", () => {
  it("lists every year from 2027 down to 2004 with no gaps", () => {
    const years = forecastYears().map((row) => row.year);
    expect(years[0]).toBe(2027);
    expect(years[years.length - 1]).toBe(2004);
    for (let index = 0; index < years.length - 1; index += 1) {
      expect(years[index] - years[index + 1]).toBe(1);
    }
  });

  it("keeps 2004 as a Wood Monkey placeholder", () => {
    const year = forecastYear(2004);
    expect(year?.animal).toBe("Wood Monkey");
    expect(year?.summary).toBe("The information will be up soon.");
    expect(year?.features[0]?.status).toBe("placeholder");
    expect(year?.events[0]?.status).toBe("placeholder");
    expect(year?.features.some((item) => /facebook/i.test(item.title))).toBe(false);
    expect(year?.events.some((item) => /boutique/i.test(item.title))).toBe(false);
  });

  it("puts the November 2004 boutique on the 2005 forecast year", () => {
    const year = forecastYear(2005);
    const boutique = year?.events.find((item) => item.title.startsWith("World of Feng Shui Philippines first boutique"));
    expect(boutique?.date).toBe("2004-11");
    expect(boutique?.status).toBe("live");
    expect(year?.summary).not.toMatch(/luck/i);
  });

  it("dates the Manila Bulletin extravaganza story 15 January 2006", () => {
    const story = forecastYear(2006)?.features.find((item) => item.title === "Lillian Too's First Feng Shui Extravaganza In The Country Set Today");
    expect(story?.date).toBe("2006-01-15");
    expect(story?.url).toBe("https://www.lillian-too.com/news_mbuletinjan06.php");
    expect(forecastYear(2005)?.features.some((item) => item.url === story?.url)).toBe(false);
  });

  it("uses the published Sallan title and stand-in link on the 2007 year", () => {
    const story = forecastYear(2007)?.features.find((item) => item.title === "Marites Allen's World of Feng Shui");
    expect(story?.outlet).toBe("Manila Bulletin");
    expect(story?.date).toBe("2007-01");
    expect(story?.url).toBe("http://edwinsallan.blogspot.com/2009/12/world-of-feng-shui.html");
    expect(forecastYear(2010)?.features.some((item) => item.title.startsWith("Marites Allen's World of Feng Sh"))).toBe(false);
  });

  it("keeps two 2011 stories that share a source link", () => {
    const titles = forecastYear(2011)?.features.map((item) => item.title) || [];
    expect(titles).toContain("Showbiz News Ngayon interview: Kris Aquino's 'spouse star' reading");
    expect(titles).toContain("Kris writes a poem for James");
  });

  it("credits the 26 January 2009 report to The Manila Times", () => {
    const story = forecastYear(2009)?.features.find((item) => item.url === "https://ntucphl.org/2009/01/feng-shui-experts-optimism-in-2009/");
    expect(story?.outlet).toBe("The Manila Times");
    expect(story?.date).toBe("2009-01-26");
    expect(forecastYear(2009)?.summary).toContain("The Manila Times");
    expect(forecastYear(2009)?.summary).not.toMatch(/luck/i);
  });

  it("appends researched items once and leaves partial copy as the published title", () => {
    const added = extraMediaArticles([]);
    expect(added.some((item) => item.title === "Facebook Page - Marites Allen, the real Feng Shui Queen")).toBe(false);
    expect(added.some((item) => item.title === "FENG SHUI EXPERTS OPTIMISTIC IN 2009")).toBe(false);
    expect(added.filter((item) => item.title === "Marites Allen's World of Feng Shui")).toHaveLength(1);
    const column = added.find((item) => item.id === "early-r04");
    expect(column?.title).toBe("Have you got your own Dzi? (First of two parts)");
    expect(column?.excerpt).toBe(column?.title);
    expect(column?.body).toBe(`<p>${column?.title}</p>`);
    expect(column?.body).not.toMatch(/luck/i);
    expect(column?.year).toBe(2006);
    expect(column?.month).toBe(0);
    const blocked = extraMediaArticles([article(column!.externalUrl, column!.title)]);
    expect(blocked.some((item) => item.id === "early-r04")).toBe(false);
    expect(added.some((item) => item.id === "early-r02")).toBe(true);
    expect(added.some((item) => item.id === "early-r03")).toBe(true);
    expect(added.some((item) => item.id === "early-r12")).toBe(true);
    expect(added.some((item) => item.id === "early-r31")).toBe(true);
    const sameUrl = extraMediaArticles([article("https://www.philstar.com/cebu-business/2011/02/11/655956/feng-shui-expert-bares-positive-projections-cebu-businesses", "Already live")]);
    expect(sameUrl.some((item) => item.id === "early-r31")).toBe(false);
  });
});

function article(url: string, title: string): Article {
  return {
    id: "existing",
    slug: "existing",
    title,
    excerpt: title,
    body: "",
    featuredImageId: null,
    author: "Marites Allen",
    categoryId: "cat-press",
    tags: [],
    outlet: "Existing",
    externalUrl: url,
    ctaLabel: "Read",
    year: 2006,
    month: 1,
    status: "published",
    publishedAt: null,
    seoTitle: title,
    seoDescription: title,
    updatedAt: "2026-11-26T00:00:00.000Z"
  };
}

describe("latest story", () => {
  it("keeps the newest story ahead of a later video", () => {
    const latest = pickLatestStory([
      { year: 2026, m: 11, outlet: "Daily Tribune", kind: "story", title: "Fire Sheep year favors steady growth, says Marites Allen" },
      { year: 2026, m: 11, outlet: "YouTube", kind: "video", title: "A later November upload" },
      { year: 2010, m: 2, outlet: "Sun.Star Cebu", kind: "story", title: "Solid to liquid" }
    ]);
    expect(latest?.title).toBe("Fire Sheep year favors steady growth, says Marites Allen");
  });
});
