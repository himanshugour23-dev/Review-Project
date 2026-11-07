import { searchIGDBGames } from "@/lib/igdb";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Game from "@/models/igdbGames";
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();
    if (!query) {
      return NextResponse.json(
        { error: "No query provided" },
        { status: 400 }
      );
    }
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    // Escape regex special characters for MongoDB search.
    // Done By GPT 
    const escapedQuery = query.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const existingGames = await Game.find({
      name: { $regex: escapedQuery, $options: "i" },
    })
      .sort({ igdbRating: -1 })
      .limit(10)
      .lean();

    // 2. Check whether cached results are fresh.
    const isFresh = existingGames.length > 0 && existingGames.every(
        (game) =>
          game.lastFetched &&
          Date.now() -
            new Date(game.lastFetched).getTime() <
            THIRTY_DAYS
      );

    if (isFresh) {
      return NextResponse.json(existingGames);
    }

    const igdbGames = await searchIGDBGames(query);

    const cleanedGames = igdbGames
      .filter((game: any) => game.coverImage).sort( (a: any, b: any) =>
          (b.igdbRating ?? 0) - (a.igdbRating ?? 0)
      )
      .slice(0, 10);

    if (cleanedGames.length > 0) {
      await Game.bulkWrite(
        cleanedGames.map((game: any) => ({
          updateOne: {
            filter: { igdbId: game.igdbId },

            update: {
              $set: {
                ...game,
                lastFetched: new Date(),
              },
            },
            upsert: true,
          },
        }))
      );
    }

    const savedGames = await Game.find({
      igdbId: {
        $in: cleanedGames.map((game: any) => game.igdbId),
      },
    })
      .sort({ igdbRating: -1 })
      .lean();

    return NextResponse.json(savedGames);

  } catch (error) {
    console.error(
      "Error in GET /api/games/search:",
      error
    );

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
