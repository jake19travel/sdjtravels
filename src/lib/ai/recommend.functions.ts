import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import type { Recommendations } from "./recommend.server";

export type RecommendResult = { ok: true; data: Recommendations } | { ok: false; error: string };

export const getRecommendations = createServerFn({ method: "POST" })
  .inputValidator((input: { prompt: string }) => {
    const prompt = String(input?.prompt ?? "").trim();
    if (prompt.length < 10) throw new Error("Tell us a bit more about your trip.");
    if (prompt.length > 1000) throw new Error("Please keep it under 1000 characters.");
    return { prompt };
  })
  .handler(async ({ data }): Promise<RecommendResult> => {
    const { recommendDestinations } = await import("./recommend.server");
    try {
      return { ok: true, data: await recommendDestinations(getRequest(), data.prompt) };
    } catch (e) {
      const status = (e as { statusCode?: number })?.statusCode;
      console.error("recommend failed", status, e);
      if (status === 429) return { ok: false, error: "Lots of trips being planned right now — try again in a minute." };
      if (status === 402) return { ok: false, error: "AI credits have run out for this app. Please try again later." };
      return { ok: false, error: "We couldn't plan that trip just now. Please try again." };
    }
  });
