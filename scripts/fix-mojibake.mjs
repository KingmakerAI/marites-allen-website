import fs from "fs";
import path from "path";

const CP1252_REVERSE = {
  0x20ac: 0x80,
  0x201a: 0x82,
  0x0192: 0x83,
  0x201e: 0x84,
  0x2026: 0x85,
  0x2020: 0x86,
  0x2021: 0x87,
  0x02c6: 0x88,
  0x2030: 0x89,
  0x0160: 0x8a,
  0x2039: 0x8b,
  0x0152: 0x8c,
  0x017d: 0x8e,
  0x2018: 0x91,
  0x2019: 0x92,
  0x201c: 0x93,
  0x201d: 0x94,
  0x2022: 0x95,
  0x2013: 0x96,
  0x2014: 0x97,
  0x02dc: 0x98,
  0x2122: 0x99,
  0x0161: 0x9a,
  0x203a: 0x9b,
  0x0153: 0x9c,
  0x017e: 0x9e,
  0x0178: 0x9f
};

function decodeAsUtf8FromCp1252(value) {
  const bytes = Buffer.alloc(value.length);
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code <= 0xff) {
      bytes[i] = code;
      continue;
    }
    const mapped = CP1252_REVERSE[code];
    if (mapped === undefined) return null;
    bytes[i] = mapped;
  }
  const fixed = bytes.toString("utf8");
  if (!fixed || fixed.includes("\uFFFD")) return null;
  return fixed;
}

const LITERAL_FIXES = [
  [/\u00E2\u2020\u2019/g, "\u2192"],
  [/\u00C2\u00B7/g, "\u00B7"],
  [/\u00E2\u20AC\u201D/g, "\u2014"],
  [/\u00E2\u20AC\u201C/g, "\u2013"],
  [/\u00E2\u20AC\u2122/g, "\u2019"],
  [/\u00C3\u00A9/g, "\u00E9"],
  [/\u00C3\u00A8/g, "\u00E8"],
  [/\u00C3\u00A0/g, "\u00E0"]
];

function repairMojibake(value) {
  if (!/[ÃÂâï]/.test(value)) return value;
  const decoded = decodeAsUtf8FromCp1252(value);
  if (decoded && decoded !== value && !/[ÃÂâï]/.test(decoded)) return decoded;
  let next = value;
  for (const [pattern, replacement] of LITERAL_FIXES) next = next.replace(pattern, replacement);
  return next;
}

function repairDeep(value) {
  if (typeof value === "string") return repairMojibake(value);
  if (Array.isArray(value)) return value.map(repairDeep);
  if (value && typeof value === "object") {
    const out = {};
    for (const [key, item] of Object.entries(value)) out[key] = repairDeep(item);
    return out;
  }
  return value;
}

const file = path.join(process.cwd(), "data", "cms.json");
if (!fs.existsSync(file)) {
  console.log("no cms.json");
  process.exit(0);
}
const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
const data = JSON.parse(raw);
const fixed = repairDeep(data);
fs.writeFileSync(file, JSON.stringify(fixed, null, 2) + "\n", "utf8");
const before = (raw.match(/[ÃÂâï]/g) || []).length;
const after = (JSON.stringify(fixed).match(/[ÃÂâï]/g) || []).length;
console.log(`repaired cms.json: marker chars ${before} -> ${after}`);
