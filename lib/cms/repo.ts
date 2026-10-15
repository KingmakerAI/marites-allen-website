import "server-only";
import { revalidateTag } from "next/cache";
import { newId, nowIso, slugify } from "./crypto";
import { sanitizeHtml, sanitizeText } from "./sanitize";
import { mergePageCopy } from "./page-copy-defaults";
import type { PageCopy } from "./page-copy-types";
import { mutateStore, readStore } from "./store";
import type {
  Article,
  ArticleCategory,
  CmsEvent,
  CmsPage,
  ConsultationService,
  ContentStatus,
  FaqItem,
  HomeSection,
  MediaAsset,
  NavigationItem,
  PageBlock,
  PricingRow,
  Signup,
  SignupKind,
  SignupStatus,
  SiteSettings,
  Testimonial
} from "./types";

export const CMS_TAGS = {
  pages: "cms-pages",
  articles: "cms-articles",
  media: "cms-media",
  services: "cms-services",
  events: "cms-events",
  settings: "cms-settings",
  nav: "cms-nav",
  home: "cms-home",
  pageCopy: "cms-page-copy"
};

function bust(tag: string) {
  try {
    revalidateTag(tag, "max");
  } catch {
    /* seed/scripts outside Next runtime */
  }
}

function monthName(m: number) {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1] || "";
}

function uniqueSlug(base: string, taken: (slug: string) => boolean) {
  const root = (base || "item").slice(0, 70);
  if (!taken(root)) return root;
  let n = 2;
  while (taken(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

export async function listPages() {
  return (await readStore()).pages.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getPage(id: string) {
  return (await readStore()).pages.find((p) => p.id === id) || null;
}

export async function getPageBySlug(slug: string, publishedOnly = false) {
  return (
    (await readStore()).pages.find(
      (p) => p.slug === slug && (!publishedOnly || p.status === "published")
    ) || null
  );
}

export async function savePage(input: Partial<CmsPage> & { title: string; slug: string; blocks: PageBlock[] }) {
  const id = input.id || newId();
  const page: CmsPage = {
    id,
    slug: slugify(input.slug),
    title: sanitizeText(input.title, 160),
    blocks: input.blocks.map((block) =>
      block.type === "richText" ? { ...block, html: sanitizeHtml(block.html) } : block
    ),
    status: (input.status || "draft") as ContentStatus,
    seoTitle: sanitizeText(input.seoTitle || input.title, 70),
    seoDescription: sanitizeText(input.seoDescription || "", 180),
    ogImageId: input.ogImageId ?? null,
    publishedAt: input.status === "published" ? input.publishedAt || nowIso() : null,
    updatedAt: nowIso()
  };
  await mutateStore((store) => {
    const idx = store.pages.findIndex((p) => p.id === id);
    if (idx >= 0) store.pages[idx] = page;
    else store.pages.unshift(page);
  });
  bust(CMS_TAGS.pages);
  return page;
}

export async function deletePage(id: string) {
  await mutateStore((store) => {
    store.pages = store.pages.filter((p) => p.id !== id);
  });
  bust(CMS_TAGS.pages);
}

export async function duplicatePage(id: string) {
  const page = await getPage(id);
  if (!page) return null;
  return await savePage({
    ...page,
    id: undefined,
    title: `${page.title} (copy)`,
    slug: `${page.slug}-copy`,
    status: "draft",
    publishedAt: null
  });
}

export async function listArticles(filter?: { status?: ContentStatus; q?: string; categoryId?: string }) {
  return (await readStore())
    .articles.filter((a) => {
      if (filter?.status && a.status !== filter.status) return false;
      if (filter?.categoryId === "none") {
        if (a.categoryId) return false;
      } else if (filter?.categoryId && a.categoryId !== filter.categoryId) return false;
      if (filter?.q) {
        const q = filter.q.toLowerCase();
        return `${a.title} ${a.outlet} ${a.excerpt} ${a.tags.join(" ")}`.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => b.year - a.year || b.month - a.month);
}

export async function getArticle(id: string) {
  return (await readStore()).articles.find((a) => a.id === id) || null;
}

export async function getArticleBySlug(slug: string) {
  return (await readStore()).articles.find((a) => a.slug === slug && a.status === "published") || null;
}

export async function publishedArticles() {
  return await listArticles({ status: "published" });
}

export async function saveArticle(input: Partial<Article> & { title: string; slug: string; year: number; month: number }) {
  const id = input.id || newId();
  const article = await mutateStore((store) => {
    const existing = store.articles.find((a) => a.id === id);
    const status = (input.status || "draft") as ContentStatus;
    const categoryId =
      input.categoryId && store.categories.some((c) => c.id === input.categoryId) ? input.categoryId : null;
    const row: Article = {
      id,
      slug: uniqueSlug(slugify(input.slug), (slug) => store.articles.some((a) => a.slug === slug && a.id !== id)),
      title: sanitizeText(input.title, 200),
      excerpt: sanitizeText(input.excerpt || "", 400),
      body: sanitizeHtml(input.body || ""),
      featuredImageId: input.featuredImageId ?? null,
      author: sanitizeText(input.author || "Marites Allen", 80),
      categoryId,
      tags: (input.tags || []).map((t) => sanitizeText(t, 40)).filter(Boolean),
      outlet: sanitizeText(input.outlet || "", 120),
      externalUrl: sanitizeText(input.externalUrl || "", 500),
      ctaLabel: sanitizeText(input.ctaLabel || "Read article", 40),
      year: input.year,
      month: input.month,
      status,
      publishedAt:
        status === "published"
          ? existing?.publishedAt || input.publishedAt || nowIso()
          : existing?.publishedAt || null,
      seoTitle: sanitizeText(input.seoTitle || input.title, 70),
      seoDescription: sanitizeText(input.seoDescription || input.excerpt || "", 180),
      updatedAt: nowIso()
    };
    const idx = store.articles.findIndex((a) => a.id === id);
    if (idx >= 0) store.articles[idx] = row;
    else store.articles.unshift(row);
    return row;
  });
  bust(CMS_TAGS.articles);
  return article;
}

export async function deleteArticle(id: string) {
  await mutateStore((store) => {
    store.articles = store.articles.filter((a) => a.id !== id);
  });
  bust(CMS_TAGS.articles);
}

export function articleMonthLabel(article: Article) {
  return monthName(article.month);
}

export async function listCategories() {
  return (await readStore()).categories.sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveCategory(input: Partial<ArticleCategory> & { name: string; slug: string }) {
  const id = input.id || newId();
  const row = await mutateStore((store) => {
    const next: ArticleCategory = {
      id,
      name: sanitizeText(input.name, 80),
      slug: uniqueSlug(slugify(input.slug), (slug) => store.categories.some((c) => c.slug === slug && c.id !== id)),
      description: sanitizeText(input.description || "", 300)
    };
    const idx = store.categories.findIndex((c) => c.id === id);
    if (idx >= 0) store.categories[idx] = next;
    else store.categories.push(next);
    return next;
  });
  bust(CMS_TAGS.articles);
  return row;
}

export async function deleteCategory(id: string) {
  await mutateStore((store) => {
    store.categories = store.categories.filter((c) => c.id !== id);
    store.articles = store.articles.map((a) => (a.categoryId === id ? { ...a, categoryId: null } : a));
  });
  bust(CMS_TAGS.articles);
}

export async function listMedia(q?: string) {
  return (await readStore())
    .media.filter((m) => !q || `${m.filename} ${m.altText}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getMedia(id: string) {
  return (await readStore()).media.find((m) => m.id === id) || null;
}

export async function saveMedia(asset: MediaAsset) {
  await mutateStore((store) => {
    store.media.unshift(asset);
  });
  bust(CMS_TAGS.media);
  return asset;
}

export async function mediaInUse(id: string) {
  const store = (await readStore());
  return (
    store.articles.some((a) => a.featuredImageId === id) ||
    store.pages.some((p) => p.ogImageId === id || JSON.stringify(p.blocks).includes(id)) ||
    store.services.some((s) => s.imageId === id)
  );
}

export async function deleteMedia(id: string) {
  if (await mediaInUse(id)) throw new Error("This image is still used by content.");
  const asset = await getMedia(id);
  await mutateStore((store) => {
    store.media = store.media.filter((m) => m.id !== id);
  });
  bust(CMS_TAGS.media);
  return asset;
}

export async function listServices() {
  return (await readStore()).services.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveService(input: ConsultationService) {
  await mutateStore((store) => {
    const idx = store.services.findIndex((s) => s.id === input.id);
    if (idx >= 0) store.services[idx] = input;
    else store.services.push(input);
  });
  bust(CMS_TAGS.services);
  return input;
}

export async function deleteService(id: string) {
  await mutateStore((store) => {
    store.services = store.services.filter((s) => s.id !== id);
    store.pricing = store.pricing.filter((p) => p.serviceId !== id);
  });
  bust(CMS_TAGS.services);
}

export async function listPricing() {
  return (await readStore()).pricing.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function savePricing(row: PricingRow) {
  await mutateStore((store) => {
    const idx = store.pricing.findIndex((p) => p.id === row.id);
    if (idx >= 0) store.pricing[idx] = row;
    else store.pricing.push(row);
  });
  bust(CMS_TAGS.services);
  return row;
}

export async function deletePricing(id: string) {
  await mutateStore((store) => {
    store.pricing = store.pricing.filter((p) => p.id !== id);
  });
  bust(CMS_TAGS.services);
}

export async function listEvents(publishedOnly = false) {
  return (await readStore())
    .events.filter((e) => !publishedOnly || e.status === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveEvent(row: CmsEvent) {
  await mutateStore((store) => {
    const idx = store.events.findIndex((e) => e.id === row.id);
    if (idx >= 0) store.events[idx] = row;
    else store.events.push(row);
  });
  bust(CMS_TAGS.events);
  return row;
}

export async function deleteEvent(id: string) {
  await mutateStore((store) => {
    store.events = store.events.filter((e) => e.id !== id);
  });
  bust(CMS_TAGS.events);
}

export async function listTestimonials() {
  return (await readStore()).testimonials
    .map((t) => ({ ...t, consentOnFile: Boolean(t.consentOnFile) }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveTestimonial(row: Testimonial) {
  await mutateStore((store) => {
    const idx = store.testimonials.findIndex((t) => t.id === row.id);
    if (idx >= 0) store.testimonials[idx] = row;
    else store.testimonials.push(row);
  });
  bust(CMS_TAGS.home);
  return row;
}

export async function listFaqs() {
  return (await readStore()).faqs.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveFaq(row: FaqItem) {
  await mutateStore((store) => {
    const idx = store.faqs.findIndex((f) => f.id === row.id);
    if (idx >= 0) store.faqs[idx] = row;
    else store.faqs.push(row);
  });
  bust(CMS_TAGS.home);
  return row;
}

export async function listNavigation(location?: "header" | "footer") {
  return (await readStore())
    .navigation.filter((n) => !location || n.location === location)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveNavigation(row: NavigationItem) {
  await mutateStore((store) => {
    const idx = store.navigation.findIndex((n) => n.id === row.id);
    if (idx >= 0) store.navigation[idx] = row;
    else store.navigation.push(row);
  });
  bust(CMS_TAGS.nav);
  return row;
}

export async function deleteNavigation(id: string) {
  await mutateStore((store) => {
    store.navigation = store.navigation.filter((n) => n.id !== id && n.parentId !== id);
  });
  bust(CMS_TAGS.nav);
}

export async function getSettings(): Promise<SiteSettings | null> {
  return (await readStore()).settings;
}

export async function saveSettings(settings: SiteSettings) {
  await mutateStore((store) => {
    store.settings = settings;
  });
  bust(CMS_TAGS.settings);
  bust(CMS_TAGS.nav);
  return settings;
}

export async function listHomeSections() {
  return (await readStore()).homeSections.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveHomeSection(row: HomeSection) {
  await mutateStore((store) => {
    const idx = store.homeSections.findIndex((h) => h.id === row.id);
    if (idx >= 0) store.homeSections[idx] = row;
    else store.homeSections.push(row);
  });
  bust(CMS_TAGS.home);
  return row;
}

export async function dashboardStats() {
  const store = (await readStore());
  const signups = store.signups || [];
  const byKind = (kind: SignupKind) => signups.filter((s) => s.kind === kind);
  const bookings = byKind("booking-waitlist");
  return {
    publishedArticles: store.articles.filter((a) => a.status === "published").length,
    draftArticles: store.articles.filter((a) => a.status === "draft").length,
    pages: store.pages.length,
    services: store.services.filter((s) => s.active).length,
    pricing: store.pricing.filter((p) => p.active).length,
    media: store.media.length,
    events: store.events.length,
    unreadSignups: bookings.filter((s) => s.status === "new").length,
    signups: bookings.length,
    speaking: byKind("speaking").length,
    pressKit: byKind("press-kit").length,
    destinyChart: byKind("destiny-chart").length,
    newsletter: byKind("newsletter").length,
    allMessages: signups.length,
    recent: store.auditLog.slice(0, 8)
  };
}

export async function listUsers() {
  return (await readStore()).adminUsers.map((user) => ({
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt
  }));
}

export async function listSignups(filter?: {
  kind?: SignupKind;
  status?: SignupStatus;
  q?: string;
  sort?: "createdAt" | "name" | "email" | "status" | "interest";
  dir?: "asc" | "desc";
}) {
  const sortKey = filter?.sort || "createdAt";
  const mul = filter?.dir === "asc" ? 1 : -1;
  return ((await readStore()).signups || [])
    .filter((row) => {
      if (filter?.kind && row.kind !== filter.kind) return false;
      if (filter?.status && row.status !== filter.status) return false;
      if (filter?.q) {
        const q = filter.q.toLowerCase();
        const extra = Object.values(row.fields || {}).join(" ");
        return `${row.email} ${row.name} ${row.phone} ${row.organization} ${row.notes} ${extra}`
          .toLowerCase()
          .includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const value = (row: typeof a) =>
        sortKey === "interest"
          ? `${row.fields?.service || ""} ${row.notes}`
          : sortKey === "name"
            ? row.name
            : sortKey === "email"
              ? row.email
              : sortKey === "status"
                ? row.status
                : row.createdAt;
      return value(a).localeCompare(value(b)) * mul;
    });
}

export async function saveSignup(input: Omit<Signup, "id" | "createdAt" | "status"> & { status?: SignupStatus }) {
  const email = sanitizeText(input.email, 160).toLowerCase();
  const kind = input.kind;
  return await mutateStore((store) => {
    if (!store.signups) store.signups = [];
    const existing = store.signups.find((row) => row.kind === kind && row.email === email);
    if (existing) {
      existing.name = sanitizeText(input.name || existing.name, 120);
      existing.phone = sanitizeText(input.phone || existing.phone, 40);
      existing.organization = sanitizeText(input.organization || existing.organization, 160);
      existing.notes = sanitizeText(input.notes || existing.notes, 4000);
      existing.source = sanitizeText(input.source || existing.source, 80);
      existing.fields = { ...existing.fields, ...input.fields };
      if (existing.status === "archived") existing.status = "new";
      return existing;
    }
    const row: Signup = {
      id: newId(),
      kind,
      email,
      name: sanitizeText(input.name || "", 120),
      phone: sanitizeText(input.phone || "", 40),
      organization: sanitizeText(input.organization || "", 160),
      notes: sanitizeText(input.notes || "", 4000),
      source: sanitizeText(input.source || "", 80),
      fields: Object.fromEntries(
        Object.entries(input.fields || {}).map(([k, v]) => [k, sanitizeText(v, 400)])
      ),
      status: input.status || "new",
      createdAt: nowIso()
    };
    store.signups.unshift(row);
    store.signups = store.signups.slice(0, 5000);
    return row;
  });
}

export async function updateSignupStatus(id: string, status: SignupStatus) {
  await mutateStore((store) => {
    const row = store.signups.find((s) => s.id === id);
    if (row) row.status = status;
  });
}

export async function deleteSignup(id: string) {
  await mutateStore((store) => {
    store.signups = store.signups.filter((s) => s.id !== id);
  });
}

export async function getPageCopy() {
  return mergePageCopy((await readStore()).pageCopy);
}

/** Draft working copy for admin editors. Falls back to the published copy. */
export async function getEditablePageCopy() {
  const store = await readStore();
  return mergePageCopy(store.pageCopyDraft || store.pageCopy);
}

export async function hasUnpublishedPageCopy() {
  const store = await readStore();
  if (!store.pageCopyDraft) return false;
  return JSON.stringify(mergePageCopy(store.pageCopyDraft)) !== JSON.stringify(mergePageCopy(store.pageCopy));
}

export type AdminSearchHit = {
  type: string;
  label: string;
  sub: string;
  href: string;
};

export async function searchAdmin(query: string, limit = 12): Promise<AdminSearchHit[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const store = (await readStore());
  const hits: AdminSearchHit[] = [];
  const match = (...parts: Array<string | null | undefined>) =>
    parts.some((part) => part && part.toLowerCase().includes(q));

  for (const page of store.pages) {
    if (match(page.title, page.slug)) {
      hits.push({ type: "Page", label: page.title, sub: `/${page.slug}`, href: `/admin/pages/${page.id}` });
    }
  }
  for (const article of store.articles) {
    if (match(article.title, article.outlet, article.excerpt)) {
      hits.push({
        type: "Article",
        label: article.title,
        sub: `${article.outlet || "Article"} · ${article.status}`,
        href: `/admin/articles/${article.id}`
      });
    }
  }
  for (const service of store.services) {
    if (match(service.name, service.description, service.categoryLabel)) {
      hits.push({ type: "Consultation", label: service.name, sub: service.categoryLabel || "Consultation", href: "/admin/consultations" });
    }
  }
  for (const event of store.events) {
    if (match(event.title, event.venue, event.summary)) {
      hits.push({ type: "Event", label: event.title, sub: event.whenLabel || event.venue || "Event", href: `/admin/events/${event.id}` });
    }
  }
  for (const row of store.signups || []) {
    if (row.kind !== "booking-waitlist") continue;
    if (match(row.email, row.name, row.notes, row.fields?.service)) {
      hits.push({
        type: "Enquiry",
        label: row.name || row.email,
        sub: row.fields?.service || row.email,
        href: `/admin/enquiries?q=${encodeURIComponent(row.email)}`
      });
    }
  }
  for (const asset of store.media) {
    if (match(asset.filename, asset.altText)) {
      hits.push({ type: "Media", label: asset.filename, sub: asset.altText, href: `/admin/media?q=${encodeURIComponent(asset.filename)}` });
    }
  }
  return hits.slice(0, limit);
}

/** Write the public (published) page copy. Prefer savePageCopyDraft + publishPageCopy in admin. */
export async function savePageCopy(copy: PageCopy) {
  await mutateStore((store) => {
    store.pageCopy = copy;
    store.pageCopyDraft = structuredClone(copy);
  });
  bust(CMS_TAGS.pageCopy);
  bust(CMS_TAGS.home);
  return copy;
}

export async function savePageCopyDraft(copy: PageCopy) {
  await mutateStore((store) => {
    store.pageCopyDraft = copy;
  });
  return copy;
}

export async function publishPageCopy() {
  const store = await readStore();
  const draft = mergePageCopy(store.pageCopyDraft || store.pageCopy);
  await mutateStore((next) => {
    next.pageCopy = structuredClone(draft);
    next.pageCopyDraft = structuredClone(draft);
  });
  bust(CMS_TAGS.pageCopy);
  bust(CMS_TAGS.home);
  return draft;
}

const COPY_ROOTS = new Set([
  "about",
  "destara",
  "frigga",
  "projects",
  "forecast",
  "home",
  "book",
  "eventsPage",
  "mediaPage"
]);

function pathSegments(path: string) {
  return path
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);
}

function getAtPath(root: unknown, segments: string[]): unknown {
  let cursor: unknown = root;
  for (const part of segments) {
    if (cursor == null || typeof cursor !== "object") return undefined;
    cursor = (cursor as Record<string | number, unknown>)[part];
  }
  return cursor;
}

function setStringAtPath(root: unknown, segments: string[], value: string) {
  if (!segments.length) throw new Error("Empty copy path");
  let cursor: unknown = root;
  for (let i = 0; i < segments.length - 1; i++) {
    if (cursor == null || typeof cursor !== "object") {
      throw new Error(`Unknown copy path: ${segments.join(".")}`);
    }
    const part = segments[i];
    const next = Array.isArray(cursor)
      ? cursor[Number(part)]
      : (cursor as Record<string, unknown>)[part];
    if (next == null) throw new Error(`Unknown copy path: ${segments.join(".")}`);
    cursor = next;
  }
  const leaf = segments[segments.length - 1];
  if (Array.isArray(cursor)) {
    const index = Number(leaf);
    if (!Number.isInteger(index) || index < 0 || index >= cursor.length || typeof cursor[index] !== "string") {
      throw new Error(`Cannot set non-text field: ${segments.join(".")}`);
    }
    cursor[index] = value;
    return;
  }
  if (cursor == null || typeof cursor !== "object") {
    throw new Error(`Unknown copy path: ${segments.join(".")}`);
  }
  const obj = cursor as Record<string, unknown>;
  if (typeof obj[leaf] !== "string") {
    throw new Error(`Cannot set non-text field: ${segments.join(".")}`);
  }
  obj[leaf] = value;
}

/** Apply one or more text patches to the draft PageCopy by dotted path (e.g. about.title). */
export async function setCopyPaths(patches: Array<{ path: string; value: string }>) {
  const copy = structuredClone(await getEditablePageCopy());
  for (const patch of patches) {
    const segments = pathSegments(patch.path);
    if (!segments.length || !COPY_ROOTS.has(segments[0])) {
      throw new Error(`Unknown copy path: ${patch.path}`);
    }
    const existing = getAtPath(copy, segments);
    if (typeof existing !== "string") {
      throw new Error(`Cannot set non-text field: ${patch.path}`);
    }
    setStringAtPath(copy, segments, sanitizeText(patch.value, 8000));
  }
  return await savePageCopyDraft(copy);
}

export async function getCopyPathValue(path: string) {
  const segments = pathSegments(path);
  if (!segments.length || !COPY_ROOTS.has(segments[0])) return null;
  const value = getAtPath(await getEditablePageCopy(), segments);
  return typeof value === "string" ? value : null;
}

export { monthName };
