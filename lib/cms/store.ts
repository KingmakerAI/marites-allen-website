import "server-only";
import fs from "fs";
import path from "path";
import type {
  AdminUser,
  Article,
  ArticleCategory,
  AuditLog,
  CmsEvent,
  CmsPage,
  ConsultationService,
  FaqItem,
  HomeSection,
  MediaAsset,
  NavigationItem,
  PasswordReset,
  PricingRow,
  Session,
  Signup,
  SiteSettings,
  Testimonial
} from "./types";
import type { PageCopy } from "./page-copy-types";

export type StoredAdminUser = AdminUser & {
  passwordHash: string;
  passwordReset?: PasswordReset;
};

export type StoreData = {
  adminUsers: StoredAdminUser[];
  sessions: Session[];
  pages: CmsPage[];
  articles: Article[];
  categories: ArticleCategory[];
  media: MediaAsset[];
  services: ConsultationService[];
  pricing: PricingRow[];
  events: CmsEvent[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  navigation: NavigationItem[];
  settings: SiteSettings | null;
  homeSections: HomeSection[];
  auditLog: AuditLog[];
  signups: Signup[];
  pageCopy: PageCopy | null;
  /** Working copy for Live Edit / Copy screens. Publish copies this to pageCopy. */
  pageCopyDraft: PageCopy | null;
  bootstrap?: {
    owners?: string;
    maritesPassword?: string;
    attempts?: { key: string; count: number; resetAt: number }[];
  };
};

const EMPTY: StoreData = {
  adminUsers: [],
  sessions: [],
  pages: [],
  articles: [],
  categories: [],
  media: [],
  services: [],
  pricing: [],
  events: [],
  testimonials: [],
  faqs: [],
  navigation: [],
  settings: null,
  homeSections: [],
  auditLog: [],
  signups: [],
  pageCopy: null,
  pageCopyDraft: null,
  bootstrap: {}
};

const CMS_BLOB_PATH = "cms/ma-cms.json";

function emptyStore(): StoreData {
  return structuredClone(EMPTY);
}

function normalize(parsed: Partial<StoreData>): StoreData {
  return {
    ...emptyStore(),
    ...parsed,
    signups: parsed.signups || [],
    pageCopy: parsed.pageCopy || null,
    pageCopyDraft: parsed.pageCopyDraft || null,
    bootstrap: parsed.bootstrap || {}
  };
}

/** Blob on Vercel (or when CMS_STORE=blob). A local disk everywhere else, including tests. */
export function useBlobStore() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  return Boolean(process.env.VERCEL) || process.env.CMS_STORE === "blob";
}

export type PersistenceMode = "blob" | "file" | "ephemeral";

export function persistenceMode(): PersistenceMode {
  if (useBlobStore()) return "blob";
  if (process.env.VERCEL) return "ephemeral";
  return "file";
}

export function getStorePath() {
  if (process.env.CMS_JSON_PATH) return process.env.CMS_JSON_PATH;
  // Vercel’s app filesystem is read-only; keep a mutable copy under /tmp.
  if (process.env.VERCEL) {
    return path.join("/tmp", "ma-cms.json");
  }
  const root = process.cwd();
  return path.join(/* turbopackIgnore: true */ root, "data", "cms.json");
}

let fileMemo: { path: string; mtime: number; data: StoreData } | null = null;

function readFileStore(): StoreData {
  const storePath = getStorePath();
  try {
    if (!fs.existsSync(storePath)) return emptyStore();
    const mtime = fs.statSync(storePath).mtimeMs;
    if (fileMemo && fileMemo.path === storePath && fileMemo.mtime === mtime) return structuredClone(fileMemo.data);
    // Strip UTF-8 BOM (common on OneDrive / Windows editors) so JSON.parse succeeds.
    const raw = fs.readFileSync(storePath, "utf8").replace(/^\uFEFF/, "");
    const data = normalize(JSON.parse(raw) as Partial<StoreData>);
    fileMemo = { path: storePath, mtime, data };
    return structuredClone(data);
  } catch {
    return emptyStore();
  }
}

let ephemeralWrites = 0;

/** Seed may write a scratch copy. A real save on Vercel may not. */
export function allowEphemeralWrites() {
  ephemeralWrites += 1;
}

export function endEphemeralWrites() {
  ephemeralWrites = Math.max(0, ephemeralWrites - 1);
}

function writeFileStore(data: StoreData) {
  const storePath = getStorePath();
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  const payload = JSON.stringify(data, null, 2);
  const tmp = `${storePath}.tmp`;
  fs.writeFileSync(tmp, payload, "utf8");
  try {
    fs.renameSync(tmp, storePath);
  } catch {
    try {
      fs.copyFileSync(tmp, storePath);
      fs.unlinkSync(tmp);
    } catch {
      fs.writeFileSync(storePath, payload, "utf8");
      try {
        fs.unlinkSync(tmp);
      } catch {
        /* OneDrive may lock the temp file briefly */
      }
    }
  }
}

function isMissingBlob(err: unknown) {
  if (!err || typeof err !== "object") return false;
  const status = "status" in err ? Number((err as { status?: number }).status) : 0;
  const name = "name" in err ? String((err as { name?: string }).name) : "";
  const message = err instanceof Error ? err.message : "";
  return status === 404 || name === "BlobNotFoundError" || /not found|does not exist|blob_not_found/i.test(message);
}

async function readBlobStore(): Promise<StoreData> {
  const { get } = await import("@vercel/blob");
  try {
    const result = await get(CMS_BLOB_PATH, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return emptyStore();
    const raw = (await new Response(result.stream).text()).replace(/^\uFEFF/, "");
    return normalize(JSON.parse(raw) as Partial<StoreData>);
  } catch (err) {
    if (isMissingBlob(err)) return emptyStore();
    throw err;
  }
}

async function writeBlobStore(data: StoreData) {
  const { put } = await import("@vercel/blob");
  await put(CMS_BLOB_PATH, JSON.stringify(data), {
    access: "private",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json"
  });
}

// Collapse repeated reads during one page render. Writes refresh it.
let blobMemo: { at: number; data: StoreData } | null = null;
const BLOB_MEMO_MS = 1500;

export async function readStore(): Promise<StoreData> {
  if (!useBlobStore()) return readFileStore();
  if (blobMemo && Date.now() - blobMemo.at < BLOB_MEMO_MS) return structuredClone(blobMemo.data);
  const data = await readBlobStore();
  blobMemo = { at: Date.now(), data };
  return structuredClone(data);
}

export async function writeStore(data: StoreData) {
  if (process.env.VERCEL && !useBlobStore() && ephemeralWrites === 0) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set. This save was not stored.");
  }
  if (!useBlobStore()) {
    writeFileStore(data);
    try {
      fileMemo = { path: getStorePath(), mtime: fs.statSync(getStorePath()).mtimeMs, data: structuredClone(data) };
    } catch {
      fileMemo = null;
    }
    return;
  }
  await writeBlobStore(data);
  blobMemo = { at: Date.now(), data: structuredClone(data) };
}

export async function mutateStore<T>(fn: (store: StoreData) => T): Promise<T> {
  const store = await readStore();
  const result = fn(store);
  await writeStore(store);
  return result;
}

export async function mutateStoreIfChanged(fn: (store: StoreData) => boolean) {
  const store = await readStore();
  if (!fn(store)) return false;
  await writeStore(store);
  return true;
}

export async function storeUploadedFile(filename: string, body: Buffer, contentType: string) {
  if (!useBlobStore()) {
    const rel = `/uploads/${filename}`;
    const dest = path.join(process.cwd(), "public", "uploads", filename);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, body);
    return rel;
  }
  const { put } = await import("@vercel/blob");
  const blob = await put(`uploads/${filename}`, body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType
  });
  return blob.url;
}

export async function removeStoredFile(filePath: string) {
  if (/^https?:/i.test(filePath)) {
    const { del } = await import("@vercel/blob");
    await del(filePath);
    return;
  }
  if (!filePath.startsWith("/uploads/")) return;
  const dest = path.join(process.cwd(), "public", filePath.replace(/^\//, ""));
  if (fs.existsSync(dest)) fs.unlinkSync(dest);
}
