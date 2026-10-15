import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { hashPassword, slugify, verifyPassword } from "./crypto";
import { readSessionCookie, safeAdminNext, signSessionCookie } from "./session-cookie";
import { formatArticleBody, sanitizeHtml } from "./sanitize";
import type { StoreData } from "./store";

describe("crypto", () => {
  it("hashes and verifies passwords", () => {
    const hash = hashPassword("change-this-password");
    expect(hash.startsWith("scrypt:")).toBe(true);
    expect(verifyPassword("change-this-password", hash)).toBe(true);
    expect(verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("slugifies titles", () => {
    expect(slugify("Hello, Feng Shui!")).toBe("hello-feng-shui");
  });

  it("signs a session cookie and rejects tampered or expired cookies", async () => {
    const cookie = await signSessionCookie({ id: "sess-1", email: "owner@example.com", exp: Date.now() + 60_000 });
    expect((await readSessionCookie(cookie))?.email).toBe("owner@example.com");

    const [body, signature] = cookie.split(".");
    const tampered = `${body}.${signature.slice(0, -1)}${signature.endsWith("a") ? "b" : "a"}`;
    expect(await readSessionCookie(tampered)).toBeNull();

    const expired = await signSessionCookie({ id: "sess-1", email: "owner@example.com", exp: Date.now() - 1000 });
    expect(await readSessionCookie(expired)).toBeNull();
  });

  it("refuses to sign a production cookie when the secret is missing", async () => {
    const env = process.env as { NODE_ENV?: string; ADMIN_SESSION_SECRET?: string; VERCEL?: string };
    const prevNode = env.NODE_ENV;
    const prevSecret = env.ADMIN_SESSION_SECRET;
    const prevVercel = env.VERCEL;
    env.NODE_ENV = "production";
    delete env.ADMIN_SESSION_SECRET;
    delete env.VERCEL;
    try {
      await expect(signSessionCookie({ id: "sess-1", email: "owner@example.com", exp: Date.now() + 60_000 })).rejects.toThrow(
        /ADMIN_SESSION_SECRET/
      );
    } finally {
      env.NODE_ENV = prevNode;
      if (prevSecret === undefined) delete env.ADMIN_SESSION_SECRET;
      else env.ADMIN_SESSION_SECRET = prevSecret;
      if (prevVercel === undefined) delete env.VERCEL;
      else env.VERCEL = prevVercel;
    }
  });

  it("keeps the return path inside the admin", () => {
    expect(safeAdminNext("/admin/articles")).toBe("/admin/articles");
    expect(safeAdminNext("https://evil.example/admin")).toBe("/admin/dashboard");
    expect(safeAdminNext("//evil.example")).toBe("/admin/dashboard");
    expect(safeAdminNext("/media")).toBe("/admin/dashboard");
  });
});

describe("sanitize", () => {
  it("strips scripts and events", () => {
    const html = sanitizeHtml(`<p>Hi</p><script>alert(1)</script><a href="javascript:alert(1)" onclick="x">x</a>`);
    expect(html).not.toContain("script");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("<p>Hi</p>");
  });

  it("turns plain writing into paragraphs", () => {
    const html = formatArticleBody("First paragraph.\n\nSecond line\nstays with it.");
    expect(html).toBe("<p>First paragraph.</p><p>Second line<br />stays with it.</p>");
    expect(formatArticleBody("<p>Already HTML</p>")).toBe("<p>Already HTML</p>");
  });
});

describe("cms repository", () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "ma-cms-"));
    process.env.CMS_JSON_PATH = path.join(dir, "cms.json");
    process.env.ANALYTICS_JSON_PATH = path.join(dir, "analytics.json");
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
    delete process.env.CMS_JSON_PATH;
    delete process.env.ANALYTICS_JSON_PATH;
  });

  it("saves and lists articles, and blocks media delete when referenced", async () => {
    const { saveArticle, listArticles, saveMedia, mediaInUse, deleteMedia } = await import("./repo");
    const article = await saveArticle({
      title: "Test press",
      slug: "test-press",
      excerpt: "Quote",
      year: 2026,
      month: 3,
      status: "published",
      outlet: "Test Outlet"
    });
    expect((await listArticles({ status: "published" })).some((a) => a.id === article.id)).toBe(true);

    await saveMedia({
      id: "img1",
      filename: "a.webp",
      path: "/uploads/a.webp",
      mimeType: "image/webp",
      size: 12,
      width: null,
      height: null,
      altText: "alt",
      createdAt: new Date().toISOString()
    });
    await saveArticle({
      ...article,
      featuredImageId: "img1"
    });
    expect(await mediaInUse("img1")).toBe(true);
    await expect(deleteMedia("img1")).rejects.toThrow(/still used/i);
  });

  it("keeps story links unique and keeps the original publish date", async () => {
    const { saveArticle, getArticleBySlug, listArticles } = await import("./repo");
    const first = await saveArticle({ title: "Same", slug: "same-story", year: 2026, month: 1, status: "published" });
    const second = await saveArticle({ title: "Same again", slug: "same-story", year: 2026, month: 2, status: "published" });
    expect(second.slug).toBe("same-story-2");
    expect((await getArticleBySlug("same-story"))?.id).toBe(first.id);
    const again = await saveArticle({ ...first, title: "Renamed" });
    expect(again.slug).toBe("same-story");
    expect(again.publishedAt).toBe(first.publishedAt);
    expect((await listArticles({ q: "renamed" })).some((row) => row.id === first.id)).toBe(true);
  });

  it("lists stories with no folder and keeps folder links unique", async () => {
    const { saveArticle, saveCategory, listArticles } = await import("./repo");
    const press = await saveCategory({ name: "Press", slug: "press" });
    const again = await saveCategory({ name: "Press", slug: "press" });
    expect(press.slug).toBe("press");
    expect(again.slug).toBe("press-2");
    await saveArticle({ title: "Loose", slug: "loose", year: 2026, month: 1, status: "draft" });
    await saveArticle({ title: "Filed", slug: "filed", year: 2026, month: 1, status: "draft", categoryId: press.id });
    await saveArticle({ title: "Bogus", slug: "bogus", year: 2026, month: 1, status: "draft", categoryId: "missing" });
    expect((await listArticles({ categoryId: "none" })).map((row) => row.slug).sort()).toEqual(["bogus", "loose"]);
    const kept = await saveCategory({ ...press, name: "Press desk" });
    expect(kept.slug).toBe("press");
  });

  it("stores email sign-ups and updates the same email for a kind", async () => {
    const { saveSignup, listSignups } = await import("./repo");
    await saveSignup({
      kind: "newsletter",
      email: "guest@example.com",
      name: "Guest",
      phone: "",
      organization: "",
      notes: "",
      source: "footer",
      fields: {}
    });
    await saveSignup({
      kind: "newsletter",
      email: "guest@example.com",
      name: "Guest Two",
      phone: "",
      organization: "",
      notes: "",
      source: "footer",
      fields: {}
    });
    const rows = await listSignups({ kind: "newsletter" });
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe("Guest Two");
  });

  it("sorts booking enquiries by name", async () => {
    const { saveSignup, listSignups } = await import("./repo");
    await saveSignup({
      kind: "booking-waitlist",
      email: "b@example.com",
      name: "Bea",
      phone: "",
      organization: "",
      notes: "Career reading",
      source: "book",
      fields: { service: "Business Strategy" }
    });
    await saveSignup({
      kind: "booking-waitlist",
      email: "a@example.com",
      name: "Ada",
      phone: "",
      organization: "",
      notes: "Home audit",
      source: "book",
      fields: { service: "Home / Office Feng Shui" }
    });
    const rows = await listSignups({ kind: "booking-waitlist", sort: "name", dir: "asc" });
    expect(rows.map((r) => r.name)).toEqual(["Ada", "Bea"]);
  });

  it("saves designed-page copy and merges defaults", async () => {
    const { getPageCopy, savePageCopy } = await import("./repo");
    const copy = await getPageCopy();
    expect(copy.about.title).toBeTruthy();
    expect(copy.forecast.zodiacs).toHaveLength(12);
    expect(copy.book.title).toBeTruthy();
    expect(copy.eventsPage.speakingLines.length).toBeGreaterThan(0);
    expect(copy.mediaPage.videos.length).toBeGreaterThan(0);
    expect(copy.home.pressNames.length).toBeGreaterThan(0);
    await savePageCopy({
      ...copy,
      about: { ...copy.about, title: "Edited About" }
    });
    expect((await getPageCopy()).about.title).toBe("Edited About");
  });

  it("lists designed site pages next to extra pages", async () => {
    const { combineAdminPages } = await import("./site-pages");
    const rows = combineAdminPages([
      {
        id: "p1",
        slug: "about",
        title: "About Marites Allen",
        blocks: [],
        status: "published",
        seoTitle: "",
        seoDescription: "",
        ogImageId: null,
        publishedAt: null,
        updatedAt: "2026-08-21T00:00:00.000Z"
      }
    ]);
    expect(rows.some((row) => row.kind === "site" && row.href === "/about" && row.editHref.includes("live"))).toBe(true);
    const extra = rows.find((row) => row.id === "p1");
    expect(extra?.blocked).toBe(true);
    expect(extra?.status).toBe("archived");
  });

  it("patches page copy by dotted path", async () => {
    const { ensureSeeded } = await import("./seed");
    await ensureSeeded();
    const { setCopyPaths, getPageCopy } = await import("./repo");
    await setCopyPaths([{ path: "about.title", value: "Live Edit Title" }]);
    expect((await getPageCopy()).about.title).toBe("Live Edit Title");
    await setCopyPaths([{ path: "about.recognition.0", value: "Updated award" }]);
    expect((await getPageCopy()).about.recognition[0]).toBe("Updated award");
  });

  it("counts unique visitors and page opens", async () => {
    const { recordVisit, analyticsSummary, manilaDay } = await import("./analytics");
    recordVisit({ visitorId: "alice", isNewVisitor: true, path: "/" });
    recordVisit({ visitorId: "alice", isNewVisitor: false, path: "/about" });
    recordVisit({ visitorId: "bob", isNewVisitor: true, path: "/" });
    const summary = analyticsSummary();
    const today = manilaDay();
    expect(summary.todayViews).toBe(3);
    expect(summary.todayVisitors).toBe(2);
    expect(summary.totalVisitors).toBe(2);
    expect(summary.totalViews).toBe(3);
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("builds visit charts for 24 hours, 48 hours, week, month, and year", async () => {
    const { recordVisit, analyticsSeries, parseAnalyticsRange } = await import("./analytics");
    recordVisit({ visitorId: "alice", isNewVisitor: true, path: "/" });
    recordVisit({ visitorId: "bob", isNewVisitor: true, path: "/about" });
    expect(parseAnalyticsRange("48h")).toBe("48h");
    expect(parseAnalyticsRange("nope")).toBe("week");
    const hours = analyticsSeries("24h");
    const twoDays = analyticsSeries("48h");
    const week = analyticsSeries("week");
    const month = analyticsSeries("month");
    const year = analyticsSeries("year");
    expect(hours).toHaveLength(24);
    expect(twoDays).toHaveLength(48);
    expect(week).toHaveLength(7);
    expect(month).toHaveLength(30);
    expect(year).toHaveLength(12);
    expect(hours.at(-1)?.views).toBeGreaterThanOrEqual(2);
    expect(week.at(-1)?.views).toBeGreaterThanOrEqual(2);
    expect(hours.every((point) => point.label)).toBe(true);
    expect(year.at(-1)?.key).toMatch(/^\d{4}-\d{2}$/);
  });

  it("accepts a signed session without a row only when the store is ephemeral", async () => {
    const { resolveSessionUser } = await import("./auth");
    const cookie = await signSessionCookie({
      id: "missing-row",
      email: "maritesallen@gmail.com",
      exp: Date.now() + 60_000
    });
    const store = {
      sessions: [],
      adminUsers: [
        {
          id: "different-id",
          email: "maritesallen@gmail.com",
          role: "owner",
          createdAt: "2026-01-01T00:00:00.000Z",
          lastLoginAt: null,
          passwordHash: "x"
        }
      ]
    } as unknown as StoreData;
    expect((await resolveSessionUser(store, cookie, "ephemeral"))?.email).toBe("maritesallen@gmail.com");
    expect(await resolveSessionUser(store, cookie, "file")).toBeNull();
    expect(await resolveSessionUser(store, cookie, "blob")).toBeNull();
  });

  it("creates owner logins and lets them change or reset a password", async () => {
    process.env.OWNER_BOOTSTRAP_PASSWORD = "IamLUCKY168!";
    const { ensureSeeded } = await import("./seed");
    await ensureSeeded();
    const { authenticate, changePasswordWithCurrent, requestPasswordReset, completePasswordReset } = await import("./auth");
    expect((await authenticate("maritesallen@gmail.com", "IamLUCKY168!"))?.role).toBe("owner");
    expect((await authenticate("cap10kirck@gmail.com", "IamLUCKY168!"))?.role).toBe("owner");
    const changed = await changePasswordWithCurrent("maritesallen@gmail.com", "IamLUCKY168!", "NewLucky168!");
    expect(changed?.email).toBe("maritesallen@gmail.com");
    expect(await authenticate("maritesallen@gmail.com", "IamLUCKY168!")).toBeNull();
    expect(await authenticate("maritesallen@gmail.com", "NewLucky168!")).toBeTruthy();

    await requestPasswordReset("cap10kirck@gmail.com");
    const note = fs.readFileSync(path.join(dir, "last-password-reset.txt"), "utf8");
    const code = note.match(/Code: ([A-Z0-9]+)/)?.[1];
    expect(code).toBeTruthy();
    const reset = await completePasswordReset("cap10kirck@gmail.com", code!, "ResetLucky168!");
    expect(reset?.email).toBe("cap10kirck@gmail.com");
    expect(await authenticate("cap10kirck@gmail.com", "ResetLucky168!")).toBeTruthy();
  });
});
