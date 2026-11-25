import { describe, expect, it } from "vitest";
import { assignForecastYear, forecastYearFromDate, mediaPageVideos, videoCountsByYear, type MaVideo } from "./ma-videos";

function item(partial: Partial<MaVideo>): MaVideo {
  return {
    title: "Sample",
    channel_or_outlet: "Outlet",
    platform: "YouTube",
    date: "",
    url: "https://www.youtube.com/watch?v=abcdefghijk",
    year_bucket: "",
    type: "talk",
    url_check: "ok",
    media_kind: "video",
    ...partial
  };
}

describe("forecast year from a date", () => {
  it("moves 1 October through 3 February onto the forecast year that season introduces", () => {
    expect(forecastYearFromDate("2026-10-01")).toBe(2027);
    expect(forecastYearFromDate("2026-10-12")).toBe(2027);
    expect(forecastYearFromDate("2026-11-27")).toBe(2027);
    expect(forecastYearFromDate("2027-02-03")).toBe(2027);
    expect(forecastYearFromDate("2026-02-03")).toBe(2026);
    expect(forecastYearFromDate("2026-02-04")).toBeNull();
    expect(forecastYearFromDate("2026-06-01")).toBeNull();
  });

  it("puts the October and November 2026 press conferences on 2027 even when the bucket says 2026", () => {
    expect(
      assignForecastYear(
        item({
          date: "2026-10-12",
          year_bucket: "2026 Fire Horse",
          type: "presscon",
          title: "YEAR OF THE FIRE SHEEP by MARITES ALLEN Press Conference"
        })
      )
    ).toBe(2027);
    expect(
      assignForecastYear(
        item({
          date: "2026-11-13",
          year_bucket: "2026 Fire Horse",
          type: "presscon",
          title: "Fire Sheep press conference"
        })
      )
    ).toBe(2027);
  });

  it("uses the year bucket outside that window", () => {
    expect(
      assignForecastYear(
        item({
          date: "2015-06-02",
          year_bucket: "2015 Wood Sheep"
        })
      )
    ).toBe(2015);
  });

  it("keeps an October video in its calendar year on the media page", () => {
    const video = mediaPageVideos().find((item) => item.title.startsWith("2027 YEAR OF THE FIRE SHEEP FORECAST"));
    expect(video?.year).toBe(2026);
    expect(video?.month).toBe(10);
    expect(mediaPageVideos().some((item) => item.year === 0)).toBe(false);
  });

  it("leaves undated items off the year pages", () => {
    expect(assignForecastYear(item({ date: "", year_bucket: "2026 Fire Horse" }))).toBeNull();
    expect(videoCountsByYear().every(([, count]) => count > 0)).toBe(true);
  });
});
