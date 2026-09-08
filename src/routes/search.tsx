import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AnimeCard } from "@/components/AnimeCard";
import { allGenres, allYears, animeList } from "@/data/anime";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Anime by Genre and Year — AniVerse" },
      {
        name: "description",
        content:
          "Search the AniVerse catalogue and filter anime by genre and release year to find your next series.",
      },
      { property: "og:title", content: "Search Anime by Genre and Year — AniVerse" },
      {
        property: "og:description",
        content:
          "Search the AniVerse catalogue and filter anime by genre and release year to find your next series.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [year, setYear] = useState("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return animeList.filter((anime) => {
      const matchesQuery =
        !q ||
        anime.title.toLowerCase().includes(q) ||
        anime.titleJp.includes(query.trim()) ||
        anime.genres.some((g) => g.toLowerCase().includes(q));
      const matchesGenre = genre === "all" || anime.genres.includes(genre);
      const matchesYear = year === "all" || String(anime.year) === year;
      return matchesQuery && matchesGenre && matchesYear;
    });
  }, [query, genre, year]);

  return (
    <AppShell>
      <section className="mt-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Browse the catalogue
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {results.length} {results.length === 1 ? "title" : "titles"} match your filters.
        </p>

        <div className="mt-6 rounded-2xl glass p-4">
          <label className="flex items-center gap-3 rounded-xl border border-line bg-ink/60 px-4 py-3">
            <SearchIcon className="size-4 shrink-0 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or genre…"
              aria-label="Search anime"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-slate-600 focus:outline-none"
            />
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Select
              label="Genre"
              value={genre}
              onChange={setGenre}
              options={["all", ...allGenres]}
            />
            <Select
              label="Year"
              value={year}
              onChange={setYear}
              options={["all", ...allYears.map(String)]}
            />
          </div>
        </div>

        {results.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl glass px-6 py-16 text-center">
            <p className="font-display text-lg font-semibold text-foreground">
              No titles found
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
