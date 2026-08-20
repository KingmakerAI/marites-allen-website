import { NextResponse } from "next/server";
import { newId } from "@/lib/cms/crypto";
import { isBotUserAgent, recordVisit, shouldSkipPath } from "@/lib/cms/analytics";

const COOKIE = "ma_vid";

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") || "";
  if (isBotUserAgent(ua)) return NextResponse.json({ ok: true });

  let path = "/";
  try {
    const body = (await request.json()) as { path?: string };
    path = typeof body.path === "string" && body.path.startsWith("/") ? body.path.slice(0, 180) : "/";
  } catch {
    path = "/";
  }
  if (shouldSkipPath(path)) return NextResponse.json({ ok: true });

  const cookieHeader = request.headers.get("cookie") || "";
  const existing = cookieHeader.match(/(?:^|;\s*)ma_vid=([^;]+)/)?.[1];
  const visitorId = existing || newId();
  recordVisit({ visitorId, isNewVisitor: !existing, path });

  const res = NextResponse.json({ ok: true });
  if (!existing) {
    res.cookies.set(COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/"
    });
  }
  return res;
}
