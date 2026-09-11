import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AnimeCard } from "@/components/AnimeCard";
import { WatchTracker } from "@/components/WatchTracker";
import type { Anime } from "@/data/anime";
import { fetchAnimeById } from "@/lib/jikan";
import { useFavorites } from "@/lib/favorites";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "My Favorite Anime — AniJikan" },
      {
        name: "description",
        content: "Every anime you have saved to your AniJikan list, in one place.",
      },
      { property: "og:title", content: "My Favorite Anime — AniJikan" },
      {
        property: "og:description",
        content: "Every anime you have saved to your AniJikan list, in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites } = useFavorites();
  const { data, isLoading } = useQuery({
    queryKey: ["favorites", favorites],
    queryFn: async () => {
      const list = await Promise.all(favorites.map((id) => fetchAnimeById(id)));
      return list.filter((a): a is Anime => a !== null);
    },
    enabled: favorites.length > 0,
    staleTime: 1000 * 60 * 10,
  });
  const saved = data ?? [];

  return (
    <AppShell>
      <section className="mt-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          My list
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {favorites.length} saved {favorites.length === 1 ? "title" : "titles"}
        </p>

        {favorites.length > 0 ? (
          isLoading ? (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {favorites.map((id) => (
                <div key={id} className="aspect-3/4 animate-pulse rounded-2xl glass" />
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {saved.map((anime) => (
                <div key={anime.id}>
                  <AnimeCard anime={anime} />
                  <WatchTracker anime={anime} />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="mt-8 rounded-3xl glass px-6 py-20 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand to-cyan shadow-lg shadow-brand/30">
              <Heart className="size-6 text-primary-foreground" />
            </span>
            <p className="mt-5 font-display text-xl font-bold text-foreground">
              Nothing saved yet
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
              Tap the heart on any poster and it will show up here, ready for your next
              watchlist.
            </p>
            <Link
              to="/search"
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-brand to-cyan px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-brand/30 transition hover:shadow-xl hover:shadow-cyan/30"
            >
              Browse anime
            </Link>
          </div>
        )}
      </section>
    </AppShell>
  );
}
