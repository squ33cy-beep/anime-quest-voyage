import heroNeonCircuit from "@/assets/hero-neon-circuit.jpg";
import posterBladeOfDawn from "@/assets/poster-blade-of-dawn.jpg";
import posterStarweaver from "@/assets/poster-starweaver.jpg";
import posterIronPulse from "@/assets/poster-iron-pulse.jpg";
import posterRooftopDays from "@/assets/poster-rooftop-days.jpg";
import posterMidnightCase from "@/assets/poster-midnight-case.jpg";
import posterFlavorWar from "@/assets/poster-flavor-war.jpg";
import posterVoidDrift from "@/assets/poster-void-drift.jpg";
import posterGhostWaltz from "@/assets/poster-ghost-waltz.jpg";
import posterFirstArrow from "@/assets/poster-first-arrow.jpg";

export type Episode = {
  number: number;
  title: string;
  duration: string;
};

export type Anime = {
  id: string;
  title: string;
  titleJp: string;
  poster: string;
  score: number;
  year: number;
  genres: string[];
  status: "Airing" | "Finished" | "Upcoming";
  episodeCount: number;
  synopsis: string;
  episodes: Episode[];
};

function makeEpisodes(count: number, titles: string[]): Episode[] {
  return Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    title: titles[i % titles.length],
    duration: "24 min",
  }));
}

export const animeList: Anime[] = [
  {
    id: "neon-circuit",
    title: "Neon Circuit",
    titleJp: "ネオン・サーキット",
    poster: heroNeonCircuit,
    score: 9.4,
    year: 2025,
    genres: ["Sci-Fi", "Action", "Cyberpunk"],
    status: "Airing",
    episodeCount: 24,
    synopsis:
      "In a city that never sleeps, a rogue courier races the data-storms to keep her memories — and the whole network — from being erased.",
    episodes: makeEpisodes(12, [
      "Signal Lost",
      "Rain on Wire",
      "The Courier's Debt",
      "Ghost in the Grid",
      "Blackout District",
      "Memory Market",
    ]),
  },
  {
    id: "blade-of-dawn",
    title: "Blade of Dawn",
    titleJp: "暁の刃",
    poster: posterBladeOfDawn,
    score: 8.7,
    year: 2024,
    genres: ["Action", "Drama", "Historical"],
    status: "Finished",
    episodeCount: 13,
    synopsis:
      "A masterless swordsman walks the blossom roads of a divided province, trading his blade for stories he cannot bear to forget.",
    episodes: makeEpisodes(13, [
      "Petals and Steel",
      "The Broken Oath",
      "Rain Season",
      "A Debt of Names",
      "Dawn Duel",
    ]),
  },
  {
    id: "starweaver",
    title: "Starweaver",
    titleJp: "星織り",
    poster: posterStarweaver,
    score: 9.1,
    year: 2025,
    genres: ["Fantasy", "Magic", "Adventure"],
    status: "Airing",
    episodeCount: 12,
    synopsis:
      "Every wish costs a star. When a young weaver inherits her grandmother's loom, she learns the sky is running out of light.",
    episodes: makeEpisodes(12, [
      "The Loom Awakens",
      "First Wish",
      "Constellation Debt",
      "Where Light Goes",
      "Thread of Dusk",
    ]),
  },
  {
    id: "iron-pulse",
    title: "Iron Pulse",
    titleJp: "アイアン・パルス",
    poster: posterIronPulse,
    score: 8.4,
    year: 2023,
    genres: ["Mecha", "Action", "Sci-Fi"],
    status: "Finished",
    episodeCount: 26,
    synopsis:
      "Deep-orbit pilots share one heartbeat with their machines. When a squad's rhythm breaks, the war changes shape.",
    episodes: makeEpisodes(14, [
      "Sync Rate Zero",
      "Cold Launch",
      "Two Hearts, One Frame",
      "Orbital Silence",
      "Pulse Override",
    ]),
  },
  {
    id: "rooftop-days",
    title: "Rooftop Days",
    titleJp: "屋上の日々",
    poster: posterRooftopDays,
    score: 8.9,
    year: 2024,
    genres: ["Slice of Life", "Comedy", "School"],
    status: "Finished",
    episodeCount: 12,
    synopsis:
      "Five classmates, one folding table, and every sunset of their final school year spent putting off the future.",
    episodes: makeEpisodes(12, [
      "Table for Five",
      "Cold Coffee Club",
      "Summer Homework",
      "The Long Way Home",
      "Last Bell",
    ]),
  },
  {
    id: "midnight-case",
    title: "Midnight Case",
    titleJp: "深夜の事件簿",
    poster: posterMidnightCase,
    score: 8.6,
    year: 2025,
    genres: ["Mystery", "Thriller", "Noir"],
    status: "Airing",
    episodeCount: 12,
    synopsis:
      "A detective who only works after midnight takes the cases the daytime city refuses to admit exist.",
    episodes: makeEpisodes(12, [
      "The 2 A.M. Client",
      "Neon Alibi",
      "Wet Pavement",
      "Nobody's Witness",
      "Closing Time",
    ]),
  },
  {
    id: "flavor-war",
    title: "Flavor War",
    titleJp: "美味の戦争",
    poster: posterFlavorWar,
    score: 8.1,
    year: 2025,
    genres: ["Comedy", "Shounen", "Cooking"],
    status: "Airing",
    episodeCount: 24,
    synopsis:
      "Two rival apprentices tear a legendary kitchen apart one dish at a time, and the head chef is quietly delighted.",
    episodes: makeEpisodes(10, [
      "First Cut",
      "Salt and Pride",
      "The Judging Table",
      "Burnt Offering",
      "Service Rush",
    ]),
  },
  {
    id: "void-drift",
    title: "Void Drift",
    titleJp: "ヴォイド・ドリフト",
    poster: posterVoidDrift,
    score: 8.8,
    year: 2025,
    genres: ["Sci-Fi", "Drama", "Space"],
    status: "Airing",
    episodeCount: 11,
    synopsis:
      "A lone surveyor drifts between dying stars, cataloguing the last light of systems no one will ever visit again.",
    episodes: makeEpisodes(11, [
      "Untethered",
      "Field of Quiet Suns",
      "Signal from Home",
      "Cold Bloom",
      "Terminal Drift",
    ]),
  },
  {
    id: "ghost-waltz",
    title: "Ghost Waltz",
    titleJp: "幽霊のワルツ",
    poster: posterGhostWaltz,
    score: 8.3,
    year: 2025,
    genres: ["Supernatural", "Music", "Mystery"],
    status: "Airing",
    episodeCount: 12,
    synopsis:
      "Every night a masked dancer performs for an empty theatre. Every night one more seat is taken.",
    episodes: makeEpisodes(9, [
      "Curtain, No Audience",
      "Second Row",
      "The Encore Problem",
      "Masked Rehearsal",
      "Final Bow",
    ]),
  },
  {
    id: "first-arrow",
    title: "First Arrow",
    titleJp: "初矢",
    poster: posterFirstArrow,
    score: 8.5,
    year: 2025,
    genres: ["Adventure", "Sports", "Drama"],
    status: "Upcoming",
    episodeCount: 12,
    synopsis:
      "A village archer leaves the cliffs for the capital tournament, carrying a bow older than her family's name.",
    episodes: makeEpisodes(6, [
      "Draw at Dawn",
      "The Long Road",
      "Capital Air",
      "Bracket of Ten",
      "Loose",
    ]),
  },
];

export const allGenres: string[] = Array.from(
  new Set(animeList.flatMap((a) => a.genres)),
).sort();

export const allYears: number[] = Array.from(
  new Set(animeList.map((a) => a.year)),
).sort((a, b) => b - a);

export const featuredAnime: Anime = animeList[0];

export const popularAnime: Anime[] = [...animeList]
  .sort((a, b) => b.score - a.score)
  .slice(0, 4);

export const latestAnime: Anime[] = animeList.filter((a) => a.year >= 2025);

export const recommendedAnime: Anime[] = [
  "starweaver",
  "rooftop-days",
  "void-drift",
  "ghost-waltz",
]
  .map((id) => animeList.find((a) => a.id === id))
  .filter((a): a is Anime => Boolean(a));

export function getAnimeById(id: string): Anime | undefined {
  return animeList.find((a) => a.id === id);
}
