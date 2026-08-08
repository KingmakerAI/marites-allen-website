import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ForecastClient } from "./forecast-client";

export const metadata: Metadata = pageMetadata({
  title: "2026 Fire Horse Annual Forecast",
  description:
    "Explore Marites Allen's annual Feng Shui forecasts — Year of the Fire Horse 2026 guidance for all 12 animal signs, lucky directions, and yearly themes.",
  path: "/forecast",
  keywords: [
    "2026 Fire Horse forecast",
    "annual Feng Shui forecast",
    "Chinese zodiac 2026",
    "Marites Allen horoscope"
  ]
});

export default function ForecastPage() {
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
        <ForecastClient />
      </Suspense>
    </>
  );
}
