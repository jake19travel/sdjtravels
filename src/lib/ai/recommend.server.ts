import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import { z } from "zod";
import { DESTINATIONS, tripScore } from "@/data/destinations";
import { VISA_DATA } from "@/data/visa";
import { getAllInPrice } from "@/lib/providers";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "./run-id.server";

const SLUGS = DESTINATIONS.map((d) => d.slug) as [string, ...string[]];
const pick = z.object({ slug: z.enum(SLUGS), why: z.string() });
const schema = z.object({
  understood: z.object({ month: z.number(), nights: z.number(), budgetInr: z.number().nullable() }),
  bestMatch: pick,
  bestValue: pick,
  easiest: pick,
  more: z.array(pick),
});
export type Recommendations = z.infer<typeof schema>;

export type SearchInput = {
  prompt: string;
  style: string | null;
  month: number | null;
  nights: number | null;
  budgetInr: number | null;
  adventure: number | null;
};

function catalogue(nights: number) {
  return DESTINATIONS.map((d) => {
    const v = VISA_DATA.find((x) => x.slug === d.slug)!;
    const p = getAllInPrice(d, nights);
    return `${d.slug}: ${d.name}, ${d.country}. ${d.blurb} Styles: ${d.styles.join(", ")}. Adventure ${d.adventure}/3. Flight ~${d.flightHours}h, ${d.stops ? `1 stop (~${d.layoverMinutes}min)` : "direct"}. Visa: ${v.status}, ${v.feeNote} Typical all-in for ${nights} nights: ₹${p.min}-₹${p.max}. Trip Score ${tripScore(d.score)}/10. Typical highs Jan-Dec °C: ${d.highC.join(",")}. Rain Jan-Dec (0 dry,2 wet): ${d.rain.join(",")}.`;
  }).join("\n");
}

export async function recommendDestinations(request: Request, input: SearchInput): Promise<Recommendations> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured.");
  const nights = input.nights ?? 4;
  const instructions = `You help Indian passport holders choose a trip. Choose ONLY from this checked list of destinations (use the slug):
${catalogue(nights)}

Rules:
- bestMatch: best overall fit for what they asked. bestValue: lowest typical all-in price that still fits. easiest: shortest/simplest journey and easiest visa. Use 3 different slugs.
- more: up to 3 other suitable slugs, not repeating the three above.
- why: ONE short plain-language sentence (max 20 words) on why it fits their request. Do not state prices, visa rules or fees — the app shows checked figures.
- understood.month: 0-11 travel month (guess the next upcoming month if not given; current date is ${new Date().toISOString().slice(0, 10)}). understood.nights: number of nights. understood.budgetInr: per-person budget or null.
- Speak to every traveller; never assume age or gender.`;
  const hints = [
    input.style && `Trip style: ${input.style}`,
    input.month !== null && `Month index: ${input.month}`,
    input.nights && `Nights: ${input.nights}`,
    input.budgetInr && `Budget per person: ₹${input.budgetInr}`,
    input.adventure && `How adventurous (1-3): ${input.adventure}`,
  ].filter(Boolean).join(". ");

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions,
    messages: [{ role: "user", content: `${input.prompt}${hints ? `\n\n(${hints})` : ""}` }],
    output: Output.object({ schema }),
    abortSignal: request.signal,
    maxRetries: 0,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  const out = await result.output;
  if (input.month !== null) out.understood.month = input.month;
  if (input.nights) out.understood.nights = input.nights;
  if (input.budgetInr) out.understood.budgetInr = input.budgetInr;
  out.understood.month = Math.min(11, Math.max(0, Math.round(out.understood.month)));
  out.understood.nights = Math.min(30, Math.max(1, Math.round(out.understood.nights || 4)));
  return out;
}
