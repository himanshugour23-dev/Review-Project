import {
  getRawgGameDevelopmentTeam,
  getRawgCreatorDetails,
} from "@/lib/rawg";


export interface GameCreator {
  id: number;
  name: string;
  slug: string;
  image?: string;
  image_background?: string;
  description?: string;
  games_count?: number;
  reviews_count?: number;
  rating?: number;
  rating_top?: number;
  ratings_count?: number;
  positions?: {
    id: number;
    name: string;
    slug: string;
  }[];
}

export async function getGameCreators(
  rawgId: number
): Promise<GameCreator[]> {

  const developmentTeam =
    await getRawgGameDevelopmentTeam(rawgId);


  if (!developmentTeam.length) {
    return [];
  }

  const creators = await Promise.all(
    developmentTeam.map(async (creator: any) => {

      try {
        const details =
          await getRawgCreatorDetails(creator.id);

        return {
          ...creator,
          ...details,
        };

      } catch (error) {

        console.error(
          `Failed to fetch creator ${creator.id}:`,
          error
        );
        return creator;
      }
    })
  );


  return creators;
}