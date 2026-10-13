import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import type { Recommendations, SearchInput } from "./recommend.server";

export type RecommendResult = { ok: true; data: Recommendations } | { ok: false; error: string };

const num = (v: unknown, min: number, max: number) => {
  const n = Number(v);
  return v === null || v === undefined || v === "" || !Number.isFinite(n) ? null : Math.min(max, Math.max(min, Math.round(n)));
};

export const getRecommendations = createServerFn({ method: "POST" })
  .inputValidator((input: Partial<SearchInput>): SearchInput => {
    const prompt = String(input?.prompt ?? "").trim();
    if (prompt.length < 3) throw new Error("Tell us a little about your trip.");
    if (prompt.length > 1000) throw new Error("Please keep it under 1000 characters.");
    return {
      prompt,
      style: input.style ? String(input.style).slice(0, 40) : null,
      month: num(input.month, 0, 11),
      nights: num(input.nights, 1, 30),
      budgetInr: num(input.budgetInr, 5000, 1000000),
      adventure: num(input.adventure, 1, 3),
    };
  })
  .handler(async ({ data }): Promise<RecommendResult> => {
    const { recommendDestinations } = await import("./recommend.server");
    try {
      return { ok: true, data: await recommendDestinations(getRequest(), data) };
    } catch (e) {
      const status = (e as { statusCode?: number })?.statusCode;
      console.error("recommend failed", status, e);
      if (status === 429) return { ok: false, error: "Lots of trips being planned right now. Try again in a minute." };
      if (status === 402) return { ok: false, error: "Trip suggestions are paused for now. Please try again later." };
      return { ok: false, error: "We couldn't plan that trip just now. Please try again." };
    }
  });
