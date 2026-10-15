import type { MetadataRoute } from "next";

const SITE_ORIGIN = "https://www.maritesallen.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/adminportal", "/adminportal/", "/api/"]
      }
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN
  };
}
