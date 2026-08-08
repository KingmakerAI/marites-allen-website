import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import ProjectsClient from "./projects-client";

export const metadata: Metadata = pageMetadata({
  title: "Projects & Collaborations",
  description:
    "Corporate speaking, brand collaborations, and signature projects with Marites Allen — Accenture, Citibank, HSBC, Nestlé, Bench, Marco Polo, and more.",
  path: "/projects",
  keywords: [
    "Marites Allen speaking",
    "corporate Feng Shui",
    "Feng Shui collaborations",
    "brand partnerships"
  ]
});

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" }
        ])}
      />
      <ProjectsClient />
    </>
  );
}
