import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { forecastYears } from "@/lib/forecast-archive";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Annual Forecast archive",
  description: "Marites Allen's annual Feng Shui forecasts, from the latest year back to the earliest coverage on record.",
  path: "/annual-forecast"
});

export default function AnnualForecastIndexPage() {
  const years = forecastYears();
  return (
    <div className="page-shell page-enter">
      <SiteHeader />
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "clamp(28px,4vw,48px) clamp(18px,4vw,40px) 72px" }}>
        <p className="eyebrow" style={{ fontSize: 12, margin: "0 0 8px" }}>
          Annual Forecast
        </p>
        <h1 className="font-display" style={{ color: "#143d31", fontSize: "clamp(32px,4vw,48px)", margin: "0 0 12px" }}>
          Every forecast year
        </h1>
        <p style={{ color: "#5f6b60", fontSize: 16, lineHeight: 1.6, margin: "0 0 28px" }}>
          Coverage, events and features for each lunar year, newest first.
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {years.map((row) => (
            <Link
              key={row.year}
              href={`/annual-forecast/${row.year}`}
              className="archive-item"
              style={{ display: "block" }}
            >
              <span className="font-display" style={{ display: "block", fontSize: 22, color: "#143d31" }}>
                {row.year} · {row.animal}
              </span>
              <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "#5f6b60" }}>
                {row.features.length} features · {row.events.length} events
              </span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
