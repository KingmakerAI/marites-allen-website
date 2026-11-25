import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { readSessionCookie, safeAdminNext, SESSION_COOKIE } from "@/lib/cms/session-cookie";

const CASE_FOLD_ROOTS = new Set([
  "about",
  "articles",
  "book",
  "booking-experience",
  "destara",
  "events",
  "forecast",
  "frigga",
  "home",
  "media",
  "privacy",
  "projects",
  "terms"
]);

function lowercaseRedirect(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === pathname.toLowerCase()) return null;
  const root = pathname.split("/")[1]?.toLowerCase() || "";
  if (!CASE_FOLD_ROOTS.has(root)) return null;
  const url = request.nextUrl.clone();
  let nextPath = pathname.toLowerCase();
  if (nextPath.length > 1 && nextPath.endsWith("/")) nextPath = nextPath.slice(0, -1);
  url.pathname = nextPath;
  return NextResponse.redirect(url, 308);
}

export async function proxy(request: NextRequest) {
  const lowered = lowercaseRedirect(request);
  if (lowered) return lowered;

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
  matcher: [
    "/admin/:path*",
    "/adminportal",
    "/adminportal/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|images|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest).*)"
  ]
};
