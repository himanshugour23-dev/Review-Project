"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Game {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
  metacritic?: number;
  rawgRating?: number;
  averageRating?: number;
}


const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#27272a" offset="20%" />
      <stop stop-color="#3f3f46" offset="50%" />
      <stop stop-color="#27272a" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#27272a" />
  <rect width="${w}" height="${h}" fill="url(#g)" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export default function BrowsePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchGames() {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(
          `/api/games/browse?page=${page}&limit=15`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        if (cancelled) return;

        setGames(data?.games ?? []);
        setTotalPages(data?.totalPages ?? 1);

        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        if (!cancelled) setErr("Failed to load games.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchGames();
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="bg-black min-h-screen text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">

        <section className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Browse Games
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Explore games across platforms and genres.
          </p>
        </section>

  
        {err && <div className="text-red-400 mb-4">{err}</div>}
        {loading && (
          <div className="text-sm text-gray-400 mb-4">
            Updating results…
          </div>
        )}
        {!loading && !err && games.length === 0 && (
          <div className="text-gray-500">No games found.</div>
        )}

       
        {games.length > 0 && (
          <>
            <motion.div
              animate={{ opacity: loading ? 0.6 : 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
            >
              {games.map((game, index) => (
                <Link
                  key={game._id || index}
                  href={`/game/${game.slug}`}
                  className="
                    group relative rounded-xl overflow-hidden
                    bg-zinc-900
                    transition-transform duration-300
                    hover:-translate-y-1
                    will-change-transform
                    transform-gpu
                  "
                >
              
                  <div className="relative w-full h-48">
                    <Image
                      src={game.coverImage || "/fallback.jpg"}
                      alt={game.name}
                      fill
                      unoptimized
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer(300, 200)
                      )}`}
                      className="
                        object-cover
                        transition-transform duration-700 ease-out
                        group-hover:scale-110
                        group-hover:rotate-[0.5deg]
                        will-change-transform
                        transform-gpu
                        backface-hidden
                      "
                    />
                  </div>

                  {/* Cinematic overlay */}
                  <div
                    className="
                      absolute inset-0
                      bg-gradient-to-t from-black/80 via-black/30 to-transparent
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity duration-500
                    "
                  />

                  {/* Glow ring */}
                  <div
                    className="
                      absolute inset-0
                      ring-1 ring-white/5
                      group-hover:ring-indigo-400/30
                      transition-all duration-500
                    "
                  />

               
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 text-sm flex justify-between items-center">
                    <span className="truncate">{game.name}</span>
                    {game.averageRating !== undefined && (
                      <span className="text-pink-400 font-semibold">
                        {game.averageRating}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </motion.div>

           
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={cn(
                  "px-3 py-1 text-sm bg-zinc-800 rounded",
                  page === 1
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-zinc-700 transition"
                )}
              >
                Prev
              </button>

              <span className="text-sm text-gray-300">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={cn(
                  "px-3 py-1 text-sm bg-zinc-800 rounded",
                  page === totalPages
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-zinc-700 transition"
                )}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
