import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { HeartPulse, Landmark, MessageCircle, ShieldCheck, Users } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { TRIP_SCORES, allInPrice, inr } from "@/data/trip-scores";

export const Route = createFileRoute("/trip-score/$slug")({
  loader: ({ params }) => {
    const t = TRIP_SCORES.find((s) => s.slug === params.slug);
    if (!t) throw notFound();
    return t;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found — Wayfind" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.question} Trip Score ${loaderData.overall}/100 — Wayfind`;
    const desc = `${loaderData.destination} in ${loaderData.month} for ${loaderData.traveller.toLowerCase()}: scores, explanation and an all-in price from ${inr(allInPrice(loaderData.price))}.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="min-h-screen"><SiteHeader /><p className="px-5 py-16 text-center">Trip Score not found. <Link to="/trip-score" className="text-primary underline">See all</Link></p></main>
  ),
  component: TripScorePage,
});

function TripScorePage() {
  const t = Route.useLoaderData();
  const rows = [
    { icon: Users, label: "Social", v: t.scores.social },
    { icon: ShieldCheck, label: "Safety", v: t.scores.safety },
    { icon: HeartPulse, label: "Fitness", v: t.scores.fitness },
    { icon: Landmark, label: "Cultural", v: t.scores.cultural },
  ];
  const price = [
    ["Return flight", t.price.flight],
    ["Baggage", t.price.baggage],
    ["Visa fees", t.price.visa],
    ["Stay (5 nights)", t.price.stay],
  ] as const;

  const share = () => {
    const text = `${t.question} Trip Score: ${t.overall}/100 — ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-2xl px-5 pb-16 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t.month} · {t.traveller}</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-teal md:text-4xl">{t.question}</h1>

        <div className="mt-6 rounded-3xl border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-sunset text-primary-foreground">
              <span className="font-display text-3xl font-bold">{t.overall}</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trip Score</p>
              <p className="font-display text-xl font-bold text-teal">{t.destination}</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {rows.map(({ icon: Icon, label, v }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-accent-foreground" />
                <span className="w-16 text-sm font-medium">{label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-sunset" style={{ width: `${v}%` }} />
                </div>
                <span className="w-7 text-right text-sm font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 leading-relaxed">{t.explanation}</p>

        <div className="mt-6 rounded-3xl bg-sand p-5">
          <h2 className="text-lg font-bold text-teal">Estimated all-in price</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {price.map(([l, v]) => (
              <li key={l} className="flex justify-between"><span className="text-muted-foreground">{l}</span><span>{inr(v)}</span></li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t pt-3 font-display text-xl font-bold text-teal">
            <span>Total</span><span>{inr(allInPrice(t.price))}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Sample estimate from India. Real prices vary by date and city.</p>
        </div>

        <button onClick={share} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal py-3.5 font-semibold text-teal-foreground">
          <MessageCircle className="h-5 w-5" /> Share on WhatsApp
        </button>
      </article>
    </main>
  );
}
