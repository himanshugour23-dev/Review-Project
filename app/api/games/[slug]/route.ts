import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import IGDBGame from "@/models/igdbGames";
import Review from "@/models/review";
import User from "@/models/User";
import ReviewReaction from "@/models/reviewReaction";
import { getToken } from "next-auth/jwt";
import {
  getIGDBGameDetails,
  getIGDBGameDLC,
} from "@/lib/igdb";

export async function GET(req: NextRequest,{ params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const [gameResult, token] = await Promise.all([
      IGDBGame.findOne({ slug }).lean(),
      getToken({ req }),
    ]);
    if (!gameResult) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }
    let game: any = gameResult;
    const userPromise = token?.userId && token?.provider && token?.providerId ? User.findOne({
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

    const expiresAt = user?.subscription?.expiresAt;

    const isPremium = user?.subscription?.isPremium === true &&!!expiresAt && new Date(expiresAt) > new Date();

    const needsRefresh = !game.detailsFetched;

    if (needsRefresh) {
      const [detailsResult, dlcResult] = await Promise.allSettled([
        getIGDBGameDetails(game.igdbId),
        getIGDBGameDLC(game.igdbId),
      ]);

      const update: Record<string, any> = {};

      if ( detailsResult.status === "fulfilled" && detailsResult.value) {
        const details = detailsResult.value;
        update.summary = details.summary ?? game.summary;
        update.storyline = details.storyline ?? game.storyline;
        update.totalRating =details.totalRating ?? game.totalRating;
        update.totalRatingCount =details.totalRatingCount ?? game.totalRatingCount;

        update.igdbRating =details.igdbRating ?? game.igdbRating;

        update.igdbRatingCount =details.igdbRatingCount ?? game.igdbRatingCount;
        update.metacritic =details.metacritic ?? game.metacritic;
        update.aggregatedRatingCount =details.aggregatedRatingCount ??game.aggregatedRatingCount;
        update.hypes = details.hypes ?? game.hypes;
        update.category = details.category ?? game.category;
        update.parentGameId =details.parentGameId ?? game.parentGameId;
        update.genres = details.genres ?? game.genres;
        update.platforms = details.platforms ?? game.platforms;
        update.themes = details.themes ?? game.themes;
        update.gameModes = details.gameModes ?? game.gameModes;
        update.playerPerspectives =
          details.playerPerspectives ?? game.playerPerspectives;
        update.keywords = details.keywords ?? game.keywords;
        update.franchises = details.franchises ?? game.franchises;
        update.screenshots = details.screenshots?.length
          ? details.screenshots
          : game.screenshots ?? [];

        update.videos = details.videos?.length
          ? details.videos
          : game.videos ?? [];

        update.similarGames = details.similarGames?.length
          ? details.similarGames
          : game.similarGames ?? [];
        update.artworks = details.artworks?.length? details.artworks: game.artworks ?? [];

        // Developers and publishers are stored for premium users.
        update.igdbDetails = {...game.igdbDetails,developers:
            details.igdbDetails?.developers ??
            game.igdbDetails?.developers ??
            [],
          publishers:
            details.igdbDetails?.publishers ??
            game.igdbDetails?.publishers ??
            [],

          websites:
            details.igdbDetails?.websites ??
            game.igdbDetails?.websites ??
            [],

          dlc: game.igdbDetails?.dlc ?? [],
        };
        update.detailsFetched = true;
      }

      if (dlcResult.status === "fulfilled" && dlcResult.value) {
        update.igdbDetails = {
          ...game.igdbDetails,
          ...update.igdbDetails,
          dlc: dlcResult.value,
        };
      }

      if (detailsResult.status === "fulfilled" || dlcResult.status === "fulfilled") {
        update.lastFetched = new Date();
        await IGDBGame.findByIdAndUpdate(
          game._id,
          { $set: update }
        );
        game = {
          ...game,
          ...update,
        };
      }

      if (detailsResult.status === "rejected") {
        console.error(
          "IGDB game details fetch failed:",
          detailsResult.reason
        );
      }

      if (dlcResult.status === "rejected") {
        console.error(
          "IGDB DLC fetch failed:",
          dlcResult.reason
        );
      }
    }

    const reviewIds = reviews.map(
      (review: any) => review._id
    );
    const userId = token?.userId || null;
    const reactionCountsPromise =
      reviewIds.length > 0
        ? ReviewReaction.aggregate([
            {
              $match: {
                reviewId: { $in: reviewIds },
              },
            },
            {
              $group: {
                _id: {
                  reviewId: "$reviewId",
                  type: "$type",
                },
                count: { $sum: 1 },
              },
            },
          ])
        : Promise.resolve([]);


    const myReactionsPromise =
      userId && reviewIds.length > 0
        ? ReviewReaction.find({
            userId,
            reviewId: { $in: reviewIds },
          }).select("reviewId type")
        : Promise.resolve([]);

    const [reactionCounts, mine] = await Promise.all([
      reactionCountsPromise,
      myReactionsPromise,
    ]);

    // Build reaction count map.
    const countMap: Record<
      string,
      { likes: number; dislikes: number }
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

    // Build current user's reaction map.
    const myReactions: Record<
      string,
      "like" | "dislike"
    > = {};

    for (const reaction of mine) {
      myReactions[reaction.reviewId.toString()] =
        reaction.type;
    }

    // Enrich reviews.
    const enrichedReviews = reviews.map((review: any) => {
      const id = review._id.toString();

      return {
        ...review,
        likes: countMap[id]?.likes || 0,
        dislikes: countMap[id]?.dislikes || 0,
        reaction: myReactions[id] || null,
      };
    });

    // Remove premium-only fields for free users.
    const responseGame = {
      ...game,
      igdbDetails: game.igdbDetails
        ? { ...game.igdbDetails }
        : game.igdbDetails,
    };

    if (!isPremium) {
      delete responseGame.artworks;
      if (responseGame.igdbDetails) {
        delete responseGame.igdbDetails.developers;
        delete responseGame.igdbDetails.publishers;
      }
    }

    return NextResponse.json({
      game: responseGame,
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