import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AnimeCard } from "@/components/AnimeCard";
import {
  featuredAnime,
  latestAnime,
  popularAnime,
  recommendedAnime,
} from "@/data/anime";
import { useFavorites } from "@/lib/favorites";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AniVerse — Discover Your Next Anime" },
      {
        name: "description",
        content:
          "Browse popular, latest and recommended anime with scores, genres and episode guides on AniVerse.",
      },
      { property: "og:title", content: "AniVerse — Discover Your Next Anime" },
      {
        property: "og:description",
        content:
          "Browse popular, latest and recommended anime with scores, genres and episode guides on AniVerse.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const featuredSaved = isFavorite(featuredAnime.id);

  return (
    <AppShell>
      <section className="relative mt-8">
        <div className="absolute -left-6 top-6 hidden h-full w-40 -rotate-12 rounded-3xl border border-line/60 bg-white/[0.03] backdrop-blur-md lg:block" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line/70 bg-panel/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-cyan backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-cyan" /> Featured this season
            </div>
            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Neon
              <br />
              Circuit
            </h1>
            <p className="mt-2 font-display text-lg font-medium text-slate-400">
              {featuredAnime.titleJp}
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
              {featuredAnime.synopsis}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/anime/$animeId"
                params={{ animeId: featuredAnime.id }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-cyan px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-brand/30 transition hover:shadow-xl hover:shadow-cyan/30"
              >
                <Play className="size-4 fill-current" /> Watch now
              </Link>
              <button
                type="button"
                onClick={() => toggleFavorite(featuredAnime.id)}
                aria-pressed={featuredSaved}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition hover:border-pink/50"
              >
                <Plus className="size-4" /> {featuredSaved ? "In my list" : "My list"}
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-1.5 font-display font-bold text-cyan">
                <span className="text-pink">★</span> {featuredAnime.score.toFixed(1)}
              </span>
              <span className="text-slate-500">{featuredAnime.year}</span>
              <span className="text-slate-500">
                TV · {featuredAnime.episodeCount} ep
              </span>
              {featuredAnime.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="rounded-md border border-line bg-panel/50 px-2 py-0.5 text-xs text-slate-300"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div className="relative w-full max-w-sm lg:w-auto lg:max-w-md">
            <div className="absolute -right-8 -top-8 size-40 animate-drift rounded-3xl border border-cyan/20 bg-cyan/10 backdrop-blur-xl" />
            <div className="relative animate-floaty">
              <div className="rotate-3 rounded-3xl border border-line/70 bg-white/[0.04] p-3 shadow-2xl shadow-black/50 backdrop-blur-xl transition duration-500 hover:rotate-0">
                <img
                  src={featuredAnime.poster}
                  alt="Neon Circuit key visual"
                  width={1080}
                  height={1440}
                  className="aspect-3/4 w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section title="Popular now" actionLabel="View all">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {popularAnime.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </Section>

      <Section title="Just dropped" actionLabel="All episodes">
        <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {latestAnime.map((anime) => (
            <Link
              key={anime.id}
              to="/anime/$animeId"
              params={{ animeId: anime.id }}
              className="group w-44 shrink-0 sm:w-48"
            >
              <img
                src={anime.poster}
                alt={`${anime.title} poster art`}
                loading="lazy"
                width={800}
                height={1024}
                className="aspect-3/4 w-full rounded-xl object-cover transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:shadow-brand/20"
              />
              <h3 className="mt-2.5 truncate font-display text-sm font-semibold text-foreground">
                {anime.title}
              </h3>
              <p className="text-xs text-slate-500">
                {anime.year} · Ep {anime.episodes.length}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Recommended for you" actionLabel="Refresh picks">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {recommendedAnime.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </Section>
    </AppShell>
  );
}

function Section({
  title,
  actionLabel,
  children,
}: {
  title: string;
  actionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <h2 className="truncate font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <Link
          to="/search"
          className="shrink-0 text-sm font-semibold text-cyan transition hover:text-foreground"
        >
          {actionLabel}
        </Link>
      </div>
      {children}
    </section>
  );
}
