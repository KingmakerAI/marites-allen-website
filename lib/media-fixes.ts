import type { Article } from "@/lib/cms/types";
import { extraMediaArticles, normalizeStoryTitle, normalizeStoryUrl } from "@/lib/forecast-archive";

const SALLAN_TITLE = "Marites Allen's World of Feng Shui";
const SALLAN_URL = "http://edwinsallan.blogspot.com/2009/12/world-of-feng-shui.html";
const FACEBOOK_PROFILE = "https://facebook.com/maritesallen168";

/**
 * Read-time corrections for rows already stored in the CMS. This never writes
 * the store: callers pass the published rows they just read and render the copy.
 */
export function applyMediaFixes(stored: Article[]): Article[] {
  const fixed: Article[] = [];
  for (const article of stored) {
    if (isFacebookProfile(article) || isDoc84Duplicate(article)) continue;
    if (isThinSallan(article)) {
      fixed.push(withSallan(article));
      continue;
    }
    if (isNtucOxReport(article)) {
      fixed.push({ ...article, outlet: "The Manila Times", year: 2009, month: 1 });
      continue;
    }
    if (isJanuary2006Extravaganza(article)) {
      fixed.push({ ...article, year: 2006, month: 1 });
      continue;
    }
    fixed.push(article);
  }
  return fixed;
}

/** Stored rows, corrected, then archive and researched items that are not already there. */
export function assemblePublishedArticles(stored: Article[]): Article[] {
  const fixed = applyMediaFixes(stored);
  return [...fixed, ...extraMediaArticles(fixed)];
}

function isFacebookProfile(article: Article) {
  if (normalizeStoryTitle(article.title) === "facebook page - marites allen, the real feng shui queen") return true;
  return normalizeStoryUrl(article.externalUrl || "") === FACEBOOK_PROFILE;
}

function isThinSallan(article: Article) {
  return normalizeStoryTitle(article.title) === "feature by edwin p. sallan";
}

function isDoc84Duplicate(article: Article) {
  const title = normalizeStoryTitle(article.title);
  const outlet = normalizeStoryTitle(article.outlet);
  return title.startsWith("marites allen's world of feng sh") && !title.endsWith("feng shui") && outlet.includes("manila standard");
}

function isNtucOxReport(article: Article) {
  return normalizeStoryUrl(article.externalUrl || "").includes("ntucphl.org/2009/01/feng-shui-experts-optimism");
}

function isJanuary2006Extravaganza(article: Article) {
  return normalizeStoryUrl(article.externalUrl || "").includes("lillian-too.com/news_mbuletinjan06");
}

function withSallan(article: Article): Article {
  return {
    ...article,
    title: SALLAN_TITLE,
    excerpt: SALLAN_TITLE,
    body: `<p>${SALLAN_TITLE}</p>`,
    outlet: "Manila Bulletin",
    externalUrl: SALLAN_URL,
    ctaLabel: "Read",
    year: 2007,
    month: 1,
    tags: article.tags.filter((tag) => tag !== "placeholder"),
    seoTitle: SALLAN_TITLE.slice(0, 70),
    seoDescription: SALLAN_TITLE.slice(0, 180)
  };
}
