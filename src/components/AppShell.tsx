import { Link } from "@tanstack/react-router";
import { CalendarDays, Compass, Heart, Search, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage, type TKey } from "@/lib/i18n";

const desktopNav = [
  { key: "nav.discover", to: "/" },
  { key: "nav.browse", to: "/search" },
  { key: "nav.myList", to: "/favorites" },
  { key: "nav.schedule", to: "/schedule" },
] as const satisfies readonly { key: TKey; to: string }[];

const mobileNav: { key: TKey; to: string; icon: LucideIcon }[] = [
  { key: "nav.home", to: "/", icon: Compass },
  { key: "nav.search", to: "/search", icon: Search },
  { key: "nav.saved", to: "/favorites", icon: Heart },
  { key: "nav.schedule", to: "/schedule", icon: CalendarDays },
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
        AniJikan
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage();

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
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link
              to="/search"
              aria-label={t("nav.search")}
              className="hidden text-slate-500 transition hover:text-foreground sm:block"
            >
              <Search className="size-5" />
            </Link>
            <Link
              to="/login"
              className="hidden rounded-full border border-line bg-panel/60 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur-md transition hover:border-brand/50 sm:block"
            >
              {t("action.login")}
            </Link>
            <Link
              to="/register"
              aria-label="Create an account"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-pink to-brand text-sm font-bold text-primary-foreground"
            >
              R
            </Link>
          </div>
        </header>

        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line/60 bg-panel/70 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 items-start gap-1 px-2 py-2 sm:px-4">
          {mobileNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-cyan" }}
              className="flex min-w-0 flex-col items-center gap-1 px-0.5 text-slate-500"
            >
              <item.icon className="size-5 shrink-0" />
              <span className="w-full truncate text-center text-[10px] font-semibold leading-tight">
                {t(item.key)}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
