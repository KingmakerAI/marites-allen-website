import { redirect } from "next/navigation";

export default async function LegacyAdminLoginPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }
  const qs = params.toString();
  redirect(qs ? `/adminportal?${qs}` : "/adminportal");
}
