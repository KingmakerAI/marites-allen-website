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
  bootstrap?: { owners?: string };
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
  bootstrap: {}
};

function emptyStore(): StoreData {
  return structuredClone(EMPTY);
}

export function getStorePath() {
  const root = process.cwd();
  return process.env.CMS_JSON_PATH || path.join(/* turbopackIgnore: true */ root, "data", "cms.json");
}

export function readStore(): StoreData {
  const storePath = getStorePath();
  try {
    if (!fs.existsSync(storePath)) return emptyStore();
    const raw = fs.readFileSync(storePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    return { ...emptyStore(), ...parsed, signups: parsed.signups || [], pageCopy: parsed.pageCopy || null, bootstrap: parsed.bootstrap || {} };
  } catch {
    return emptyStore();
  }
}

export function writeStore(data: StoreData) {
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

export function mutateStore<T>(fn: (store: StoreData) => T): T {
  const store = readStore();
  const result = fn(store);
  writeStore(store);
  return result;
}

export function mutateStoreIfChanged(fn: (store: StoreData) => boolean) {
  const store = readStore();
  if (!fn(store)) return false;
  writeStore(store);
  return true;
}
