const RAWG_BASE_URL = "https://api.rawg.io/api";
const RAWG_API_KEY = process.env.RAWG_API_KEY!;

export async function searchRawgGames(query: string) {
  const url = `${RAWG_BASE_URL}/games?search=${encodeURIComponent(
    query
  )}&key=${RAWG_API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("RAWG API failed");
  }

  const data = await res.json();
  return data.results;
}

export async function getRawgGameDetails(gameId: number) {
  const url = `${RAWG_BASE_URL}/games/${gameId}?key=${RAWG_API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("RAWG API failed");
  }

  return res.json() ;  
}

export async function getRawgGameDLC(rawgId: number) {
  const url = `${RAWG_BASE_URL}/games/${rawgId}/additions?key=${RAWG_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("RAWG API failed");
  }
  const data = await res.json();
  return data.results;
}

export async function getRawgGameDevelopmentTeam(
  rawgId: number | string
) {
  const url =
    `${RAWG_BASE_URL}/games/${rawgId}/development-team` +`?key=${RAWG_API_KEY}&page_size=50`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `RAWG development team fetch failed: ${res.status}`
    );
  }

  const data = await res.json();

  return data.results ?? [];
}


export async function getRawgCreatorDetails(
  creatorId: number | string
) {
  const url =
    `${RAWG_BASE_URL}/creators/${creatorId}` +`?key=${RAWG_API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `RAWG creator details failed: ${res.status}`
    );
  }

  return res.json();
}