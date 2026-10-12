import { describe, expect, it } from "vitest";
import { passportOk, visaFor } from "@/data/visa";
import { destinationBySlug } from "@/data/destinations";
import { getAllInPrice } from "@/lib/providers";

describe("passport validity", () => {
  const thailand = visaFor("thailand")!; // 6 months from arrival
  const arrival = new Date("2026-11-10");
  const ret = new Date("2026-11-15");
  it("fails when passport expires within 6 months of arrival", () => {
    expect(passportOk(thailand, new Date("2027-04-01"), arrival, ret)).toBe(false);
  });
  it("passes when passport is valid 6+ months after arrival", () => {
    expect(passportOk(thailand, new Date("2027-05-11"), arrival, ret)).toBe(true);
  });
});

describe("all-in price", () => {
  it("adds flights, luggage, visa fee and stay", () => {
    const vn = destinationBySlug("vietnam")!;
    const p = getAllInPrice(vn, 4);
    expect(p.min).toBe(22000 + 0 + 2100 + 2000 * 4);
    expect(p.max).toBe(38000 + 3500 + 2100 + 5000 * 4);
  });
});
