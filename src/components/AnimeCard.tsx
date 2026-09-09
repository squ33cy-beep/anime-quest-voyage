import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Anime } from "@/data/anime";
import { statusLabel } from "@/lib/jikan";
import { useFavorites } from "@/lib/favorites";

export function AnimeCard({ anime }: { anime: Anime }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(anime.id);

  return (
    <div className="group relative rounded-2xl glass p-3 transition duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10">
      <Link
        to="/anime/$animeId"
        params={{ animeId: anime.id }}
        className="block"
        aria-label={anime.title}
      >
        <div className="relative">
          <img
            src={anime.poster}
            alt={`${anime.title} poster art`}
            loading="lazy"
            width={800}
            height={1024}
            className="aspect-3/4 w-full rounded-xl object-cover"
          />
          <span
            className={`absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md ${
              anime.status === "Airing"
                ? "border-cyan/40 bg-ink/75 text-cyan"
                : anime.status === "Upcoming"
                  ? "border-pink/40 bg-ink/75 text-pink"
                  : "border-line/70 bg-ink/75 text-slate-300"
            }`}
          >
            {anime.status === "Airing" && (
              <span className="size-1.5 animate-pulse rounded-full bg-cyan" />
            )}
            {statusLabel(anime.status)}
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 truncate font-display font-semibold text-foreground">
              {anime.title}
            </h3>
            <span className="shrink-0 font-display text-sm font-bold text-cyan">
              ★ {anime.score.toFixed(1)}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {anime.year || "TBA"} · {anime.genres.slice(0, 2).join(" · ")}
          </p>
          <span className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-line bg-panel/60 px-3 py-2 text-xs font-semibold text-foreground transition group-hover:border-brand/50 group-hover:text-cyan">
            View Details
          </span>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggleFavorite(anime.id)}
        aria-label={favorite ? `Remove ${anime.title} from favorites` : `Add ${anime.title} to favorites`}
        aria-pressed={favorite}
        className="absolute right-5 top-5 grid size-9 place-items-center rounded-full border border-line/70 bg-ink/70 backdrop-blur-md transition hover:border-pink/60"
      >
        <Heart
          className={
            favorite
              ? "size-4 fill-pink text-pink"
              : "size-4 text-slate-300 transition group-hover:text-pink"
          }
        />
      </button>
    </div>
  );
}
