import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Sparkles, Wallet, ShieldCheck, ArrowRight, Check, Users, HeartPulse, Landmark, Plane } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/hero.jpg";
import { SiteHeader } from "@/components/SiteHeader";

const TITLE = "Wayfind — Trips planned around what you actually want";
const DESC =
  "Describe your trip in your own words. Wayfind finds where to go, shows the real all-in price, and checks you can actually get there.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

const PLACEHOLDER =
  "Five days in November, under ₹80,000, warm weather, good food, safe for a solo woman, no visa hassle";

function Index() {
  const [trip, setTrip] = useState("");

  return (
    <main className="min-h-screen overflow-x-hidden">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pb-12 pt-4 md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10">
        <div>
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> For travellers 22–35, solo women welcome
          </p>
          <h1 className="text-[1.9rem] font-bold leading-[1.15] text-teal md:text-5xl">
            Tell us what you want from a trip.{" "}
            <span className="text-primary">We find where to go,</span> show you the real price, and make sure you can actually get there.
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-6 rounded-3xl border bg-card p-3 shadow-soft"
          >
            <label htmlFor="trip" className="sr-only">Describe your trip</label>
            <textarea
              id="trip"
              rows={5}
              value={trip}
              maxLength={1000}
              onChange={(e) => setTrip(e.target.value)}
              placeholder={PLACEHOLDER}
              className="w-full resize-none rounded-2xl bg-sand p-4 text-base leading-relaxed outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-sunset px-5 py-3.5 font-semibold text-primary-foreground shadow-glow transition hover:brightness-105">
              Find my trip <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
        <div className="relative mt-8 hidden overflow-hidden rounded-3xl shadow-soft md:mt-0 md:block">
          <img src={hero} alt="A solo traveller watching the sunset over a coastal town" width={1024} height={1280} className="h-full w-full object-cover" />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-5 pb-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "Trip Score", text: "Every destination rated on social, safety, fitness and cultural factors — matched to you." },
            { icon: Wallet, title: "All-in Price", text: "Flight, baggage and visa fees in one honest number. No surprises at checkout." },
            { icon: ShieldCheck, title: "Booking Checks", text: "Visa, passport validity and layovers checked before you pay a single rupee." },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl border bg-card p-6 shadow-soft">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-teal">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-teal py-14 text-teal-foreground">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-3xl font-bold">How it works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["Describe it", "Type your trip like you'd tell a friend — dates, budget, vibe, must-haves."],
              ["Compare matches", "See destinations ranked by Trip Score with the all-in price upfront."],
              ["Book with confidence", "We check visas, passport and layovers so nothing breaks at the airport."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sunset font-display text-lg font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{t}</h3>
                  <p className="mt-1 text-sm opacity-80">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Sample score */}
      <section className="mx-auto max-w-5xl px-5 py-14 md:grid md:grid-cols-2 md:items-center md:gap-10">
        <div>
          <h2 className="text-3xl font-bold text-teal">A Trip Score, up close</h2>
          <p className="mt-3 text-muted-foreground">
            One glance tells you how well a place fits your brief — and exactly what you'll pay to get there.
          </p>
        </div>
        <SampleScore />
      </section>

      <Waitlist trip={trip} />

      <footer className="px-5 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Wayfind. Made for curious Indian travellers.
      </footer>
    </main>
  );
}

function SampleScore() {
  const rows = [
    { icon: Users, label: "Social", v: 82 },
    { icon: ShieldCheck, label: "Safety", v: 91 },
    { icon: HeartPulse, label: "Fitness", v: 74 },
    { icon: Landmark, label: "Cultural", v: 88 },
  ];
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border bg-card shadow-soft md:mt-0">
      <div className="relative h-40">
        <img src={hero} alt="" loading="lazy" width={1024} height={1280} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-teal-foreground">
          <div>
            <p className="text-xs opacity-80">5 days · November</p>
            <h3 className="text-2xl font-bold">Da Nang, Vietnam</h3>
          </div>
          <div className="rounded-2xl bg-sunset px-3 py-1.5 text-center text-primary-foreground">
            <p className="font-display text-2xl font-bold leading-none">86</p>
            <p className="text-[10px] font-semibold uppercase">Trip Score</p>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-5">
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
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-sand p-4">
          <div className="flex items-center gap-2 text-sm">
            <Plane className="h-4 w-4 text-primary" /> All-in from Delhi
          </div>
          <span className="font-display text-xl font-bold text-teal">₹62,400</span>
        </div>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {["e-Visa, approved in ~3 days", "Passport valid 6+ months", "1 layover, 2h 10m, no transit visa"].map((c) => (
            <li key={c} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" /> {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Waitlist({ trip }: { trip: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error" | "duplicate">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) || clean.length > 255) {
      setState("error");
      return;
    }
    setState("loading");
    const { error } = await supabase
      .from("waitlist_signups")
      .insert({ email: clean, trip_description: trip.trim().slice(0, 1000) || null });
    setState(!error ? "done" : error.code === "23505" ? "duplicate" : "error");
  }

  return (
    <section id="waitlist" className="mx-auto max-w-5xl px-5 pb-10">
      <div className="rounded-3xl bg-sunset p-7 text-primary-foreground shadow-glow md:p-12">
        <h2 className="text-3xl font-bold">Be first to plan with Wayfind</h2>
        <p className="mt-2 opacity-90">Join the waiting list. We'll email you when early access opens.</p>
        {state === "done" ? (
          <p className="mt-6 flex items-center gap-2 rounded-2xl bg-card p-4 font-semibold text-teal">
            <Check className="h-5 w-5 text-success" /> You're on the list. See you soon!
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              className="flex-1 rounded-2xl bg-card px-4 py-3.5 text-foreground outline-none focus:ring-2 focus:ring-teal"
            />
            <button
              disabled={state === "loading"}
              className="rounded-2xl bg-teal px-6 py-3.5 font-semibold text-teal-foreground disabled:opacity-70"
            >
              {state === "loading" ? "Joining…" : "Join waitlist"}
            </button>
          </form>
        )}
        {state === "error" && <p className="mt-3 text-sm font-medium">Please check your email and try again.</p>}
        {state === "duplicate" && <p className="mt-3 text-sm font-medium">This email is already on the waiting list.</p>}
      </div>
    </section>
  );
}
