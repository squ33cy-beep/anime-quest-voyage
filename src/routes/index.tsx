import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Info, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AnimeCard } from "@/components/AnimeCard";
import type { Anime } from "@/data/anime";
import {
  fetchAiringAnime,
  fetchPopularAnime,
  fetchTopRatedAnime,
  statusLabel,
} from "@/lib/jikan";
import { useFavorites } from "@/lib/favorites";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AniJikan — Discover Your Next Anime" },
      {
        name: "description",
        content:
          "Browse popular, currently airing and top rated anime with scores, genres and episode guides on AniJikan.",
      },
      { property: "og:title", content: "AniJikan — Discover Your Next Anime" },
      {
        property: "og:description",
        content:
          "Browse popular, currently airing and top rated anime with scores, genres and episode guides on AniJikan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const airing = useQuery({
    queryKey: ["anime", "airing"],
    queryFn: () => fetchAiringAnime(10),
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
  const popular = useQuery({
    queryKey: ["anime", "popular"],
    queryFn: () => fetchPopularAnime(8),
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
  const topRated = useQuery({
    queryKey: ["anime", "top-rated"],
    queryFn: () => fetchTopRatedAnime(8),
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });

  const featured = airing.data?.[0];

  return (
    <AppShell>
      <section className="relative mt-8">
        <div className="absolute -left-6 top-6 hidden h-full w-40 -rotate-12 rounded-3xl border border-line/60 bg-white/[0.03] backdrop-blur-md lg:block" />
        {featured ? (
          <Hero anime={featured} />
        ) : (
          <div className="relative h-80 animate-pulse rounded-3xl glass" />
        )}
      </section>

      <Section title="Popular now">
        <Grid query={popular} />
      </Section>

      <Section title="Currently airing">
        <Grid query={airing} skip={1} />
      </Section>

      <Section title="Top rated">
        <Grid query={topRated} />
      </Section>
    </AppShell>
  );
}

function Hero({ anime }: { anime: Anime }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(anime.id);

  return (
    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line/70 bg-panel/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-cyan backdrop-blur-md">
          <span className="size-1.5 animate-pulse rounded-full bg-cyan" />
          {statusLabel(anime.status)}
        </div>
        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {anime.title}
        </h1>
        <p className="mt-2 font-display text-lg font-medium text-slate-400">
          {anime.titleJp}
        </p>
        <p className="mt-5 line-clamp-4 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
          {anime.synopsis}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/anime/$animeId"
            params={{ animeId: anime.id }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-cyan px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-brand/30 transition hover:shadow-xl hover:shadow-cyan/30"
          >
            <Info className="size-4" /> View Details
          </Link>
          <button
            type="button"
            onClick={() => toggleFavorite(anime.id)}
            aria-pressed={saved}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition hover:border-pink/50"
          >
            <Plus className="size-4" /> {saved ? "In my list" : "My list"}
          </button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1.5 font-display font-bold text-cyan">
            <span className="text-pink">★</span> {anime.score.toFixed(1)}
          </span>
          <span className="text-slate-500">{anime.year || "TBA"}</span>
          <span className="text-slate-500">TV · {anime.episodeCount || "?"} ep</span>
          {anime.genres.slice(0, 2).map((genre) => (
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
              src={anime.poster}
              alt={`${anime.title} key visual`}
              width={1080}
              height={1440}
              className="aspect-3/4 w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Grid({
  query,
  skip = 0,
}: {
  query: { data: Anime[] | undefined; isLoading: boolean; isError: boolean };
  skip?: number;
}) {
  if (query.isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="aspect-3/4 animate-pulse rounded-2xl glass" />
        ))}
      </div>
    );
  }
  if (query.isError || !query.data?.length) {
    return (
      <div className="rounded-2xl glass px-6 py-12 text-center text-sm text-slate-400">
        Couldn&apos;t load these titles right now. Please try again in a moment.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {query.data.slice(skip).map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
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
          Browse all
        </Link>
      </div>
      {children}
    </section>
  );
}
