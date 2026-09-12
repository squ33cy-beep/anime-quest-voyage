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
};

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
    broadcastDay: null,
    broadcastTime: null,
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

export async function searchAnime(opts: {
  query: string;
  year: string;
}): Promise<Anime[]> {
  try {
    const query = `
      query ($search: String,$seasonYear: Int) {
        Page(page: 1, perPage: 20) {
          media(type: ANIME, search: $search, seasonYear: $seasonYear, sort: POPULARITY_DESC) {${MEDIA_QUERY}
          }
        }
      }
    `;
    const variables: Record<string, unknown> = {};
    if (opts.query.trim()) {
      variables["search"] = opts.query.trim();
    }
    if (opts.year !== "all") {
      variables["seasonYear"] = parseInt(opts.year, 10);
    }

    const data = await fetchAniList<{ Page: { media: AniListMedia[] } }>(
      query,
      variables
    );
    return dedupe(data.Page.media.map(mapAnime));
  } catch {
    return [];
  }
}