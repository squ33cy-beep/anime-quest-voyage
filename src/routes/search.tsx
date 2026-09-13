import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AnimeCard } from "@/components/AnimeCard";
import { commonGenres, searchAnime, seasons } from "@/lib/jikan";

const years = Array.from({ length: 27 }, (_, i) => String(2026 - i));

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Anime by Genre and Year — AniJikan" },
      {
        name: "description",
        content:
          "Search real anime data and filter by genre and release year to find your next series.",
      },
      { property: "og:title", content: "Search Anime by Genre and Year — AniJikan" },
      {
        property: "og:description",
        content:
          "Search real anime data and filter by genre and release year to find your next series.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [genre, setGenre] = useState("all");
  const [year, setYear] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 450);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", debounced, year],
    queryFn: () => searchAnime({ query: debounced, year }),
    staleTime: 1000 * 60 * 5,
  });

  const results = useMemo(
    () =>
      (data ?? []).filter((a) => genre === "all" || a.genres.includes(genre)),
    [data, genre],
  );

  return (
    <AppShell>
      <section className="mt-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Browse the catalogue
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {isLoading
            ? "Searching…"
            : `${results.length} ${results.length === 1 ? "title" : "titles"} match your filters.`}
        </p>

        <div className="mt-6 rounded-2xl glass p-4">
          <label className="flex items-center gap-3 rounded-xl border border-line bg-ink/60 px-4 py-3">
            <SearchIcon className="size-4 shrink-0 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title…"
              aria-label="Search anime"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-slate-600 focus:outline-none"
            />
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Select
              label="Genre"
              value={genre}
              onChange={setGenre}
              options={["all", ...commonGenres]}
            />
            <Select
              label="Year"
              value={year}
              onChange={setYear}
              options={["all", ...years]}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="aspect-3/4 animate-pulse rounded-2xl glass" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl glass px-6 py-16 text-center">
            <p className="font-display text-lg font-semibold text-foreground">
              {isError ? "Couldn't load results" : "No titles found"}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Try a different keyword, or loosen the genre and year filters.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const id = `${label.toLowerCase()}-filter`;
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-400"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm text-foreground transition focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/30"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-panel">
            {option === "all" ? `All ${label.toLowerCase()}s` : option}
          </option>
        ))}
      </select>
    </div>
  );
}
