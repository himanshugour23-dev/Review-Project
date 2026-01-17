import { NextResponse ,NextRequest} from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/db";
import Report from "@/models/report";
import Review from "@/models/review";
import mongoose from "mongoose";
export async function PATCH(
  req: NextRequest, { params }: { params: Promise<{ id: string }> }){
        try {
            const token = await getToken({ req });
            if (!token?.userId || token.role !== "admin"){
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            await connectToDatabase();

            const { id: reportId } = await params;

            const { action } = await req.json(); 

            if (!["approve", "reject"].includes(action)) {
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
                }
                const report = await Report.findById(reportId);

                if (!report)
                return NextResponse.json({ error: "Report not found" }, { status: 404 });   

                if(report.status !== "pending"){
                    return NextResponse.json(
                        { error: "Report already reviewed" },
                        { status: 400 }
                    );
                }
                if (action === "approve") {
                await Review.findByIdAndDelete(report.reviewId);

                report.status = "approved";
                }

                if (action === "reject") {
                report.status = "rejected";
                }
            
                report.reviewedBy = new mongoose.Types.ObjectId(token.userId);
                report.reviewedAt = new Date();

                await report.save();

                return NextResponse.json(
                { success: true, status: report.status },
                { status: 200 }
                );


        } catch (error) {
            return NextResponse.json(
                { error: "Failed to process report" },
                { status: 500 }
            );
        }
  }


