export const SESSION_COOKIE = "ma_admin_session";
export const SESSION_MAX_AGE = 604800;

const DEV_SESSION_SECRET = "ma-admin-session-dev";

export type SessionClaims = { id: string; email: string; exp: number };

export class SessionSecretError extends Error {
  constructor() {
    super("ADMIN_SESSION_SECRET is not set. Add it in the Vercel project settings before signing in.");
    this.name = "SessionSecretError";
  }
}

/** Production must set ADMIN_SESSION_SECRET. Local dev and tests use a stable fallback. */
export function sessionSecret(): string | null {
  const fromEnv = process.env.ADMIN_SESSION_SECRET?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL || process.env.NODE_ENV === "production") return null;
  return DEV_SESSION_SECRET;
}

function encodeBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify"
  ]);
}

export async function signSessionCookie(claims: SessionClaims) {
  const secret = sessionSecret();
  if (!secret) throw new SessionSecretError();
  const body = encodeBase64Url(new TextEncoder().encode(JSON.stringify(claims)));
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey(secret), new TextEncoder().encode(body)));
  return `${body}.${encodeBase64Url(signature)}`;
}

export async function readSessionCookie(value: string, options?: { allowExpired?: boolean }): Promise<SessionClaims | null> {
  const secret = sessionSecret();
  if (!secret) return null;
  const dot = value.indexOf(".");
  if (dot <= 0) return null;
  const body = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  if (!body || !signature || signature.includes(".")) return null;
  let signatureBytes;
  try {
    signatureBytes = decodeBase64Url(signature);
  } catch {
    return null;
  }
  const valid = await crypto.subtle.verify("HMAC", await hmacKey(secret), signatureBytes, new TextEncoder().encode(body));
  if (!valid) return null;
  try {
    const claims = JSON.parse(new TextDecoder().decode(decodeBase64Url(body))) as SessionClaims;
    if (!claims || typeof claims.id !== "string" || typeof claims.email !== "string" || typeof claims.exp !== "number") return null;
    if (!options?.allowExpired && claims.exp <= Date.now()) return null;
    return claims;
  } catch {
    return null;
  }
}

/** Only return to another admin page. Anything else, including other sites, goes to the dashboard. */
export function safeAdminNext(value: string | null | undefined) {
  if (!value || !value.startsWith("/admin") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return "/admin/dashboard";
  }
  return value;
}
