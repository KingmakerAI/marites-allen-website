import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/cms/auth";
import { searchAdmin } from "@/lib/cms/repo";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ hits: [] }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ hits: [] });
  const hits = await searchAdmin(q);
  return NextResponse.json({ hits });
}
