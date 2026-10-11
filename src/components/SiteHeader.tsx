import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-4">
      <Link to="/" className="font-display text-2xl font-bold text-teal">
        Way<span className="text-primary">find</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm font-semibold text-teal">
        <Link to="/visa-checker" activeProps={{ className: "text-primary" }}>Visa checker</Link>
        <Link to="/trip-score" activeProps={{ className: "text-primary" }}>Trip Scores</Link>
      </nav>
    </header>
  );
}
