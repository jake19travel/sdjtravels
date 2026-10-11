import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "./run-id.server";

const schema = z.object({
  summary: z.string(),
  destinations: z.array(
    z.object({
      name: z.string(),
      country: z.string(),
      tripScore: z.number(),
      estimatedAllInInr: z.number(),
      visaNote: z.string(),
      reasons: z.array(z.string()),
    }),
  ),
});

export type Recommendations = z.infer<typeof schema>;

const INSTRUCTIONS = `You are Wayfind, a travel planner for young Indian travellers (22-35), including solo women, departing from India.
Recommend exactly 3 destinations that match the traveller's request. For each give:
- tripScore 0-100 (fit across social, safety, fitness and cultural factors for this traveller)
- estimatedAllInInr: rough per-person total in INR for return flight from a major Indian city, baggage, visa fees and mid-range stay
- visaNote: one short sentence on visa for Indian passport holders (say it must be verified on official sources)
- reasons: 3 short, specific reasons tied to their request (weather that month, budget, safety, food, etc.)
Respect budget and dates. Be honest when something is a stretch. summary: one sentence.`;

export async function recommendDestinations(request: Request, prompt: string): Promise<Recommendations> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured.");
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: INSTRUCTIONS,
    messages: [{ role: "user", content: prompt }],
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
  return await result.output;
}
