import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import AdminClient from "./admin-client";

export const metadata: Metadata = pageMetadata({
  title: "Admin",
  description: "Private admin area for Marites Allen website operations.",
  path: "/admin",
  noIndex: true
});

export default function AdminPage() {
  return <AdminClient />;
}