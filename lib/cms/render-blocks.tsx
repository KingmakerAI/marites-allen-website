import type { PageBlock } from "./types";

export function PageBlocks({ blocks }: { blocks: PageBlock[] }) {
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
        return null;
      })}
    </div>
  );
}
