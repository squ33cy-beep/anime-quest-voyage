import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "aniverse:tracking";

export type WatchStatus = "watching" | "completed" | "plan" | "dropped";

export const watchStatuses: WatchStatus[] = [
  "watching",
  "completed",
  "plan",
  "dropped",
];

export const watchStatusLabels: Record<WatchStatus, string> = {
  watching: "Watching",
  completed: "Completed",
  plan: "Plan to Watch",
  dropped: "Dropped",
};

export type TrackingEntry = {
  /** 1-10, or 0 when unrated. */
  rating: number;
  status: WatchStatus;
  episodesWatched: number;
};

export const emptyEntry: TrackingEntry = {
  rating: 0,
  status: "plan",
  episodesWatched: 0,
};

type TrackingContextValue = {
  getEntry: (id: string) => TrackingEntry;
  setRating: (id: string, rating: number) => void;
  setStatus: (id: string, status: WatchStatus) => void;
  setEpisodesWatched: (id: string, episodes: number) => void;
};

const TrackingContext = createContext<TrackingContextValue | null>(null);

type TrackingMap = Record<string, TrackingEntry>;

function sanitize(raw: unknown): TrackingMap {
  if (!raw || typeof raw !== "object") return {};
  const out: TrackingMap = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    const v = (value ?? {}) as Partial<TrackingEntry>;
    const status = watchStatuses.includes(v.status as WatchStatus)
      ? (v.status as WatchStatus)
      : "plan";
    out[id] = {
      rating: Math.min(10, Math.max(0, Math.round(Number(v.rating) || 0))),
      status,
      episodesWatched: Math.max(0, Math.round(Number(v.episodesWatched) || 0)),
    };
  }
  return out;
}

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<TrackingMap>({});

  // Read after mount so server and client render the same initial markup.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(sanitize(JSON.parse(raw)));
    } catch {
      /* ignore unreadable storage */
    }
  }, []);

  const update = useCallback((id: string, patch: Partial<TrackingEntry>) => {
    setEntries((current) => {
      const next: TrackingMap = {
        ...current,
        [id]: { ...emptyEntry, ...current[id], ...patch },
      };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore unwritable storage */
      }
      return next;
    });
  }, []);

  const value = useMemo<TrackingContextValue>(
    () => ({
      getEntry: (id) => entries[id] ?? emptyEntry,
      setRating: (id, rating) =>
        update(id, { rating: Math.min(10, Math.max(0, Math.round(rating))) }),
      setStatus: (id, status) => update(id, { status }),
      setEpisodesWatched: (id, episodes) =>
        update(id, { episodesWatched: Math.max(0, Math.round(episodes)) }),
    }),
    [entries, update],
  );

  return (
    <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>
  );
}

export function useTracking(): TrackingContextValue {
  const ctx = useContext(TrackingContext);
  if (ctx) return ctx;
  // Fallback keeps components renderable outside the provider.
  return {
    getEntry: () => emptyEntry,
    setRating: () => {},
    setStatus: () => {},
    setEpisodesWatched: () => {},
  };
}
