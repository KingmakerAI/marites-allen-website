import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@vercel/blob", () => ({
  get: vi.fn(async () => {
    throw new Error("This store has been suspended.");
  }),
  put: vi.fn(async () => {
    throw new Error("This store has been suspended.");
  })
}));

describe("admin login when Vercel Blob is suspended", () => {
  const env = process.env;

  afterEach(() => {
    delete env.BLOB_READ_WRITE_TOKEN;
    delete env.VERCEL;
    delete env.CMS_STORE;
    delete env.CMS_JSON_PATH;
  });

  it("counts attempts in memory and rejects a fake password", async () => {
    env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_test";
    env.VERCEL = "1";
    delete env.CMS_JSON_PATH;
    delete env.CMS_STORE;

    const { authenticate, rateLimitLogin } = await import("./auth");
    const key = "suspended-blob-login";
    for (let i = 0; i < 5; i += 1) {
      expect(await rateLimitLogin(key)).toBe(true);
    }
    expect(await rateLimitLogin(key)).toBe(false);
    expect(await authenticate("test@example.com", "wrongpass123")).toBeNull();
  });
});
