import { NextResponse , NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Game from "@/models/game";


export async function POST(req: NextRequest) {
  try {

    const token = await getToken({ req });

    if (!token?.userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


    const { gameId } = await req.json();
    if (!mongoose.Types.ObjectId.isValid(gameId))
      return NextResponse.json({ error: "Invalid gameId" }, { status: 400 });

   
    await connectToDatabase();

   
    const exists = await Game.exists({ _id: gameId });
    if (!exists)
      return NextResponse.json({ error: "Game not found" }, { status: 404 });

  
    const result = await User.updateOne(
      { _id: token.userId },
      { $addToSet: { favoriteGames: gameId } }
    );

    if (result.matchedCount === 0)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Add favourite error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
    
  }
}
