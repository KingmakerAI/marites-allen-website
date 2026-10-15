import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getArticleBySlug, getMedia, listCategories, monthName } from "@/lib/cms/repo";
import { ensureSeeded } from "@/lib/cms/seed";
import { formatArticleBody } from "@/lib/cms/sanitize";
import { breadcrumbJsonLd, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

function absoluteUrl(path: string) {
  if (/^https?:/i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await ensureSeeded();
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return pageMetadata({ title: "Article", description: "", path: `/articles/${slug}`, noIndex: true });
  const image = article.featuredImageId ? await getMedia(article.featuredImageId) : null;
  return pageMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    path: `/articles/${article.slug}`,
    type: "article",
    image: image?.path
  });
}

export default async function ArticlePage({ params }: Props) {
  await ensureSeeded();
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const category = article.categoryId ? (await listCategories()).find((item) => item.id === article.categoryId) || null : null;
  const image = article.featuredImageId ? await getMedia(article.featuredImageId) : null;
  const when = `${monthName(article.month)} ${article.year}`;
  const path = `/articles/${article.slug}`;
  const imageUrl = image ? absoluteUrl(image.path) : undefined;

  return (
    <div className="page-shell">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Media", path: "/media" },
            { name: article.title, path }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt || article.seoDescription,
            datePublished: article.publishedAt || undefined,
            dateModified: article.updatedAt,
            author: { "@type": "Person", name: article.author || SITE_NAME },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            mainEntityOfPage: `${SITE_URL}${path}`,
            ...(imageUrl ? { image: [imageUrl] } : {}),
            ...(category ? { articleSection: category.name } : {})
          }
        ]}
      />
      <SiteHeader />
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px" }}>
        <p style={{ margin: "0 0 18px" }}>
          <Link href="/media" style={{ color: "#1a4d3e", fontWeight: 700, fontSize: 14 }}>
            ← Media
          </Link>
        </p>
        <p style={{ color: "#c69a3e", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontSize: 12, margin: "0 0 10px" }}>
          {category ? (
            <Link href={`/media?category=${category.slug}`} style={{ color: "#c69a3e" }}>
              {category.name}
            </Link>
          ) : null}
          {category ? " · " : ""}
          {article.outlet ? `${article.outlet} · ` : ""}
          {when}
        </p>
        <h1 className="font-display" style={{ color: "#143d31", fontSize: "clamp(28px,4vw,42px)", lineHeight: 1.2, margin: "0 0 16px" }}>
          {article.title}
        </h1>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.path}
            alt={image.altText || article.title}
            style={{ width: "100%", maxHeight: 460, objectFit: "cover", borderRadius: 16, margin: "0 0 20px" }}
          />
        ) : null}
        {article.excerpt ? <p style={{ color: "#5f6b60", fontSize: 18, lineHeight: 1.6 }}>{article.excerpt}</p> : null}
        <div
          dangerouslySetInnerHTML={{ __html: formatArticleBody(article.body) }}
          style={{ lineHeight: 1.7, fontSize: 16, color: "#2a2a28" }}
        />
        {article.tags.length > 0 && (
          <p style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
            {article.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#1a4d3e",
                  background: "rgba(230,198,128,0.4)",
                  borderRadius: 99,
                  padding: "4px 10px"
                }}
              >
                {tag}
              </span>
            ))}
          </p>
        )}
        {article.externalUrl && (
          <p>
            <a href={article.externalUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: "#143d31" }}>
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
