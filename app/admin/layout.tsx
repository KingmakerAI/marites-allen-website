import { getSessionUser } from "@/lib/cms/auth";
import { ensureSeeded } from "@/lib/cms/seed";
import { AdminShell } from "./admin-shell";
import "./admin.css";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  ensureSeeded();
  const user = await getSessionUser();
  if (!user) return <div className="admin-login-wrap">{children}</div>;
  return <AdminShell user={user}>{children}</AdminShell>;
}
