import { createFileRoute, notFound } from "@tanstack/react-router";
import { Heart, Play } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AnimeCard } from "@/components/AnimeCard";
import { animeList, getAnimeById } from "@/data/anime";
import { useFavorites } from "@/lib/favorites";

export const Route = createFileRoute("/anime/$animeId")({
  loader: ({ params }) => {
    const anime = getAnimeById(params.animeId);
    if (!anime) throw notFound();
    return { anime };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Anime not found — AniVerse" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { anime } = loaderData;
    const title = `${anime.title} — Episodes, Score & Details | AniVerse`;
    const description = anime.synopsis;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "video.tv_show" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: AnimeNotFound,
  component: AnimeDetail,
});

function AnimeNotFound() {
  return (
    <AppShell>
      <section className="mt-16 rounded-2xl glass px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">
          That title isn&apos;t in the catalogue
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Try browsing the catalogue to find something else.
        </p>
      </section>
    </AppShell>
  );
}

function AnimeDetail() {
  const { anime } = Route.useLoaderData();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(anime.id);

  const similar = animeList
    .filter(
      (a) => a.id !== anime.id && a.genres.some((g) => anime.genres.includes(g)),
    )
    .slice(0, 4);

  return (
    <AppShell>
      <section className="mt-10 flex flex-col gap-8 lg:flex-row">
        <div className="w-full max-w-xs shrink-0 self-center lg:self-start">
          <div className="rounded-3xl border border-line/70 bg-white/[0.04] p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <img
              src={anime.poster}
              alt={`${anime.title} cover art`}
              width={1080}
              height={1440}
              className="aspect-3/4 w-full rounded-2xl object-cover"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {anime.title}
          </h1>
          <p className="mt-2 font-display text-lg font-medium text-slate-400">
            {anime.titleJp}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Score" value={`★ ${anime.score.toFixed(1)}`} />
            <Stat label="Status" value={anime.status} />
            <Stat label="Episodes" value={String(anime.episodeCount)} />
            <Stat label="Year" value={String(anime.year)} />
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            {anime.synopsis}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {anime.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-md border border-line bg-panel/50 px-2.5 py-1 text-xs text-slate-300"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-cyan px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-brand/30 transition hover:shadow-xl hover:shadow-cyan/30"
            >
              <Play className="size-4 fill-current" /> Watch episode 1
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(anime.id)}
              aria-pressed={favorite}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition hover:border-pink/50"
            >
              <Heart className={favorite ? "size-4 fill-pink text-pink" : "size-4"} />
              {favorite ? "In my list" : "Add to my list"}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Episodes
        </h2>
        <ul className="mt-6 divide-y divide-line/60 overflow-hidden rounded-2xl glass">
          {anime.episodes.map((episode) => (
            <li
              key={episode.number}
              className="flex items-center gap-4 px-4 py-3.5 transition hover:bg-white/[0.03] sm:px-5"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-ink/60 font-display text-sm font-bold text-cyan">
                {episode.number}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                {episode.title}
              </span>
              <span className="shrink-0 text-xs text-slate-500">
                {episode.duration}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            More like this
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {similar.map((item) => (
              <AnimeCard key={item.id} anime={item} />
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-panel/50 px-4 py-3 backdrop-blur-md">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 truncate font-display text-lg font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}
