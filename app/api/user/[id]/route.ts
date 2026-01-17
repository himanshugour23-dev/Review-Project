import { NextResponse,NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Review from "@/models/review";
import Game from "@/models/game";
import mongoose from "mongoose";

export async function GET(
  req:  NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(id)
      .select("name avatar bio socials favoriteGames")
      .populate({
        path: "favoriteGames",
        model: Game,
        select: "name slug coverImage",
      })
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const reviews = await Review.find({ userId: id })
      .populate({
        path: "gameId",
        model: Game,
        select: "name slug coverImage",
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ user, reviews });

  } catch (error) {
    console.error("Public profile error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
