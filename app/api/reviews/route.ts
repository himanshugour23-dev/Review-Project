import Game from "@/models/game";
import Review from "@/models/review";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse ,NextRequest } from "next/server";
export async function POST(req:NextRequest){

    try {
                 const token = await getToken({ req });

         if(!token?.providerId || !token?.provider) return NextResponse.json({error:"Unauthorized"}, {status: 401});
         
         await connectToDatabase () ;   

         const user = await User.findOne({
             provider: token.provider,
             providerId: token.providerId,
         })

         if(!user) return NextResponse.json("Unauthorized", {status: 401});

         const {gameId,rating,reviewText} = await req.json()  ; 

         if(!gameId || !rating) return NextResponse.json("ratings is required", {status: 400});

         const game = await Game.findById(gameId);

         if(!game) return NextResponse.json("Game not found", {status: 404});
        
         const normalized = rating * 2;

        if (!Number.isInteger(normalized) || normalized < 1 || normalized > 10) {
        return NextResponse.json(
            { error: "Rating must be between 0.5 and 5 in steps of 0.5" },
            { status: 400 }
        );
        }


         const gameObjectId = new mongoose.Types.ObjectId(gameId);

         await Review.findOneAndUpdate(
            {userId: user._id,
            gameId: gameObjectId
              },
            {
                rating,
                reviewText : reviewText ?.trim()??null 
            },
            {
                upsert : true , 
                new : true ,
                runValidators : true
            }
         )

         console.log("review taken or updated successfully") ;
         
        const stats = await Review.aggregate([
            { $match: { gameId: gameObjectId } },
            {
                $group: {
                _id: "$gameId",
                averageRating: { $avg: "$rating" },
                reviewCount: { $sum: 1 }
                }
            }
            ]);

         await Game.findOneAndUpdate({
            _id : gameObjectId,    
         },
        {
            averageRating :  stats[0]?.averageRating ?? 0,
            reviewCount :  stats[0]?.reviewCount ??  0
        })

    return NextResponse.json({success : true})
    }   catch (error) {
          console.error("Review API error:", error);
         return NextResponse.json(
          { error: "Something went wrong" },
         { status: 500 }
    );
  }
}