import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getArticleBySlug } from "@/lib/cms/repo";
import { ensureSeeded } from "@/lib/cms/seed";
import { breadcrumbJsonLd, pageMetadata, SITE_NAME } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  ensureSeeded();
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return pageMetadata({ title: "Article", description: "", path: `/articles/${slug}`, noIndex: true });
  return pageMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    path: `/articles/${article.slug}`,
    type: "article"
  });
}

export default async function ArticlePage({ params }: Props) {
  ensureSeeded();
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  return (
    <div className="page-shell">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Media", path: "/media" },
          { name: article.title, path: `/articles/${article.slug}` }
        ])}
      />
      <SiteHeader />
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px" }}>
        <p style={{ color: "#c69a3e", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontSize: 12 }}>
          {article.outlet} · {article.year}
        </p>
        <h1 className="font-display" style={{ color: "#143d31", fontSize: "clamp(28px,4vw,42px)", lineHeight: 1.2 }}>
          {article.title}
        </h1>
        <p style={{ color: "#5f6b60", fontSize: 18, lineHeight: 1.6 }}>{article.excerpt}</p>
        <div dangerouslySetInnerHTML={{ __html: article.body }} style={{ lineHeight: 1.7, fontSize: 16 }} />
        {article.externalUrl && (
          <p>
            <a href={article.externalUrl} target="_blank" rel="noopener noreferrer">
              {article.ctaLabel || "Read original"} →
            </a>
          </p>
        )}
        <p style={{ fontSize: 13, color: "#6b6862" }}>By {article.author || SITE_NAME}</p>
      </article>
      <SiteFooter />
    </div>
  );
}
