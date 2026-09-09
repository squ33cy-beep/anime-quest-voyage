import type { Anime, Episode } from "@/data/anime";

const BASE = "https://api.jikan.moe/v4";

type JikanAnime = {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images: { jpg: { large_image_url: string | null; image_url: string | null } };
  score: number | null;
  year: number | null;
  aired?: { from: string | null };
  status: string | null;
  episodes: number | null;
  synopsis: string | null;
  genres: { name: string }[];
  themes?: { name: string }[];
};

type JikanEpisode = {
  mal_id: number;
  title: string | null;
  duration?: number | null;
};

function mapStatus(status: string | null): Anime["status"] {
  const s = (status ?? "").toLowerCase();
  if (s.includes("currently")) return "Airing";
  if (s.includes("not yet")) return "Upcoming";
  return "Finished";
}

export function statusLabel(status: Anime["status"]): string {
  if (status === "Airing") return "Currently Airing";
  if (status === "Upcoming") return "Not Yet Aired";
  return "Finished Airing";
}

export function mapAnime(item: JikanAnime): Anime {
  return {
    id: String(item.mal_id),
    title: item.title_english ?? item.title,
    titleJp: item.title_japanese ?? "",
    poster:
      item.images.jpg.large_image_url ?? item.images.jpg.image_url ?? "",
    score: item.score ?? 0,
    year:
      item.year ??
      (item.aired?.from ? new Date(item.aired.from).getFullYear() : 0),
    genres: [...item.genres, ...(item.themes ?? [])].map((g) => g.name),
    status: mapStatus(item.status),
    episodeCount: item.episodes ?? 0,
    synopsis: item.synopsis ?? "No synopsis available yet.",
    episodes: [],
  };
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Jikan request failed (${res.status})`);
  return (await res.json()) as T;
}

function dedupe(list: Anime[]): Anime[] {
  const seen = new Set<string>();
  return list.filter((a) => (seen.has(a.id) ? false : (seen.add(a.id), true)));
}

export async function fetchPopularAnime(limit = 8): Promise<Anime[]> {
  const json = await getJson<{ data: JikanAnime[] }>(
    `/top/anime?filter=bypopularity&limit=${limit}`,
  );
  return dedupe(json.data.map(mapAnime));
}

export async function fetchAiringAnime(limit = 10): Promise<Anime[]> {
  const json = await getJson<{ data: JikanAnime[] }>(
    `/top/anime?filter=airing&limit=${limit}`,
  );
  return dedupe(json.data.map(mapAnime));
}

export async function fetchTopRatedAnime(limit = 8): Promise<Anime[]> {
  const json = await getJson<{ data: JikanAnime[] }>(
    `/top/anime?limit=${limit}`,
  );
  return dedupe(json.data.map(mapAnime));
}

export async function fetchAnimeById(id: string): Promise<Anime | null> {
  try {
    const json = await getJson<{ data: JikanAnime }>(`/anime/${id}/full`);
    return mapAnime(json.data);
  } catch {
    return null;
  }
}

export async function fetchEpisodes(id: string): Promise<Episode[]> {
  try {
    const json = await getJson<{ data: JikanEpisode[] }>(
      `/anime/${id}/episodes`,
    );
    return json.data.slice(0, 30).map((ep, i) => ({
      number: ep.mal_id ?? i + 1,
      title: ep.title ?? `Episode ${i + 1}`,
      duration: ep.duration ? `${Math.round(ep.duration / 60)} min` : "24 min",
    }));
  } catch {
    return [];
  }
}

export async function fetchRecommendations(id: string, limit = 4): Promise<Anime[]> {
  try {
    const json = await getJson<{ data: { entry: JikanAnime }[] }>(
      `/anime/${id}/recommendations`,
    );
    return dedupe(json.data.slice(0, limit).map((r) => mapAnime(r.entry)));
  } catch {
    return [];
  }
}
