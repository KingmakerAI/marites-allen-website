import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "ma_admin_session";

export function proxy(request: NextRequest) {
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
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/adminportal";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/adminportal", "/adminportal/:path*"]
};
