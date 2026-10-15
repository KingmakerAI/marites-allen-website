import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  authenticate,
  cookieOptions,
  createSession,
  rateLimitLogin,
  REMEMBER_EMAIL_COOKIE,
  SESSION_COOKIE
} from "@/lib/cms/auth";
import { fingerprint } from "@/lib/cms/crypto";
import { safeAdminNext, SESSION_MAX_AGE, SessionSecretError } from "@/lib/cms/session-cookie";
import { loginSchema } from "@/lib/cms/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const to = (path: string) => NextResponse.redirect(new URL(path, origin), 303);

  const form = await request.formData();
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  const next = safeAdminNext(String(form.get("next") || ""));
  const remember = (() => {
    const v = form.get("remember");
    return v === "on" || v === "true" || v === "1";
  })();

  const fail = (error: string) => to(`/adminportal?error=${error}`);

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) return fail("invalid");

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "local";
  if (!(await rateLimitLogin(fingerprint(ip)))) return fail("rate");

  const user = await authenticate(parsed.data.email, parsed.data.password);
  if (!user) return fail("invalid");

  let session: Awaited<ReturnType<typeof createSession>>;
  try {
    session = await createSession(user.id, remember);
  } catch (err) {
    if (err instanceof SessionSecretError) return fail("secret");
    throw err;
  }

  const res = to(next);
  res.cookies.set(SESSION_COOKIE, session.token, cookieOptions(remember));
  if (remember) {
    res.cookies.set(REMEMBER_EMAIL_COOKIE, user.email, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE
    });
  } else {
    res.cookies.set(REMEMBER_EMAIL_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0
    });
  }
  return res;
}
