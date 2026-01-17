import { NextResponse,NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import ReviewReaction from "@/models/reviewReaction";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req
    });

    if (!token?.userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { reviewId, type } = await req.json();

    if (
      !mongoose.Types.ObjectId.isValid(reviewId) ||
      !["like", "dislike"].includes(type)
    ) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await ReviewReaction.findOne({
      userId: token.userId,
      reviewId,
    });

 
    if (existing && existing.type === type) {
      await ReviewReaction.deleteOne({ _id: existing._id });
      return NextResponse.json({ status: "removed" });
    }


    if (existing && existing.type !== type) {
      existing.type = type;
      await existing.save();
      return NextResponse.json({ status: "updated" });
    }


    await ReviewReaction.create({
      userId: token.userId,
      reviewId,
      type,
    });

    return NextResponse.json({ status: "created" });
  } catch (error) {
    console.error("Reaction error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req:NextRequest){
      try {
        const { searchParams } = new URL(req.url) ; 
        const reviewId = searchParams.get("reviewId") ;

        if(!reviewId ||!mongoose.Types.ObjectId.isValid(reviewId)){
          return NextResponse.json({error:"Invalid review id"},{status:400})
        }

        await connectToDatabase() ; 

        const count = await ReviewReaction.aggregate([
          { $match : {reviewId : new mongoose.Types.ObjectId(reviewId)}},
          {
            $group : {
              _id : "$type",
              count : {$sum : 1}
            },
          },
        ]) ; 

        let likeCount = 0 ; 
        let dislikeCount = 0 ; 

        for(const c of count){
          if(c._id === "like") likeCount = c.count ; 
          if(c._id === "dislike") dislikeCount = c.count ; 
        }

        const token = await getToken({req})

        let myReaction : "like" | "dislike" | null = null ;

        if(token?.userId){
          const mine = await ReviewReaction.findOne({
             userId : token.userId,
             reviewId ,
          }).lean() ; 

          myReaction = mine?.type || null ;
        }

        return NextResponse.json({
          likeCount,
          dislikeCount,
          myReaction
        })
      } catch (error) {
          
            return NextResponse.json({error:"Something went wrong"},{status:500})
      }
}