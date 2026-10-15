/** Map Unicode chars that Windows-1252 put in the 0x80–0x9F range back to bytes. */
const CP1252_REVERSE: Record<number, number> = {
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

function decodeAsUtf8FromCp1252(value: string): string | null {
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

/** Common UTF-8-as-Windows-1252 sequences. Patterns use escapes so this file stays clean UTF-8. */
const LITERAL_FIXES: Array<[RegExp, string]> = [
  [/\u00E2\u2020\u2019/g, "\u2192"], // â†’ →
  [/\u00C2\u00B7/g, "\u00B7"], // Â· ·
  [/\u00E2\u20AC\u201D/g, "\u2014"], // â€” —
  [/\u00E2\u20AC\u201C/g, "\u2013"], // â€“ –
  [/\u00E2\u20AC\u2122/g, "\u2019"], // â€™ ’
  [/\u00E2\u20AC\u02DC/g, "\u2018"], // â€˜ ‘
  [/\u00E2\u20AC\u0153/g, "\u201C"], // â€œ “
  [/\u00E2\u20AC\u009D/g, "\u201D"], // broken ”
  [/\u00E2\u20AC\u00A6/g, "\u2026"], // â€¦ …
  [/\u00E2\u20AC\u2018/g, "\u2018"],
  [/\u00E2\u20AC\u2019/g, "\u2019"],
  [/\u00E2\u20AC\u201C/g, "\u201C"],
  [/\u00E2\u20AC\u201D/g, "\u201D"],
  [/\u00C3\u00A9/g, "\u00E9"], // Ã© é
  [/\u00C3\u00A8/g, "\u00E8"], // Ã¨ è
  [/\u00C3\u00A1/g, "\u00E1"], // Ã¡ á
  [/\u00C3\u00AD/g, "\u00ED"], // Ã­ í
  [/\u00C3\u00B3/g, "\u00F3"], // Ã³ ó
  [/\u00C3\u00BA/g, "\u00FA"], // Ãº ú
  [/\u00C3\u00B1/g, "\u00F1"], // Ã± ñ
  [/\u00C3\u0089/g, "\u00C9"], // Ã‰ É
  [/\u00C3\u00A0/g, "\u00E0"] // Ã  à
];

/** UTF-8 bytes were saved as Windows-1252 text (e.g. â†’ for →). Re-decode them. */
export function repairMojibake(value: string): string {
  if (!/[ÃÂâï]/.test(value)) return value;

  const decoded = decodeAsUtf8FromCp1252(value);
  if (decoded && decoded !== value && !/[ÃÂâï]/.test(decoded)) return decoded;

  let next = value;
  for (const [pattern, replacement] of LITERAL_FIXES) {
    next = next.replace(pattern, replacement);
  }
  return next;
}

export function repairDeep<T>(value: T): T {
  if (typeof value === "string") return repairMojibake(value) as T;
  if (Array.isArray(value)) return value.map((item) => repairDeep(item)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      out[key] = repairDeep(item);
    }
    return out as T;
  }
  return value;
}
