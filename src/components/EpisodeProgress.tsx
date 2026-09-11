import { Minus, Plus } from "lucide-react";
import type { Anime } from "@/data/anime";
import { useTracking } from "@/lib/tracking";

/** Compact +/- episode counter, usable on any anime card. */
export function EpisodeProgress({
  anime,
  label,
}: {
  anime: Anime;
  label?: string;
}) {
  const { getEntry, setEpisodesWatched } = useTracking();
  const entry = getEntry(anime.id);
  const max = anime.episodeCount > 0 ? anime.episodeCount : 9999;

  return (
    <div className="mt-2 rounded-2xl border border-line/70 bg-panel/40 p-2">
      {label ? (
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      ) : null}
      <div className={`flex items-center gap-2 ${label ? "mt-1.5" : ""}`}>
        <button
          type="button"
          aria-label={`Decrease episodes watched for ${anime.title}`}
          onClick={() =>
            setEpisodesWatched(anime.id, Math.max(0, entry.episodesWatched - 1))
          }
          disabled={entry.episodesWatched <= 0}
          className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-ink/70 text-foreground transition hover:border-brand/60 disabled:opacity-40"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="flex-1 text-center font-display text-sm font-bold text-foreground">
          {entry.episodesWatched}
          {anime.episodeCount > 0 ? (
            <span className="text-muted-foreground"> / {anime.episodeCount}</span>
          ) : null}
        </span>
        <button
          type="button"
          aria-label={`Increase episodes watched for ${anime.title}`}
          onClick={() =>
            setEpisodesWatched(anime.id, Math.min(max, entry.episodesWatched + 1))
          }
          disabled={entry.episodesWatched >= max}
          className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-ink/70 text-foreground transition hover:border-cyan/60 disabled:opacity-40"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
