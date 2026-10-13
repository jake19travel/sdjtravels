import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-2xl font-extrabold">Wayfind</p>
          <p className="mt-1 text-sm opacity-80">A calm way to plan trips that actually work out.</p>
        </div>
        <nav className="flex flex-wrap gap-5 text-sm font-semibold opacity-90">
          <Link to="/visa-checker">Visa checker</Link>
          <Link to="/trip-score">Trip Scores</Link>
        </nav>
        <Link to="/" hash="trip" className="tap inline-flex items-center justify-center rounded-2xl bg-primary px-6 font-semibold text-primary-foreground hover:brightness-110">
          Plan my trip
        </Link>
      </div>
      <p className="border-t border-ink-foreground/15 px-5 py-4 text-center text-xs opacity-70">© 2026 Wayfind</p>
    </footer>
  );
}
