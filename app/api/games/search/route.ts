import { searchRawgGames } from "@/lib/rawg";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Game from "@/models/game";

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

    const THIRTY_DAYS = 30*24*60*60*1000;
    

    const existingGames = await Game.find({
      name: { $regex: query, $options: "i" },
    })
      .limit(10)
      .lean();

      const isFresh =
      existingGames.length > 0 &&
      existingGames.every(
        (game) =>
          game.lastFetched &&
          Date.now() - new Date(game.lastFetched).getTime() < THIRTY_DAYS
      );

    if (isFresh) {
      return NextResponse.json(existingGames);
    }
    

    const rawgGames = await searchRawgGames(query);

 

   
    const cleanedGames = rawgGames
        .filter((g: any) => g.background_image)
        .sort((a: any, b: any) => b.rating - a.rating)  
        .slice(0, 10)

      .map((game: any) => ({
        rawgId: game.id,
        slug: game.slug,
        name: game.name,
        coverImage: game.background_image,
        released: new Date(game.released),
        genres: game.genres?.map((g: any) => g.name),
        rawgRating: game.rating ?? 0,
        metacritic: game.metacritic ?? 0,
        playtime: game.playtime ?? 0,
        platforms: game.platforms?.map((p: any) => p.platform.name),
      }));

  
   await Game.bulkWrite(
    cleanedGames.map((game: any) => ({
      updateOne: {
        filter: { rawgId: game.rawgId },
        update: {
          $set: { lastFetched: new Date() },
          $setOnInsert: game,
        },
        upsert: true,
      },
    }))
  );


    
    const savedGames = await Game.find({
      rawgId: { $in: cleanedGames.map((g: any) => g.rawgId) },
    })
    .sort({ rawgRating: -1 })
    .lean();

    return NextResponse.json(savedGames);
  } catch (error) {
   
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
