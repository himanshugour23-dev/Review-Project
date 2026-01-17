import { connectToDatabase } from "@/lib/db";
import Game from "@/models/game";
import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour

export async function GET() {
  try {
    await connectToDatabase();

    const FEATURED_SLUGS = [
      "dark-souls-iii",
      "the-last-of-us-part-2",
      "elden-ring",
      "the-witcher-3-wild-hunt",
      "shadows-die-twice",
    ];

    const games = await Game.find({ slug: { $in: FEATURED_SLUGS } })
      .select("name slug coverImage ")
      .lean()
      .maxTimeMS(3000);

    const gameMap = new Map(games.map(g => [g.slug, g]));
    const ordered = FEATURED_SLUGS
      .map(slug => gameMap.get(slug))
      .filter(Boolean);

    if (ordered.length !== FEATURED_SLUGS.length) {
      console.warn("Some featured slugs missing in DB");
    }

    return NextResponse.json({ recommended: ordered });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
