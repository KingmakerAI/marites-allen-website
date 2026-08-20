import type { MetadataRoute } from "next";
import { getCachedArticles, getCachedEvents, getCachedPublishedPages } from "@/lib/cms/content";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const [articles, events, extraPages] = await Promise.all([
    getCachedArticles(),
    getCachedEvents(),
    getCachedPublishedPages()
  ]);

  return [
    ...PUBLIC_ROUTES.map((route) => ({
      url: route.path === "/" ? SITE_URL : `${SITE_URL}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: article.updatedAt ? new Date(article.updatedAt) : lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6
    })),
    ...events.map((event) => ({
      url: `${SITE_URL}/events#${event.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...extraPages.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5
    }))
  ];
}
