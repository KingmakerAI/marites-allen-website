import "server-only";
import fs from "fs";
import path from "path";
import { Readable } from "node:stream";
import { readStore } from "./store";
import type { PressKitFile } from "./types";

/** Sentence baked into public/press-kit/PLACEHOLDER.pdf. Real kits must not include it. */
export const PRESS_KIT_PLACEHOLDER_MARK = "This is not the Marites Allen press kit.";

export const PRESS_KIT_DOWNLOAD_PATH = "/press-kit";
export const PRESS_KIT_MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const STATIC_NAMES = ["press-kit.pdf", "press-kit.zip"] as const;
const PLACEHOLDER_NAME = "PLACEHOLDER.pdf";

export type ResolvedPressKit = {
  filename: string;
  mimeType: string;
  size: number;
  placeholder: boolean;
  source: "upload" | "static";
  absolutePath?: string;
  remoteUrl?: string;
};

export type PressKitEmailStatus = "sent" | "not-configured" | "failed" | "no-file";

export type PressKitVisitorNotice = {
  emailed: boolean;
  headline: string;
  detail: string;
  downloadPath: string | null;
};

export function sniffPressKit(buf: Buffer): { mime: string; ext: ".pdf" | ".zip" } | null {
  if (buf.length >= 5 && buf.subarray(0, 5).toString("ascii") === "%PDF-") {
    return { mime: "application/pdf", ext: ".pdf" };
  }
  if (
    buf.length >= 4 &&
    buf[0] === 0x50 &&
    buf[1] === 0x4b &&
    (buf[2] === 0x03 || buf[2] === 0x05 || buf[2] === 0x07) &&
    (buf[3] === 0x04 || buf[3] === 0x06 || buf[3] === 0x08)
  ) {
    return { mime: "application/zip", ext: ".zip" };
  }
  return null;
}

export function fileLooksLikePlaceholder(buf: Buffer) {
  const head = buf.subarray(0, 8192).toString("latin1");
  return head.includes(PRESS_KIT_PLACEHOLDER_MARK);
}

export function publicSiteOrigin(headerList: { get(name: string): string | null }) {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/$/, "");
  if (configured) return configured;
  const host = (headerList.get("x-forwarded-host") || headerList.get("host") || "").split(",")[0].trim();
  if (!host) return "https://www.maritesallen.com";
  const forwarded = (headerList.get("x-forwarded-proto") || "").split(",")[0].trim();
  const proto = forwarded || (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Honest copy for the media page. "Sent to …" is only used when an email was accepted.
 */
export function pressKitVisitorNotice(input: {
  email: string;
  hasFile: boolean;
  emailStatus: PressKitEmailStatus;
  missing: string[];
}): PressKitVisitorNotice {
  if (!input.hasFile || input.emailStatus === "no-file") {
    return {
      emailed: false,
      headline: "Registered. The press kit file is not on the site yet.",
      detail:
        "Nothing was emailed. Add the file under Admin → Press kit, or add public/press-kit/press-kit.pdf (or press-kit.zip) and redeploy.",
      downloadPath: null
    };
  }
  if (input.emailStatus === "sent") {
    return {
      emailed: true,
      headline: `Sent to ${input.email}`,
      detail: "The download link is below, and the same link is in the email.",
      downloadPath: PRESS_KIT_DOWNLOAD_PATH
    };
  }
  const missing =
    input.missing.length > 0 ? input.missing.join("; ") : "RESEND_API_KEY and BOOKING_FROM_EMAIL (or RESET_FROM_EMAIL)";
  if (input.emailStatus === "not-configured") {
    return {
      emailed: false,
      headline: "Your press kit is ready to download.",
      detail: `Email was not sent. Missing on the host: ${missing}.`,
      downloadPath: PRESS_KIT_DOWNLOAD_PATH
    };
  }
  return {
    emailed: false,
    headline: "Your press kit is ready to download.",
    detail:
      "Email was not sent. The mail service refused the message. Check RESEND_API_KEY and BOOKING_FROM_EMAIL (or RESET_FROM_EMAIL). The from address has to be a verified sender.",
    downloadPath: PRESS_KIT_DOWNLOAD_PATH
  };
}

function defaultPublicDir() {
  return path.join(process.cwd(), "public");
}

function insideDir(root: string, target: string) {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(target);
  return resolved === resolvedRoot || resolved.startsWith(resolvedRoot + path.sep);
}

function statFile(abs: string, root: string) {
  if (!insideDir(root, abs)) return null;
  try {
    const stat = fs.statSync(abs);
    if (!stat.isFile() || stat.size <= 0) return null;
    return stat;
  } catch {
    return null;
  }
}

function allowedBlobUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname.endsWith(".public.blob.vercel-storage.com") || url.hostname.endsWith(".blob.vercel-storage.com"))
    );
  } catch {
    return false;
  }
}

function staticFile(publicDir: string, name: string, placeholder: boolean): ResolvedPressKit | null {
  const abs = path.join(publicDir, "press-kit", name);
  const stat = statFile(abs, publicDir);
  if (!stat) return null;
  const zip = name.endsWith(".zip");
  let marked = placeholder;
  if (!marked) {
    try {
      const head = Buffer.alloc(Math.min(8192, stat.size));
      const fd = fs.openSync(abs, "r");
      try {
        fs.readSync(fd, head, 0, head.length, 0);
      } finally {
        fs.closeSync(fd);
      }
      marked = fileLooksLikePlaceholder(head);
    } catch {
      marked = false;
    }
  }
  return {
    filename: name,
    mimeType: zip ? "application/zip" : "application/pdf",
    size: stat.size,
    placeholder: marked,
    source: "static",
    absolutePath: abs
  };
}

export function resolveStaticPressKit(publicDir = defaultPublicDir()): ResolvedPressKit | null {
  for (const name of STATIC_NAMES) {
    const file = staticFile(publicDir, name, false);
    if (file) return file;
  }
  return staticFile(publicDir, PLACEHOLDER_NAME, true);
}

function resolveUploaded(record: PressKitFile, publicDir: string): ResolvedPressKit | null {
  if (/^https?:/i.test(record.path)) {
    if (!allowedBlobUrl(record.path)) return null;
    return {
      filename: record.filename || "press-kit",
      mimeType: record.mimeType || "application/octet-stream",
      size: record.size,
      placeholder: Boolean(record.placeholder),
      source: "upload",
      remoteUrl: record.path
    };
  }
  if (!record.path.startsWith("/uploads/")) return null;
  const abs = path.join(publicDir, record.path.replace(/^\//, ""));
  const stat = statFile(abs, path.join(publicDir, "uploads"));
  if (!stat) return null;
  return {
    filename: record.filename || path.basename(abs),
    mimeType: record.mimeType || "application/octet-stream",
    size: stat.size,
    placeholder: Boolean(record.placeholder),
    source: "upload",
    absolutePath: abs
  };
}

/** Uploaded file wins. Then press-kit.pdf / press-kit.zip. Then the placeholder. */
export async function resolvePressKit(publicDir = defaultPublicDir()): Promise<ResolvedPressKit | null> {
  const record = (await readStore()).pressKitFile;
  if (record) {
    const uploaded = resolveUploaded(record, publicDir);
    if (uploaded) return uploaded;
  }
  return resolveStaticPressKit(publicDir);
}

export function pressKitDownloadName(file: ResolvedPressKit) {
  if (file.placeholder) return "press-kit-placeholder.pdf";
  if (file.mimeType === "application/zip" || file.filename.toLowerCase().endsWith(".zip")) return "press-kit.zip";
  return "press-kit.pdf";
}

export async function openPressKit(file: ResolvedPressKit): Promise<{
  stream: ReadableStream;
  size: number | null;
  mimeType: string;
  filename: string;
} | null> {
  const filename = pressKitDownloadName(file);
  if (file.absolutePath) {
    const stream = Readable.toWeb(fs.createReadStream(file.absolutePath)) as ReadableStream;
    return { stream, size: file.size, mimeType: file.mimeType, filename };
  }
  if (!file.remoteUrl) return null;
  try {
    const res = await fetch(file.remoteUrl, { signal: AbortSignal.timeout(20000) });
    if (!res.ok || !res.body) return null;
    const length = Number(res.headers.get("content-length") || "");
    return {
      stream: res.body,
      size: Number.isFinite(length) && length > 0 ? length : file.size || null,
      mimeType: file.mimeType || res.headers.get("content-type") || "application/octet-stream",
      filename
    };
  } catch {
    return null;
  }
}
