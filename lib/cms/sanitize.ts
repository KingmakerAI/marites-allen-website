const ALLOWED = new Set(["p", "br", "strong", "em", "ul", "ol", "li", "a", "h2", "h3", "blockquote"]);

function stripTags(html: string) {
  return html.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (full, tag: string, attrs: string) => {
    const name = tag.toLowerCase();
    if (!ALLOWED.has(name)) return "";
    if (name === "br") return "<br />";
    if (full.startsWith("</")) return `</${name}>`;
    if (name === "a") {
      const href = /href\s*=\s*("([^"]*)"|'([^']*)')/i.exec(attrs);
      const url = (href?.[2] || href?.[3] || "").trim();
      if (!url || !/^(https?:|\/|#|mailto:)/i.test(url)) return "<a>";
      return `<a href="${url.replace(/"/g, "")}" rel="noopener noreferrer">`;
    }
    return `<${name}>`;
  });
}

export function sanitizeHtml(input: string) {
  return stripTags(input).replace(/on\w+\s*=/gi, "").replace(/javascript:/gi, "");
}

function escapeText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Keep pasted HTML, and turn plain writing into paragraphs so line breaks survive on the page. */
export function formatArticleBody(input: string) {
  const clean = sanitizeHtml(input || "");
  if (!clean) return "";
  if (/<[a-z][^>]*>/i.test(clean)) return clean;
  return clean
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `<p>${escapeText(part).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export function sanitizeText(input: string, max = 4000) {
  return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, max).trim();
}
