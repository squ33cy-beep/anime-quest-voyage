import type { Anime, Episode } from "@/data/anime";

const ANILIST_URL = "https://graphql.anilist.co";

type AniListMedia = {
  id: number;
  title: {
    english: string | null;
    romaji: string | null;
    native: string | null;
  };
  coverImage: {
    extraLarge: string | null;
    large: string | null;
  };
  averageScore: number | null;
  seasonYear: number | null;
  startDate?: { year: number | null };
  genres: string[];
  status: string | null;
  episodes: number | null;
  description: string | null;
  nextAiringEpisode?: { airingAt: number; episode: number } | null;
};

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Convert an AniList `airingAt` Unix timestamp (seconds) into a weekday + local time. */
export function airingSchedule(airingAt: number | null | undefined): {
  day: string | null;
  time: string | null;
} {
  if (!airingAt) return { day: null, time: null };
  const date = new Date(airingAt * 1000);
  if (Number.isNaN(date.getTime())) return { day: null, time: null };
  return {
    day: WEEKDAYS[date.getDay()] ?? null,
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}


function mapStatus(status: string | null): Anime["status"] {
  if (status === "RELEASING") return "Airing";
  if (status === "NOT_YET_RELEASED") return "Upcoming";
  return "Finished";
}

export function statusLabel(status: Anime["status"]): string {
  if (status === "Airing") return "Currently Airing";
  if (status === "Upcoming") return "Not Yet Aired";
  return "Finished Airing";
}

function mapAnime(item: AniListMedia): Anime {
  const { day, time } = airingSchedule(item.nextAiringEpisode?.airingAt);
  return {
    id: String(item.id),
    title: item.title.english || item.title.romaji || "Unknown Title",
    titleJp: item.title.native || "",
    poster: item.coverImage.extraLarge || item.coverImage.large || "",
    score: item.averageScore ? item.averageScore / 10 : 0,
    year: item.seasonYear || item.startDate?.year || 0,
    genres: item.genres || [],
    status: mapStatus(item.status),
    episodeCount: item.episodes || 0,
    synopsis: item.description
      ? item.description.replace(/<[^>]*>?/gm, "")
      : "No synopsis available yet.",
    episodes: [],
    broadcastDay: day,
    broadcastTime: time,
    nextEpisode: item.nextAiringEpisode?.episode ?? null,
  };
}


async function fetchAniList<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`AniList request failed: ${response.status}`);
  }

  const json = await response.json();
  return json.data;
}

const MEDIA_QUERY = `
  id
  title { english romaji native }
  coverImage { extraLarge large }
  averageScore
  seasonYear
  startDate { year }
  genres
  status
  episodes
  description
  nextAiringEpisode { airingAt episode }
`;


function dedupe(list: Anime[]): Anime[] {
  const seen = new Set<string>();
  return list.filter((a) => (seen.has(a.id) ? false : (seen.add(a.id), true)));
}

export async function fetchPopularAnime(limit = 8): Promise<Anime[]> {
  try {
    const query = `
      query ($perPage: Int) {
        Page(page: 1, perPage: $perPage) {
          media(type: ANIME, sort: POPULARITY_DESC) {
            ${MEDIA_QUERY}
          }
        }
      }
    `;
    const data = await fetchAniList<{ Page: { media: AniListMedia[] } }>(query, {
      perPage: limit,
    });
    return dedupe(data.Page.media.map(mapAnime));
  } catch {
    return [];
  }
}

export async function fetchAiringAnime(limit = 10): Promise<Anime[]> {
  try {
    const query = `
      query ($perPage: Int) {
        Page(page: 1, perPage: $perPage) {
          media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
            ${MEDIA_QUERY}
          }
        }
      }
    `;
    const data = await fetchAniList<{ Page: { media: AniListMedia[] } }>(query, {
      perPage: limit,
    });
    return dedupe(data.Page.media.map(mapAnime));
  } catch {
    return [];
  }
}

export async function fetchTopRatedAnime(limit = 8): Promise<Anime[]> {
  try {
    const query = `
      query ($perPage: Int) {
        Page(page: 1, perPage: $perPage) {
          media(type: ANIME, sort: SCORE_DESC) {
            ${MEDIA_QUERY}
          }
        }
      }
    `;
    const data = await fetchAniList<{ Page: { media: AniListMedia[] } }>(query, {
      perPage: limit,
    });
    return dedupe(data.Page.media.map(mapAnime));
  } catch {
    return [];
  }
}

export async function fetchAnimeById(id: string): Promise<Anime | null> {
  try {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {${MEDIA_QUERY}
        }
      }
    `;
    const data = await fetchAniList<{ Media: AniListMedia }>(query, {
      id: parseInt(id, 10),
    });
    return data.Media ? mapAnime(data.Media) : null;
  } catch {
    return null;
  }
}

export async function fetchEpisodes(id: string): Promise<Episode[]> {
  try {
    const anime = await fetchAnimeById(id);
    if (!anime) return [];
    const count = anime.episodeCount || 12;
    const episodes: Episode[] = [];
    for (let i = 1; i <= Math.min(count, 30); i++) {
      episodes.push({
        number: i,
        title: `Episode ${i}`,
        duration: "24 min",
      });
    }
    return episodes;
  } catch {
    return [];
  }
}

export async function fetchRecommendations(
  id: string,
  limit = 4
): Promise<Anime[]> {
  try {
    const query = `
      query ($id: Int,$perPage: Int) {
        Media(id: $id, type: ANIME) {
          recommendations(perPage: $perPage, sort: RATING_DESC) {
            nodes {
              mediaRecommendation {
                ${MEDIA_QUERY}
              }
            }
          }
        }
      }
    `;
    type RecData = {
      Media: {
        recommendations: {
          nodes: { mediaRecommendation: AniListMedia | null }[];
        };
      };
    };
    const data = await fetchAniList<RecData>(query, {
      id: parseInt(id, 10),
      perPage: limit,
    });
    const list = data.Media.recommendations.nodes
      .map((n) => n.mediaRecommendation)
      .filter((m): m is AniListMedia => m !== null)
      .map(mapAnime);
    return dedupe(list);
  } catch {
    return [];
  }
}

export const commonGenres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
];

export const seasons = ["WINTER", "SPRING", "SUMMER", "FALL"] as const;
export type Season = (typeof seasons)[number];

export type SearchPage = {
  results: Anime[];
  currentPage: number;
  hasNextPage: boolean;
};

export async function searchAnime(opts: {
  query: string;
  year: string;
  season: string;
  genres?: string[];
  page?: number;
  perPage?: number;
}): Promise<SearchPage> {
  const page = opts.page ?? 1;
  const perPage = opts.perPage ?? 20;
  try {
    const query = `
      query ($page: Int, $perPage: Int, $search: String, $seasonYear: Int, $season: MediaSeason, $genre_in: [String]) {
        Page(page: $page, perPage: $perPage) {
          pageInfo { currentPage hasNextPage }
          media(type: ANIME, search: $search, seasonYear: $seasonYear, season: $season, genre_in: $genre_in, sort: POPULARITY_DESC) {${MEDIA_QUERY}
          }
        }
      }
    `;
    const variables: Record<string, unknown> = { page, perPage };
    if (opts.query.trim()) {
      variables["search"] = opts.query.trim();
    }
    if (opts.year !== "all") {
      variables["seasonYear"] = parseInt(opts.year, 10);
    }
    if (opts.season !== "all") {
      variables["season"] = opts.season;
    }
    if (opts.genres && opts.genres.length > 0) {
      variables["genre_in"] = opts.genres;
    }

    const data = await fetchAniList<{
      Page: {
        pageInfo: { currentPage: number; hasNextPage: boolean };
        media: AniListMedia[];
      };
    }>(query, variables);
    return {
      results: dedupe(data.Page.media.map(mapAnime)),
      currentPage: data.Page.pageInfo?.currentPage ?? page,
      hasNextPage: Boolean(data.Page.pageInfo?.hasNextPage),
    };
  } catch {
    return { results: [], currentPage: page, hasNextPage: false };
  }
}