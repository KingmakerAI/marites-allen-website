import { HOME_SERVICES } from "../site-data";
import type { ConsultationService, PricingRow } from "./types";

const ROMANS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function formatServicePrice(row?: PricingRow | null) {
  if (!row) return "";
  const amount = row.promoPrice ?? row.price;
  const note = row.note?.trim() || "";
  if (amount == null || Number.isNaN(Number(amount))) return note;
  let formatted = "";
  try {
    formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: row.currency || "USD",
      maximumFractionDigits: 0
    }).format(Number(amount));
  } catch {
    formatted = `${row.currency || "USD"} ${amount}`;
  }
  return [formatted, note].filter(Boolean).join(" · ");
}

export type HomeServiceCard = (typeof HOME_SERVICES)[number];

export function mapServicesForHome(
  services: ConsultationService[],
  pricing: PricingRow[],
  fallback: HomeServiceCard[] = HOME_SERVICES
): HomeServiceCard[] {
  if (!services.length) return fallback;
  return services.map((s, i) => {
    const price = pricing.find((p) => p.serviceId === s.id);
    const includes = s.idealFor
      ? s.idealFor
          .split(/[;\n]/)
          .map((x) => x.trim())
          .filter(Boolean)
      : [];
    const durationBits = [s.duration, formatServicePrice(price)].filter(Boolean);
    return {
      id: s.slug || s.id,
      num: ROMANS[i] || String(i + 1),
      title: s.name,
      popular: s.featured,
      tagline: s.description,
      duration: durationBits.join(" · "),
      includes
    };
  });
}
