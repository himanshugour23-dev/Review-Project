import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/db";
import Report from "@/models/report";
import Review from "@/models/review";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { reviewId, reason } = await req.json();

    if (!reviewId || !reason) {
      return NextResponse.json(
        { error: "Review ID and reason are required" },
        { status: 400 }
      );
    }

   
    const reviewExists = await Review.exists({ _id: reviewId });
    if (!reviewExists) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }


    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await Report.countDocuments({
      reporterId: token.userId,
      createdAt: { $gte: today },
    });

    if (todayCount >= 3) {
      return NextResponse.json(
        { error: "Daily report limit reached" },
        { status: 429 }
      );
    }

    const report = await Report.create({
      reporterId: token.userId,
      reviewId,
      reason,
    });

    return NextResponse.json(report, { status: 201 });

  } catch (err: any) {
  
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "You have already reported this review" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Report failed" },
      { status: 500 }
    );
  }
}
