import { connectToDatabase } from "@/lib/db";
import Game from "@/models/game";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type") || "critics";

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 15, 1),
      15
    );
    const skip = (page - 1) * limit;

    const AFTER_2010 = new Date("2011-01-01T00:00:00.000Z");

    let filter: any = {};
    let sort: any = {};
    let select = "name slug coverImage metacritic rawgRating";

 
    if (type === "critics") {
      filter = {
        metacritic: { $gte: 75 },
        rawgRating: { $gte: 4 },
        released: { $gte: AFTER_2010 },
      };

      sort = { metacritic: -1, rawgRating: -1 };
    } 
    else if (type === "most-loved") {
      filter = {
        rawgRating: { $gte: 4 },
        released: { $gte: AFTER_2010 },
      };

      sort = { rawgRating: -1 };
    } 
    else {
      return NextResponse.json(
        { error: "Invalid discover type" },
        { status: 400 }
      );
    }

    const [games, total] = await Promise.all([
      Game.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(select)
        .lean(),

      Game.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

  
    return NextResponse.json({
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      games,
    });

  } catch (error) {
    console.error("Discover fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
