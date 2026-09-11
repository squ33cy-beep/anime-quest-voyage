import { Minus, Plus, Star } from "lucide-react";
import type { Anime } from "@/data/anime";
import {
  useTracking,
  watchStatusLabels,
  watchStatuses,
  type WatchStatus,
} from "@/lib/tracking";

export function WatchTracker({ anime }: { anime: Anime }) {
  const { getEntry, setRating, setStatus, setEpisodesWatched } = useTracking();
  const entry = getEntry(anime.id);
  const max = anime.episodeCount > 0 ? anime.episodeCount : 9999;

  return (
    <div className="mt-3 space-y-3 rounded-2xl border border-line/70 bg-panel/40 p-3">
      {/* Rating 1-10 */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Your rating
          </span>
          <span className="font-display text-xs font-bold text-cyan">
            {entry.rating > 0 ? `${entry.rating}/10` : "—"}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-0.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`Rate ${anime.title} ${n} out of 10`}
              aria-pressed={entry.rating === n}
              onClick={() => setRating(anime.id, entry.rating === n ? 0 : n)}
              className="grid size-6 place-items-center rounded-md transition hover:bg-brand/15"
            >
              <Star
                className={
                  n <= entry.rating
                    ? "size-3.5 fill-cyan text-cyan"
                    : "size-3.5 text-slate-500"
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Watch status */}
      <div>
        <label
          htmlFor={`status-${anime.id}`}
          className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Status
        </label>
        <select
          id={`status-${anime.id}`}
          value={entry.status}
          onChange={(e) => setStatus(anime.id, e.target.value as WatchStatus)}
          className="mt-1.5 w-full rounded-xl border border-line bg-ink/70 px-3 py-2 text-xs font-semibold text-foreground outline-none transition focus:border-brand/60"
        >
          {watchStatuses.map((s) => (
            <option key={s} value={s}>
              {watchStatusLabels[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Episode progress */}
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Episodes watched
        </span>
        <div className="mt-1.5 flex items-center gap-2">
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
    </div>
  );
}
