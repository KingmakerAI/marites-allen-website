import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/cms/auth";
import { listSignups } from "@/lib/cms/repo";
import { ensureSeeded } from "@/lib/cms/seed";

function csvCell(value: string) {
  const text = value.replace(/"/g, '""');
  return /[",\n]/.test(text) ? `"${text}"` : text;
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.redirect(new URL("/adminportal", request.url));
  await ensureSeeded();
  const q = new URL(request.url).searchParams.get("q") || undefined;
  const rows = await listSignups({ kind: "press-kit", q, sort: "createdAt", dir: "desc" });
  const lines = [
    ["Date", "Name", "Outlet", "Email"].join(","),
    ...rows.map((row) =>
      [new Date(row.createdAt).toISOString(), row.name, row.organization, row.email].map(csvCell).join(",")
    )
  ];
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"press-kit-registrations.csv\""
    }
  });
}
