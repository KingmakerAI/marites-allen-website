import { describe, expect, it } from "vitest";
import { forecastYear, forecastYears } from "./forecast-archive";

describe("forecast years", () => {
  it("lists every year from 2027 down to 2004 with no gaps", () => {
    const years = forecastYears().map((row) => row.year);
    expect(years[0]).toBe(2027);
    expect(years[years.length - 1]).toBe(2004);
    for (let index = 0; index < years.length - 1; index += 1) {
      expect(years[index] - years[index + 1]).toBe(1);
    }
  });

  it("keeps 2004 as a Wood Monkey placeholder", () => {
    const year = forecastYear(2004);
    expect(year?.animal).toBe("Wood Monkey");
    expect(year?.summary).toBe("The information will be up soon.");
    expect(year?.features[0]?.status).toBe("placeholder");
    expect(year?.events[0]?.status).toBe("placeholder");
  });
});
