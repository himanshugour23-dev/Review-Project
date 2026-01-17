import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import Game from "@/models/game";
import Review from "@/models/review";
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.userId || !mongoose.Types.ObjectId.isValid(token.userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const userId = new mongoose.Types.ObjectId(token.userId);

    const user = await User.findById(userId)
      .select("name avatar bio favoriteGames")
      .populate({
        path: "favoriteGames",
        model: Game,
        select: "name slug coverImage",
      })
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const review = await Review.find({ userId })
      .populate({
        path: "gameId",
        model: Game,
        select: "name slug coverImage",
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ user, review });
  } catch (error) {
    console.log("My profile Error", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}


export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.userId || !mongoose.Types.ObjectId.isValid(token.userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bio } = await req.json();

    await connectToDatabase();

    const userId = new mongoose.Types.ObjectId(token.userId);

    const user = await User.findByIdAndUpdate(
      userId,
      { ...(bio !== undefined && { bio }) },
      { new: true }
    ).select("bio");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      bio: user.bio,
    });
  } catch (error) {
    console.log("Update profile error", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
