"use client";

import { createContext, useContext } from "react";
import type { NavigationItem, SiteSettings } from "@/lib/cms/types";
import { FORECAST_YEARS } from "@/lib/site-data";

type ForecastYearNav = { year: string; label: string };

type CmsContextValue = {
  settings: SiteSettings | null;
  nav: NavigationItem[];
  forecastYears: ForecastYearNav[];
};

const CmsContext = createContext<CmsContextValue>({
  settings: null,
  nav: [],
  forecastYears: [...FORECAST_YEARS]
});

export function CmsProvider({
  settings,
  nav,
  forecastYears,
  children
}: CmsContextValue & { children: React.ReactNode }) {
  return (
    <CmsContext.Provider value={{ settings, nav, forecastYears: forecastYears?.length ? forecastYears : [...FORECAST_YEARS] }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  return useContext(CmsContext);
}
