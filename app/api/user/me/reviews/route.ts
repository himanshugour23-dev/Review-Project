import { NextResponse , NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/db";
import Game from "@/models/game";
import Review from "@/models/review";

export async function GET(req:NextRequest)
{
        try {
              const token =await getToken({req}) ; 
               if (!token?.userId)
                 return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

               await connectToDatabase() ; 

               const reviews = await Review.find({userId : token.userId})
               .populate({path : "gameId", model : Game , select :"name slug coverImage released "})
               .sort({createdAt : -1})
               .lean() ; 
               return NextResponse.json(reviews)
        } catch (error) {
            console.log("My review Error ")
              return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 }
                );
        }
}