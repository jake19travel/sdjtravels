// Data providers. Each currently reads local mock / typical data; swap the body for a live API later
// without touching the UI.
import { MONTHS, type Destination } from "@/data/destinations";
import { visaFor } from "@/data/visa";

export type Weather = { highC: number; summary: string };

export function getWeather(d: Destination, month: number): Weather {
  const highC = d.highC[month] ?? 30;
  const rain = d.rain[month] ?? 0;
  const feel = highC >= 33 ? "Hot" : highC >= 26 ? "Warm" : highC >= 18 ? "Mild" : "Cool";
  const wet = rain === 2 ? "rainy season" : rain === 1 ? "some showers" : "mostly dry";
  return { highC, summary: `${feel}, around ${highC}°C, ${wet} in ${MONTHS[month]}` };
}

export type AllInPrice = { min: number; max: number; parts: { label: string; min: number; max: number }[] };

/** Typical all-in price per person: flights (taxes included), luggage, visa fee and stay. */
export function getAllInPrice(d: Destination, nights: number): AllInPrice {
  const visa = visaFor(d.slug)?.feeInr ?? 0;
  const parts = [
    { label: "Return flights (incl. taxes)", min: d.flightInr[0], max: d.flightInr[1] },
    { label: "Checked luggage", min: d.baggageInr[0], max: d.baggageInr[1] },
    { label: "Visa fee", min: visa, max: visa },
    { label: `Stay (${nights} nights)`, min: d.stayPerNightInr[0] * nights, max: d.stayPerNightInr[1] * nights },
  ];
  return { min: parts.reduce((a, p) => a + p.min, 0), max: parts.reduce((a, p) => a + p.max, 0), parts };
}
