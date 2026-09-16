import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Game from "@/models/game";
import Review from "@/models/review";
import User from "@/models/User";
import ReviewReaction from "@/models/reviewReaction";
import { getToken } from "next-auth/jwt";
import { getRawgGameDetails, getRawgGameDLC } from "@/lib/rawg";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();

    const { slug } = await params;

    const [gameResult, token] = await Promise.all([
      Game.findOne({ slug }).lean(),
      getToken({ req }),
    ]);

    if (!gameResult) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    let game = gameResult;

    const userPromise =
      token?.userId && token?.provider && token?.providerId
        ? User.findOne({
            provider: token.provider as "google" | "github",
            providerId: token.providerId,
          }).lean()
        : Promise.resolve(null);

    const reviewsPromise = Review.find({
      gameId: game._id,
    })
      .populate({
        path: "userId",
        model: User,
        select: "name avatar",
      })
      .sort({ createdAt: -1 })
      .lean();

    const [user, reviews] = await Promise.all([
      userPromise,
      reviewsPromise,
    ]);

    let isPremium = false;

    if (user) {
      const expiresAt = user.subscription?.expiresAt;

      isPremium =
        user.subscription?.isPremium === true &&
        !!expiresAt &&
        expiresAt > new Date();
    }

    if (isPremium && !game.rawgDetails) {
      try {
        const [details, dlc] = await Promise.all([
          getRawgGameDetails(game.rawgId),
          getRawgGameDLC(game.rawgId),
        ]);

        const rawgDetails = {
          developers:
            details.developers?.map((developer: any) => ({
              id: developer.id,
              name: developer.name,
              slug: developer.slug,
            })) ?? [],

          publishers:
            details.publishers?.map((publisher: any) => ({
              id: publisher.id,
              name: publisher.name,
              slug: publisher.slug,
            })) ?? [],

          stores:
            details.stores?.map((store: any) => ({
              id: store.store?.id,
              name: store.store?.name,
              slug: store.store?.slug,
              url: store.url,
            })) ?? [],

          dlc:
            dlc?.map((item: any) => ({
              id: item.id,
              name: item.name,
              slug: item.slug,
              released: item.released
                ? new Date(item.released)
                : undefined,
              image: item.background_image,
            })) ?? [],
        };

        await Game.findByIdAndUpdate(game._id, {
          $set: {
            rawgDetails,
          },
        });

        game = {
          ...game,
          rawgDetails,
        };
      } catch (rawgError) {
        console.error("RAWG details fetch failed:", rawgError);
      }
    }

    const reviewIds = reviews.map((review) => review._id);

    const userId = token?.userId || null;

    const reactionCountsPromise =
      reviewIds.length > 0
        ? ReviewReaction.aggregate([
            {
              $match: {
                reviewId: {
                  $in: reviewIds,
                },
              },
            },
            {
              $group: {
                _id: {
                  reviewId: "$reviewId",
                  type: "$type",
                },
                count: {
                  $sum: 1,
                },
              },
            },
          ])
        : Promise.resolve([]);

    const myReactionsPromise =
      userId && reviewIds.length > 0
        ? ReviewReaction.find({
            userId,
            reviewId: {
              $in: reviewIds,
            },
          }).select("reviewId type")
        : Promise.resolve([]);

    const [reactionCounts, mine] = await Promise.all([
      reactionCountsPromise,
      myReactionsPromise,
    ]);

    const countMap: Record<
      string,
      {
        likes: number;
        dislikes: number;
      }
    > = {};

    for (const reaction of reactionCounts) {
      const id = reaction._id.reviewId.toString();

      if (!countMap[id]) {
        countMap[id] = {
          likes: 0,
          dislikes: 0,
        };
      }

      if (reaction._id.type === "like") {
        countMap[id].likes = reaction.count;
      }

      if (reaction._id.type === "dislike") {
        countMap[id].dislikes = reaction.count;
      }
    }

    const myReactions: Record<
      string,
      "like" | "dislike"
    > = {};

    for (const reaction of mine) {
      myReactions[reaction.reviewId.toString()] =
        reaction.type;
    }

    const enrichedReviews = reviews.map((review) => {
      const id = review._id.toString();

      return {
        ...review,
        likes: countMap[id]?.likes || 0,
        dislikes: countMap[id]?.dislikes || 0,
        reaction: myReactions[id] || null,
      };
    });

    return NextResponse.json({
      game,
      reviews: enrichedReviews,
    });
  } catch (error) {
    console.error("Game detail error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}