import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cms } from "@/lib/cms/cms-attr";
import { getCachedPageCopy } from "@/lib/cms/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getCachedPageCopy();
  return pageMetadata({
    title: copy.about.seoTitle,
    description: copy.about.seoDescription,
    path: "/about",
    keywords: ["about Marites Allen", "Feng Shui Queen biography", "Filipina Feng Shui master"],
    type: "profile"
  });
}

export default async function AboutPage() {
  const copy = await getCachedPageCopy();
  const about = copy.about;

  return (
    <div className="page-shell page-enter">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" }
        ])}
      />
      <SiteHeader />

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(28px,4vw,48px) clamp(18px,4vw,40px) 0" }}>
        <div style={{ fontSize: 12, color: "#8a8a80" }} {...cms("about.kicker")}>
          {about.kicker}
        </div>
        <h1
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: "clamp(30px,4.4vw,46px)",
            color: "#143d31",
            margin: "6px 0 4px",
            borderBottom: "2px solid rgba(20,61,49,0.12)",
            paddingBottom: 14
          }}
          {...cms("about.title")}
        >
          {about.title}
        </h1>
      </div>

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 clamp(18px,4vw,40px) 60px",
          display: "flex",
          flexWrap: "wrap-reverse",
          gap: 36
        }}
      >
        <div style={{ flex: "2 1 480px", minWidth: 300 }}>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: "20px 0" }} {...cms("about.intro")}>
            {about.intro}
          </p>

          {about.sections.map((section, si) => (
            <div key={`${section.heading}-${si}`}>
              <h2
                className="font-display"
                style={{
                  fontWeight: 600,
                  fontSize: 24,
                  color: "#143d31",
                  margin: "36px 0 12px",
                  borderBottom: "1px solid rgba(20,61,49,0.12)",
                  paddingBottom: 8
                }}
                {...cms(`about.sections.${si}.heading`)}
              >
                {section.heading}
              </h2>
              {section.paragraphs.map((p, pi) => (
                <p
                  key={`${si}-${pi}`}
                  style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: "0 0 16px" }}
                  {...cms(`about.sections.${si}.paragraphs.${pi}`)}
                >
                  {p}
                </p>
              ))}
            </div>
          ))}

          <h2
            className="font-display"
            style={{
              fontWeight: 600,
              fontSize: 24,
              color: "#143d31",
              margin: "36px 0 12px",
              borderBottom: "1px solid rgba(20,61,49,0.12)",
              paddingBottom: 8
            }}
            {...cms("about.recognitionHeading")}
          >
            {about.recognitionHeading}
          </h2>
          <ul style={{ fontSize: 16, lineHeight: 1.85, color: "#333", paddingLeft: 22, margin: "0 0 16px" }}>
            {about.recognition.map((item, i) => (
              <li key={i} {...cms(`about.recognition.${i}`)}>
                {item}
              </li>
            ))}
          </ul>

          <h2
            className="font-display"
            style={{
              fontWeight: 600,
              fontSize: 24,
              color: "#143d31",
              margin: "36px 0 12px",
              borderBottom: "1px solid rgba(20,61,49,0.12)",
              paddingBottom: 8
            }}
            {...cms("about.bibliographyHeading")}
          >
            {about.bibliographyHeading}
          </h2>
          <ul style={{ fontSize: 16, lineHeight: 1.85, color: "#333", paddingLeft: 22, margin: "0 0 16px" }}>
            {about.bibliography.map((item, i) => (
              <li key={i} {...cms(`about.bibliography.${i}`)}>
                <em>{item}</em>
              </li>
            ))}
          </ul>

          <h2
            className="font-display"
            style={{
              fontWeight: 600,
              fontSize: 24,
              color: "#143d31",
              margin: "36px 0 12px",
              borderBottom: "1px solid rgba(20,61,49,0.12)",
              paddingBottom: 8
            }}
            {...cms("about.seeAlsoHeading")}
          >
            {about.seeAlsoHeading}
          </h2>
          <ul style={{ fontSize: 16, lineHeight: 1.85, margin: "0 0 30px", paddingLeft: 22 }}>
            {about.seeAlso.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} {...cms(`about.seeAlso.${i}.label`)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div
            style={{
              background: "#fffdf8",
              border: "1px solid rgba(20,61,49,0.12)",
              borderRadius: 16,
              padding: "22px 24px",
              marginBottom: 20
            }}
          >
            <div
              className="font-display"
              style={{ fontWeight: 600, fontSize: 18, color: "#143d31", marginBottom: 8 }}
              {...cms("about.ctaTitle")}
            >
              {about.ctaTitle}
            </div>
            <p style={{ fontSize: 14, color: "#5f6b60", margin: "0 0 14px" }} {...cms("about.ctaBody")}>
              {about.ctaBody}
            </p>
            <Link
              href={about.ctaHref}
              style={{
                display: "inline-block",
                background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                padding: "12px 24px",
                borderRadius: 10
              }}
              {...cms("about.ctaLabel")}
            >
              {about.ctaLabel} →
            </Link>
          </div>
        </div>

        <div style={{ flex: "1 1 260px", minWidth: 260, maxWidth: 320 }}>
          <div
            style={{
              background: "#f4efe3",
              border: "1px solid rgba(20,61,49,0.15)",
              borderRadius: 4,
              overflow: "hidden"
            }}
          >
            <div
              className="font-display"
              style={{
                background: "#e7ddc0",
                padding: "10px 14px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: 16,
                color: "#143d31"
              }}
              {...cms("about.title")}
            >
              {about.title}
            </div>
            <div style={{ aspectRatio: "4/5", overflow: "hidden", position: "relative" }}>
              <Image
                src={about.imageUrl}
                alt={about.imageAlt}
                fill
                sizes="320px"
                style={{ objectFit: "cover", objectPosition: "50% 15%" }}
              />
            </div>
            <div style={{ padding: 14 }}>
              {about.infobox.map((row, i) => (
                <div key={`${row.label}-${i}`}>
                  <div
                    style={{ fontSize: 11, color: "#6b7268", textTransform: "uppercase", letterSpacing: "0.5px" }}
                    {...cms(`about.infobox.${i}.label`)}
                  >
                    {row.label}
                  </div>
                  <div style={{ fontSize: 13.5, color: "#2a2a28", margin: "2px 0 10px" }} {...cms(`about.infobox.${i}.value`)}>
                    {row.label.toLowerCase() === "app" ? <Link href="/destara">{row.value}</Link> : row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter variant="minimal" />
    </div>
  );
}
