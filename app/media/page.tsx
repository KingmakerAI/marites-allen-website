import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { getCachedArticles, getCachedPageCopy, getCachedSettings } from "@/lib/cms/content";
import { parseVideoLines } from "@/lib/cms/copy-lines";
import { listCategories, monthName } from "@/lib/cms/repo";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import MediaClient from "./media-client";

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

export default async function MediaPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const query = await searchParams;
  const [articles, pageCopy, settings] = await Promise.all([
    getCachedArticles(),
    getCachedPageCopy(),
    getCachedSettings()
  ]);
  const folders = new Map((await listCategories()).map((cat) => [cat.id, cat]));
  const copy = pageCopy.mediaPage;
  const press = articles.map((a) => {
    const folder = a.categoryId ? folders.get(a.categoryId) : undefined;
    return {
      year: a.year,
      m: a.month,
      month: monthName(a.month),
      outlet: a.outlet,
      quote: a.excerpt || a.title,
      cta: a.ctaLabel,
      url: a.externalUrl || `/articles/${a.slug}`,
      category: folder?.name || "",
      categorySlug: folder?.slug || "",
      slug: a.slug
    };
  });
  const latest =
    [...press].sort((a, b) => b.year - a.year || b.m - a.m || a.outlet.localeCompare(b.outlet))[0] ||
    null;
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Media", path: "/media" }
        ])}
      />
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
        activeCategory={(query.category || "").trim().toLowerCase()}
      />
    </>
  );
}
