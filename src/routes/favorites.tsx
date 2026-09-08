import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AnimeCard } from "@/components/AnimeCard";
import { animeList } from "@/data/anime";
import { useFavorites } from "@/lib/favorites";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "My Favorite Anime — AniVerse" },
      {
        name: "description",
        content: "Every anime you have saved to your AniVerse list, in one place.",
      },
      { property: "og:title", content: "My Favorite Anime — AniVerse" },
      {
        property: "og:description",
        content: "Every anime you have saved to your AniVerse list, in one place.",
      },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites } = useFavorites();
  const saved = animeList.filter((anime) => favorites.includes(anime.id));

  return (
    <AppShell>
      <section className="mt-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          My list
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {saved.length} saved {saved.length === 1 ? "title" : "titles"}
        </p>

        {saved.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {saved.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
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
              binge.
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
