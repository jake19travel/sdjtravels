import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ExternalLink, FileCheck2, Plane, Stamp } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { VISA_DATA } from "@/data/visa";

const TITLE = "Free Visa Checker for Indian Passport Holders — Wayfind";
const DESC = "Check visa status, passport validity rules and layover transit-visa notes for popular destinations from India.";

export const Route = createFileRoute("/visa-checker")({
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
  component: VisaChecker,
});

function VisaChecker() {
  const [slug, setSlug] = useState(VISA_DATA[0]?.slug ?? "");
  const [days, setDays] = useState(7);
  const [shown, setShown] = useState<{ slug: string; days: number } | null>(null);
  const entry = shown && VISA_DATA.find((v) => v.slug === shown.slug);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-5 pb-16 pt-4">
        <p className="mb-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">Free · Indian passport</p>
        <h1 className="text-3xl font-bold text-teal md:text-4xl">Visa checker</h1>
        <p className="mt-2 text-muted-foreground">Pick where you're going and for how long.</p>

        <form
          onSubmit={(e) => { e.preventDefault(); setShown({ slug, days }); }}
          className="mt-6 space-y-4 rounded-3xl border bg-card p-5 shadow-soft"
        >
          <label className="block text-sm font-semibold">
            Destination
            <select value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1.5 w-full rounded-2xl border bg-sand px-4 py-3 text-base font-normal">
              {VISA_DATA.map((v) => <option key={v.slug} value={v.slug}>{v.country}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Trip length (days)
            <input type="number" min={1} max={365} value={days} onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))} className="mt-1.5 w-full rounded-2xl border bg-sand px-4 py-3 text-base font-normal" />
          </label>
          <button className="w-full rounded-2xl bg-sunset py-3.5 font-semibold text-primary-foreground shadow-glow">Check visa</button>
        </form>

        {entry && shown && (
          <article className="mt-6 rounded-3xl border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-teal">{entry.country}</h2>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">{entry.status}</span>
            </div>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <Stamp className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">Visa status</p>
                  <p className="text-muted-foreground">
                    {entry.status}, up to {entry.maxStay} days.{" "}
                    {shown.days > entry.maxStay
                      ? `Your ${shown.days}-day trip is longer than this — you'll need a different visa.`
                      : `Your ${shown.days}-day trip fits.`}
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <FileCheck2 className="h-5 w-5 shrink-0 text-primary" />
                <div><p className="font-semibold">Passport validity</p><p className="text-muted-foreground">{entry.passportRule}</p></div>
              </li>
              <li className="flex gap-3">
                <Plane className="h-5 w-5 shrink-0 text-primary" />
                <div><p className="font-semibold">Layover & transit visa</p><p className="text-muted-foreground">{entry.transitNote}</p></div>
              </li>
            </ul>
            <div className="mt-5 rounded-2xl bg-sand p-4 text-xs text-muted-foreground">
              <p className="flex gap-2"><AlertTriangle className="h-4 w-4 shrink-0 text-primary" /> Rules change often. This is general guidance, not legal advice — always confirm before you book or travel.</p>
              <a href={entry.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 font-semibold text-teal underline">
                Verify on the official government source <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
