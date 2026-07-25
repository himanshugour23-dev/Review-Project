"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
<rect width="${w}" height="${h}" fill="#27272a"/>
<rect width="${w}" height="${h}" fill="url(#g)"/>
</svg>
`;

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
          {
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();

        if (cancelled) return;

        setGames(data?.games ?? []);
        setTotalPages(data?.totalPages ?? 1);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch {
        if (!cancelled) {
          setErr("Failed to load games.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchGames();

    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="min-h-screen bg-black text-white">

      <section className="relative overflow-hidden border-b border-white/10">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,.18),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl px-5 pt-24 pb-14">

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-400">
            Collection
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight">
            Browse Games
          </h1>

          <p className="mt-5 max-w-2xl text-gray-400 leading-8">
            Explore thousands of games across every genre,
            platform and generation.
          </p>

        </div>

      </section>

      <main className="mx-auto max-w-7xl px-5 py-12">

        {err && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {err}
          </div>
        )}

        {loading && (
          <div className="mb-6 text-sm text-gray-400">
            Updating results...
          </div>
        )}

        {!loading && !err && games.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-zinc-950 py-16 text-center text-gray-500">
            No games found.
          </div>
        )}

        <AnimatePresence mode="wait">
                    <motion.div
            key={page}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {games.map((game, index) => (
              <motion.div
                key={game._id || index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.04,
                }}
              >
                <Link
                  href={`/game/${game.slug}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded bg-zinc-900 shadow-xl ring-1 ring-white/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-blue-500/40">

                    <div className="relative aspect-[2/3]">

                      <Image
                        src={game.coverImage || "/fallback.jpg"}
                        alt={game.name}
                        fill
                        unoptimized
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(
                          shimmer(320, 480)
                        )}`}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="absolute bottom-0 left-0 right-0 p-3">

                      <h3 className="truncate text-sm font-semibold text-white">
                        {game.name}
                      </h3>

                      <div className="mt-2 flex items-center justify-between">

                        {game.averageRating !== undefined && (
                          <span className="rounded bg-pink-500/20 px-2 py-1 text-xs font-semibold text-pink-400">
                            ★ {game.averageRating}
                          </span>
                        )}

                        {game.metacritic !== undefined && (
                          <span className="rounded bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-400">
                            {game.metacritic}
                          </span>
                        )}

                      </div>

                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

        </AnimatePresence>

               {games.length > 0 && (
          <div className="mt-14 flex flex-col items-center gap-6">

            <div className="flex items-center gap-4 rounded-full border border-white/10 bg-zinc-950 px-4 py-3 shadow-xl">

              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition",
                  page === 1
                    ? "cursor-not-allowed opacity-30"
                    : "hover:bg-white/10"
                )}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                  Page
                </p>

                <p className="text-lg font-bold">
                  {page}
                  <span className="mx-2 text-gray-500">/</span>
                  {totalPages}
                </p>
              </div>

              <button
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={page === totalPages}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition",
                  page === totalPages
                    ? "cursor-not-allowed opacity-30"
                    : "hover:bg-white/10"
                )}
              >
                <ChevronRight size={18} />
              </button>

            </div>

            <p className="text-center text-sm text-gray-500">
              Browse every title in our collection with community ratings and curated metadata.
            </p>

          </div>
        )}

      </main>
    </div>
  );
}