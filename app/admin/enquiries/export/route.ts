import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/cms/auth";
import { listSignups } from "@/lib/cms/repo";
import { ensureSeeded } from "@/lib/cms/seed";
import type { SignupStatus } from "@/lib/cms/types";

function csvCell(value: string) {
  const text = value.replace(/"/g, '""');
  return /[",\n]/.test(text) ? `"${text}"` : text;
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.redirect(new URL("/admin/login", request.url));
  ensureSeeded();

  const { searchParams } = new URL(request.url);
  const sort = (searchParams.get("sort") || "createdAt") as "createdAt" | "name" | "email" | "status" | "interest";
  const dir = searchParams.get("dir") === "asc" ? "asc" : "desc";
  const rows = listSignups({
    kind: "booking-waitlist",
    status: (searchParams.get("status") || undefined) as SignupStatus | undefined,
    q: searchParams.get("q") || undefined,
    sort,
    dir
  });

  const header = ["Date", "Name", "Email", "Phone", "Consultation", "Looking for", "Source", "Status"];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        new Date(row.createdAt).toISOString(),
        row.name,
        row.email,
        row.phone,
        row.fields?.service || "",
        row.notes,
        row.source,
        row.status
      ]
        .map((cell) => csvCell(String(cell || "")))
        .join(",")
    )
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="consultation-enquiries.csv"`
    }
  });
}
