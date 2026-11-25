import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveFeatureList } from "@/components/archive-feature-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  forecastYear,
  forecastYears,
  formatArchiveDate,
  pressConferences
} from "@/lib/forecast-archive";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return forecastYears().map((row) => ({ year: String(row.year) }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  const row = forecastYear(Number(year));
  if (!row) return pageMetadata({ title: "Forecast", description: "Annual forecast", path: `/annual-forecast/${year}` });
  return pageMetadata({
    title: `${row.year} ${row.title}`,
    description: row.summary,
    path: `/annual-forecast/${row.year}`
  });
}

export default async function AnnualForecastYearPage({
  params
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const row = forecastYear(Number(year));
  if (!row) notFound();
  const october = pressConferences().find((item) => item.date === "2026-10-12");
  const november = pressConferences().find((item) => item.date === "2026-11-27");
  const showPress = row.year === 2027 && october && november;

  return (
    <div className="page-shell page-enter">
      <SiteHeader />
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "clamp(28px,4vw,48px) clamp(18px,4vw,40px) 72px" }}>
        <p style={{ margin: "0 0 14px" }}>
          <Link href="/annual-forecast" style={{ fontWeight: 700, fontSize: 14 }}>
            ← All years
          </Link>
        </p>
        <p className="eyebrow" style={{ fontSize: 12, margin: "0 0 8px" }}>
          {row.year} · {row.animal}
        </p>
        <h1 className="font-display" style={{ color: "#143d31", fontSize: "clamp(32px,4.4vw,52px)", margin: "0 0 14px", lineHeight: 1.1 }}>
          {row.title}
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: "#3d4a41", margin: "0 0 32px" }}>{row.summary}</p>

        {row.events.length ? (
          <section style={{ marginBottom: 36 }}>
            <h2 className="font-display" style={{ color: "#143d31", fontSize: 28, margin: "0 0 14px" }}>
              Events
            </h2>
            <div style={{ display: "grid", gap: 12 }}>
              {row.events.map((event) =>
                event.status === "placeholder" ? (
                  <article key={event.title} className="paper-card">
                    <p className="eyebrow" style={{ fontSize: 11, margin: 0 }}>
                      {formatArchiveDate(event.date)}
                    </p>
                    <h3 className="font-display">{event.title}</h3>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>The information will be up soon.</p>
                  </article>
                ) : (
                  <article key={event.title} className="archive-item">
                    <h3 className="font-display" style={{ margin: "0 0 6px", color: "#143d31", fontSize: 22 }}>
                      {event.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: 14, color: "#5f6b60" }}>
                      {formatArchiveDate(event.date)}
                      {event.venue ? ` · ${event.venue}` : ""}
                    </p>
                    {event.source ? (
                      <p style={{ margin: "8px 0 0" }}>
                        <a href={event.source} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>
                          Source
                        </a>
                      </p>
                    ) : null}
                  </article>
                )
              )}
            </div>
          </section>
        ) : null}

        {showPress ? (
          <>
            <section style={{ marginBottom: 36 }}>
              <h2 className="font-display" style={{ color: "#143d31", fontSize: 28, margin: "0 0 14px" }}>
                Press conference, 12 October 2026, SPACES Penthouse, World Plaza Tower, BGC
              </h2>
              <ArchiveFeatureList features={october.coverage} />
            </section>
            <section style={{ marginBottom: 36 }}>
              <h2 className="font-display" style={{ color: "#143d31", fontSize: 28, margin: "0 0 14px" }}>
                27 November 2026 Press conference
              </h2>
              <article className="paper-card">
                <p className="eyebrow" style={{ fontSize: 11, margin: 0 }}>
                  {formatArchiveDate(november.date)}
                </p>
                <h3 className="font-display">{november.title}</h3>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>The information will be up soon.</p>
              </article>
            </section>
          </>
        ) : null}

        <section>
          <h2 className="font-display" style={{ color: "#143d31", fontSize: 28, margin: "0 0 14px" }}>
            Features
          </h2>
          <ArchiveFeatureList features={row.features} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
