import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getCachedPageCopy } from "@/lib/cms/content";
import { ForecastClient } from "./forecast-client";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getCachedPageCopy();
  return pageMetadata({
    title: copy.forecast.seoTitle,
    description: copy.forecast.seoDescription,
    path: "/forecast",
    keywords: [
      "2026 Fire Horse forecast",
      "annual Feng Shui forecast",
      "Chinese zodiac 2026",
      "Marites Allen horoscope"
    ]
  });
}

export default async function ForecastPage() {
  const copy = await getCachedPageCopy();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Annual Forecast", path: "/forecast" }
        ])}
      />
      <Suspense
        fallback={
          <div className="page-shell page-enter" style={{ padding: 48, textAlign: "center", color: "#5f6b60" }}>
            Loading forecast…
          </div>
        }
      >
        <ForecastClient copy={copy.forecast} />
      </Suspense>
    </>
  );
}
