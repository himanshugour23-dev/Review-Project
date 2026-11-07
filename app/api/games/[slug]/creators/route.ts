
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { connectToDatabase } from "@/lib/db";
import IGDBGame from "@/models/igdbGames";
import User from "@/models/User";

import {
  getIGDBGameDevelopmentTeam,
  getIGDBCompanyDetails,
} from "@/lib/igdb";

type Company = {
  id: number;
  name: string;
  slug?: string;
};

type DevelopmentTeam = {
  developers: Company[];
  publishers: Company[];
};

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{ slug: string }>;
  }
) {
  try {
    await connectToDatabase();

    const { slug } = await context.params;


    const game = await IGDBGame.findOne({ slug })
      .select(
        "igdbId name slug artworks igdbDetails.developers igdbDetails.publishers"
      )
      .lean();

    if (!game) {
      return NextResponse.json(
        { message: "Game not found" },
        { status: 404 }
      );
    }

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.provider || !token?.providerId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const provider = token.provider as "google" | "github";
    if (provider !== "google" && provider !== "github") {
      return NextResponse.json(
        { message: "Unsupported authentication provider" },
        { status: 401 }
      );
    }

    const user = await User.findOne({
      provider,
      providerId: token.providerId,
    })
      .select("subscription")
      .lean();

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const isPremium =
      user.subscription?.isPremium === true &&
      !!user.subscription?.expiresAt &&
      new Date(user.subscription.expiresAt).getTime() > Date.now();
    if (!isPremium) {
      return NextResponse.json(
        {
          message: "Premium subscription required",
          isPremium: false,
        },
        { status: 403 }
      );
    }

    let developmentTeam: DevelopmentTeam = {
      developers: game.igdbDetails?.developers ?? [],
      publishers: game.igdbDetails?.publishers ?? [],
    };

    if (
      developmentTeam.developers.length === 0 &&
      developmentTeam.publishers.length === 0
    ) {
      developmentTeam = await getIGDBGameDevelopmentTeam(
        game.igdbId
      );
    }

    const developers = developmentTeam.developers ?? [];
    const publishers = developmentTeam.publishers ?? [];

    // Remove duplicate companies if a company is both developer and publisher.
    const uniqueCompanies = Array.from(
      new Map(
        [...developers, ...publishers].map((company) => [
          company.id,
          company,
        ])
      ).values()
    );


    const companyResults = await Promise.allSettled(
      uniqueCompanies.map((company) =>
        getIGDBCompanyDetails(company.id)
      )
    );

    const companyDetails: NonNullable<
      Awaited<ReturnType<typeof getIGDBCompanyDetails>>
    >[] = [];

    for (const result of companyResults) {
      if (result.status === "fulfilled" && result.value) {
        companyDetails.push(result.value);
      } else if (result.status === "rejected") {
        console.error(
          "Failed to fetch IGDB company details:",
          result.reason
        );
      }
    }

    // Artworks in your current MongoDB schema are complete URL strings.
    // Keep them as strings; the frontend supports strings and object formats.
    const artworks = Array.isArray(game.artworks)
      ? game.artworks.filter(
          (artwork): artwork is string =>
            typeof artwork === "string" && artwork.length > 0
        )
      : [];

    return NextResponse.json(
      {
        game: {
          name: game.name,
          slug: game.slug,
          igdbId: game.igdbId,
        },

        creators: {
          developers,
          publishers,
        },

        companyDetails,
        artworks,
        isPremium: true,
      },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Premium creators API error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch premium game information",
      },
      { status: 500 }
    );
  }
}
