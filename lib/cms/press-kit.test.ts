import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { fileLooksLikePlaceholder, PRESS_KIT_PLACEHOLDER_MARK, pressKitVisitorNotice, resolvePressKit, sniffPressKit } from "./press-kit";
import { isStorageFailure } from "./store";

function tinyPdf(text: string) {
  const content = `BT /F1 12 Tf 72 720 Td (${text.replace(/[()\\]/g, "")}) Tj ET\n`;
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}endstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"
  ];
  let body = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(body));
    body += obj;
  }
  const xrefAt = Buffer.byteLength(body);
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  return Buffer.from(`${body}${xref}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`);
}

describe("press kit", () => {
  let dir: string;
  let publicDir: string;
  const envKeys = ["CMS_JSON_PATH", "RESEND_API_KEY", "BOOKING_FROM_EMAIL", "RESET_FROM_EMAIL"] as const;
  const previous: Record<string, string | undefined> = {};

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "ma-press-"));
    publicDir = path.join(dir, "public");
    fs.mkdirSync(path.join(publicDir, "press-kit"), { recursive: true });
    fs.mkdirSync(path.join(publicDir, "uploads"), { recursive: true });
    for (const key of envKeys) previous[key] = process.env[key];
    process.env.CMS_JSON_PATH = path.join(dir, "cms.json");
    delete process.env.RESEND_API_KEY;
    delete process.env.BOOKING_FROM_EMAIL;
    delete process.env.RESET_FROM_EMAIL;
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
    for (const key of envKeys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });

  it("accepts pdf and zip bytes and rejects a photo", () => {
    expect(sniffPressKit(tinyPdf("Hello"))?.ext).toBe(".pdf");
    expect(sniffPressKit(Buffer.from([0x50, 0x4b, 0x03, 0x04, 0, 0]))?.ext).toBe(".zip");
    expect(sniffPressKit(Buffer.from([0xff, 0xd8, 0xff, 0x00]))).toBeNull();
  });

  it("does not say the kit was sent unless email actually went out", () => {
    const email = "editor@example.com";
    const sent = pressKitVisitorNotice({ email, hasFile: true, emailStatus: "sent", missing: [] });
    expect(sent.emailed).toBe(true);
    expect(sent.headline).toBe(`Sent to ${email}`);
    expect(sent.downloadPath).toBe("/press-kit");

    for (const emailStatus of ["not-configured", "failed", "no-file"] as const) {
      const notice = pressKitVisitorNotice({
        email,
        hasFile: emailStatus !== "no-file",
        emailStatus,
        missing: ["RESEND_API_KEY", "BOOKING_FROM_EMAIL or RESET_FROM_EMAIL"]
      });
      expect(notice.emailed).toBe(false);
      expect(notice.headline).not.toMatch(/Sent to/);
      expect(notice.detail).not.toMatch(/Sent to/);
      expect(`${notice.headline} ${notice.detail}`).not.toMatch(/✓/);
    }

    const unconfigured = pressKitVisitorNotice({
      email,
      hasFile: true,
      emailStatus: "not-configured",
      missing: ["RESEND_API_KEY"]
    });
    expect(unconfigured.detail).toContain("RESEND_API_KEY");
    expect(unconfigured.detail).toMatch(/not sent/i);
    expect(unconfigured.downloadPath).toBe("/press-kit");
  });

  it("names the mail settings that are missing", async () => {
    const { missingPressKitMailEnv } = await import("./notify");
    expect(missingPressKitMailEnv()).toEqual(["RESEND_API_KEY", "BOOKING_FROM_EMAIL or RESET_FROM_EMAIL"]);
    process.env.RESEND_API_KEY = "test-key";
    expect(missingPressKitMailEnv()).toEqual(["BOOKING_FROM_EMAIL or RESET_FROM_EMAIL"]);
    process.env.RESET_FROM_EMAIL = "Kit <kit@example.com>";
    expect(missingPressKitMailEnv()).toEqual([]);
  });

  it("serves a static kit, prefers an uploaded file, and ignores path traversal", async () => {
    expect(await resolvePressKit(publicDir)).toBeNull();

    const placeholder = tinyPdf(PRESS_KIT_PLACEHOLDER_MARK);
    fs.writeFileSync(path.join(publicDir, "press-kit", "PLACEHOLDER.pdf"), placeholder);
    const onlyPlaceholder = await resolvePressKit(publicDir);
    expect(onlyPlaceholder?.placeholder).toBe(true);
    expect(onlyPlaceholder?.source).toBe("static");

    const real = tinyPdf("Real kit file");
    fs.writeFileSync(path.join(publicDir, "press-kit", "press-kit.pdf"), real);
    const fromDisk = await resolvePressKit(publicDir);
    expect(fromDisk?.placeholder).toBe(false);
    expect(fromDisk?.absolutePath).toContain("press-kit.pdf");

    const uploaded = tinyPdf("Uploaded kit");
    fs.writeFileSync(path.join(publicDir, "uploads", "kit.pdf"), uploaded);
    const { savePressKitFile } = await import("./repo");
    await savePressKitFile({
      filename: "press-kit.pdf",
      path: "/uploads/kit.pdf",
      mimeType: "application/pdf",
      size: uploaded.length,
      updatedAt: "2026-11-25T00:00:00.000Z",
      placeholder: false
    });
    const fromUpload = await resolvePressKit(publicDir);
    expect(fromUpload?.source).toBe("upload");
    expect(fromUpload?.absolutePath).toContain(`${path.sep}uploads${path.sep}kit.pdf`);

    await savePressKitFile({
      filename: "bad.pdf",
      path: "/uploads/../../press-kit/press-kit.pdf",
      mimeType: "application/pdf",
      size: 10,
      updatedAt: "2026-11-25T00:00:00.000Z",
      placeholder: false
    });
    const rejected = await resolvePressKit(publicDir);
    expect(rejected?.source).toBe("static");
    expect(rejected?.filename).toBe("press-kit.pdf");
  });

  it("ships a labeled placeholder and no invented press kit", () => {
    const committed = fs.readFileSync(path.join(process.cwd(), "public", "press-kit", "PLACEHOLDER.pdf"));
    expect(committed.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    expect(fileLooksLikePlaceholder(committed)).toBe(true);
    expect(fs.existsSync(path.join(process.cwd(), "public", "press-kit", "press-kit.pdf"))).toBe(false);
    expect(fs.existsSync(path.join(process.cwd(), "public", "press-kit", "press-kit.zip"))).toBe(false);
    const readme = fs.readFileSync(path.join(process.cwd(), "public", "press-kit", "README.md"), "utf8");
    expect(readme).toContain("press-kit.pdf");
    expect(readme).toContain("BLOB_READ_WRITE_TOKEN");
    expect(readme).toContain("RESEND_API_KEY");
  });

  it("recognises a missing Blob token and a read-only disk as storage failures", () => {
    expect(isStorageFailure(new Error("BLOB_READ_WRITE_TOKEN is not set. This file was not stored."))).toBe(true);
    expect(isStorageFailure(Object.assign(new Error("EROFS: read-only file system"), { code: "EROFS" }))).toBe(true);
    expect(isStorageFailure(new Error("File type not allowed"))).toBe(false);
  });
});
