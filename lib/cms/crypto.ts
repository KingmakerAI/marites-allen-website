import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEYLEN = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEYLEN).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [algo, salt, hash] = stored.split(":");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const actual = scryptSync(password, salt, KEYLEN);
  const expected = Buffer.from(hash, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function newId() {
  return randomBytes(16).toString("hex");
}

export function newToken() {
  return randomBytes(32).toString("hex");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function nowIso() {
  return new Date().toISOString();
}

export function fingerprint(ip: string) {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export function hashToken(value: string) {
  return createHash("sha256").update(value.trim().toUpperCase()).digest("hex");
}

export function newResetCode() {
  return randomBytes(4).toString("hex").toUpperCase();
}
