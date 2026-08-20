import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { hashPassword, slugify, verifyPassword } from "./crypto";
import { sanitizeHtml } from "./sanitize";

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
});

describe("sanitize", () => {
  it("strips scripts and events", () => {
    const html = sanitizeHtml(`<p>Hi</p><script>alert(1)</script><a href="javascript:alert(1)" onclick="x">x</a>`);
    expect(html).not.toContain("script");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("<p>Hi</p>");
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
    const article = saveArticle({
      title: "Test press",
      slug: "test-press",
      excerpt: "Quote",
      year: 2026,
      month: 3,
      status: "published",
      outlet: "Test Outlet"
    });
    expect(listArticles({ status: "published" }).some((a) => a.id === article.id)).toBe(true);

    saveMedia({
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
    saveArticle({
      ...article,
      featuredImageId: "img1"
    });
    expect(mediaInUse("img1")).toBe(true);
    expect(() => deleteMedia("img1")).toThrow(/still used/i);
  });

  it("stores email sign-ups and updates the same email for a kind", async () => {
    const { saveSignup, listSignups } = await import("./repo");
    saveSignup({
      kind: "newsletter",
      email: "guest@example.com",
      name: "Guest",
      phone: "",
      organization: "",
      notes: "",
      source: "footer",
      fields: {}
    });
    saveSignup({
      kind: "newsletter",
      email: "guest@example.com",
      name: "Guest Two",
      phone: "",
      organization: "",
      notes: "",
      source: "footer",
      fields: {}
    });
    const rows = listSignups({ kind: "newsletter" });
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe("Guest Two");
  });

  it("sorts booking enquiries by name", async () => {
    const { saveSignup, listSignups } = await import("./repo");
    saveSignup({
      kind: "booking-waitlist",
      email: "b@example.com",
      name: "Bea",
      phone: "",
      organization: "",
      notes: "Career reading",
      source: "book",
      fields: { service: "Business Strategy" }
    });
    saveSignup({
      kind: "booking-waitlist",
      email: "a@example.com",
      name: "Ada",
      phone: "",
      organization: "",
      notes: "Home audit",
      source: "book",
      fields: { service: "Home / Office Feng Shui" }
    });
    const rows = listSignups({ kind: "booking-waitlist", sort: "name", dir: "asc" });
    expect(rows.map((r) => r.name)).toEqual(["Ada", "Bea"]);
  });

  it("saves designed-page copy and merges defaults", async () => {
    const { getPageCopy, savePageCopy } = await import("./repo");
    const copy = getPageCopy();
    expect(copy.about.title).toBeTruthy();
    expect(copy.forecast.zodiacs).toHaveLength(12);
    expect(copy.book.title).toBeTruthy();
    expect(copy.eventsPage.speakingLines.length).toBeGreaterThan(0);
    expect(copy.mediaPage.videos.length).toBeGreaterThan(0);
    expect(copy.home.pressNames.length).toBeGreaterThan(0);
    savePageCopy({
      ...copy,
      about: { ...copy.about, title: "Edited About" }
    });
    expect(getPageCopy().about.title).toBe("Edited About");
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
    ensureSeeded();
    const { setCopyPaths, getPageCopy } = await import("./repo");
    setCopyPaths([{ path: "about.title", value: "Live Edit Title" }]);
    expect(getPageCopy().about.title).toBe("Live Edit Title");
    setCopyPaths([{ path: "about.recognition.0", value: "Updated award" }]);
    expect(getPageCopy().about.recognition[0]).toBe("Updated award");
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

  it("creates owner logins and lets them change or reset a password", async () => {
    process.env.OWNER_BOOTSTRAP_PASSWORD = "IamLUCKY168!";
    const { ensureSeeded } = await import("./seed");
    ensureSeeded();
    const { authenticate, changePasswordWithCurrent, requestPasswordReset, completePasswordReset } = await import("./auth");
    expect(authenticate("maritesallen@gmail.com", "IamLUCKY168!")?.role).toBe("owner");
    expect(authenticate("cap10kirck@gmail.com", "IamLUCKY168!")?.role).toBe("owner");
    const changed = changePasswordWithCurrent("maritesallen@gmail.com", "IamLUCKY168!", "NewLucky168!");
    expect(changed?.email).toBe("maritesallen@gmail.com");
    expect(authenticate("maritesallen@gmail.com", "IamLUCKY168!")).toBeNull();
    expect(authenticate("maritesallen@gmail.com", "NewLucky168!")).toBeTruthy();

    await requestPasswordReset("cap10kirck@gmail.com");
    const note = fs.readFileSync(path.join(dir, "last-password-reset.txt"), "utf8");
    const code = note.match(/Code: ([A-Z0-9]+)/)?.[1];
    expect(code).toBeTruthy();
    const reset = completePasswordReset("cap10kirck@gmail.com", code!, "ResetLucky168!");
    expect(reset?.email).toBe("cap10kirck@gmail.com");
    expect(authenticate("cap10kirck@gmail.com", "ResetLucky168!")).toBeTruthy();
  });
});
