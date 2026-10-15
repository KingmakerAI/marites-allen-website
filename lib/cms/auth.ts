import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, hashToken, newId, newResetCode, newToken, nowIso, verifyPassword } from "./crypto";
import { readSessionCookie, SESSION_COOKIE, SESSION_MAX_AGE, signSessionCookie } from "./session-cookie";
import { mutateStore, mutateStoreIfChanged, persistenceMode, readStore, type PersistenceMode, type StoreData } from "./store";
import type { AdminRole, AdminUser } from "./types";

export { SESSION_COOKIE };
export const REMEMBER_EMAIL_COOKIE = "ma_admin_email";
const SESSION_MS = SESSION_MAX_AGE * 1000;
const RESET_MINUTES = 20;
const OWNER_EMAILS = ["maritesallen@gmail.com", "cap10kirck@gmail.com"] as const;
const OWNER_BOOTSTRAP = "owners-gmail-2026-08-21";
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const resetAttempts = new Map<string, { count: number; resetAt: number }>();

function publicUser(row: AdminUser & { passwordHash?: string }): AdminUser {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    createdAt: row.createdAt,
    lastLoginAt: row.lastLoginAt
  };
}

function memoryLimit(map: Map<string, { count: number; resetAt: number }>, key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = map.get(key);
  if (!current || current.resetAt < now) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

async function sharedLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  return mutateStore((store) => {
    store.bootstrap = store.bootstrap || {};
    const attempts = (store.bootstrap.attempts || []).filter((row) => row.resetAt > now);
    let row = attempts.find((item) => item.key === key);
    if (!row) {
      row = { key, count: 0, resetAt: now + windowMs };
      attempts.push(row);
    }
    const allowed = row.count < limit;
    if (allowed) row.count += 1;
    store.bootstrap.attempts = attempts.slice(-300);
    return allowed;
  });
}

export async function rateLimitLogin(key: string, limit = 8, windowMs = 15 * 60 * 1000) {
  if (persistenceMode() === "ephemeral") return memoryLimit(loginAttempts, key, limit, windowMs);
  return sharedLimit(`login:${key}`, limit, windowMs);
}

export async function rateLimitReset(key: string, limit = 5, windowMs = 15 * 60 * 1000) {
  if (persistenceMode() === "ephemeral") return memoryLimit(resetAttempts, key, limit, windowMs);
  return sharedLimit(`reset:${key}`, limit, windowMs);
}

export async function authenticate(email: string, password: string): Promise<AdminUser | null> {
  const store = await readStore();
  const user = store.adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) return null;
  return publicUser(user);
}

export async function createSession(userId: string, remember = false) {
  const id = newToken();
  const exp = Date.now() + SESSION_MS;
  const expiresAt = new Date(exp).toISOString();
  let email = "";
  await mutateStore((store) => {
    store.sessions = store.sessions.filter((s) => s.userId !== userId && s.expiresAt > nowIso());
    store.sessions.push({ id, userId, expiresAt });
    const user = store.adminUsers.find((u) => u.id === userId);
    if (user) {
      user.lastLoginAt = nowIso();
      email = user.email;
    }
  });
  const token = await signSessionCookie({ id, email, exp });
  return { token, expiresAt, remember };
}

export async function destroySession(token: string) {
  const id = (await readSessionCookie(token, { allowExpired: true }))?.id;
  if (!id) return;
  await mutateStore((store) => {
    store.sessions = store.sessions.filter((s) => s.id !== id);
  });
}

/** A signed cookie is enough on Vercel, where each visit can open a fresh content file. */
export async function resolveSessionUser(
  store: StoreData,
  cookieValue: string | undefined,
  mode: PersistenceMode
): Promise<AdminUser | null> {
  if (!cookieValue) return null;
  const claims = await readSessionCookie(cookieValue);
  if (!claims) return null;
  const session = store.sessions.find((s) => s.id === claims.id);
  if (session) {
    if (session.expiresAt <= nowIso()) return null;
    const user = store.adminUsers.find((u) => u.id === session.userId);
    return user ? publicUser(user) : null;
  }
  if (mode !== "ephemeral") return null;
  const user = store.adminUsers.find((u) => u.email.toLowerCase() === claims.email.toLowerCase());
  return user ? publicUser(user) : null;
}

export async function getSessionUser(): Promise<AdminUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const mode = persistenceMode();
  let store = await readStore();
  const user = await resolveSessionUser(store, token, mode);
  if (user || mode !== "ephemeral") return user;
  const { ensureSeeded } = await import("./seed");
  await ensureSeeded();
  store = await readStore();
  return resolveSessionUser(store, token, mode);
}

export async function requireUser(minRole?: AdminRole) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (minRole === "owner" && user.role !== "owner") redirect("/admin/dashboard");
  return user;
}

export function cookieOptions(remember = false) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remember ? { maxAge: SESSION_MAX_AGE } : {})
  };
}

export async function logAudit(userId: string, entity: string, entityId: string, action: string) {
  await mutateStore((store) => {
    store.auditLog.unshift({
      id: newId(),
      userId,
      entity,
      entityId,
      action,
      timestamp: nowIso()
    });
    store.auditLog = store.auditLog.slice(0, 400);
  });
}

function ownerBootstrapPassword() {
  return process.env.OWNER_BOOTSTRAP_PASSWORD?.trim() || "";
}

/** Creates the two owner logins, and sets their password once. Later password changes are kept. */
export async function ensureOwnerAccounts() {
  const password = ownerBootstrapPassword();
  await mutateStoreIfChanged((store) => {
    let changed = false;
    store.bootstrap = store.bootstrap || {};
    const stampPasswords = Boolean(password) && store.bootstrap.owners !== OWNER_BOOTSTRAP;
    for (const email of OWNER_EMAILS) {
      const row = store.adminUsers.find((u) => u.email === email);
      if (!row) {
        if (!password) continue;
        store.adminUsers.push({
          id: newId(),
          email,
          passwordHash: hashPassword(password),
          role: "owner",
          createdAt: nowIso(),
          lastLoginAt: null
        });
        changed = true;
      } else {
        if (row.role !== "owner") {
          row.role = "owner";
          changed = true;
        }
        if (stampPasswords) {
          row.passwordHash = hashPassword(password);
          delete row.passwordReset;
          changed = true;
        }
      }
    }
    if (stampPasswords) {
      store.bootstrap.owners = OWNER_BOOTSTRAP;
      changed = true;
    }
    return changed;
  });
}

export async function changePasswordWithCurrent(email: string, current: string, nextPassword: string): Promise<AdminUser | null> {
  const user = await authenticate(email, current);
  if (!user) return null;
  await mutateStore((store) => {
    const row = store.adminUsers.find((u) => u.id === user.id);
    if (!row) return;
    row.passwordHash = hashPassword(nextPassword);
    delete row.passwordReset;
    store.sessions = store.sessions.filter((s) => s.userId !== row.id);
  });
  return user;
}

function resetEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESET_FROM_EMAIL?.trim());
}

async function emailResetCode(email: string, code: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESET_FROM_EMAIL;
  if (!key || !from) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Your Marites Allen website reset code",
        text: `Your reset code is ${code}. It expires in ${RESET_MINUTES} minutes. If you did not ask for this, you can ignore this email.`
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function requestPasswordReset(email: string): Promise<{ status: "sent" | "unconfigured"; testCode?: string }> {
  if (!resetEmailConfigured() && !process.env.CMS_JSON_PATH) return { status: "unconfigured" };
  const normalized = email.trim().toLowerCase();
  const code = newResetCode();
  const expiresAt = new Date(Date.now() + RESET_MINUTES * 60 * 1000).toISOString();
  const found = await mutateStore((store) => {
    const row = store.adminUsers.find((u) => u.email === normalized);
    if (!row) return false;
    row.passwordReset = { tokenHash: hashToken(code), expiresAt };
    return true;
  });
  if (found && resetEmailConfigured()) await emailResetCode(normalized, code);
  return { status: "sent", testCode: process.env.CMS_JSON_PATH && found ? code : undefined };
}

export async function completePasswordReset(email: string, code: string, nextPassword: string): Promise<AdminUser | null> {
  const normalized = email.trim().toLowerCase();
  const tokenHash = hashToken(code);
  const user = await mutateStore((store) => {
    const row = store.adminUsers.find((u) => u.email === normalized);
    if (!row?.passwordReset) return null;
    if (row.passwordReset.expiresAt < nowIso()) {
      delete row.passwordReset;
      return null;
    }
    if (row.passwordReset.tokenHash !== tokenHash) return null;
    row.passwordHash = hashPassword(nextPassword);
    delete row.passwordReset;
    store.sessions = store.sessions.filter((s) => s.userId !== row.id);
    return publicUser(row);
  });
  return user;
}

export async function setUserPassword(userId: string, nextPassword: string) {
  return await mutateStore((store) => {
    const row = store.adminUsers.find((u) => u.id === userId);
    if (!row) return false;
    row.passwordHash = hashPassword(nextPassword);
    delete row.passwordReset;
    store.sessions = store.sessions.filter((s) => s.userId !== userId);
    return true;
  });
}

