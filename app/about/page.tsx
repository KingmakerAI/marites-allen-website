import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Marites Allen",
  description:
    "Meet Marites Allen, the Feng Shui Queen — first Filipina Master in Feng Shui, author, speaker, and consultant to families and leaders in 100+ countries.",
  path: "/about",
  keywords: ["about Marites Allen", "Feng Shui Queen biography", "Filipina Feng Shui master"],
  type: "profile"
});

export default function AboutPage() {
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
        <div style={{ fontSize: 12, color: "#8a8a80" }}>Marites Allen</div>
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
        >
          Marites Allen
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
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: "20px 0" }}>
            <strong>Marites Allen</strong>, widely known as <strong>the Feng Shui Queen</strong>, is a Filipina Feng
            Shui master, author and consultant. In 2013 she became the first Filipina awarded the title of{" "}
            <strong>Master in Feng Shui</strong> by the International Feng Shui Association. Over more than three
            decades of practice, she has advised individuals, families, and organizations across more than 100
            countries, and is based between Manila, Philippines, and London, United Kingdom.
          </p>

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
          >
            Early life and education
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: "0 0 16px" }}>
            Allen&apos;s interest in Chinese metaphysics and Feng Shui developed over years of independent study and
            travel, including exposure to teachings connected to His Holiness the Dalai Lama. She holds an MBA from the
            Ateneo Graduate School of Business, pairing a formal business education with her metaphysical practice.
          </p>

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
          >
            Career
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: "0 0 16px" }}>
            Allen built her practice around personal Destiny Readings (BaZi astrology), home and office Feng Shui
            audits, and business consultations on timing and strategy. Her clients have included business leaders,
            celebrities and public figures, drawn by her approach that blends traditional Chinese metaphysics with
            practical, real-world guidance.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: "0 0 16px" }}>
            She is a frequent media commentator on Chinese astrology and the annual Chinese New Year forecast,
            appearing regularly on Philippine television and in international press. She also hosts{" "}
            <em>Marites Allen Live</em>, a recurring broadcast segment sharing Feng Shui guidance and yearly forecasts.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: "0 0 16px" }}>
            In 2026, Allen extended her practice into technology with the launch of{" "}
            <Link href="/destara">Destara</Link>, an AI-powered &quot;Destiny Guide&quot; trained on her three decades
            of Feng Shui knowledge, offering guidance to a global audience in over 50 languages.
          </p>

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
          >
            Philosophy
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#333", margin: "0 0 16px" }}>
            Allen is known for demystifying Feng Shui for a broad, non-Chinese audience. As she frequently states,{" "}
            <strong>&quot;You don&apos;t have to be Chinese, it&apos;s all about energy,&quot;</strong> emphasizing
            that Feng Shui is &quot;not a religion, not magic, and never a superstition,&quot; but a practical
            framework for aligning one&apos;s environment and timing with one&apos;s goals.
          </p>

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
          >
            Recognition
          </h2>
          <ul style={{ fontSize: 16, lineHeight: 1.85, color: "#333", paddingLeft: 22, margin: "0 0 16px" }}>
            <li>First Filipina awarded the title of Master in Feng Shui by the International Feng Shui Association (2013)</li>
            <li>Regularly featured in Forbes, Tatler Asia, Manila Bulletin, Manila Times, Philippine Star, and the Daily Tribune</li>
            <li>Television appearances discussing annual Chinese astrology forecasts</li>
            <li>Author of published works on Chinese astrology</li>
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
          >
            Bibliography
          </h2>
          <ul style={{ fontSize: 16, lineHeight: 1.85, color: "#333", paddingLeft: 22, margin: "0 0 16px" }}>
            <li>
              <em>Chinese Astrology: Decode the Zodiac</em>
            </li>
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
          >
            See also
          </h2>
          <ul style={{ fontSize: 16, lineHeight: 1.85, margin: "0 0 30px", paddingLeft: 22 }}>
            <li>
              <Link href="/projects">Brands &amp; projects Marites Allen has worked with</Link>
            </li>
            <li>
              <Link href="/events">Speaking engagements &amp; events</Link>
            </li>
            <li>
              <Link href="/forecast">2026 Chinese New Year forecast</Link>
            </li>
            <li>
              <Link href="/destara">Destara, the AI Destiny Guide</Link>
            </li>
            <li>
              <Link href="/media">Media coverage &amp; press kit</Link>
            </li>
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
            <div className="font-display" style={{ fontWeight: 600, fontSize: 18, color: "#143d31", marginBottom: 8 }}>
              Work with Marites Allen
            </div>
            <p style={{ fontSize: 14, color: "#5f6b60", margin: "0 0 14px" }}>
              Book a personal, home/office, or business consultation directly online.
            </p>
            <Link
              href="/book"
              style={{
                display: "inline-block",
                background: "linear-gradient(160deg,#1a4d3e,#143d31)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                padding: "12px 24px",
                borderRadius: 10
              }}
            >
              Book Consultation · Coming Soon →
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
            >
              Marites Allen
            </div>
            <div style={{ aspectRatio: "4/5", overflow: "hidden", position: "relative" }}>
              <Image
                src="/images/zip/marites-1.webp"
                alt="Marites Allen"
                fill
                sizes="320px"
                style={{ objectFit: "cover", objectPosition: "50% 15%" }}
              />
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: "#6b7268", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Occupation
              </div>
              <div style={{ fontSize: 13.5, color: "#2a2a28", margin: "2px 0 10px" }}>
                Feng Shui master, author, consultant
              </div>
              <div style={{ fontSize: 11, color: "#6b7268", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Known for
              </div>
              <div style={{ fontSize: 13.5, color: "#2a2a28", margin: "2px 0 10px" }}>
                First Filipina Master in Feng Shui (IFSA, 2013); annual CNY forecasts
              </div>
              <div style={{ fontSize: 11, color: "#6b7268", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Years active
              </div>
              <div style={{ fontSize: 13.5, color: "#2a2a28", margin: "2px 0 10px" }}>30+ years</div>
              <div style={{ fontSize: 11, color: "#6b7268", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Based in
              </div>
              <div style={{ fontSize: 13.5, color: "#2a2a28", margin: "2px 0 10px" }}>
                Manila, Philippines &amp; London, UK
              </div>
              <div style={{ fontSize: 11, color: "#6b7268", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Education
              </div>
              <div style={{ fontSize: 13.5, color: "#2a2a28", margin: "2px 0 10px" }}>
                MBA, Ateneo Graduate School of Business
              </div>
              <div style={{ fontSize: 11, color: "#6b7268", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Notable work
              </div>
              <div style={{ fontSize: 13.5, color: "#2a2a28", margin: "2px 0 10px" }}>
                Chinese Astrology: Decode the Zodiac
              </div>
              <div style={{ fontSize: 11, color: "#6b7268", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                App
              </div>
              <div style={{ fontSize: 13.5, color: "#2a2a28", margin: "2px 0 0" }}>
                <Link href="/destara">Destara</Link> (2026)
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter variant="minimal" />
    </div>
  );
}
