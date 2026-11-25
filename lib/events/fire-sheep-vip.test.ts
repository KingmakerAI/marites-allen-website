import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  FIRE_SHEEP_VIP_EVENT,
  fireSheepPopupAllowed,
  fireSheepVipHasEnded,
  manilaCalendarDay,
  mergeCodeEvents
} from "./fire-sheep-vip";
import type { CmsEvent } from "@/lib/cms/types";

const END = Date.parse("2026-11-27T14:00:00+08:00");

describe("fire sheep vip event", () => {
  it("stays upcoming until 2:00 PM Asia/Manila on 27 November 2026", () => {
    expect(fireSheepVipHasEnded(END - 1)).toBe(false);
    expect(fireSheepVipHasEnded(END)).toBe(true);
  });

  it("uses the Manila calendar day", () => {
    expect(manilaCalendarDay(new Date("2026-11-25T16:30:00.000Z"))).toBe("2026-11-26");
    expect(manilaCalendarDay(new Date("2026-11-25T15:30:00.000Z"))).toBe("2026-11-25");
  });

  it("allows the home page and skips admin and media", () => {
    expect(fireSheepPopupAllowed("/", END - 1)).toBe(true);
    expect(fireSheepPopupAllowed("/events", END - 1)).toBe(true);
    expect(fireSheepPopupAllowed("/about", END - 1)).toBe(true);
    expect(fireSheepPopupAllowed("/media", END - 1)).toBe(false);
    expect(fireSheepPopupAllowed("/media/kit", END - 1)).toBe(false);
    expect(fireSheepPopupAllowed("/admin", END - 1)).toBe(false);
    expect(fireSheepPopupAllowed("/admin/events", END - 1)).toBe(false);
    expect(fireSheepPopupAllowed("/adminportal", END - 1)).toBe(false);
    expect(fireSheepPopupAllowed("/", END)).toBe(false);
  });

  it("adds the event only when the CMS has no matching row", () => {
    const merged = mergeCodeEvents([]);
    expect(merged.map((event) => event.id)).toEqual([FIRE_SHEEP_VIP_EVENT.id]);

    const blob: CmsEvent = { ...FIRE_SHEEP_VIP_EVENT, title: "Title stored in Blob", summary: "Blob summary" };
    const kept = mergeCodeEvents([blob]);
    expect(kept).toHaveLength(1);
    expect(kept[0].title).toBe("Title stored in Blob");
    expect(kept[0].summary).toBe("Blob summary");

    const sameSlug: CmsEvent = { ...FIRE_SHEEP_VIP_EVENT, id: "other-id", title: "Slug already used" };
    expect(mergeCodeEvents([sameSlug])[0].title).toBe("Slug already used");
  });
});

describe("fire sheep vip event in the CMS read path", () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "ma-vip-"));
    process.env.CMS_JSON_PATH = path.join(dir, "cms.json");
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
    delete process.env.CMS_JSON_PATH;
  });

  it("shows the event when the store has no events and does not write it into the store", async () => {
    const { listEvents } = await import("../cms/repo");
    const { readStore } = await import("../cms/store");
    const listed = await listEvents(true);
    expect(listed.some((event) => event.id === FIRE_SHEEP_VIP_EVENT.id)).toBe(true);
    expect((await readStore()).events).toEqual([]);
  });

  it("keeps a Blob row instead of replacing it", async () => {
    const { listEvents, saveEvent } = await import("../cms/repo");
    await saveEvent({ ...FIRE_SHEEP_VIP_EVENT, title: "Title stored in Blob", status: "published" });
    const listed = await listEvents(true);
    const matches = listed.filter((event) => event.id === FIRE_SHEEP_VIP_EVENT.id);
    expect(matches).toHaveLength(1);
    expect(matches[0].title).toBe("Title stored in Blob");
  });
});
