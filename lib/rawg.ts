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
