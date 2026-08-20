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

export function sanitizeText(input: string, max = 4000) {
  return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, max).trim();
}
