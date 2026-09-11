import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AnimeCard } from "@/components/AnimeCard";
import { EpisodeProgress } from "@/components/EpisodeProgress";
import type { Anime } from "@/data/anime";
import { fetchAnimeById } from "@/lib/jikan";
import { useFavorites } from "@/lib/favorites";
import { useTracking } from "@/lib/tracking";
import { useLanguage, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "My Schedule — Weekly Anime Broadcast Days | AniJikan" },
      {
        name: "description",
        content:
          "See the airing anime from your saved list arranged by their weekly broadcast day, Monday through Sunday.",
      },
      { property: "og:title", content: "My Schedule — Weekly Anime Broadcast Days" },
      {
        property: "og:description",
        content:
          "See the airing anime from your saved list arranged by their weekly broadcast day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SchedulePage,
});

const days: { key: TKey; match: string }[] = [
  { key: "day.monday", match: "monday" },
  { key: "day.tuesday", match: "tuesday" },
  { key: "day.wednesday", match: "wednesday" },
  { key: "day.thursday", match: "thursday" },
  { key: "day.friday", match: "friday" },
  { key: "day.saturday", match: "saturday" },
  { key: "day.sunday", match: "sunday" },
];

function dayIndex(anime: Anime): number {
  const raw = (anime.broadcastDay ?? "").toLowerCase();
  return days.findIndex((d) => raw.includes(d.match));
}

function SchedulePage() {
  const { t } = useLanguage();
  const { favorites } = useFavorites();
  const { getEntry } = useTracking();

  const { data, isLoading } = useQuery({
    queryKey: ["favorites", favorites],
    queryFn: async () => {
      const list = await Promise.all(favorites.map((id) => fetchAnimeById(id)));
      return list.filter((a): a is Anime => a !== null);
    },
    enabled: favorites.length > 0,
    staleTime: 1000 * 60 * 10,
  });

  const airing = (data ?? []).filter((a) => a.status === "Airing");
  const grouped = days.map((day, i) => ({
    day,
    items: airing.filter((a) => dayIndex(a) === i),
  }));
  const unknown = airing.filter((a) => dayIndex(a) === -1);
  const hasAny = airing.length > 0;
  const catchingUp = (data ?? []).filter(
    (a) => a.status === "Finished" && getEntry(a.id).status === "watching",
  );

  return (
    <AppShell>
      <section className="mt-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("schedule.title")}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">{t("schedule.subtitle")}</p>

        {isLoading && favorites.length > 0 ? (
          <div className="mt-8 space-y-8">
            {[0, 1, 2].map((row) => (
              <div key={row} className="space-y-4">
                <div className="h-5 w-28 animate-pulse rounded-full glass" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {[0, 1, 2, 3].map((c) => (
                    <div key={c} className="aspect-3/4 animate-pulse rounded-2xl glass" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : hasAny ? (
          <div className="mt-8 space-y-10">
            {grouped
              .filter((g) => g.items.length > 0)
              .map((g) => (
                <DayBlock key={g.day.match} label={t(g.day.key)} items={g.items} />
              ))}
            {unknown.length > 0 && (
              <DayBlock label={t("schedule.unknownDay")} items={unknown} muted />
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl glass px-6 py-20 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand to-cyan shadow-lg shadow-brand/30">
              <CalendarDays className="size-6 text-primary-foreground" />
            </span>
            <p className="mt-5 font-display text-xl font-bold text-foreground">
              {t("schedule.emptyTitle")}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
              {t("schedule.emptyBody")}
            </p>
            <Link
              to="/search"
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-brand to-cyan px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-brand/30 transition hover:shadow-xl hover:shadow-cyan/30"
            >
              {t("action.browseAnime")}
            </Link>
          </div>
        )}

        {catchingUp.length > 0 && (
          <div className="mt-14 border-t border-line/60 pt-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {t("schedule.catchingUp")}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              {t("schedule.catchingUpBody")}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {catchingUp.map((anime) => (
                <div key={anime.id}>
                  <AnimeCard anime={anime} />
                  <EpisodeProgress anime={anime} label={t("schedule.episodes")} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function DayBlock({
  label,
  items,
  muted = false,
}: {
  label: string;
  items: Anime[];
  muted?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <div>
      <div className="flex items-center gap-3">
        <h2
          className={`font-display text-lg font-bold tracking-tight ${
            muted ? "text-slate-400" : "text-foreground"
          }`}
        >
          {label}
        </h2>
        <span className="rounded-full border border-line/70 bg-panel/60 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400">
          {items.length}
        </span>
        <span className="h-px flex-1 bg-line/60" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((anime) => (
          <div key={anime.id}>
            <AnimeCard anime={anime} />
            <EpisodeProgress anime={anime} label={t("schedule.episodes")} />
          </div>
        ))}
      </div>
    </div>
  );
}
