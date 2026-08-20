"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import { authenticate, cookieOptions, createSession, destroySession, getSessionUser, logAudit, rateLimitLogin, rateLimitReset, SESSION_COOKIE, REMEMBER_EMAIL_COOKIE, changePasswordWithCurrent, requestPasswordReset, completePasswordReset, setUserPassword } from "@/lib/cms/auth";
import { fingerprint, hashPassword, newId, nowIso, slugify } from "@/lib/cms/crypto";
import { mutateStore } from "@/lib/cms/store";
import { sanitizeHtml, sanitizeText } from "@/lib/cms/sanitize";
import {
  deleteArticle,
  deleteCategory,
  deleteEvent,
  deleteMedia,
  deleteNavigation,
  deletePage,
  deletePricing,
  deleteService,
  deleteSignup,
  duplicatePage,
  mediaInUse,
  saveArticle,
  saveCategory,
  saveEvent,
  saveFaq,
  saveHomeSection,
  saveMedia,
  saveNavigation,
  savePage,
  savePricing,
  saveService,
  saveSettings,
  saveTestimonial,
  getPageCopy,
  listHomeSections,
  savePageCopy,
  setCopyPaths,
  updateSignupStatus
} from "@/lib/cms/repo";
import {
  articleInputSchema,
  categoryInputSchema,
  consultationInputSchema,
  eventInputSchema,
  loginSchema,
  navInputSchema,
  pageInputSchema,
  pricingInputSchema,
  userInputSchema
} from "@/lib/cms/validation";
import type { AdminRole, HomeSection, PageBlock, SiteSettings } from "@/lib/cms/types";
import type { PageCopy } from "@/lib/cms/page-copy-types";
import { isReservedPageSlug } from "@/lib/cms/reserved-slugs";

async function actor(minRole?: AdminRole) {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  if (minRole === "owner" && user.role !== "owner") throw new Error("Owner role required");
  return user;
}

function formStr(form: FormData, key: string) {
  return String(form.get(key) || "").trim();
}

function formBool(form: FormData, key: string) {
  const v = form.get(key);
  return v === "on" || v === "true" || v === "1";
}

function toIso(value: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formStr(formData, "email"),
    password: formStr(formData, "password")
  });
  const next = formStr(formData, "next") || "/admin/dashboard";
  if (!parsed.success) redirect("/admin/login?error=invalid");

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "local";
  if (!rateLimitLogin(fingerprint(ip))) redirect("/admin/login?error=rate");

  const user = authenticate(parsed.data.email, parsed.data.password);
  if (!user) redirect("/admin/login?error=invalid");

  const remember = formBool(formData, "remember");
  const session = createSession(user.id, remember);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, session.token, cookieOptions(session.expiresAt));
  if (remember) {
    jar.set(REMEMBER_EMAIL_COOKIE, user.email, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(session.expiresAt)
    });
  } else {
    jar.delete(REMEMBER_EMAIL_COOKIE);
  }
  redirect(next.startsWith("/admin") ? next : "/admin/dashboard");
}

async function signInUser(userId: string, next = "/admin/dashboard", remember = false) {
  const session = createSession(userId, remember);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, session.token, cookieOptions(session.expiresAt));
  redirect(next.startsWith("/admin") ? next : "/admin/dashboard");
}

export async function changePasswordAction(formData: FormData) {
  const email = formStr(formData, "email").toLowerCase();
  const current = formStr(formData, "currentPassword");
  const nextPassword = formStr(formData, "newPassword");
  const confirm = formStr(formData, "confirmPassword");
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "local";
  if (!rateLimitLogin(fingerprint(ip + ":change"))) redirect("/admin/login?view=change&error=rate");
  if (nextPassword.length < 10) redirect("/admin/login?view=change&error=weak");
  if (nextPassword !== confirm) redirect("/admin/login?view=change&error=mismatch");
  const user = changePasswordWithCurrent(email, current, nextPassword);
  if (!user) redirect("/admin/login?view=change&error=invalid");
  logAudit(user.id, "users", user.id, "password-change");
  await signInUser(user.id);
}

export async function requestResetAction(formData: FormData) {
  const email = formStr(formData, "email").toLowerCase();
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "local";
  if (!rateLimitReset(fingerprint(ip + ":reset"))) redirect("/admin/login?view=forgot&error=rate");
  await requestPasswordReset(email);
  redirect(`/admin/login?view=reset&email=${encodeURIComponent(email)}&sent=1`);
}

export async function completeResetAction(formData: FormData) {
  const email = formStr(formData, "email").toLowerCase();
  const code = formStr(formData, "code");
  const nextPassword = formStr(formData, "newPassword");
  const confirm = formStr(formData, "confirmPassword");
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "local";
  if (!rateLimitReset(fingerprint(ip + ":complete"))) redirect("/admin/login?view=reset&error=rate");
  if (nextPassword.length < 10) redirect(`/admin/login?view=reset&email=${encodeURIComponent(email)}&error=weak`);
  if (nextPassword !== confirm) redirect(`/admin/login?view=reset&email=${encodeURIComponent(email)}&error=mismatch`);
  const user = completePasswordReset(email, code, nextPassword);
  if (!user) redirect(`/admin/login?view=reset&email=${encodeURIComponent(email)}&error=reset`);
  logAudit(user.id, "users", user.id, "password-reset");
  await signInUser(user.id);
}

export async function setUserPasswordAction(formData: FormData) {
  const actorUser = await actor("owner");
  const id = formStr(formData, "id");
  const nextPassword = formStr(formData, "password");
  if (nextPassword.length < 10) redirect("/admin/users?error=weak");
  if (!setUserPassword(id, nextPassword)) redirect("/admin/users?error=invalid");
  logAudit(actorUser.id, "users", id, "password-set");
  redirect("/admin/users?saved=1");
}

export async function logoutAction() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) destroySession(token);
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function savePageAction(formData: FormData) {
  const user = await actor();
  let blocks: PageBlock[] = [];
  try {
    blocks = JSON.parse(formStr(formData, "blocks") || "[]") as PageBlock[];
  } catch {
    throw new Error("Invalid blocks JSON");
  }
  const parsed = pageInputSchema.parse({
    id: formStr(formData, "id") || undefined,
    slug: formStr(formData, "slug") || slugify(formStr(formData, "title")),
    title: formStr(formData, "title"),
    blocks,
    status: formStr(formData, "status") || "draft",
    seoTitle: formStr(formData, "seoTitle"),
    seoDescription: formStr(formData, "seoDescription"),
    ogImageId: formStr(formData, "ogImageId") || null
  });
  const page = savePage({
    ...parsed,
    slug: isReservedPageSlug(parsed.slug) ? `${parsed.slug}-page` : parsed.slug
  });
  logAudit(user.id, "pages", page.id, parsed.id ? "update" : "create");
  redirect(`/admin/pages/${page.id}?saved=1`);
}

export async function deletePageAction(formData: FormData) {
  const user = await actor();
  const id = formStr(formData, "id");
  deletePage(id);
  logAudit(user.id, "pages", id, "delete");
  redirect("/admin/pages");
}

export async function duplicatePageAction(formData: FormData) {
  const user = await actor();
  const copy = duplicatePage(formStr(formData, "id"));
  if (copy) logAudit(user.id, "pages", copy.id, "duplicate");
  redirect(copy ? `/admin/pages/${copy.id}` : "/admin/pages");
}

export async function saveArticleAction(formData: FormData) {
  const user = await actor();
  const parsed = articleInputSchema.parse({
    id: formStr(formData, "id") || undefined,
    slug: formStr(formData, "slug") || slugify(formStr(formData, "title")),
    title: formStr(formData, "title"),
    excerpt: formStr(formData, "excerpt"),
    body: formStr(formData, "body"),
    featuredImageId: formStr(formData, "featuredImageId") || null,
    author: formStr(formData, "author") || "Marites Allen",
    categoryId: formStr(formData, "categoryId") || null,
    tags: formStr(formData, "tags")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    outlet: formStr(formData, "outlet"),
    externalUrl: formStr(formData, "externalUrl"),
    ctaLabel: formStr(formData, "ctaLabel") || "Read article",
    year: Number(formStr(formData, "year") || new Date().getFullYear()),
    month: Number(formStr(formData, "month") || 1),
    status: formStr(formData, "status") || "draft",
    seoTitle: formStr(formData, "seoTitle"),
    seoDescription: formStr(formData, "seoDescription")
  });
  const article = saveArticle(parsed);
  logAudit(user.id, "articles", article.id, parsed.id ? "update" : "create");
  redirect(`/admin/articles/${article.id}?saved=1`);
}

export async function deleteArticleAction(formData: FormData) {
  const user = await actor();
  const id = formStr(formData, "id");
  deleteArticle(id);
  logAudit(user.id, "articles", id, "delete");
  redirect("/admin/articles");
}

export async function saveCategoryAction(formData: FormData) {
  const user = await actor();
  const parsed = categoryInputSchema.parse({
    id: formStr(formData, "id") || undefined,
    name: formStr(formData, "name"),
    slug: formStr(formData, "slug") || slugify(formStr(formData, "name")),
    description: formStr(formData, "description")
  });
  const row = saveCategory(parsed);
  logAudit(user.id, "categories", row.id, parsed.id ? "update" : "create");
  redirect("/admin/categories?saved=1");
}

export async function deleteCategoryAction(formData: FormData) {
  const user = await actor();
  const id = formStr(formData, "id");
  deleteCategory(id);
  logAudit(user.id, "categories", id, "delete");
  redirect("/admin/categories");
}

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function uploadMediaAction(formData: FormData) {
  const user = await actor();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("No file uploaded");
  if (file.size > 8 * 1024 * 1024) throw new Error("File too large (8MB max)");
  if (!ALLOWED_MIME.has(file.type)) throw new Error("File type not allowed");
  const ext = file.type === "image/jpeg" ? ".jpg" : file.type === "image/png" ? ".png" : file.type === "image/gif" ? ".gif" : ".webp";
  const id = newId();
  const filename = `${id}${ext}`;
  const rel = `/uploads/${filename}`;
  const dest = path.join(process.cwd(), "public", "uploads", filename);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(await file.arrayBuffer()));
  saveMedia({
    id,
    filename: sanitizeText(file.name, 120) || filename,
    path: rel,
    mimeType: file.type,
    size: file.size,
    width: null,
    height: null,
    altText: sanitizeText(formStr(formData, "altText"), 160),
    createdAt: nowIso()
  });
  logAudit(user.id, "media", id, "upload");
  redirect("/admin/media?saved=1");
}

export async function updateMediaAltAction(formData: FormData) {
  const user = await actor();
  const id = formStr(formData, "id");
  mutateStore((store) => {
    const row = store.media.find((m) => m.id === id);
    if (row) row.altText = sanitizeText(formStr(formData, "altText"), 160);
  });
  logAudit(user.id, "media", id, "update");
  redirect("/admin/media?saved=1");
}

export async function deleteMediaAction(formData: FormData) {
  const user = await actor();
  const id = formStr(formData, "id");
  if (mediaInUse(id)) redirect("/admin/media?error=inuse");
  const asset = deleteMedia(id);
  if (asset?.path.startsWith("/uploads/")) {
    const dest = path.join(process.cwd(), "public", asset.path.replace(/^\//, ""));
    if (fs.existsSync(dest)) fs.unlinkSync(dest);
  }
  logAudit(user.id, "media", id, "delete");
  redirect("/admin/media?saved=1");
}

export async function saveServiceAction(formData: FormData) {
  const user = await actor();
  const parsed = consultationInputSchema.parse({
    id: formStr(formData, "id") || newId(),
    name: formStr(formData, "name"),
    slug: formStr(formData, "slug") || slugify(formStr(formData, "name")),
    categoryLabel: formStr(formData, "categoryLabel"),
    description: formStr(formData, "description"),
    idealFor: formStr(formData, "idealFor"),
    duration: formStr(formData, "duration"),
    ctaText: formStr(formData, "ctaText") || "Enquire",
    bookingUrl: formStr(formData, "bookingUrl") || "/book",
    flags: {
      birth: formBool(formData, "flagBirth"),
      property: formBool(formData, "flagProperty"),
      company: formBool(formData, "flagCompany"),
      event: formBool(formData, "flagEvent")
    },
    imageId: formStr(formData, "imageId") || null,
    active: formBool(formData, "active"),
    featured: formBool(formData, "featured"),
    sortOrder: Number(formStr(formData, "sortOrder") || 0)
  });
  saveService({ ...parsed, flags: parsed.flags, imageId: parsed.imageId ?? null });
  const priceRaw = formStr(formData, "price");
  if (priceRaw !== "") {
    savePricing({
      id: formStr(formData, "pricingId") || `price-${parsed.id}`,
      serviceId: parsed.id,
      price: Number(priceRaw || 0),
      currency: formStr(formData, "currency") || "USD",
      promoPrice: formStr(formData, "promoPrice") ? Number(formStr(formData, "promoPrice")) : null,
      note: formStr(formData, "note"),
      active: parsed.active,
      sortOrder: parsed.sortOrder
    });
  }
  logAudit(user.id, "consultations", parsed.id, "save");
  redirect("/admin/consultations?saved=1");
}

export async function deleteServiceAction(formData: FormData) {
  const user = await actor();
  const id = formStr(formData, "id");
  deleteService(id);
  logAudit(user.id, "consultations", id, "delete");
  redirect("/admin/consultations");
}

export async function savePricingAction(formData: FormData) {
  const user = await actor();
  const parsed = pricingInputSchema.parse({
    id: formStr(formData, "id") || newId(),
    serviceId: formStr(formData, "serviceId"),
    price: Number(formStr(formData, "price") || 0),
    currency: formStr(formData, "currency") || "USD",
    promoPrice: formStr(formData, "promoPrice") ? Number(formStr(formData, "promoPrice")) : null,
    note: formStr(formData, "note"),
    active: formBool(formData, "active"),
    sortOrder: Number(formStr(formData, "sortOrder") || 0)
  });
  savePricing({ ...parsed, promoPrice: parsed.promoPrice ?? null });
  logAudit(user.id, "pricing", parsed.id, "save");
  redirect("/admin/consultations?saved=1");
}

export async function deletePricingAction(formData: FormData) {
  const user = await actor();
  const id = formStr(formData, "id");
  deletePricing(id);
  logAudit(user.id, "pricing", id, "delete");
  redirect("/admin/consultations");
}

export async function saveEventAction(formData: FormData) {
  const user = await actor();
  const parsed = eventInputSchema.parse({
    id: formStr(formData, "id") || newId(),
    title: formStr(formData, "title"),
    slug: formStr(formData, "slug") || slugify(formStr(formData, "title")),
    eyebrow: formStr(formData, "eyebrow"),
    summary: formStr(formData, "summary"),
    whenLabel: formStr(formData, "whenLabel"),
    whereLabel: formStr(formData, "whereLabel"),
    startsAt: toIso(formStr(formData, "startsAt")),
    endsAt: toIso(formStr(formData, "endsAt")),
    venue: formStr(formData, "venue"),
    liveUrl: formStr(formData, "liveUrl"),
    ctaHref: formStr(formData, "ctaHref"),
    ctaLabel: formStr(formData, "ctaLabel"),
    imageUrl: formStr(formData, "imageUrl"),
    tagline: formStr(formData, "tagline"),
    status: formStr(formData, "status") || "draft",
    sortOrder: Number(formStr(formData, "sortOrder") || 0)
  });
  saveEvent(parsed);
  logAudit(user.id, "events", parsed.id, "save");
  redirect(`/admin/events/${parsed.id}?saved=1`);
}

export async function deleteEventAction(formData: FormData) {
  const user = await actor();
  const id = formStr(formData, "id");
  deleteEvent(id);
  logAudit(user.id, "events", id, "delete");
  redirect("/admin/events");
}

export async function saveNavAction(formData: FormData) {
  const user = await actor();
  const parsed = navInputSchema.parse({
    id: formStr(formData, "id") || newId(),
    label: formStr(formData, "label"),
    href: formStr(formData, "href"),
    external: formBool(formData, "external"),
    parentId: formStr(formData, "parentId") || null,
    enabled: formBool(formData, "enabled"),
    sortOrder: Number(formStr(formData, "sortOrder") || 0),
    location: formStr(formData, "location")
  });
  saveNavigation({ ...parsed, parentId: parsed.parentId ?? null });
  logAudit(user.id, "navigation", parsed.id, "save");
  redirect("/admin/navigation?saved=1");
}

export async function deleteNavAction(formData: FormData) {
  const user = await actor();
  const id = formStr(formData, "id");
  deleteNavigation(id);
  logAudit(user.id, "navigation", id, "delete");
  redirect("/admin/navigation");
}

export async function saveSettingsAction(formData: FormData) {
  const user = await actor();
  const settings: SiteSettings = {
    general: {
      siteName: sanitizeText(formStr(formData, "siteName"), 80),
      tagline: sanitizeText(formStr(formData, "tagline"), 80),
      logoUrl: sanitizeText(formStr(formData, "logoUrl"), 300)
    },
    contact: {
      email: sanitizeText(formStr(formData, "email"), 120),
      emailSecondary: sanitizeText(formStr(formData, "emailSecondary"), 120),
      phone: sanitizeText(formStr(formData, "phone"), 40),
      phoneSecondary: sanitizeText(formStr(formData, "phoneSecondary"), 40),
      whatsapp: sanitizeText(formStr(formData, "whatsapp"), 40)
    },
    social: (() => {
      if (formStr(formData, "socialMode") === "cards") {
        return zipText(formData, [
          ["socialId", 40],
          ["socialLabel", 80],
          ["socialHandle", 80],
          ["socialHref", 300]
        ])
          .map(([id, label, handle, href]) => ({
            id: sanitizeText(id || slugify(label) || "link", 40),
            label: sanitizeText(label, 80),
            handle: sanitizeText(handle, 80),
            href: sanitizeText(href, 300)
          }))
          .filter((row) => row.label || row.href);
      }
      try {
        return JSON.parse(formStr(formData, "social") || "[]");
      } catch {
        return [];
      }
    })(),
    friggaSocial: (() => {
      if (formStr(formData, "socialMode") === "cards") {
        return zipText(formData, [
          ["friggaId", 40],
          ["friggaLabel", 80],
          ["friggaHandle", 80],
          ["friggaHref", 300]
        ])
          .map(([id, label, handle, href]) => ({
            id: sanitizeText(id || slugify(label) || "link", 40),
            label: sanitizeText(label, 80),
            handle: sanitizeText(handle, 80),
            href: sanitizeText(href, 300)
          }))
          .filter((row) => row.label || row.href);
      }
      try {
        return JSON.parse(formStr(formData, "friggaSocial") || "[]");
      } catch {
        return [];
      }
    })(),
    seoDefaults: {
      title: sanitizeText(formStr(formData, "seoTitle"), 70),
      description: sanitizeText(formStr(formData, "seoDescription"), 180),
      ogImage: sanitizeText(formStr(formData, "ogImage"), 300)
    },
    business: {
      bookingUrl: sanitizeText(formStr(formData, "bookingUrl"), 200),
      currency: sanitizeText(formStr(formData, "currency"), 8) || "USD",
      comingSoonLabel: sanitizeText(formStr(formData, "comingSoonLabel"), 80) || "Coming Soon",
      bookCtaLabel: sanitizeText(formStr(formData, "bookCtaLabel"), 80) || "Book Consultation · Coming Soon →"
    }
  };
  saveSettings(settings);
  logAudit(user.id, "settings", "site", "update");
  redirect("/admin/settings?saved=1");
}

export async function saveHomeSectionAction(formData: FormData) {
  const user = await actor();
  const row: HomeSection = {
    id: formStr(formData, "id") || newId(),
    blockType: formStr(formData, "blockType"),
    payload: JSON.parse(formStr(formData, "payload") || "{}"),
    enabled: formBool(formData, "enabled"),
    sortOrder: Number(formStr(formData, "sortOrder") || 0)
  };
  saveHomeSection(row);
  logAudit(user.id, "homepage", row.id, "save");
  redirect("/admin/homepage?saved=1");
}

export async function saveHomepageAllAction(formData: FormData) {
  const user = await actor();

  saveHomeSection({
    id: "home-hero",
    blockType: "hero",
    enabled: formBool(formData, "heroEnabled"),
    sortOrder: 1,
    payload: {
      heading: sanitizeText(formStr(formData, "heading"), 160),
      subheading: sanitizeText(formStr(formData, "subheading"), 500),
      highlight: sanitizeText(formStr(formData, "highlight"), 120),
      ctaLabel: sanitizeText(formStr(formData, "ctaLabel"), 80),
      ctaHref: sanitizeText(formStr(formData, "ctaHref"), 200) || "/book",
      chartCtaLabel: sanitizeText(formStr(formData, "chartCtaLabel"), 80),
      rating: sanitizeText(formStr(formData, "rating"), 80),
      imageUrl: sanitizeText(formStr(formData, "imageUrl"), 300),
      imageAlt: sanitizeText(formStr(formData, "imageAlt"), 160)
    }
  });

  const values = formData.getAll("statValue").map((v) => String(v).trim());
  const labels = formData.getAll("statLabel").map((v) => String(v).trim());
  const items = values
    .map((value, i) => ({ value, label: labels[i] || value }))
    .filter((item) => item.value);
  saveHomeSection({
    id: "home-stats",
    blockType: "stats",
    enabled: true,
    sortOrder: 2,
    payload: { items }
  });

  const servicesId = formStr(formData, "servicesId");
  if (servicesId) {
    const existing = listHomeSections().find((s) => s.id === servicesId);
    saveHomeSection({
      id: servicesId,
      blockType: "services",
      enabled: formBool(formData, "servicesEnabled"),
      sortOrder: Number(formStr(formData, "servicesSortOrder") || existing?.sortOrder || 3),
      payload: existing?.payload || {}
    });
  }

  saveHomeSection({
    id: "home-closing",
    blockType: "closing",
    enabled: formBool(formData, "closingEnabled"),
    sortOrder: 4,
    payload: {
      heading: sanitizeText(formStr(formData, "closingHeading"), 160),
      body: sanitizeText(formStr(formData, "closingBody"), 400),
      ctaLabel: sanitizeText(formStr(formData, "closingCtaLabel"), 80),
      ctaHref: sanitizeText(formStr(formData, "closingCtaHref"), 200) || "/book"
    }
  });

  const faqIds = allText(formData, "faqId", 40);
  const faqQuestions = allText(formData, "faqQuestion", 200);
  const faqAnswers = formData.getAll("faqAnswer").map((v) => sanitizeHtml(String(v || "")));
  const faqSorts = formData.getAll("faqSortOrder").map((v) => Number(String(v) || 0));
  faqIds.forEach((id, i) => {
    if (!id) return;
    saveFaq({
      id,
      question: faqQuestions[i] || "",
      answer: faqAnswers[i] || "",
      showOnHome: formBool(formData, `faqShow_${id}`),
      sortOrder: faqSorts[i] || i + 1
    });
  });

  const newFaqQ = sanitizeText(formStr(formData, "newFaqQuestion"), 200);
  const newFaqA = sanitizeHtml(formStr(formData, "newFaqAnswer"));
  if (newFaqQ && newFaqA) {
    saveFaq({
      id: newId(),
      question: newFaqQ,
      answer: newFaqA,
      showOnHome: formBool(formData, "newFaqShowOnHome"),
      sortOrder: Number(formStr(formData, "newFaqSortOrder") || faqIds.length + 1)
    });
  }

  const reviewIds = allText(formData, "reviewId", 40);
  const reviewNames = allText(formData, "reviewName", 80);
  const reviewRoles = allText(formData, "reviewRole", 80);
  const reviewTexts = allText(formData, "reviewText", 600);
  const reviewInitials = allText(formData, "reviewInitial", 2);
  const reviewSorts = formData.getAll("reviewSortOrder").map((v) => Number(String(v) || 0));
  reviewIds.forEach((id, i) => {
    if (!id) return;
    const name = reviewNames[i] || "";
    saveTestimonial({
      id,
      name,
      role: reviewRoles[i] || "",
      text: reviewTexts[i] || "",
      initial: reviewInitials[i] || name.slice(0, 1),
      featured: formBool(formData, `reviewFeatured_${id}`),
      sortOrder: reviewSorts[i] || i + 1
    });
  });

  logAudit(user.id, "homepage", "all", "save");
  redirect("/admin/homepage?saved=1");
}

export async function saveStatsHomeAction(formData: FormData) {
  const user = await actor();
  const values = formData.getAll("statValue").map((v) => String(v).trim());
  const labels = formData.getAll("statLabel").map((v) => String(v).trim());
  const items =
    values.length > 0
      ? values
          .map((value, i) => ({ value, label: labels[i] || value }))
          .filter((item) => item.value)
      : formStr(formData, "stats")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [value, ...rest] = line.split("|");
            return { value: value.trim(), label: rest.join("|").trim() || value.trim() };
          });
  saveHomeSection({
    id: "home-stats",
    blockType: "stats",
    enabled: true,
    sortOrder: 2,
    payload: { items }
  });
  logAudit(user.id, "homepage", "home-stats", "save");
  redirect("/admin/homepage?saved=1");
}

export async function saveClosingHomeAction(formData: FormData) {
  const user = await actor();
  saveHomeSection({
    id: "home-closing",
    blockType: "closing",
    enabled: formBool(formData, "enabled"),
    sortOrder: 4,
    payload: {
      heading: sanitizeText(formStr(formData, "heading"), 160),
      body: sanitizeText(formStr(formData, "body"), 400),
      ctaLabel: sanitizeText(formStr(formData, "ctaLabel"), 80),
      ctaHref: sanitizeText(formStr(formData, "ctaHref"), 200) || "/book"
    }
  });
  logAudit(user.id, "homepage", "home-closing", "save");
  redirect("/admin/homepage?saved=1");
}

export async function saveFaqAction(formData: FormData) {
  const user = await actor();
  const row = saveFaq({
    id: formStr(formData, "id") || newId(),
    question: sanitizeText(formStr(formData, "question"), 200),
    answer: sanitizeHtml(formStr(formData, "answer")),
    showOnHome: formBool(formData, "showOnHome"),
    sortOrder: Number(formStr(formData, "sortOrder") || 0)
  });
  logAudit(user.id, "faqs", row.id, "save");
  redirect("/admin/homepage?saved=1");
}

export async function saveTestimonialAction(formData: FormData) {
  const user = await actor();
  const name = sanitizeText(formStr(formData, "name"), 80);
  const row = saveTestimonial({
    id: formStr(formData, "id") || newId(),
    name,
    role: sanitizeText(formStr(formData, "role"), 80),
    text: sanitizeText(formStr(formData, "text"), 600),
    initial: sanitizeText(formStr(formData, "initial") || name.slice(0, 1), 2),
    featured: formBool(formData, "featured"),
    sortOrder: Number(formStr(formData, "sortOrder") || 0)
  });
  logAudit(user.id, "testimonials", row.id, "save");
  redirect("/admin/homepage?saved=1");
}

export async function createUserAction(formData: FormData) {
  const user = await actor("owner");
  const parsed = userInputSchema.parse({
    email: formStr(formData, "email").toLowerCase(),
    password: formStr(formData, "password"),
    role: formStr(formData, "role")
  });
  mutateStore((store) => {
    if (store.adminUsers.some((u) => u.email === parsed.email)) throw new Error("Email already exists");
    store.adminUsers.push({
      id: newId(),
      email: parsed.email,
      passwordHash: hashPassword(parsed.password),
      role: parsed.role,
      createdAt: nowIso(),
      lastLoginAt: null
    });
  });
  logAudit(user.id, "users", parsed.email, "create");
  redirect("/admin/users?saved=1");
}

export async function deleteUserAction(formData: FormData) {
  const user = await actor("owner");
  const id = formStr(formData, "id");
  if (id === user.id) redirect("/admin/users?error=self");
  mutateStore((store) => {
    store.adminUsers = store.adminUsers.filter((u) => u.id !== id);
    store.sessions = store.sessions.filter((s) => s.userId !== id);
  });
  logAudit(user.id, "users", id, "delete");
  redirect("/admin/users");
}

export async function updateSignupStatusAction(formData: FormData) {
  const user = await actor();
  const id = formStr(formData, "id");
  const status = formStr(formData, "status") as "new" | "contacted" | "archived";
  updateSignupStatus(id, status);
  logAudit(user.id, "enquiries", id, status);
  redirect("/admin/enquiries?saved=1");
}

export async function deleteSignupAction(formData: FormData) {
  const user = await actor();
  const id = formStr(formData, "id");
  deleteSignup(id);
  logAudit(user.id, "enquiries", id, "delete");
  redirect("/admin/enquiries");
}

function lines(form: FormData, key: string) {
  return formStr(form, key)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function pairs(form: FormData, key: string) {
  return lines(form, key).map((line) => {
    const [a, ...rest] = line.split("|");
    return { label: sanitizeText(a || "", 120), value: sanitizeText(rest.join("|").trim() || "", 400) };
  });
}

function allText(form: FormData, key: string, max: number) {
  return form.getAll(key).map((value) => sanitizeText(String(value || "").trim(), max));
}

function zipText(form: FormData, keys: Array<[string, number]>) {
  const cols = keys.map(([key, max]) => allText(form, key, max));
  const count = Math.max(0, ...cols.map((col) => col.length));
  return Array.from({ length: count }, (_, i) => cols.map((col) => col[i] || ""));
}

function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((part) => sanitizeText(part.trim(), 2000))
    .filter(Boolean);
}

export async function saveAboutCopyAction(formData: FormData) {
  const user = await actor();
  const current = getPageCopy();
  let sections = current.about.sections;
  if (formStr(formData, "aboutSectionsMode") === "cards") {
    const headings = allText(formData, "sectionHeading", 120);
    const bodies = allText(formData, "sectionBody", 8000);
    sections = headings
      .map((heading, i) => ({ heading, paragraphs: paragraphs(bodies[i] || "") }))
      .filter((section) => section.heading || section.paragraphs.length);
  } else {
    try {
      const parsed = JSON.parse(formStr(formData, "sectionsJson") || "[]");
      if (Array.isArray(parsed)) sections = parsed;
    } catch {
      /* keep existing */
    }
  }
  const seeAlsoRows = zipText(formData, [
    ["seeAlsoLabel", 160],
    ["seeAlsoHref", 200]
  ]);
  const infoRows = zipText(formData, [
    ["infoLabel", 120],
    ["infoValue", 400]
  ]);
  const next: PageCopy = {
    ...current,
    about: {
      ...current.about,
      seoTitle: sanitizeText(formStr(formData, "seoTitle"), 120),
      seoDescription: sanitizeText(formStr(formData, "seoDescription"), 300),
      kicker: sanitizeText(formStr(formData, "kicker"), 80),
      title: sanitizeText(formStr(formData, "title"), 120),
      intro: sanitizeText(formStr(formData, "intro"), 2000),
      sections,
      recognitionHeading: sanitizeText(formStr(formData, "recognitionHeading") || current.about.recognitionHeading, 80),
      recognition: lines(formData, "recognition").map((s) => sanitizeText(s, 300)),
      bibliographyHeading: sanitizeText(formStr(formData, "bibliographyHeading") || current.about.bibliographyHeading, 80),
      bibliography: lines(formData, "bibliography").map((s) => sanitizeText(s, 200)),
      seeAlsoHeading: sanitizeText(formStr(formData, "seeAlsoHeading") || current.about.seeAlsoHeading, 80),
      seeAlso: seeAlsoRows.length
        ? seeAlsoRows
            .map(([label, href]) => ({ label, href: href || "/" }))
            .filter((row) => row.label || row.href !== "/")
        : lines(formData, "seeAlso").map((line) => {
            const [label, href] = line.split("|");
            return { label: sanitizeText(label || "", 160), href: sanitizeText(href || "/", 200) };
          }),
      infobox: infoRows.length
        ? infoRows.map(([label, value]) => ({ label, value })).filter((row) => row.label || row.value)
        : pairs(formData, "infobox"),
      imageUrl: sanitizeText(formStr(formData, "imageUrl"), 300),
      imageAlt: sanitizeText(formStr(formData, "imageAlt"), 120),
      ctaTitle: sanitizeText(formStr(formData, "ctaTitle"), 120),
      ctaBody: sanitizeText(formStr(formData, "ctaBody"), 400),
      ctaLabel: sanitizeText(formStr(formData, "ctaLabel"), 80),
      ctaHref: sanitizeText(formStr(formData, "ctaHref"), 200)
    }
  };
  savePageCopy(next);
  logAudit(user.id, "pageCopy", "about", "save");
  redirect("/admin/copy?tab=about&saved=1");
}

export async function saveDestaraCopyAction(formData: FormData) {
  const user = await actor();
  const current = getPageCopy();
  savePageCopy({
    ...current,
    destara: {
      ...current.destara,
      seoTitle: sanitizeText(formStr(formData, "seoTitle"), 120),
      seoDescription: sanitizeText(formStr(formData, "seoDescription"), 300),
      kicker: sanitizeText(formStr(formData, "kicker"), 80),
      title: sanitizeText(formStr(formData, "title"), 80),
      intro: sanitizeText(formStr(formData, "intro"), 2000),
      overviewHeading: sanitizeText(formStr(formData, "overviewHeading"), 80),
      overview: sanitizeText(formStr(formData, "overview"), 2000),
      featuresHeading: sanitizeText(formStr(formData, "featuresHeading"), 80),
      features: lines(formData, "features").map((s) => sanitizeText(s, 200)),
      caption: sanitizeText(formStr(formData, "caption"), 200),
      availabilityHeading: sanitizeText(formStr(formData, "availabilityHeading"), 80),
      availability: sanitizeText(formStr(formData, "availability"), 800),
      complementHeading: sanitizeText(formStr(formData, "complementHeading"), 80),
      complement: sanitizeText(formStr(formData, "complement"), 2000),
      appUrl: sanitizeText(formStr(formData, "appUrl"), 200),
      ctaLabel: sanitizeText(formStr(formData, "ctaLabel"), 80),
      facts:
        formStr(formData, "destaraFactsMode") === "cards"
          ? zipText(formData, [
              ["factLabel", 120],
              ["factValue", 400]
            ])
              .map(([label, value]) => ({ label, value }))
              .filter((row) => row.label || row.value)
          : pairs(formData, "facts")
    }
  });
  logAudit(user.id, "pageCopy", "destara", "save");
  redirect("/admin/copy?tab=destara&saved=1");
}

export async function saveFriggaCopyAction(formData: FormData) {
  const user = await actor();
  const current = getPageCopy();
  savePageCopy({
    ...current,
    frigga: {
      ...current.frigga,
      seoTitle: sanitizeText(formStr(formData, "seoTitle"), 120),
      seoDescription: sanitizeText(formStr(formData, "seoDescription"), 300),
      kicker: sanitizeText(formStr(formData, "kicker"), 80),
      title: sanitizeText(formStr(formData, "title"), 120),
      body: sanitizeText(formStr(formData, "body"), 2000),
      shopUrl: sanitizeText(formStr(formData, "shopUrl"), 200),
      shopLabel: sanitizeText(formStr(formData, "shopLabel"), 80),
      browseLabel: sanitizeText(formStr(formData, "browseLabel"), 80),
      regionsHeading: sanitizeText(
        formStr(formData, "regionsHeading") || current.frigga.regionsHeading,
        80
      ),
      shops:
        formStr(formData, "friggaListsMode") === "cards"
          ? zipText(formData, [
              ["storeFlag", 8],
              ["storeName", 80],
              ["storeUrl", 200]
            ])
              .map(([flag, label, url]) => ({ flag, label, url }))
              .filter((row) => row.label || row.url)
          : lines(formData, "shops").map((line) => {
              const [flag, label, url] = line.split("|");
              return {
                flag: sanitizeText(flag || "", 8),
                label: sanitizeText(label || "", 80),
                url: sanitizeText(url || "", 200)
              };
            }),
      collectionsLabel: sanitizeText(
        formStr(formData, "collectionsLabel") || current.frigga.collectionsLabel,
        80
      ),
      collectionsHeading: sanitizeText(formStr(formData, "collectionsHeading"), 120),
      collectionsBody: sanitizeText(formStr(formData, "collectionsBody"), 400),
      collections:
        formStr(formData, "friggaListsMode") === "cards"
          ? zipText(formData, [
              ["collectionId", 40],
              ["collectionTitle", 80],
              ["collectionDesc", 240]
            ])
              .map(([id, title, desc], i) => ({
                id: id || slugify(title) || `c-${i}`,
                title,
                desc
              }))
              .filter((row) => row.title || row.desc)
          : lines(formData, "collections").map((line, i) => {
              const [id, title, ...rest] = line.split("|");
              return {
                id: sanitizeText(id || `c-${i}`, 40),
                title: sanitizeText(title || "", 80),
                desc: sanitizeText(rest.join("|").trim(), 240)
              };
            }),
      guideKicker: sanitizeText(formStr(formData, "guideKicker"), 80),
      guideTitle: sanitizeText(formStr(formData, "guideTitle"), 120),
      guideBody: sanitizeText(formStr(formData, "guideBody"), 800),
      guidePerks: lines(formData, "guidePerks").map((s) => sanitizeText(s, 200)),
      guideCta: sanitizeText(formStr(formData, "guideCta"), 80),
      marketplacesHeading: sanitizeText(formStr(formData, "marketplacesHeading"), 80),
      marketplacesBody: sanitizeText(formStr(formData, "marketplacesBody"), 300),
      marketplaces: lines(formData, "marketplaces").map((s) => sanitizeText(s, 80))
    }
  });
  logAudit(user.id, "pageCopy", "frigga", "save");
  redirect("/admin/copy?tab=frigga&saved=1");
}

export async function saveProjectsCopyAction(formData: FormData) {
  const user = await actor();
  const current = getPageCopy();
  let items = current.projects.items;
  if (formStr(formData, "projectsMode") === "cards") {
    items = zipText(formData, [
      ["projectId", 40],
      ["projectCategory", 80],
      ["projectName", 120],
      ["projectSummary", 300],
      ["projectBody1", 2000],
      ["projectBody2", 2000]
    ])
      .map(([id, category, name, summary, body1, body2], i) => ({
        id: id || slugify(name) || `p-${i}`,
        category,
        name,
        summary,
        body1,
        body2
      }))
      .filter((row) => row.name || row.summary);
  } else {
    try {
      const parsed = JSON.parse(formStr(formData, "itemsJson") || "[]");
      if (Array.isArray(parsed)) items = parsed;
    } catch {
      /* keep */
    }
  }
  savePageCopy({
    ...current,
    projects: {
      seoTitle: sanitizeText(formStr(formData, "seoTitle"), 120),
      seoDescription: sanitizeText(formStr(formData, "seoDescription"), 300),
      kicker: sanitizeText(formStr(formData, "kicker"), 80),
      title: sanitizeText(formStr(formData, "title"), 120),
      body: sanitizeText(formStr(formData, "body"), 800),
      items
    }
  });
  logAudit(user.id, "pageCopy", "projects", "save");
  redirect("/admin/copy?tab=projects&saved=1");
}

export async function saveForecastCopyAction(formData: FormData) {
  const user = await actor();
  const current = getPageCopy();
  let years = current.forecast.years;
  let zodiacs = current.forecast.zodiacs;
  let stars = current.forecast.stars;
  let navYears = lines(formData, "navYears").map((line) => {
    const [year, ...rest] = line.split("|");
    return { year: sanitizeText(year || "", 8), label: sanitizeText(rest.join("|").trim(), 80) };
  });
  if (formStr(formData, "forecastMode") === "cards") {
    navYears = zipText(formData, [
      ["navYear", 8],
      ["navLabel", 80]
    ])
      .map(([year, label]) => ({ year, label }))
      .filter((row) => row.year || row.label);
    years = zipText(formData, [
      ["fyYear", 8],
      ["fyAnimal", 40],
      ["fyLabel", 80],
      ["fyElement", 40],
      ["fyCny", 80],
      ["fyIntro", 2000],
      ["fyLead", 2000],
      ["fyBody1", 2000],
      ["fyBody2", 2000]
    ])
      .map(([year, animal, label, element, cny, intro, lead, body1, body2]) => ({
        year,
        animal,
        label,
        element,
        cny,
        intro,
        lead,
        body1,
        body2
      }))
      .filter((row) => row.year || row.label);
    zodiacs = zipText(formData, [
      ["zxId", 40],
      ["zxSign", 40],
      ["zxYears", 80],
      ["zxText", 2000],
      ["zxFocus", 200]
    ])
      .map(([id, sign, yearsLabel, text, focus], i) => ({
        id: id || slugify(sign) || `z-${i}`,
        sign,
        years: yearsLabel,
        text,
        focus
      }))
      .filter((row) => row.sign || row.text);
    stars = zipText(formData, [
      ["starTitle", 120],
      ["starText", 2000]
    ])
      .map(([title, text]) => ({ title, text }))
      .filter((row) => row.title || row.text);
  } else {
    try {
      const y = JSON.parse(formStr(formData, "yearsJson") || "[]");
      if (Array.isArray(y)) years = y;
    } catch {
      /* keep */
    }
    try {
      const z = JSON.parse(formStr(formData, "zodiacsJson") || "[]");
      if (Array.isArray(z)) zodiacs = z;
    } catch {
      /* keep */
    }
    try {
      const s = JSON.parse(formStr(formData, "starsJson") || "[]");
      if (Array.isArray(s)) stars = s;
    } catch {
      /* keep */
    }
  }
  savePageCopy({
    ...current,
    forecast: {
      seoTitle: sanitizeText(formStr(formData, "seoTitle"), 120),
      seoDescription: sanitizeText(formStr(formData, "seoDescription"), 300),
      defaultYear: sanitizeText(formStr(formData, "defaultYear"), 8) || "2026",
      navYears,
      years,
      zodiacs,
      stars
    }
  });
  logAudit(user.id, "pageCopy", "forecast", "save");
  redirect("/admin/copy?tab=forecast&saved=1");
}

export async function saveHomeExtrasAction(formData: FormData) {
  const user = await actor();
  const current = getPageCopy();
  savePageCopy({
    ...current,
    home: {
      ...current.home,
      aboutKicker: sanitizeText(formStr(formData, "aboutKicker"), 80),
      aboutHeading: sanitizeText(formStr(formData, "aboutHeading"), 160),
      aboutBody: sanitizeText(formStr(formData, "aboutBody"), 800),
      aboutCta: sanitizeText(formStr(formData, "aboutCta"), 80),
      aboutImageUrl: sanitizeText(formStr(formData, "aboutImageUrl"), 200),
      speakingLabel: sanitizeText(formStr(formData, "speakingLabel"), 120),
      speakingClients: lines(formData, "speakingClients").map((s) => sanitizeText(s, 80)),
      pressLabel: sanitizeText(formStr(formData, "pressLabel"), 80),
      pressBadge: sanitizeText(formStr(formData, "pressBadge"), 80),
      pressNames: lines(formData, "pressNames").map((s) => sanitizeText(s, 80)),
      destaraBadge1: sanitizeText(formStr(formData, "destaraBadge1"), 40),
      destaraBadge2: sanitizeText(formStr(formData, "destaraBadge2"), 40),
      destaraHeading: sanitizeText(formStr(formData, "destaraHeading"), 160),
      destaraBody: sanitizeText(formStr(formData, "destaraBody"), 800),
      destaraCta: sanitizeText(formStr(formData, "destaraCta"), 80),
      destaraMore: sanitizeText(formStr(formData, "destaraMore"), 80),
      destaraUrl: sanitizeText(formStr(formData, "destaraUrl"), 200),
      destaraBenefits:
        formStr(formData, "homeListsMode") === "cards"
          ? zipText(formData, [
              ["benefitTitle", 120],
              ["benefitDesc", 240]
            ])
              .map(([title, desc]) => ({ title, desc }))
              .filter((row) => row.title || row.desc)
          : lines(formData, "destaraBenefits").map((line) => {
              const [title, ...rest] = line.split("|");
              return { title: sanitizeText(title || "", 120), desc: sanitizeText(rest.join("|").trim(), 240) };
            }),
      servicesKicker: sanitizeText(formStr(formData, "servicesKicker"), 80),
      servicesHeading: sanitizeText(formStr(formData, "servicesHeading"), 160),
      servicesBody: sanitizeText(formStr(formData, "servicesBody"), 600),
      bespokeKicker: sanitizeText(formStr(formData, "bespokeKicker"), 120),
      bespokeHeading: sanitizeText(formStr(formData, "bespokeHeading"), 160),
      bespokeCta: sanitizeText(formStr(formData, "bespokeCta"), 80),
      comingKicker: sanitizeText(formStr(formData, "comingKicker"), 80),
      comingHeading: sanitizeText(formStr(formData, "comingHeading"), 160),
      comingBody: sanitizeText(formStr(formData, "comingBody"), 600),
      comingCta: sanitizeText(formStr(formData, "comingCta"), 80),
      guarantees: lines(formData, "guarantees").map((s) => sanitizeText(s, 80)),
      friggaHeading: sanitizeText(formStr(formData, "friggaHeading"), 160),
      friggaBody: sanitizeText(formStr(formData, "friggaBody"), 600),
      friggaCta: sanitizeText(formStr(formData, "friggaCta"), 80),
      friggaBrowse:
        formStr(formData, "homeListsMode") === "cards"
          ? zipText(formData, [
              ["browseLabel", 80],
              ["browseUrl", 200]
            ])
              .map(([label, url]) => ({ label, url }))
              .filter((row) => row.label || row.url)
          : lines(formData, "friggaBrowse").map((line) => {
              const [label, url] = line.split("|");
              return { label: sanitizeText(label || "", 80), url: sanitizeText(url || "", 200) };
            }),
      friggaRegions:
        formStr(formData, "homeListsMode") === "cards"
          ? zipText(formData, [
              ["regionName", 80],
              ["regionDomain", 80],
              ["regionUrl", 200]
            ])
              .map(([region, domain, url]) => ({ region, domain, url }))
              .filter((row) => row.region || row.domain || row.url)
          : lines(formData, "friggaRegions").map((line) => {
              const [region, domain, url] = line.split("|");
              return {
                region: sanitizeText(region || "", 80),
                domain: sanitizeText(domain || "", 80),
                url: sanitizeText(url || "", 200)
              };
            })
    }
  });
  logAudit(user.id, "pageCopy", "home", "save");
  const next = formStr(formData, "next") || "/admin/copy?tab=home";
  redirect(`${next}${next.includes("?") ? "&" : "?"}saved=1`.replace("?&", "?"));
}

export async function saveBookCopyAction(formData: FormData) {
  const user = await actor();
  const current = getPageCopy();
  savePageCopy({
    ...current,
    book: {
      ...current.book,
      seoTitle: sanitizeText(formStr(formData, "seoTitle"), 120),
      seoDescription: sanitizeText(formStr(formData, "seoDescription"), 300),
      kicker: sanitizeText(formStr(formData, "kicker"), 80),
      title: sanitizeText(formStr(formData, "title"), 120),
      intro: sanitizeText(formStr(formData, "intro"), 600),
      formTitle: sanitizeText(formStr(formData, "formTitle"), 80),
      formBody: sanitizeText(formStr(formData, "formBody"), 400),
      submitLabel: sanitizeText(formStr(formData, "submitLabel"), 60),
      successTitle: sanitizeText(formStr(formData, "successTitle"), 80),
      successBody: sanitizeText(formStr(formData, "successBody"), 400),
      preferTalkHeading: sanitizeText(
        formStr(formData, "preferTalkHeading") || current.book.preferTalkHeading,
        120
      ),
      whatsappLabel: sanitizeText(formStr(formData, "whatsappLabel") || current.book.whatsappLabel, 80)
    }
  });
  logAudit(user.id, "pageCopy", "book", "save");
  redirect("/admin/consultations?saved=1");
}

export async function saveEventsPageCopyAction(formData: FormData) {
  const user = await actor();
  const current = getPageCopy();
  let speakingLines = current.eventsPage.speakingLines;
  let videos = current.eventsPage.videos;
  if (formStr(formData, "eventsListsMode") === "cards") {
    speakingLines = zipText(formData, [
      ["speakingOrg", 160],
      ["speakingTopic", 200]
    ])
      .map(([org, topic]) => [org, topic].filter(Boolean).join("|"))
      .filter(Boolean);
    videos = zipText(formData, [
      ["videoSource", 120],
      ["videoTitle", 160],
      ["videoYt", 80]
    ])
      .map((parts) => parts.map((p) => sanitizeText(p, 160)).join("|"))
      .filter((line) => line.replace(/\|/g, "").trim());
  } else {
    speakingLines = lines(formData, "speakingLines").map((s) => sanitizeText(s, 200));
    videos = lines(formData, "videos").map((s) => sanitizeText(s, 240));
  }
  savePageCopy({
    ...current,
    eventsPage: {
      ...current.eventsPage,
      seoTitle: sanitizeText(formStr(formData, "seoTitle"), 120),
      seoDescription: sanitizeText(formStr(formData, "seoDescription"), 300),
      kicker: sanitizeText(formStr(formData, "kicker"), 80),
      title: sanitizeText(formStr(formData, "title"), 160),
      intro: sanitizeText(formStr(formData, "intro"), 600),
      speakingHeading: sanitizeText(formStr(formData, "speakingHeading"), 160),
      speakingLines,
      videosHeading: sanitizeText(formStr(formData, "videosHeading"), 160),
      videos
    }
  });
  logAudit(user.id, "pageCopy", "eventsPage", "save");
  redirect("/admin/events?saved=1");
}

export async function saveMediaPageCopyAction(formData: FormData) {
  const user = await actor();
  const current = getPageCopy();
  let videos = current.mediaPage.videos;
  if (formStr(formData, "mediaListsMode") === "cards") {
    videos = zipText(formData, [
      ["videoSource", 120],
      ["videoTitle", 160],
      ["videoYt", 80],
      ["videoDate", 40],
      ["videoBadge", 40]
    ])
      .map((parts) => {
        const [source, title, yt, date, badge] = parts.map((p) => sanitizeText(p, 160));
        return [source, title, yt, date, badge].join("|").replace(/\|+$/, "");
      })
      .filter((line) => line.replace(/\|/g, "").trim());
  } else {
    videos = lines(formData, "videos").map((s) => sanitizeText(s, 280));
  }
  savePageCopy({
    ...current,
    mediaPage: {
      ...current.mediaPage,
      seoTitle: sanitizeText(formStr(formData, "seoTitle"), 120),
      seoDescription: sanitizeText(formStr(formData, "seoDescription"), 300),
      kicker: sanitizeText(formStr(formData, "kicker"), 80),
      title: sanitizeText(formStr(formData, "title"), 160),
      intro: sanitizeText(formStr(formData, "intro"), 600),
      pressKitTitle: sanitizeText(formStr(formData, "pressKitTitle"), 160),
      pressKitBody: sanitizeText(formStr(formData, "pressKitBody"), 400),
      videosHeading: sanitizeText(formStr(formData, "videosHeading"), 160),
      videos
    }
  });
  logAudit(user.id, "pageCopy", "mediaPage", "save");
  redirect("/admin/articles?saved=1");
}

export async function saveCopyPatchesAction(formData: FormData) {
  const user = await actor();
  const returnTo = formStr(formData, "returnTo") || "/admin/pages";
  const raw = formStr(formData, "patches");
  let patches: Array<{ path: string; value: string }> = [];
  try {
    const parsed = JSON.parse(raw || "[]");
    if (Array.isArray(parsed)) {
      patches = parsed
        .filter((row) => row && typeof row.path === "string")
        .map((row) => ({ path: String(row.path), value: String(row.value ?? "") }));
    }
  } catch {
    redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}error=bad-patches`);
  }
  if (!patches.length) redirect(returnTo);
  setCopyPaths(patches);
  logAudit(user.id, "pageCopy", "patches", "save");
  redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}saved=1`);
}
