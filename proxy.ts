import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { readSessionCookie, safeAdminNext, SESSION_COOKIE } from "@/lib/cms/session-cookie";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/adminportal" || pathname.startsWith("/adminportal/")) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/adminportal";
    return NextResponse.redirect(url);
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const claims = token ? await readSessionCookie(token) : null;
  if (!claims) {
    const url = request.nextUrl.clone();
    url.pathname = "/adminportal";
    url.searchParams.set("next", safeAdminNext(pathname));
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/adminportal", "/adminportal/:path*"]
};
