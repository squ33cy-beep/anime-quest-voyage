import { Star } from "lucide-react";
import type { Anime } from "@/data/anime";
import { EpisodeProgress } from "@/components/EpisodeProgress";
import {
  useTracking,
  watchStatusLabels,
  watchStatuses,
  type WatchStatus,
} from "@/lib/tracking";

export function WatchTracker({ anime }: { anime: Anime }) {
  const { getEntry, setRating, setStatus } = useTracking();
  const entry = getEntry(anime.id);

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
      <EpisodeProgress anime={anime} label="Episodes watched" />
    </div>
  );
}
