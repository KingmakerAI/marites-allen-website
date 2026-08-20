"use client";

import { useState } from "react";
import type { PageBlock } from "@/lib/cms/types";

const CHOICES: Array<{ type: PageBlock["type"]; label: string; hint: string }> = [
  { type: "hero", label: "Big title", hint: "A large heading at the top" },
  { type: "heading", label: "Smaller heading", hint: "A section title" },
  { type: "richText", label: "Writing", hint: "Paragraphs of text" },
  { type: "image", label: "Picture", hint: "A photo" },
  { type: "cta", label: "Button", hint: "A clickable button" },
  { type: "faq", label: "Questions", hint: "A list of questions and answers" },
  { type: "spacer", label: "Empty space", hint: "A little gap" }
];

function emptyBlock(type: PageBlock["type"]): PageBlock {
  if (type === "hero") return { type: "hero", heading: "", subheading: "", ctaLabel: "", ctaHref: "/book" };
  if (type === "heading") return { type: "heading", text: "" };
  if (type === "image") return { type: "image", src: "", alt: "" };
  if (type === "cta") return { type: "cta", label: "Learn more", href: "/book" };
  if (type === "faq") return { type: "faq", items: [{ q: "", a: "" }] };
  if (type === "spacer") return { type: "spacer" };
  return { type: "richText", html: "" };
}

function stripTags(html: string) {
  return html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<[^>]+>/g, "").trim();
}

function toHtml(text: string) {
  const parts = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) return "<p></p>";
  return parts.map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`).join("");
}

export function PageBlocksEditor({ initial }: { initial: PageBlock[] }) {
  const [blocks, setBlocks] = useState<PageBlock[]>(initial.length ? initial : [emptyBlock("hero"), emptyBlock("richText")]);

  const update = (next: PageBlock[]) => {
    setBlocks(next);
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>('input[name="blocks"]');
      input?.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };

  return (
    <div className="block-editor">
      <input type="hidden" name="blocks" value={JSON.stringify(blocks)} />
      <p className="field-hint">Each box is one piece of the page. Add, change, or remove them. Watch the preview on the right.</p>
      {blocks.map((block, index) => (
        <div key={`${block.type}-${index}`} className="block-card">
          <div className="block-card-head">
            <strong>
              {CHOICES.find((c) => c.type === block.type)?.label || block.type}
            </strong>
            <div className="admin-actions">
              <button type="button" className="btn secondary" disabled={index === 0} onClick={() => {
                const next = [...blocks];
                [next[index - 1], next[index]] = [next[index], next[index - 1]];
                update(next);
              }}>
                Up
              </button>
              <button type="button" className="btn secondary" disabled={index === blocks.length - 1} onClick={() => {
                const next = [...blocks];
                [next[index + 1], next[index]] = [next[index], next[index + 1]];
                update(next);
              }}>
                Down
              </button>
              <button type="button" className="btn danger" onClick={() => update(blocks.filter((_, i) => i !== index))}>
                Remove
              </button>
            </div>
          </div>

          {block.type === "hero" && (
            <>
              <label>
                Big title
                <input value={block.heading} onChange={(e) => update(blocks.map((b, i) => i === index && b.type === "hero" ? { ...b, heading: e.target.value } : b))} />
              </label>
              <label>
                Extra sentence
                <textarea rows={2} value={block.subheading || ""} onChange={(e) => update(blocks.map((b, i) => i === index && b.type === "hero" ? { ...b, subheading: e.target.value } : b))} />
              </label>
              <div className="fields-2">
                <label>
                  Button words
                  <input value={block.ctaLabel || ""} onChange={(e) => update(blocks.map((b, i) => i === index && b.type === "hero" ? { ...b, ctaLabel: e.target.value } : b))} />
                </label>
                <label>
                  Button goes to
                  <input value={block.ctaHref || ""} onChange={(e) => update(blocks.map((b, i) => i === index && b.type === "hero" ? { ...b, ctaHref: e.target.value } : b))} />
                </label>
              </div>
            </>
          )}

          {block.type === "heading" && (
            <label>
              Heading
              <input value={block.text} onChange={(e) => update(blocks.map((b, i) => i === index && b.type === "heading" ? { ...b, text: e.target.value } : b))} />
            </label>
          )}

          {block.type === "richText" && (
            <label>
              Writing
              <textarea rows={5} value={stripTags(block.html)} onChange={(e) => update(blocks.map((b, i) => i === index && b.type === "richText" ? { ...b, html: toHtml(e.target.value) } : b))} />
              <span className="field-hint">Type normally. Leave a blank line to start a new paragraph.</span>
            </label>
          )}

          {block.type === "image" && (
            <div className="fields-2">
              <label>
                Picture link
                <input value={block.src} onChange={(e) => update(blocks.map((b, i) => i === index && b.type === "image" ? { ...b, src: e.target.value } : b))} placeholder="/uploads/photo.jpg" />
              </label>
              <label>
                Describe the picture
                <input value={block.alt} onChange={(e) => update(blocks.map((b, i) => i === index && b.type === "image" ? { ...b, alt: e.target.value } : b))} />
              </label>
            </div>
          )}

          {block.type === "cta" && (
            <div className="fields-2">
              <label>
                Button words
                <input value={block.label} onChange={(e) => update(blocks.map((b, i) => i === index && b.type === "cta" ? { ...b, label: e.target.value } : b))} />
              </label>
              <label>
                Button goes to
                <input value={block.href} onChange={(e) => update(blocks.map((b, i) => i === index && b.type === "cta" ? { ...b, href: e.target.value } : b))} />
              </label>
            </div>
          )}

          {block.type === "faq" && (
            <div className="shop-stack">
              {block.items.map((item, qi) => (
                <div key={qi} className="fields-2">
                  <label>
                    Question
                    <input
                      value={item.q}
                      onChange={(e) =>
                        update(
                          blocks.map((b, i) =>
                            i === index && b.type === "faq"
                              ? { ...b, items: b.items.map((it, j) => (j === qi ? { ...it, q: e.target.value } : it)) }
                              : b
                          )
                        )
                      }
                    />
                  </label>
                  <label>
                    Answer
                    <input
                      value={item.a}
                      onChange={(e) =>
                        update(
                          blocks.map((b, i) =>
                            i === index && b.type === "faq"
                              ? { ...b, items: b.items.map((it, j) => (j === qi ? { ...it, a: e.target.value } : it)) }
                              : b
                          )
                        )
                      }
                    />
                  </label>
                </div>
              ))}
              <button
                type="button"
                className="btn secondary"
                onClick={() =>
                  update(blocks.map((b, i) => (i === index && b.type === "faq" ? { ...b, items: [...b.items, { q: "", a: "" }] } : b)))
                }
              >
                Add a question
              </button>
            </div>
          )}

          {block.type === "spacer" && <p className="field-hint">This just adds a little empty space.</p>}
          {!CHOICES.some((choice) => choice.type === block.type) && (
            <p className="field-hint">This special piece stays as it is. You can still move or remove it.</p>
          )}
        </div>
      ))}

      <div className="block-add">
        <span>Add a piece:</span>
        {CHOICES.map((choice) => (
          <button key={choice.type} type="button" className="btn secondary" title={choice.hint} onClick={() => update([...blocks, emptyBlock(choice.type)])}>
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}
