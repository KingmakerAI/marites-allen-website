const ALLOWED = new Set(["p", "br", "strong", "em", "ul", "ol", "li", "a", "h2", "h3", "blockquote"]);

function decodeUrl(value: string) {
  return value
    .replace(/&colon;/gi, ":")
    .replace(/&#0*58;/g, ":")
    .replace(/&#x0*3a;/gi, ":")
    .replace(/[\u0000-\u0020]+/g, "");
}

function safeHref(raw: string) {
  const url = decodeUrl(raw.trim());
  if (!url || /javascript:/i.test(url)) return "";
  if (!/^(https?:|\/|#|mailto:)/i.test(url)) return "";
  return url.replace(/"/g, "");
}

/** Walk tags as tokens and keep only the allowlist. */
export function sanitizeHtml(input: string) {
  const out: string[] = [];
  const tokens = input.match(/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|[^<]+/g) || [];
  for (const token of tokens) {
    if (token.startsWith("<!--")) continue;
    if (!token.startsWith("<")) {
      out.push(token.replace(/javascript:/gi, ""));
      continue;
    }
    const parsed = /^<\/?([a-zA-Z0-9]+)([^>]*)>?/.exec(token);
    if (!parsed) continue;
    const name = parsed[1].toLowerCase();
    if (!ALLOWED.has(name)) continue;
    if (token.startsWith("</")) {
      if (name !== "br") out.push(`</${name}>`);
      continue;
    }
    if (name === "br") {
      out.push("<br />");
      continue;
    }
    if (name === "a") {
      const href = /href\s*=\s*("([^"]*)"|'([^']*)')/i.exec(parsed[2] || "");
      const url = safeHref(href?.[2] || href?.[3] || "");
      out.push(url ? `<a href="${url}" rel="noopener noreferrer">` : "<a>");
      continue;
    }
    out.push(`<${name}>`);
  }
  return out.join("");
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
