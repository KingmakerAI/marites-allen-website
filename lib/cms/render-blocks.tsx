import type { PageBlock } from "./types";

type GridArticle = { slug: string; title: string; outlet?: string; year?: number };

export function PageBlocks({ blocks, articles = [] }: { blocks: PageBlock[]; articles?: GridArticle[] }) {
  return (
    <div className="cms-blocks">
      {blocks.map((block, i) => {
        if (block.type === "hero") {
          return (
            <section key={i} className="cms-hero">
              <h1 className="font-display" style={{ fontSize: "clamp(26px,3.6vw,38px)", color: "#143d31", margin: "0 0 10px" }}>
                {block.heading}
              </h1>
              {block.subheading && <p style={{ fontSize: 16, lineHeight: 1.65, color: "#5f6b60" }}>{block.subheading}</p>}
              {block.ctaHref && block.ctaLabel && (
                <p>
                  <a href={block.ctaHref} style={{ fontWeight: 700, color: "#143d31" }}>
                    {block.ctaLabel}
                  </a>
                </p>
              )}
            </section>
          );
        }
        if (block.type === "heading") {
          return (
            <h2 key={i} className="font-display" style={{ color: "#143d31", fontSize: 24, margin: "28px 0 10px" }}>
              {block.text}
            </h2>
          );
        }
        if (block.type === "richText") {
          return (
            <div
              key={i}
              className="cms-rich"
              style={{ fontSize: 16, lineHeight: 1.7, color: "#3d4a41" }}
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          );
        }
        if (block.type === "image") {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={block.src} alt={block.alt} style={{ width: "100%", height: "auto", borderRadius: 16, margin: "16px 0" }} />
          );
        }
        if (block.type === "cta") {
          return (
            <p key={i} style={{ margin: "20px 0" }}>
              <a href={block.href} style={{ fontWeight: 700, color: "#143d31" }}>
                {block.label}
              </a>
              {block.note ? <span> — {block.note}</span> : null}
            </p>
          );
        }
        if (block.type === "faq") {
          return (
            <div key={i}>
              {block.items.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          );
        }
        if (block.type === "spacer") return <div key={i} style={{ height: 24 }} />;
        if (block.type === "articleGrid") {
          const items = articles.slice(0, block.limit || 6);
          if (!items.length) {
            return (
              <p key={i} style={{ color: "#6b7268", margin: "16px 0" }}>
                Latest stories will appear here.
              </p>
            );
          }
          return (
            <div key={i} style={{ display: "grid", gap: 12, margin: "16px 0 24px" }}>
              {items.map((item) => (
                <a
                  key={item.slug}
                  href={`/articles/${item.slug}`}
                  style={{
                    display: "block",
                    background: "#fffdf8",
                    border: "1px solid rgba(20,61,49,0.1)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    color: "#143d31"
                  }}
                >
                  <strong className="font-display" style={{ display: "block", fontSize: 18, lineHeight: 1.35 }}>
                    {item.title}
                  </strong>
                  <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "#6b7268" }}>
                    {[item.outlet, item.year].filter(Boolean).join(" · ")}
                  </span>
                </a>
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
