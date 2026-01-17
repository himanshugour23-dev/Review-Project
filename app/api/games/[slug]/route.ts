import { NextResponse , NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Game from "@/models/game";
import Review from "@/models/review";
import User from "@/models/User";
import ReviewReaction from "@/models/reviewReaction";
import { getToken } from "next-auth/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();

    const { slug } = await params;

 
    const game = await Game.findOne({ slug }).lean();

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

 
    const reviews = await Review.find({ gameId: game._id })
      .populate({
        path: "userId",
        model: User,
        select: "name avatar",
      })
      .sort({ createdAt: -1 })
      .lean();
 
    
    const token = await getToken({ req });
    const userId = token?.userId || null;
    
    const revieewIds = reviews.map(r =>r._id)
      const reactionCounts = await ReviewReaction.aggregate([
      { $match: { reviewId: { $in: revieewIds } } },
      {
        $group: {
          _id: { reviewId: "$reviewId", type: "$type" },
          count: { $sum: 1 },
        },
      },
    ]);
    const countMap: Record<string, { likes: number; dislikes: number }> = {};

for (const r of reactionCounts) {
  const id = r._id.reviewId.toString();
  if (!countMap[id]) countMap[id] = { likes: 0, dislikes: 0 };

  if (r._id.type === "like") countMap[id].likes = r.count;
  if (r._id.type === "dislike") countMap[id].dislikes = r.count;
}
let myReactions: Record<string, "like" | "dislike"> = {};

if (userId) {
  const mine = await ReviewReaction.find({
    userId,
    reviewId: { $in: revieewIds },
  }).select("reviewId type");

  for (const r of mine) {
    myReactions[r.reviewId.toString()] = r.type;
  }
}

const enrichedReviews = reviews.map(r => ({
  ...r,
  likes: countMap[r._id.toString()]?.likes || 0,
  dislikes: countMap[r._id.toString()]?.dislikes || 0,
  reaction: myReactions[r._id.toString()] || null,
}));

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
