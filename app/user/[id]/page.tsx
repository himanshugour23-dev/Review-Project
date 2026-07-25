"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Game {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
}

interface Review {
  _id: string;
  gameId: Game;
}

interface User {
  name: string;
  avatar?: string;
  bio?: string;
  favoriteGames: Game[];
}

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const favRef = useRef<HTMLDivElement | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/user/${id}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setReviews(data.reviews);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    dir: "left" | "right"
  ) => {
    if (!ref.current) return;

    const card =
      ref.current.querySelector<HTMLElement>(".scroll-card");

    if (!card) return;

    ref.current.scrollBy({
      left:
        dir === "left"
          ? -(card.offsetWidth + 16)
          : card.offsetWidth + 16,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading profile...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Profile not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      <section className="relative overflow-hidden border-b border-white/10">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,.18),transparent_55%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pt-28 pb-16 text-center">

          <div className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-white/10 shadow-2xl">

            <Image
              src={user.avatar || "/avatar-placeholder.png"}
              alt={user.name}
              fill
              className="object-cover"
            />

          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight">
            {user.name}
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400 leading-7">
            {user.bio || "No bio provided."}
          </p>

          <div className="mt-8 flex gap-10 text-center">

            <div>
              <p className="text-3xl font-bold">
                {user.favoriteGames.length}
              </p>

              <p className="text-sm text-gray-500">
                Favorites
              </p>
            </div>

            <div>
              <p className="text-3xl font-bold">
                {reviews.length}
              </p>

              <p className="text-sm text-gray-500">
                Reviews
              </p>
            </div>

          </div>

        </div>

      </section>

      <main className="mx-auto max-w-7xl px-5 py-12">
              {user.favoriteGames.length > 0 && (
        <section className="mb-16">

          <div className="mb-8 flex items-center justify-between">

            <div>
              <h2 className="text-3xl font-bold">
                Favorite Games
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Games this user loves the most.
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => scroll(favRef, "left")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => scroll(favRef, "right")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
              >
                <ChevronRight size={18} />
              </button>

            </div>

          </div>

          <div
            ref={favRef}
            className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
          >
            {user.favoriteGames.map((game) => (
              <Link
                key={game._id}
                href={`/game/${game.slug}`}
                className="group scroll-card min-w-[200px]"
              >

                <div className="relative overflow-hidden rounded-xl bg-zinc-900 shadow-2xl ring-1 ring-white/5 transition-all duration-300 group-hover:-translate-y-2 group-hover:ring-blue-500/40">

                  <div className="relative aspect-[2/3]">

                    <Image
                      src={game.coverImage}
                      alt={game.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">

                    <h3 className="truncate text-sm font-semibold">
                      {game.name}
                    </h3>

                  </div>

                </div>

              </Link>
            ))}
          </div>

        </section>
      )}

      {reviews.length > 0 && (

        <section>

          <div className="mb-8 flex items-center justify-between">

            <div>

              <h2 className="text-3xl font-bold">
                Recent Reviews
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest reviews written by {user.name}.
              </p>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() => scroll(reviewRef, "left")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => scroll(reviewRef, "right")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
              >
                <ChevronRight size={18} />
              </button>

            </div>

          </div>

          <div
            ref={reviewRef}
            className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
          >
                        {reviews.map((review) => (
              <Link
                key={review._id}
                href={`/game/${review.gameId.slug}`}
                className="group scroll-card min-w-[200px]"
              >

                <div className="relative overflow-hidden rounded-xl bg-zinc-900 shadow-2xl ring-1 ring-white/5 transition-all duration-300 group-hover:-translate-y-2 group-hover:ring-blue-500/40">

                  <div className="relative aspect-[2/3]">

                    <Image
                      src={review.gameId.coverImage}
                      alt={review.gameId.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">

                    <span className="inline-flex rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-300">
                      Review
                    </span>

                    <h3 className="mt-2 truncate text-sm font-semibold">
                      {review.gameId.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      View review →
                    </p>

                  </div>

                </div>

              </Link>
            ))}
          </div>

        </section>
      )}

      {user.favoriteGames.length === 0 && reviews.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-20 text-center">

          <h2 className="text-2xl font-semibold">
            Nothing here yet
          </h2>

          <p className="mt-3 text-gray-400">
            This user hasn't added favorite games or written any reviews.
          </p>

        </div>
      )}

      </main>

    </div>
  );
}