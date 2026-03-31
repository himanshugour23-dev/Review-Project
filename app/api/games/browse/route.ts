import { connectToDatabase } from "@/lib/db";
import Game from "@/models/game";
import { NextResponse } from "next/server";
import { platform } from "os";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 20, 1),
      50
    );
    const skip = (page - 1) * limit;

    // Fetch paginated games with popularity ranking
    const [games, total] = await Promise.all([
      Game.aggregate([
        {
          $addFields: {
            priority: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$metacritic", 50] },
                    { $gte: ["$rawgRating", 3] },
                    { $gte: ["$averageRating", 4] },
                  ],
                },
                1, 
                0, 
              ],
            },
          },
        },

     
        {
          $sort: {
            priority: -1,
            averageRating: -1,
            metacritic: -1,
            rawgRating: -1,
            released: -1,
          },
        },

        { $skip: skip },
        { $limit: limit },

        {
          $project: {
            name: 1,
            slug: 1,
            coverImage: 1,
            metacritic: 1,
            averageRating: 1,
            rawgRating: 1,
            released: 1,
            platform : 1
          },
        },
      ]).allowDiskUse(true),
      Game.countDocuments(),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      games,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
