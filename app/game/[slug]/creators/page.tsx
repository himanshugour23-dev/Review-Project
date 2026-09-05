"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
interface Creator {
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


interface CreatorResponse {

  game: {
    name: string;
    slug: string;
    rawgId: number;
  };

  creators: Creator[];

  isPremium: boolean;
}


export default function CreatorsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const [data, setData] =
    useState<CreatorResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // Tracks which creators' descriptions are expanded, by id
  const [expanded, setExpanded] =
    useState<Record<number, boolean>>({});


  useEffect(() => {

    async function loadCreators() {

      try {
        const { slug } = await params;
        const res = await fetch(
          `/api/games/${slug}/creators`
        );


        const result =
          await res.json();
        if (!res.ok) {
          throw new Error(
            result.message ||
            "Failed to load creators"
          );
        }
        setData(result);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );

      } finally {

        setLoading(false);

      }

    }


    loadCreators();

  }, [params]);


  function toggleExpanded(id: number) {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  if (loading) {

    return (
      <main className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <div className="text-2xl font-semibold">
            Loading creators...
          </div>

          <p className="text-gray-400 mt-2">
            Fetching the development team
          </p>

        </div>

      </main>
    );
  }

  if (error) {

    return (
      <main className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <p className="text-red-500 mb-4">
            {error}
          </p>

          <Link
            href="/"
            className="underline"
          >
            Go back
          </Link>

        </div>

      </main>
    );
  }


  if (!data) {
    return null;
  }

  return (

    <main className="min-h-screen px-6 py-10">

      <div className="max-w-6xl mx-auto">

        <Link
          href={`/game/${data.game.slug}`}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back to {data.game.name}
        </Link>


        <div className="mt-8 mb-10">

          <p className="text-sm text-gray-500 uppercase tracking-wider">
            Development Team
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Creators of {data.game.name}
          </h1>

          <p className="text-gray-400 mt-3">
            Meet the people behind the development
            of this game.
          </p>

        </div>


        {data.creators.length === 0 ? (

          <div className="py-20 text-center">

            <p className="text-gray-400">
              No development team information
              is available for this game.
            </p>

          </div>

        ) : (



          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


            {data.creators.map((creator) => {

              const isExpanded = !!expanded[creator.id];

              return (

              <article
                key={creator.id}
                className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900"
              >


                <div className="relative h-32">

                  {creator.image_background ? (

                    <img
                      src={creator.image_background}
                      alt=""
                      className="w-full h-full object-cover opacity-40"
                    />

                  ) : (

                    <div className="w-full h-full bg-gray-800" />

                  )}

                  <div className="absolute left-6 -bottom-14 z-10">

                    {creator.image ? (

                      <img
                        src={creator.image}
                        alt={creator.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-gray-900 bg-gray-900"
                      />

                    ) : (

                      <div className="w-28 h-28 rounded-full bg-gray-800 border-4 border-gray-900 flex items-center justify-center">

                        <span className="text-gray-500">
                          ?
                        </span>

                      </div>

                    )}

                  </div>

                </div>


            
                <div className="px-6 pb-6 pt-16">


                
                  <h2 className="text-2xl font-bold">
                    {creator.name}
                  </h2>

                  {creator.positions &&
                    creator.positions.length > 0 && (

                    <div className="flex flex-wrap gap-2 mt-3">

                      {creator.positions.map(
                        (position) => (

                          <span
                            key={position.id}
                            className="px-3 py-1 rounded-full text-xs bg-gray-800 text-gray-300"
                          >
                            {position.name}
                          </span>

                        )
                      )}

                    </div>

                  )}

                  <div className="grid grid-cols-3 gap-3 mt-6">


                    {creator.games_count !== undefined && (

                      <div className="rounded-lg bg-gray-800 p-3">

                        <p className="text-xl font-semibold">
                          {creator.games_count}
                        </p>

                        <p className="text-xs text-gray-400">
                          Games
                        </p>

                      </div>

                    )}


                    {creator.rating !== undefined && (

                      <div className="rounded-lg bg-gray-800 p-3">

                        <p className="text-xl font-semibold">
                          {creator.rating}
                        </p>

                        <p className="text-xs text-gray-400">
                          Rating
                        </p>

                      </div>

                    )}


                    {creator.reviews_count !== undefined && (

                      <div className="rounded-lg bg-gray-800 p-3">

                        <p className="text-xl font-semibold">
                          {creator.reviews_count}
                        </p>

                        <p className="text-xs text-gray-400">
                          Reviews
                        </p>

                      </div>

                    )}

                  </div>

                  {creator.description && (

                    <div className="mt-6">

                      <h3 className="font-semibold mb-2">
                        About
                      </h3>

                      <div
                        className={
                          isExpanded
                            ? "text-sm text-gray-400 leading-6"
                            : "text-sm text-gray-400 leading-6 line-clamp-6"
                        }
                        dangerouslySetInnerHTML={{
                          __html:
                            creator.description,
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => toggleExpanded(creator.id)}
                        className="mt-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>

                    </div>

                  )}


                </div>

              </article>

              );

            })}

          </div>

        )}

      </div>

    </main>
  );
}