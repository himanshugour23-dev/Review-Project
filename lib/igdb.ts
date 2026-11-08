const IGDB_BASE_URL = "https://api.igdb.com/v4";
const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error(
    "Twitch Client ID and Secret must be set in environment variables."
  );
}

// 1. ACCESS TOKEN MANAGEMENT

let accessToken: string | null = null;
let tokenExpiresAt = 0;
let tokenPromise: Promise<string> | null = null;

async function getIGDBAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiresAt - 300_000) {
    return accessToken;
  }

  if (tokenPromise) return tokenPromise;

  tokenPromise = (async (): Promise<string> => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      grant_type: "client_credentials",
    });

    const res = await fetch(TWITCH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(
        `Twitch token request failed (${res.status}): ${error}`
      );
    }

    const data: {
      access_token: string;
      expires_in: number;
      token_type: string;
    } = await res.json();

    accessToken = data.access_token;
    tokenExpiresAt = Date.now() + data.expires_in * 1000;

    return data.access_token;
  })();

  try {
    return await tokenPromise;
  } finally {
    tokenPromise = null;
  }
}

async function igdbRequest<T>(
  endpoint: string,
  query: string
): Promise<T> {
  const token = await getIGDBAccessToken();

  const res = await fetch(`${IGDB_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "text/plain",
    },
    body: query,
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.text();

    throw new Error(
      `IGDB ${endpoint} failed (${res.status}): ${error}`
    );
  }
  return res.json() as Promise<T>;
}

interface IGDBGame {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  storyline?: string;
  first_release_date?: number;
  rating?: number;
  rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;

  total_rating?: number;
  total_rating_count?: number;

  hypes?: number;
  game_type?: number;
  parent_game?: number;

  cover?: {
    id?: number;
    image_id: string;
  };

  genres?: {
    id: number;
    name: string;
  }[];

  platforms?: {
    id: number;
    name: string;
  }[];

  themes?: {
    id: number;
    name: string;
  }[];

  game_modes?: {
    id: number;
    name: string;
  }[];

  player_perspectives?: {
    id: number;
    name: string;
  }[];

  keywords?: {
    id: number;
    name: string;
  }[];

  franchises?: {
    id: number;
    name: string;
  }[];

  screenshots?: {
    id: number;
    image_id: string;
  }[];

  artworks?: {
    id: number;
    image_id: string;
  }[];

  videos?: {
    id?: number;
    name: string;
    video_id: string;
  }[];

  similar_games?: {
    id: number;
    name: string;
    slug: string;
    cover?: {
      image_id: string;
    };
  }[];

  involved_companies?: {
    id: number;
    developer: boolean;
    publisher: boolean;

    company: {
      id: number;
      name: string;
      slug?: string;
    };
  }[];

  websites?: {
    id: number;
    type: number;
    url: string;
  }[];
}

interface IGDBCompany {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  country?: number;

  logo?: {
    image_id: string;
  };

  developed?: {
    id: number;
    name: string;
    slug: string;
  }[];

  published?: {
    id: number;
    name: string;
    slug: string;
  }[];
}

// Image Helper to change Image Id to URL
function getIGDBImage(
  imageId?: string,
  size = "t_cover_big"
): string {
  if (!imageId) return "";

  return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`;
}


function normalizeIGDBGameSummary(game: IGDBGame) {
  return {
    igdbId: game.id,
    slug: game.slug,
    name: game.name,
    coverImage: getIGDBImage(game.cover?.image_id),
    genres: game.genres?.map((g) => g.name) ?? [],
    platforms: game.platforms?.map((p) => p.name) ?? [],
    released: game.first_release_date
      ? new Date(game.first_release_date * 1000)
      : undefined,
    igdbRating: game.rating ?? 0,
    metacritic: game.aggregated_rating ?? 0,
    totalRating: game.total_rating ?? 0,
    totalRatingCount: game.total_rating_count ?? 0,
    igdbRatingCount: game.rating_count ?? 0,
    aggregatedRatingCount:
      game.aggregated_rating_count ?? 0,
  };
}

function normalizeIGDBGameDetails(game: IGDBGame) {
  const companies = game.involved_companies ?? [];

  return {
    igdbId: game.id,
    slug: game.slug,
    name: game.name,
    coverImage: getIGDBImage(game.cover?.image_id),
    description: game.summary,
    summary: game.summary,
    storyline: game.storyline,
    released: game.first_release_date
      ? new Date(game.first_release_date * 1000)
      : undefined,
    igdbRating: game.rating ?? 0,
    metacritic: game.aggregated_rating ?? 0,
    totalRating: game.total_rating ?? 0,
    totalRatingCount: game.total_rating_count ?? 0,
    igdbRatingCount: game.rating_count ?? 0,
    aggregatedRatingCount:
      game.aggregated_rating_count ?? 0,
    hypes: game.hypes ?? 0,
    category: game.game_type,
    parentGameId: game.parent_game,
    genres: game.genres?.map((g) => g.name) ?? [],
    platforms: game.platforms?.map((p) => p.name) ?? [],
    themes: game.themes?.map((t) => t.name) ?? [],
    gameModes: game.game_modes?.map((m) => m.name) ?? [],
    playerPerspectives:
      game.player_perspectives?.map((p) => p.name) ?? [],
    keywords: game.keywords?.map((k) => k.name) ?? [],
    franchises: game.franchises?.map((f) => f.name) ?? [],
    screenshots:
      game.screenshots?.map((s) =>
        getIGDBImage(s.image_id, "t_screenshot_big")
      ) ?? [],

    artworks:
      game.artworks?.map((a) =>
        getIGDBImage(a.image_id, "t_1080p")
      ) ?? [],

    videos:
      game.videos?.map((v) => ({
        name: v.name,
        videoId: v.video_id,
      })) ?? [],

    similarGames:
      game.similar_games?.map((g) => ({
        id: g.id,
        name: g.name,
        slug: g.slug,
        coverImage: getIGDBImage(g.cover?.image_id),
      })) ?? [],

    igdbDetails: {
      developers: companies
        .filter((c) => c.developer)
        .map((c) => ({
          id: c.company.id,
          name: c.company.name,
          slug: c.company.slug,
        })),

      publishers: companies
        .filter((c) => c.publisher)
        .map((c) => ({
          id: c.company.id,
          name: c.company.name,
          slug: c.company.slug,
        })),

      websites:
        game.websites?.map((w) => ({
          id: w.id,
          type: w.type,
          url: w.url,
        })) ?? [],
    },
  };
}

export async function searchIGDBGames(query: string) {
  const escapedQuery = query
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');

  const games = await igdbRequest<IGDBGame[]>(
    "games",
    `
      fields
        id,
        name,
        slug,
        cover.image_id,
        first_release_date,
        rating,
        rating_count,
        aggregated_rating,
        aggregated_rating_count,
        total_rating,
        total_rating_count,
        genres.name,
        platforms.name;

      search "${escapedQuery}";
      where game_type = (0, 2, 3, 4, 8, 9, 10, 11);
      limit 20;
    `
  );

  return games.map(normalizeIGDBGameSummary);
}

export async function getIGDBGameDetails(gameId: number) {
  const games = await igdbRequest<IGDBGame[]>(
    "games",
    `
      fields
        id,
        name,
        slug,

        summary,
        storyline,

        first_release_date,

        rating,
        rating_count,

        aggregated_rating,
        aggregated_rating_count,

        total_rating,
        total_rating_count,

        hypes,

        game_type,
        parent_game,

        cover.image_id,

        genres.name,
        platforms.name,
        themes.name,
        game_modes.name,
        player_perspectives.name,
        keywords.name,
        franchises.name,

        screenshots.image_id,
        artworks.image_id,

        videos.name,
        videos.video_id,

        similar_games.id,
        similar_games.name,
        similar_games.slug,
        similar_games.cover.image_id,

        involved_companies.company.id,
        involved_companies.company.name,
        involved_companies.company.slug,
        involved_companies.developer,
        involved_companies.publisher,

        websites.id,
        websites.type,
        websites.url;

      where id = ${gameId};
      limit 1;
    `
  );

  if (!games.length) {
    throw new Error(`IGDB game not found: ${gameId}`);
  }

  const rawGame = games[0];

  console.log("IGDB DETAIL RESPONSE:", {
    name: rawGame.name,
    screenshots: rawGame.screenshots?.length ?? 0,
    artworks: rawGame.artworks?.length ?? 0,
    videos: rawGame.videos?.length ?? 0,
    companies: rawGame.involved_companies?.length ?? 0,
    websites: rawGame.websites?.length ?? 0,
  });

  return normalizeIGDBGameDetails(rawGame);
}

export async function getIGDBGameDLC(gameId: number) {
  const games = await igdbRequest<IGDBGame[]>(
    "games",
    `
      fields
        id,
        name,
        slug,
        first_release_date,
        cover.image_id,
        game_type,
        parent_game;

      where parent_game = ${gameId};
      limit 100;
      sort first_release_date asc;
    `
  );

  return games.map((game) => ({
    id: game.id,
    name: game.name,
    slug: game.slug,

    released: game.first_release_date
      ? new Date(game.first_release_date * 1000)
      : undefined,

    image: getIGDBImage(game.cover?.image_id),
  }));
}

export async function getIGDBGameDevelopmentTeam(gameId: number) {
  const companies = await igdbRequest<
    {
      id: number;
      developer: boolean;
      publisher: boolean;

      company: {
        id: number;
        name: string;
        slug?: string;
      };
    }[]
  >(
    "involved_companies",
    `
      fields
        id,
        developer,
        publisher,
        company.id,
        company.name,
        company.slug;

      where game = ${gameId};
      limit 100;
    `
  );

  return {
    developers: companies
      .filter((c) => c.developer)
      .map((c) => ({
        id: c.company.id,
        name: c.company.name,
        slug: c.company.slug,
      })),

    publishers: companies
      .filter((c) => c.publisher)
      .map((c) => ({
        id: c.company.id,
        name: c.company.name,
        slug: c.company.slug,
      })),
  };
}


export async function getIGDBCompanyDetails(
  companyId: number
) {
  const companies = await igdbRequest<IGDBCompany[]>(
    "companies",
    `
      fields
        id,
        name,
        slug,
        description,
        country,
        logo.image_id,
        developed.id,
        developed.name,
        developed.slug,
        published.id,
        published.name,
        published.slug;

      where id = ${companyId};
      limit 1;
    `
  );

  if (!companies.length) {
    throw new Error(`IGDB company not found: ${companyId}`);
  }

  const company = companies[0];

  return {
    ...company,

    logo: company.logo?.image_id
      ? getIGDBImage(company.logo.image_id, "t_logo_med")
      : undefined,
  };
}
