import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { getCachedArticles, getCachedPageCopy, getCachedSettings } from "@/lib/cms/content";
import { parseVideoLines } from "@/lib/cms/copy-lines";
import { monthName } from "@/lib/cms/repo";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import MediaClient from "./media-client";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getCachedPageCopy();
  return pageMetadata({
    title: copy.mediaPage.seoTitle,
    description: copy.mediaPage.seoDescription,
    path: "/media",
    keywords: ["Marites Allen press", "Feng Shui Queen interview", "media kit", "TV guesting Feng Shui"]
  });
}

export default async function MediaPage() {
  const [articles, pageCopy, settings] = await Promise.all([
    getCachedArticles(),
    getCachedPageCopy(),
    getCachedSettings()
  ]);
  const copy = pageCopy.mediaPage;
  const press = articles.map((a) => ({
    year: a.year,
    m: a.month,
    month: monthName(a.month),
    outlet: a.outlet,
    quote: a.excerpt || a.title,
    cta: a.ctaLabel,
    url: a.externalUrl || `/articles/${a.slug}`
  }));
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
        title={copy.title}
        intro={copy.intro}
        pressKitTitle={copy.pressKitTitle}
        pressKitBody={copy.pressKitBody}
        videosHeading={copy.videosHeading}
        videos={parseVideoLines(copy.videos)}
        contact={settings.contact}
      />
    </>
  );
}
