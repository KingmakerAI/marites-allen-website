import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { getCachedArticles, getCachedPageCopy, getCachedSettings } from "@/lib/cms/content";
import { parseVideoLines } from "@/lib/cms/copy-lines";
import { listCategories, monthName } from "@/lib/cms/repo";
import { normalizeStoryTitle, normalizeStoryUrl } from "@/lib/forecast-archive";
import { mediaPageVideos, undatedMedia } from "@/lib/ma-videos";
import { pickLatestStory } from "@/lib/media-latest";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import MediaClient, { type PressItem } from "./media-client";

function mediaSeoDescription(outlets: string[], fallback: string) {
  const unique = [...new Set(outlets.map((o) => o.trim()).filter(Boolean))];
  if (!unique.length) return fallback;
  if (unique.length === 1) {
    return `Press coverage featuring Marites Allen — ${unique[0]}.`;
  }
  if (unique.length === 2) {
    return `Press coverage featuring Marites Allen — ${unique[0]} and ${unique[1]}.`;
  }
  const head = unique.slice(0, 4);
  const rest = unique.length > 4 ? ", and more" : "";
  return `Press coverage featuring Marites Allen — ${head.slice(0, -1).join(", ")}, and ${head[head.length - 1]}${rest}.`;
}

export async function generateMetadata(): Promise<Metadata> {
  const [copy, articles] = await Promise.all([getCachedPageCopy(), getCachedArticles()]);
  return pageMetadata({
    title: copy.mediaPage.seoTitle,
    description: mediaSeoDescription(
      articles.map((a) => a.outlet),
      copy.mediaPage.seoDescription
    ),
    path: "/media",
    keywords: ["Marites Allen press", "Feng Shui Queen interview", "media kit", "TV guesting Feng Shui"]
  });
}

export const revalidate = 3600;

export default async function MediaPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; year?: string }>;
}) {
  const query = await searchParams;
  const category = (query.category || "").trim().toLowerCase();
  const year = (query.year || "").trim();
  const [articles, pageCopy, settings] = await Promise.all([
    getCachedArticles(),
    getCachedPageCopy(),
    getCachedSettings()
  ]);
  const folders = new Map((await listCategories()).map((cat) => [cat.id, cat]));
  const copy = pageCopy.mediaPage;
  const press: PressItem[] = articles.map((a) => {
    const folder = a.categoryId ? folders.get(a.categoryId) : undefined;
    return {
      year: a.year,
      m: a.month,
      month: a.month ? monthName(a.month) : String(a.year),
      outlet: a.outlet,
      quote: a.title || a.excerpt,
      cta: a.ctaLabel,
      url: a.externalUrl || `/articles/${a.slug}`,
      category: folder?.name || "",
      categorySlug: folder?.slug || "",
      slug: a.slug,
      placeholder: a.tags.includes("placeholder"),
      day: 0,
      kind: "story" as const
    };
  });
  const seenTitles = new Set(press.map((item) => normalizeStoryTitle(item.quote)));
  const seenUrls = new Set(press.map((item) => normalizeStoryUrl(item.url)).filter(Boolean));
  for (const video of mediaPageVideos()) {
    const titleKey = normalizeStoryTitle(video.title);
    const urlKey = normalizeStoryUrl(video.url);
    if (seenTitles.has(titleKey) || (urlKey && seenUrls.has(urlKey))) continue;
    seenTitles.add(titleKey);
    if (urlKey) seenUrls.add(urlKey);
    const slug = video.youtubeId ? `video-${video.youtubeId}` : `video-${urlKey.replace(/[^a-z0-9]+/g, "-").slice(-70)}`;
    press.push({
      year: video.year,
      m: video.month,
      day: video.day,
      month: video.month ? monthName(video.month) : String(video.year),
      outlet: video.outlet,
      quote: video.title,
      cta: "Watch",
      url: video.url,
      category: "Video",
      categorySlug: "video",
      slug,
      placeholder: false,
      kind: "video" as const,
      youtubeId: video.youtubeId
    });
  }
  const latest = pickLatestStory(press);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Media", path: "/media" }
        ])}
      />
      <Suspense fallback={null}>
        <MediaClient
          press={press}
          latest={latest}
          title={copy.title}
          intro={copy.intro}
          pressKitTitle={copy.pressKitTitle}
          pressKitBody={copy.pressKitBody}
          videosHeading={copy.videosHeading}
          videos={parseVideoLines(copy.videos)}
          contact={settings.contact}
          category={category}
          year={year}
          undated={undatedMedia()}
        />
      </Suspense>
    </>
  );
}
