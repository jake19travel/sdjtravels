import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { TRIP_SCORES } from "@/data/trip-scores";

const TITLE = "Trip Scores — Wayfind";
const DESC = "See how destinations score for social, safety, fitness and culture — by month and traveller type.";

export const Route = createFileRoute("/trip-score/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-5 pb-16 pt-4">
        <h1 className="text-3xl font-bold text-teal md:text-4xl">Trip Scores</h1>
        <div className="mt-6 space-y-3">
          {TRIP_SCORES.map((t) => (
            <Link key={t.slug} to="/trip-score/$slug" params={{ slug: t.slug }} className="flex items-center justify-between gap-3 rounded-3xl border bg-card p-5 shadow-soft">
              <div>
                <p className="font-semibold text-teal">{t.question}</p>
                <p className="text-xs text-muted-foreground">{t.month} · {t.traveller}</p>
              </div>
              <span className="flex items-center gap-2 font-display text-2xl font-bold text-primary">{t.overall}<ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  ),
});
