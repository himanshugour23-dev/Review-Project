import {connectToDatabase}  from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextResponse ,NextRequest } from "next/server";
import User from "@/models/User";
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.providerId || !token?.provider) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    await connectToDatabase();
    const provider = token.provider as "google" | "github";

    const user = await User.findOne({
      
      provider: token.provider,
      providerId: token.providerId,
    });
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const isPremium =user.subscription?.isPremium === true && !!user.subscription?.expiresAt && user.subscription.expiresAt > new Date();
    return NextResponse.json(
      { isPremium },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}