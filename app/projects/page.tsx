import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { getCachedPageCopy } from "@/lib/cms/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import ProjectsClient from "./projects-client";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getCachedPageCopy();
  return pageMetadata({
    title: copy.projects.seoTitle,
    description: copy.projects.seoDescription,
    path: "/projects",
    keywords: [
      "Marites Allen speaking",
      "corporate Feng Shui",
      "Feng Shui collaborations",
      "brand partnerships"
    ]
  });
}

export default async function ProjectsPage() {
  const copy = await getCachedPageCopy();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" }
        ])}
      />
      <ProjectsClient copy={copy.projects} />
    </>
  );
}
