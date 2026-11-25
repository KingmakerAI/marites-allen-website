import { describe, expect, it } from "vitest";
import type { Article } from "./cms/types";
import { assemblePublishedArticles } from "./media-fixes";

const SALLAN_URL = "http://edwinsallan.blogspot.com/2009/12/world-of-feng-shui.html";

describe("media listings read from stored rows", () => {
  it("hides the Facebook profile, corrects the Sallan row, and still adds the 2010 items", () => {
    const listed = assemblePublishedArticles([
      row({
        id: "blob-2026",
        slug: "fire-sheep-year-favors-steady-growth-says-marites-allen",
        title: "Fire Sheep year favors steady growth, says Marites Allen",
        outlet: "Daily Tribune",
        externalUrl: "https://tribune.net.ph/2026/11/06/fire-sheep-year-favors-steady-growth-says-marites-allen",
        year: 2026,
        month: 11,
        tags: []
      }),
      row({
        id: "blob-facebook-2004",
        slug: "facebook-page-marites-allen-the-real-feng-shui-queen",
        title: "Facebook Page - Marites Allen, the real Feng Shui Queen",
        outlet: "Facebook",
        externalUrl: "https://www.facebook.com/MaritesAllen168/",
        year: 2004,
        month: 1,
        tags: []
      }),
      row({
        id: "blob-sallan-2007",
        slug: "feature-by-edwin-p-sallan",
        title: "feature by Edwin P. Sallan",
        outlet: "Manila Bulletin",
        externalUrl: "",
        year: 2007,
        month: 1,
        tags: ["placeholder"]
      }),
      row({
        id: "blob-doc-84",
        slug: "marites-allens-world-of-feng-sh",
        title: "Marites Allen's World of Feng Sh...",
        outlet: "Manila Standard Today",
        externalUrl: "",
        year: 2009,
        month: 12,
        tags: ["placeholder"]
      }),
      row({
        id: "blob-ntuc-2009",
        slug: "feng-shui-experts-optimism-in-2009",
        title: "Feng Shui experts optimism in 2009 - National Trade Union Center of the Philippines",
        outlet: "NTUC Phl (repost)",
        externalUrl: "https://ntucphl.org/2009/01/feng-shui-experts-optimism-in-2009/",
        year: 2009,
        month: 1,
        tags: []
      })
    ]);

    expect(listed.some((item) => item.title === "Facebook Page - Marites Allen, the real Feng Shui Queen")).toBe(false);
    expect(listed.some((item) => item.externalUrl.includes("MaritesAllen168"))).toBe(false);
    expect(listed.some((item) => item.title === "feature by Edwin P. Sallan")).toBe(false);
    expect(listed.some((item) => item.title === "Marites Allen's World of Feng Sh...")).toBe(false);

    const sallan = listed.filter((item) => item.title === "Marites Allen's World of Feng Shui");
    expect(sallan).toHaveLength(1);
    expect(sallan[0]?.externalUrl).toBe(SALLAN_URL);
    expect(sallan[0]?.outlet).toBe("Manila Bulletin");
    expect(sallan[0]?.year).toBe(2007);
    expect(sallan[0]?.month).toBe(1);
    expect(sallan[0]?.tags.includes("placeholder")).toBe(false);

    const year2010 = listed.filter((item) => item.year === 2010);
    expect(year2010.length).toBeGreaterThan(0);
    expect(year2010.some((item) => item.title === "Solid to liquid")).toBe(true);
    expect(listed.filter((item) => item.id.startsWith("early-"))).toHaveLength(33);

    const tribune = listed.find((item) => item.id === "blob-2026");
    expect(tribune?.title).toBe("Fire Sheep year favors steady growth, says Marites Allen");
    expect(tribune?.year).toBe(2026);
    expect(tribune?.month).toBe(11);

    const ntuc = listed.find((item) => item.id === "blob-ntuc-2009");
    expect(ntuc?.outlet).toBe("The Manila Times");
    expect(ntuc?.year).toBe(2009);
    expect(ntuc?.month).toBe(1);

    const extravaganza = assemblePublishedArticles([
      row({
        id: "blob-doc-216",
        slug: "lillian-too-extravaganza-2005",
        title: "Lillian Too extravaganza",
        outlet: "Manila Bulletin",
        externalUrl: "https://www.lillian-too.com/news_mbuletinjan06.php",
        year: 2005,
        month: 1,
        tags: []
      })
    ]).find((item) => item.id === "blob-doc-216");
    expect(extravaganza?.year).toBe(2006);
    expect(extravaganza?.month).toBe(1);
  });
});

function row(partial: Pick<Article, "id" | "slug" | "title" | "outlet" | "externalUrl" | "year" | "month" | "tags">): Article {
  return {
    featuredImageId: null,
    author: "Marites Allen",
    categoryId: "cat-press",
    excerpt: partial.title,
    body: `<p>${partial.title}</p>`,
    ctaLabel: partial.externalUrl ? "Read" : "Read",
    status: "published",
    publishedAt: `${partial.year}-${String(partial.month).padStart(2, "0")}-01T00:00:00.000Z`,
    seoTitle: partial.title.slice(0, 70),
    seoDescription: partial.title.slice(0, 180),
    updatedAt: "2026-10-19T17:23:48.811Z",
    ...partial
  };
}
