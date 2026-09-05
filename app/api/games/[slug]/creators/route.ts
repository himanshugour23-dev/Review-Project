import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import {connectToDatabase} from "@/lib/db";
import Game from "@/models/game";
import User from "@/models/User";

import { getGameCreators } from "@/lib/creators";


export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{ slug: string }>;
  }
) {

  try {

    await connectToDatabase();

    const { slug } = await context.params;
    const game = await Game
      .findOne({ slug })
      .lean();


    if (!game) {
      return NextResponse.json(
        {
          message: "Game not found",
        },
        {
          status: 404,
        }
      );
    }

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });


    if (!token?.provider || !token?.providerId) {

      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const provider =
      token.provider as "google" | "github";


    const user = await User
      .findOne({
        provider,
        providerId: token.providerId,
      })
      .lean();


    if (!user) {

      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isPremium =
      user.subscription?.isPremium === true &&
      !!user.subscription?.expiresAt &&
      new Date(user.subscription.expiresAt) > new Date();


    if (!isPremium) {

      return NextResponse.json(
        {
          message: "Premium subscription required",
          isPremium: false,
        },
        {
          status: 403,
        }
      );
    }

    const creators =
      await getGameCreators(game.rawgId);

    return NextResponse.json({

      game: {
        name: game.name,
        slug: game.slug,
        rawgId: game.rawgId,
      },
      creators,
      isPremium: true,

    });


  } catch (error) {

    console.error(
      "Creators API error:",
      error
    );


    return NextResponse.json(
      {
        message: "Failed to fetch game creators",
      },
      {
        status: 500,
      }
    );
  }
}