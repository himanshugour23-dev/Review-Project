
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import IGDBGame from "@/models/igdbGames";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = req.nextUrl;
    const parsePositiveInt = (
      value: string | null,
      fallback: number
    ) => {
      const parsed = Number(value);
      return Number.isSafeInteger(parsed) && parsed > 0
        ? parsed
        : fallback;
    };

    const page = parsePositiveInt(
      searchParams.get("page"),
      1
    );

    const limit = Math.min(
      parsePositiveInt(searchParams.get("limit"), 20),
      50
    );

    const skip = (page - 1) * limit;

    const [games, total] = await Promise.all([
      IGDBGame.aggregate([
        {
          $addFields: {
            priority: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$metacritic", 75] },
                    { $gte: ["$igdbRating", 75] },
                    { $gte: ["$igdbRatingCount", 10] },
                  ],
                },
                1,
                0,
              ],
            },

            communityScore: {
              $cond: [
                { $gt: ["$reviewCount", 0] },
                { $ifNull: ["$averageRating", 0] },
                0,
              ],
            },

            criticScore: {
              $ifNull: ["$metacritic", 0],
            },

            userScore: {
              $ifNull: ["$igdbRating", 0],
            },

            ratingVotes: {
              $ifNull: ["$igdbRatingCount", 0],
            },
          },
        },

        {
          $sort: {
            priority: -1,
            communityScore: -1,
            criticScore: -1,
            userScore: -1,
            ratingVotes: -1,
            released: -1,
            _id: 1,
          },
        },

        { $skip: skip },
        { $limit: limit },

        {
          $project: {
            name: 1,
            slug: 1,
            igdbId: 1,
            coverImage: 1,
            released: 1,
            genres: 1,
            platforms: 1,
            metacritic: 1,
            igdbRating: 1,
            igdbRatingCount: 1,
            totalRating: 1,
            totalRatingCount: 1,
            averageRating: 1,
            reviewCount: 1,
            priority: 1,
          },
        },
      ]),
      IGDBGame.countDocuments(),
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
    console.error("Browse API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch browse games" },
      { status: 500 }
    );
  }
}
