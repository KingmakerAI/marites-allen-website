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
  const is2027 = year === "2027";
  return pageMetadata({
    title: is2027
      ? "Marites Allen 2027 Forecast, Year of the Fire Sheep"
      : `${year} Annual Forecast`,
    description: is2027
      ? "2026 was about movement. 2027 is about making that movement meaningful. Marites Allen's Fire Sheep forecast, twelve sign teasers, and 2027 Almanac, Planner and Horoscope Guides."
      : `Marites Allen's ${year} annual forecast, the twelve animal signs, and the Marites Allen ${year} books.`,
    path: `/forecast?year=${year}`,
    keywords: [
      `${year} forecast`,
      "annual Feng Shui forecast",
      `Chinese zodiac ${year}`,
      "Marites Allen horoscope",
      ...(is2027 ? ["Fire Sheep", "Horoscope Guide", "Feng Shui Almanac 2027"] : [])
    ]
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
