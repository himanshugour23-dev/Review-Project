import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import IGDBGame from "@/models/igdbGames";
type DiscoverType = "critics" | "most-loved";
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = req.nextUrl;
    const type = searchParams.get("type") ?? "critics";
    if (type !== "critics" && type !== "most-loved") {
      return NextResponse.json(
        { error: "Invalid discover type" },
        { status: 400 }
      );
    }

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
      parsePositiveInt(searchParams.get("limit"), 18),
      18
    );

    const skip = (page - 1) * limit;

    const AFTER_2010 = new Date(
      "2011-01-01T00:00:00.000Z"
    );

    // Both discover categories focus on games released after 2010.
    const baseFilter = {
      released: { $gte: AFTER_2010 },
    };

    let filter: Record<string, unknown>;
    let sort: Record<string, 1 | -1>;

    if (type === "critics") {
      filter = {
        ...baseFilter,
        metacritic: { $gte: 75 },
        aggregatedRatingCount: { $gte: 3 },
      };

      sort = {
        metacritic: -1,
        aggregatedRatingCount: -1,
        igdbRating: -1,
        _id: 1,
      };
    } else {

      filter = {
        ...baseFilter,
        igdbRating: { $gte: 75 },
        igdbRatingCount: { $gte: 10 },
      };

      sort = {
        igdbRating: -1,
        igdbRatingCount: -1,
        _id: 1,
      };
    }

    const projection = {
      name: 1,
      slug: 1,
      igdbId: 1,

      coverImage: 1,
      released: 1,

      genres: 1,
      platforms: 1,

      metacritic: 1,
      aggregatedRatingCount: 1,

      igdbRating: 1,
      igdbRatingCount: 1,

      totalRating: 1,
      totalRatingCount: 1,

      averageRating: 1,
      reviewCount: 1,
    };

    const [games, total] = await Promise.all([
      IGDBGame.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(projection)
        .lean(),

      IGDBGame.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      type,
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      games,
    });
  } catch (error) {
    console.error("Discover API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch discover games" },
      { status: 500 }
    );
  }
}
