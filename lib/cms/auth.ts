import "server-only";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, hashToken, newId, newResetCode, newToken, nowIso, verifyPassword } from "./crypto";
import { getStorePath, mutateStore, mutateStoreIfChanged, readStore } from "./store";
import type { AdminRole, AdminUser } from "./types";

export const SESSION_COOKIE = "ma_admin_session";
export const REMEMBER_EMAIL_COOKIE = "ma_admin_email";
const SESSION_DAYS = 7;
const SESSION_DAYS_REMEMBER = 90;
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

export function rateLimitLogin(key: string, limit = 8, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const current = loginAttempts.get(key);
  if (!current || current.resetAt < now) {
    loginAttempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function rateLimitReset(key: string, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const current = resetAttempts.get(key);
  if (!current || current.resetAt < now) {
    resetAttempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function authenticate(email: string, password: string): AdminUser | null {
  const store = readStore();
  const user = store.adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) return null;
  return publicUser(user);
}

export function createSession(userId: string, remember = false) {
  const days = remember ? SESSION_DAYS_REMEMBER : SESSION_DAYS;
  const token = newToken();
  const expiresAt = new Date(Date.now() + days * 86400000).toISOString();
  mutateStore((store) => {
    store.sessions = store.sessions.filter((s) => s.userId !== userId && s.expiresAt > nowIso());
    store.sessions.push({ id: token, userId, expiresAt });
    const user = store.adminUsers.find((u) => u.id === userId);
    if (user) user.lastLoginAt = nowIso();
  });
  return { token, expiresAt };
}

export function destroySession(token: string) {
  mutateStore((store) => {
    store.sessions = store.sessions.filter((s) => s.id !== token);
  });
}

export async function getSessionUser(): Promise<AdminUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const store = readStore();
  const session = store.sessions.find((s) => s.id === token && s.expiresAt > nowIso());
  if (!session) return null;
  const user = store.adminUsers.find((u) => u.id === session.userId);
  return user ? publicUser(user) : null;
}

export async function requireUser(minRole?: AdminRole) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (minRole === "owner" && user.role !== "owner") redirect("/admin/dashboard");
  return user;
}

export function cookieOptions(expiresAt: string) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt)
  };
}

export function logAudit(userId: string, entity: string, entityId: string, action: string) {
  mutateStore((store) => {
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
  return process.env.OWNER_BOOTSTRAP_PASSWORD || "IamLUCKY168!";
}

/** Creates the two owner logins, and sets their password once. Later password changes are kept. */
export function ensureOwnerAccounts() {
  const password = ownerBootstrapPassword();
  mutateStoreIfChanged((store) => {
    let changed = false;
    store.bootstrap = store.bootstrap || {};
    const stampPasswords = store.bootstrap.owners !== OWNER_BOOTSTRAP;
    for (const email of OWNER_EMAILS) {
      const row = store.adminUsers.find((u) => u.email === email);
      if (!row) {
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

export function changePasswordWithCurrent(email: string, current: string, nextPassword: string): AdminUser | null {
  const user = authenticate(email, current);
  if (!user) return null;
  mutateStore((store) => {
    const row = store.adminUsers.find((u) => u.id === user.id);
    if (!row) return;
    row.passwordHash = hashPassword(nextPassword);
    delete row.passwordReset;
    store.sessions = store.sessions.filter((s) => s.userId !== row.id);
  });
  return user;
}

function writeLocalResetNote(email: string, code: string, expiresAt: string) {
  try {
    const file = path.join(path.dirname(getStorePath()), "last-password-reset.txt");
    fs.writeFileSync(
      file,
      [
        "Private reset code for the website editor.",
        "Delete this file after you sign in.",
        "",
        `Email: ${email}`,
        `Code: ${code}`,
        `Expires: ${expiresAt}`,
        ""
      ].join("\n"),
      "utf8"
    );
  } catch {
    /* local file is a convenience, not required */
  }
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

export async function requestPasswordReset(email: string) {
  const normalized = email.trim().toLowerCase();
  const code = newResetCode();
  const expiresAt = new Date(Date.now() + RESET_MINUTES * 60 * 1000).toISOString();
  const found = mutateStore((store) => {
    const row = store.adminUsers.find((u) => u.email === normalized);
    if (!row) return false;
    row.passwordReset = { tokenHash: hashToken(code), expiresAt };
    return true;
  });
  if (found) {
    writeLocalResetNote(normalized, code, expiresAt);
    await emailResetCode(normalized, code);
  }
}

export function completePasswordReset(email: string, code: string, nextPassword: string): AdminUser | null {
  const normalized = email.trim().toLowerCase();
  const tokenHash = hashToken(code);
  const user = mutateStore((store) => {
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

export function setUserPassword(userId: string, nextPassword: string) {
  return mutateStore((store) => {
    const row = store.adminUsers.find((u) => u.id === userId);
    if (!row) return false;
    row.passwordHash = hashPassword(nextPassword);
    delete row.passwordReset;
    store.sessions = store.sessions.filter((s) => s.userId !== userId);
    return true;
  });
}

