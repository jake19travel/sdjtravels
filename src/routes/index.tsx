import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  ArrowRight, Check, ExternalLink, Loader2, Plane, ShieldCheck, SlidersHorizontal, Sparkles, Sun, TrendingDown, Wallet, X,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { DESTINATIONS, MONTHS, TRIP_STYLES, destinationBySlug, inr, tripScore, type Destination } from "@/data/destinations";
import { CHECKED_ON, visaFor } from "@/data/visa";
import { getAllInPrice, getWeather } from "@/lib/providers";
import { getRecommendations, type RecommendResult } from "@/lib/ai/recommend.functions";

const TITLE = "Wayfind — Tell us how you want to feel. We'll find where to go.";
const DESC = "Describe your perfect trip in your own words. See three clear picks with checked visa details and typical all-in prices.";

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

type Filters = { month: number | null; nights: number | null; budgetInr: number | null; adventure: number | null };
const NO_FILTERS: Filters = { month: null, nights: null, budgetInr: null, adventure: null };

function Index() {
  const recommend = useServerFn(getRecommendations);
  const [text, setText] = useState("");
  const [style, setStyle] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [classic, setClassic] = useState(false);
  const [classicDest, setClassicDest] = useState("");
  const [travellers, setTravellers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rec, setRec] = useState<RecommendResult | null>(null);
  const [refineOpen, setRefineOpen] = useState(false);

  async function search(next?: Partial<{ style: string | null; filters: Filters }>) {
    const s = next?.style !== undefined ? next.style : style;
    const f = next?.filters ?? filters;
    const dest = classic && classicDest ? destinationBySlug(classicDest) : undefined;
    const prompt =
      text.trim() ||
      (dest ? `A trip to ${dest.name}, ${dest.country} for ${travellers} traveller(s)` : "somewhere warm and good value for 5 days");
    setLoading(true);
    try {
      setRec(await recommend({ data: { prompt, style: s, ...f } }));
    } catch (e) {
      setRec({ ok: false, error: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      setLoading(false);
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-5 pb-10 pt-6 text-center md:pt-14">
        <h1 className="text-[2rem] font-extrabold leading-[1.1] text-ink md:text-6xl">
          Tell us how you want to feel. <span className="text-primary">We'll find where to go.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
          Solo, with friends, with family, for work or just for a weekend. Describe your perfect trip and we'll handle the rest.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); void search(); }}
          className="mt-8 rounded-3xl border bg-card p-3 text-left shadow-soft"
        >
          <label htmlFor="trip" className="sr-only">Describe your trip</label>
          <textarea
            id="trip"
            rows={3}
            maxLength={1000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="somewhere warm and cheap for 5 days in December"
            className="w-full resize-none rounded-2xl bg-sand p-4 text-base leading-relaxed outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
          {classic && (
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className="text-sm font-semibold text-ink">
                Destination
                <select value={classicDest} onChange={(e) => setClassicDest(e.target.value)} className="tap mt-1 w-full rounded-2xl border bg-card px-3">
                  <option value="">Anywhere</option>
                  {DESTINATIONS.map((d) => <option key={d.slug} value={d.slug}>{d.country}</option>)}
                </select>
              </label>
              <label className="text-sm font-semibold text-ink">
                Month
                <select value={filters.month ?? ""} onChange={(e) => setFilters({ ...filters, month: e.target.value === "" ? null : Number(e.target.value) })} className="tap mt-1 w-full rounded-2xl border bg-card px-3">
                  <option value="">Any time</option>
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
              </label>
              <label className="text-sm font-semibold text-ink">
                Travellers
                <input type="number" min={1} max={12} value={travellers} onChange={(e) => setTravellers(Math.max(1, Number(e.target.value) || 1))} className="tap mt-1 w-full rounded-2xl border bg-card px-3" />
              </label>
            </div>
          )}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={() => setClassic(!classic)} className="tap rounded-2xl px-3 text-sm font-semibold text-primary hover:bg-secondary">
              {classic ? "Hide destination and dates" : "Search by destination, dates and travellers"}
            </button>
            <button disabled={loading} className="tap flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-semibold text-primary-foreground shadow-glow hover:brightness-110 disabled:opacity-80">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Finding your trip…</> : <>Find my trip <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        </form>

        <div className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1" role="group" aria-label="Trip style">
          {TRIP_STYLES.map((s) => {
            const on = style === s;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => { const v = on ? null : s; setStyle(v); if (rec) void search({ style: v }); }}
                className={`tap shrink-0 rounded-full border px-4 text-sm font-semibold ${on ? "border-primary bg-primary text-primary-foreground" : "bg-card text-ink hover:bg-secondary"}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </section>

      {rec && (
        <Results
          rec={rec}
          loading={loading}
          travellers={travellers}
          onRefine={() => setRefineOpen(true)}
        />
      )}

      <Features />

      {refineOpen && (
        <RefinePanel
          initial={{ ...filters }}
          style={style}
          onClose={() => setRefineOpen(false)}
          onApply={(f, s) => { setFilters(f); setStyle(s); setRefineOpen(false); void search({ filters: f, style: s }); }}
        />
      )}
    </main>
  );
}

const LABELS = [
  { key: "bestMatch", label: "Best match" },
  { key: "bestValue", label: "Best value" },
  { key: "easiest", label: "Easiest journey" },
] as const;

function Results({ rec, loading, travellers, onRefine }: { rec: RecommendResult; loading: boolean; travellers: number; onRefine: () => void }) {
  const [allIn, setAllIn] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [open, setOpen] = useState<Destination | null>(null);

  if (!rec.ok) {
    return (
      <section id="results" className="mx-auto max-w-5xl scroll-mt-4 px-5 pb-12">
        <p role="alert" className="rounded-3xl border bg-card p-5 font-medium text-ink shadow-soft">{rec.error}</p>
      </section>
    );
  }
  const { understood } = rec.data;
  const nights = understood.nights;
  const top = LABELS.map(({ key, label }) => ({ label, pick: rec.data[key] }));
  const more = rec.data.more.filter((m) => !top.some((t) => t.pick.slug === m.slug));

  return (
    <section id="results" className={`mx-auto max-w-5xl scroll-mt-4 px-5 pb-12 transition-opacity ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-ink md:text-3xl">Here's what we'd pick for you</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {MONTHS[understood.month]} · {nights} nights{understood.budgetInr ? ` · up to ${inr(understood.budgetInr)} each` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="tap flex cursor-pointer items-center gap-2 rounded-2xl border bg-card px-3 text-sm font-semibold text-ink">
            <span>All-in price</span>
            <input type="checkbox" role="switch" checked={allIn} onChange={(e) => setAllIn(e.target.checked)} className="peer sr-only" />
            <span aria-hidden className={`relative h-6 w-11 rounded-full transition-colors ${allIn ? "bg-primary" : "bg-input"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${allIn ? "left-[22px]" : "left-0.5"}`} />
            </span>
          </label>
          <button onClick={onRefine} className="tap flex items-center gap-2 rounded-2xl border bg-card px-4 text-sm font-semibold text-ink hover:bg-secondary">
            <SlidersHorizontal className="h-4 w-4" /> Refine
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {top.map(({ label, pick }) => {
          const d = destinationBySlug(pick.slug);
          return d ? <ResultCard key={label} label={label} d={d} why={pick.why} month={understood.month} nights={nights} allIn={allIn} onChoose={() => setOpen(d)} /> : null;
        })}
      </div>

      {more.length > 0 && (
        <div className="mt-6 text-center">
          {!showMore ? (
            <button onClick={() => setShowMore(true)} className="tap rounded-2xl border bg-card px-6 font-semibold text-primary hover:bg-secondary">Show more options</button>
          ) : (
            <div className="grid gap-5 text-left md:grid-cols-3">
              {more.map((m) => {
                const d = destinationBySlug(m.slug);
                return d ? <ResultCard key={m.slug} d={d} why={m.why} month={understood.month} nights={nights} allIn={allIn} onChoose={() => setOpen(d)} /> : null;
              })}
            </div>
          )}
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Prices are typical estimates per person, not live fares. Visa details checked on official government sites on {CHECKED_ON} — always confirm before you book.
      </p>

      {open && <DetailsPanel d={open} month={understood.month} nights={nights} travellers={travellers} onClose={() => setOpen(null)} />}
    </section>
  );
}

function ResultCard({ label, d, why, month, nights, allIn, onChoose }: { label?: string; d: Destination; why: string; month: number; nights: number; allIn: boolean; onChoose: () => void }) {
  const price = getAllInPrice(d, nights);
  const weather = getWeather(d, month);
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border bg-card shadow-soft transition hover:-translate-y-0.5">
      <div className="relative">
        <img src={d.photo} alt={`${d.name}, ${d.country}`} loading="lazy" width={992} height={672} className="aspect-[3/2] w-full object-cover" />
        {label && <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-bold text-ink-foreground">{label}</span>}
        {d.priceDropPct && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card px-3 py-1 text-xs font-bold text-primary">
            <TrendingDown className="h-3.5 w-3.5" /> Price just dropped
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-ink">{d.name}</h3>
            <p className="text-sm text-muted-foreground">{d.country}</p>
          </div>
          <div className="shrink-0 rounded-2xl bg-secondary px-3 py-1.5 text-center text-secondary-foreground" title="Safety, social vibe, fitness level and cultural richness">
            <p className="text-xl font-extrabold leading-none">{tripScore(d.score)}<span className="text-xs font-semibold">/10</span></p>
            <p className="text-[10px] font-semibold uppercase">Trip Score</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-ink">{why}</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Sun className="h-4 w-4 text-primary" />{weather.summary}</p>
        <div className="mt-4 rounded-2xl bg-sand p-3">
          <p className="text-xs font-semibold text-muted-foreground">{allIn ? "Typical all-in price per person (estimate)" : "Typical return flights per person (estimate)"}</p>
          <p className="text-lg font-extrabold text-ink">
            {allIn ? `${inr(price.min)}–${inr(price.max)}` : `${inr(d.flightInr[0])}–${inr(d.flightInr[1])}`}
          </p>
          {allIn && <p className="text-xs text-muted-foreground">Flights and taxes, luggage, visa fee, {nights} nights' stay</p>}
        </div>
        <button onClick={onChoose} className="tap mt-4 rounded-2xl bg-primary font-semibold text-primary-foreground hover:brightness-110">Choose this</button>
      </div>
    </article>
  );
}

function Overlay({ children, onClose, label }: { children: React.ReactNode; onClose: () => void; label: string }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 animate-in fade-in" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-md overflow-y-auto bg-card p-6 shadow-soft animate-in slide-in-from-right">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">{label}</h2>
          <button onClick={onClose} aria-label="Close" className="tap grid w-12 place-items-center rounded-2xl hover:bg-secondary"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DetailsPanel({ d, month, nights, travellers, onClose }: { d: Destination; month: number; nights: number; travellers: number; onClose: () => void }) {
  const price = getAllInPrice(d, nights);
  const visa = visaFor(d.slug);
  return (
    <Overlay label={`${d.name}, ${d.country}`} onClose={onClose}>
      <img src={d.photo} alt="" width={992} height={672} className="mt-4 aspect-[3/2] w-full rounded-2xl object-cover" />
      <p className="mt-4 text-sm text-muted-foreground">{getWeather(d, month).summary}</p>

      <h3 className="mt-6 font-bold text-ink">Typical all-in price per person</h3>
      <ul className="mt-2 space-y-1.5 text-sm">
        {price.parts.map((p) => (
          <li key={p.label} className="flex justify-between gap-3"><span className="text-muted-foreground">{p.label}</span><span className="font-medium text-ink">{p.min === p.max ? inr(p.min) : `${inr(p.min)}–${inr(p.max)}`}</span></li>
        ))}
      </ul>
      <div className="mt-2 flex justify-between border-t pt-2 font-bold text-ink"><span>Total (estimate)</span><span>{inr(price.min)}–{inr(price.max)}</span></div>
      {travellers > 1 && <p className="mt-1 text-xs text-muted-foreground">For {travellers} travellers: {inr(price.min * travellers)}–{inr(price.max * travellers)}</p>}
      <p className="mt-2 text-xs text-muted-foreground">Typical range, not a live fare. Final prices depend on dates and city.</p>

      <h3 className="mt-6 font-bold text-ink">Getting there</h3>
      <p className="mt-1 flex gap-2 text-sm text-ink"><Plane className="mt-0.5 h-4 w-4 shrink-0 text-primary" />About {d.flightHours} hours, {d.stops ? `usually 1 stop (around ${Math.round(d.layoverMinutes / 60 * 10) / 10}h layover)` : "direct flights available"}.</p>

      {visa && (
        <>
          <h3 className="mt-6 font-bold text-ink">Visa for Indian passport holders</h3>
          <ul className="mt-2 space-y-2 text-sm text-ink">
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><b>{visa.status}</b>, up to {visa.maxStay} days. {visa.feeNote}</span></li>
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{visa.passportRule}</li>
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{visa.transitNote}</li>
            {visa.extra && <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{visa.extra}</li>}
          </ul>
          <div className="mt-3 rounded-2xl bg-sand p-3 text-xs text-muted-foreground">
            Checked on {CHECKED_ON} with {visa.sourceName}. Rules change, so please confirm before you book.
            <a href={visa.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 font-semibold text-primary underline">
              Verify on the official government source <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </>
      )}
      <p className="mt-6 rounded-2xl bg-secondary p-4 text-sm font-medium text-secondary-foreground">Booking is coming soon. Until then, use these details to plan with confidence.</p>
    </Overlay>
  );
}

function RefinePanel({ initial, style, onClose, onApply }: { initial: Filters; style: string | null; onClose: () => void; onApply: (f: Filters, style: string | null) => void }) {
  const [f, setF] = useState(initial);
  const [s, setS] = useState(style);
  const field = "tap mt-1 w-full rounded-2xl border bg-card px-3";
  return (
    <Overlay label="Refine" onClose={onClose}>
      <div className="mt-4 space-y-4">
        <label className="block text-sm font-semibold text-ink">Budget per person (₹)
          <input type="number" min={5000} step={5000} placeholder="e.g. 80000" value={f.budgetInr ?? ""} onChange={(e) => setF({ ...f, budgetInr: e.target.value ? Number(e.target.value) : null })} className={field} />
        </label>
        <label className="block text-sm font-semibold text-ink">Month
          <select value={f.month ?? ""} onChange={(e) => setF({ ...f, month: e.target.value === "" ? null : Number(e.target.value) })} className={field}>
            <option value="">Any time</option>
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold text-ink">Nights
          <input type="number" min={1} max={30} placeholder="e.g. 4" value={f.nights ?? ""} onChange={(e) => setF({ ...f, nights: e.target.value ? Number(e.target.value) : null })} className={field} />
        </label>
        <label className="block text-sm font-semibold text-ink">Trip style
          <select value={s ?? ""} onChange={(e) => setS(e.target.value || null)} className={field}>
            <option value="">Any</option>
            {TRIP_STYLES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <fieldset>
          <legend className="text-sm font-semibold text-ink">How adventurous?</legend>
          <div className="mt-1 grid grid-cols-3 gap-2">
            {["Relaxed", "A bit", "Very"].map((l, i) => (
              <button key={l} type="button" aria-pressed={f.adventure === i + 1} onClick={() => setF({ ...f, adventure: f.adventure === i + 1 ? null : i + 1 })}
                className={`tap rounded-2xl border text-sm font-semibold ${f.adventure === i + 1 ? "border-primary bg-primary text-primary-foreground" : "text-ink hover:bg-secondary"}`}>{l}</button>
            ))}
          </div>
        </fieldset>
        <div className="flex gap-2 pt-2">
          <button onClick={() => { setF(NO_FILTERS); setS(null); }} className="tap flex-1 rounded-2xl border font-semibold text-ink hover:bg-secondary">Clear</button>
          <button onClick={() => onApply(f, s)} className="tap flex-1 rounded-2xl bg-primary font-semibold text-primary-foreground hover:brightness-110">Show trips</button>
        </div>
      </div>
    </Overlay>
  );
}

function Features() {
  const items = [
    { icon: Sparkles, title: "Trip Score", text: "Every place rated out of 10 on safety, social vibe, fitness level and cultural richness." },
    { icon: Wallet, title: "All-in price", text: "Flights, luggage, visa fees and taxes in one typical range. No surprises." },
    { icon: ShieldCheck, title: "Checked visa details", text: "Visa, passport validity and layovers, checked on official government sites." },
  ];
  return (
    <section className="mx-auto max-w-5xl px-5 py-14">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-3xl border bg-card p-6 shadow-soft">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary"><Icon className="h-5 w-5" /></div>
            <h3 className="text-lg font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
