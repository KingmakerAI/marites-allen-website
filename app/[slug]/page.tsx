import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCachedPageBySlug, getCachedPublishedPages } from "@/lib/cms/content";
import { PageBlocks } from "@/lib/cms/render-blocks";
import { isReservedPageSlug } from "@/lib/cms/reserved-slugs";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams() {
  const pages = await getCachedPublishedPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (isReservedPageSlug(slug)) return {};
  const page = await getCachedPageBySlug(slug);
  if (!page) return {};
  return pageMetadata({
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.title,
    path: `/${page.slug}`
  });
}

export default async function ExtraPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (isReservedPageSlug(slug)) notFound();
  const page = await getCachedPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="page-shell page-enter">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: page.title, path: `/${page.slug}` }
        ])}
      />
      <SiteHeader />
      <article
        className="cms-page"
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "clamp(36px,6vw,72px) clamp(18px,4vw,40px) clamp(48px,8vw,96px)"
        }}
      >
        {page.blocks[0]?.type === "hero" ? null : (
          <h1
            className="font-display"
            style={{
              fontWeight: 700,
              fontSize: "clamp(28px,4vw,42px)",
              color: "#143d31",
              margin: "0 0 24px"
            }}
          >
            {page.title}
          </h1>
        )}
        <PageBlocks blocks={page.blocks} />
      </article>
      <SiteFooter />
    </div>
  );
}
