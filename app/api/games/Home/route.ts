import { connectToDatabase } from "@/lib/db";
import igdbGames from "@/models/igdbGames";
import { NextResponse } from "next/server";
export const revalidate = 3600;
export async function GET() {
  try {
    await connectToDatabase();
    const FEATURED_SLUGS = [
      "grand-theft-auto-vi",
      "crimson-desert-enhanced--1",
      "dark-souls-iii",
      "the-last-of-us-part-ii",
      "elden-ring",
      "the-witcher-3-wild-hunt",
      "shadows-die-twice",
    ];
    const games = await igdbGames.find({ slug: { $in: FEATURED_SLUGS } })
      .select("name slug screenshots")
      .lean()
      .maxTimeMS(3000);
    const gameMap = new Map(games.map(g => [g.slug, g]));
    const ordered = FEATURED_SLUGS
      .map(slug => {
        const game = gameMap.get(slug);
        if (!game) return null;
        return {
          name: game.name,
          slug: game.slug,
          coverImage: game.screenshots?.[0] || null,
        };
      })
      .filter(Boolean);
    if (ordered.length !== FEATURED_SLUGS.length) {
      console.warn("Some featured slugs missing in DB");
    }
    return NextResponse.json({ recommended: ordered });
  } catch (error) {
    console.error("Featured games API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}