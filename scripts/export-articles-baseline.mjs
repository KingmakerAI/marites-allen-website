/**
 * Read-only baseline export of CMS articles from Vercel Blob.
 * Does NOT write to Blob. Does NOT print secrets.
 *
 * Usage: node scripts/export-articles-baseline.mjs
 * Requires BLOB_READ_WRITE_TOKEN in env or .env.local
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { get } from "@vercel/blob";

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  const raw = fs.readFileSync(file, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!(k in process.env)) process.env[k] = v;
  }
}

loadEnv(".env.local");

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("BLOCKED: BLOB_READ_WRITE_TOKEN is not set.");
  process.exit(2);
}

const result = await get("cms/ma-cms.json", {
  access: "private",
  useCache: false,
  token
});

if (!result || result.statusCode !== 200) {
  console.error("BLOCKED: could not read cms/ma-cms.json", result?.statusCode);
  process.exit(3);
}

const raw = (await new Response(result.stream).text()).replace(/^\uFEFF/, "");
const data = JSON.parse(raw);
const articles = Array.isArray(data.articles) ? data.articles : [];
const cats = Object.fromEntries(
  (data.categories || []).map((c) => [c.id, c.name || c.slug || c.id])
);

const outDir = path.join("data", "baselines");
fs.mkdirSync(outDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupPath = path.join(outDir, `articles-baseline-${stamp}.json`);
const reportPath = path.join(outDir, `baseline-report-${stamp}.md`);

const backup = {
  exportedAt: new Date().toISOString(),
  source: "vercel-blob:cms/ma-cms.json",
  articleCount: articles.length,
  categories: data.categories || [],
  articles
};

fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2), "utf8");
fs.writeFileSync(
  path.join(outDir, "articles-baseline-LATEST.json"),
  JSON.stringify(backup, null, 2),
  "utf8"
);

/**
 * Checksum method (documented):
 * - Order: stable article `id` ascending via String.localeCompare(..., "en")
 * - Each line: `${id}\t${title}` where title is String(title ?? "")
 * - No trim, no case fold
 * - Join lines with `\n` (no trailing newline after last line)
 * - Hash: SHA-256 over UTF-8 bytes; output lowercase hex
 */
const ordered = [...articles].sort((a, b) =>
  String(a.id).localeCompare(String(b.id), "en")
);
const serialization = ordered
  .map((a) => `${String(a.id)}\t${String(a.title ?? "")}`)
  .join("\n");
const checksum = crypto
  .createHash("sha256")
  .update(serialization, "utf8")
  .digest("hex");

fs.writeFileSync(path.join(outDir, `title-checksum-${stamp}.txt`), `${checksum}\n`, "utf8");
fs.writeFileSync(path.join(outDir, "title-checksum-LATEST.txt"), `${checksum}\n`, "utf8");
fs.writeFileSync(
  path.join(outDir, "title-serialization-LATEST.txt"),
  serialization,
  "utf8"
);

const byCat = {};
for (const a of articles) {
  const key = a.categoryId ? cats[a.categoryId] || a.categoryId : "(uncategorized)";
  byCat[key] = (byCat[key] || 0) + 1;
}
const byStatus = {};
for (const a of articles) {
  const s = a.status || "(none)";
  byStatus[s] = (byStatus[s] || 0) + 1;
}
const byYear = {};
for (const a of articles) {
  const y = String(a.year ?? "(none)");
  byYear[y] = (byYear[y] || 0) + 1;
}

const titles = ordered.map(
  (a, i) =>
    `${i + 1}. [${a.id}] ${a.title ?? "(no title)"} | ${a.outlet || ""} | ${a.year}-${String(a.month ?? "").padStart(2, "0")} | ${a.status || ""}`
);

const lines = [
  "# Media stories baseline report",
  "",
  `- Exported at: ${backup.exportedAt}`,
  "- Source: Vercel Blob private path `cms/ma-cms.json`",
  `- Article count: **${articles.length}**`,
  "- Checksum method: SHA-256 over UTF-8 serialization of articles sorted by stable `id` ascending (`String.localeCompare(..., \"en\")`).",
  "- Serialization line format: `{id}\\t{title}` joined by `\\n` (no trailing newline after the last line).",
  '- Normalization: `String(id)` and `String(title ?? "")` as stored; no lowercasing or whitespace trim.',
  `- Title checksum (SHA-256 hex): \`${checksum}\``,
  `- Backup file: \`${backupPath.replace(/\\/g, "/")}\``,
  "",
  "## Counts by category/folder",
  ...Object.entries(byCat)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `- ${k}: ${v}`),
  "",
  "## Counts by status",
  ...Object.entries(byStatus)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `- ${k}: ${v}`),
  "",
  "## Counts by year",
  ...Object.entries(byYear)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([k, v]) => `- ${k}: ${v}`),
  "",
  "## Ordered titles (by id)",
  ...titles,
  ""
];

const report = lines.join("\n");
fs.writeFileSync(reportPath, report, "utf8");
fs.writeFileSync(path.join(outDir, "baseline-report-LATEST.md"), report, "utf8");

console.log(
  JSON.stringify(
    {
      articleCount: articles.length,
      checksum,
      byCat,
      byStatus,
      sampleFields: articles[0] ? Object.keys(articles[0]).sort() : [],
      backupPath,
      reportPath
    },
    null,
    2
  )
);
