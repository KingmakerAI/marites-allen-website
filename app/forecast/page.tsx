import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getCachedPageCopy } from "@/lib/cms/content";
import { ForecastClient } from "./forecast-client";

function chosenYear(raw: string | undefined, years: { year: string }[], fallback: string) {
  return raw && years.some((row) => row.year === raw) ? raw : fallback;
}

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ year?: string }>;
}): Promise<Metadata> {
  const copy = await getCachedPageCopy();
  const query = await searchParams;
  const year = chosenYear(query.year, copy.forecast.years, copy.forecast.defaultYear);
  return pageMetadata({
    title: `${year} Annual Forecast`,
    description: `Marites Allen's ${year} annual forecast, the twelve animal signs, and the Marites Allen ${year} books.`,
    path: `/forecast?year=${year}`,
    keywords: [`${year} forecast`, "annual Feng Shui forecast", `Chinese zodiac ${year}`, "Marites Allen horoscope"]
  });
}

export default async function ForecastPage({
  searchParams
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const copy = await getCachedPageCopy();
  const query = await searchParams;
  const year = chosenYear(query.year, copy.forecast.years, copy.forecast.defaultYear);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `${year} Forecast`, path: `/forecast?year=${year}` }
        ])}
      />
      <ForecastClient copy={copy.forecast} initialYear={year} />
    </>
  );
}
