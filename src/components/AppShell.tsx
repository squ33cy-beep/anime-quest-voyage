import { Link } from "@tanstack/react-router";
import { Compass, Heart, Menu, Search, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const desktopNav = [
  { label: "Discover", to: "/" },
  { label: "Browse", to: "/search" },
  { label: "My List", to: "/favorites" },
] as const;

const mobileNav: { label: string; to: string; icon: LucideIcon }[] = [
  { label: "Home", to: "/", icon: Compass },
  { label: "Search", to: "/search", icon: Search },
  { label: "Saved", to: "/favorites", icon: Heart },
  { label: "Sign in", to: "/login", icon: Menu },
];

export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full bg-brand/20 blur-[120px]" />
      <div className="absolute top-1/3 -left-40 h-[420px] w-[420px] rounded-full bg-cyan/10 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 h-[360px] w-[360px] rounded-full bg-pink/10 blur-[120px]" />
    </div>
  );
}

export function BrandMark() {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-cyan font-display text-lg font-bold text-primary-foreground shadow-lg shadow-brand/30">
        A
      </span>
      <span className="truncate font-display text-xl font-bold tracking-tight text-foreground">
        AniVerse
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-slate-200">
      <AmbientBackdrop />

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-16">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pt-5 lg:flex lg:justify-between">
          <BrandMark />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 lg:flex">
            {desktopNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-foreground" }}
                className="transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/search"
              aria-label="Search anime"
              className="hidden text-slate-500 transition hover:text-foreground sm:block"
            >
              <Search className="size-5" />
            </Link>
            <Link
              to="/login"
              className="hidden rounded-full border border-line bg-panel/60 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur-md transition hover:border-brand/50 sm:block"
            >
              Log in
            </Link>
            <Link
              to="/register"
              aria-label="Create an account"
              className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-pink to-brand text-sm font-bold text-primary-foreground"
            >
              R
            </Link>
          </div>
        </header>

        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line/60 bg-panel/70 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-6 py-2.5">
          {mobileNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-cyan" }}
              className="flex flex-col items-center gap-1 text-slate-500"
            >
              <item.icon className="size-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
