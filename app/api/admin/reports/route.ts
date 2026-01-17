import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/db";
import Report from "@/models/report";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.userId || token.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const reports = await Report.find({ status: "pending" })
      .populate("reporterId", "name username")
      .populate({
        path: "reviewId",
        select: "reviewText  userId ",
        populate: {
          path: "userId",
          select: "name username",
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(reports, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
