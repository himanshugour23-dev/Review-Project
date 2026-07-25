"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Heart } from "lucide-react";

import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

interface Game {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
  metacritic?: number;
  rawgRating?: number;
  released: string;
}

export default function DiscoverClient() {
  const [criticsChoice, setCriticsChoice] = useState<Game[]>([]);
  const [mostLoved, setMostLoved] = useState<Game[]>([]);

  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<"critics" | "loved">("critics");

  useEffect(() => {
    fetch("/api/games/discover")
      .then((res) => res.json())
      .then((data) => {
        setCriticsChoice(data.criticsChoice || []);
        setMostLoved(data.mostLoved || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const games =
    tab === "critics"
      ? criticsChoice
      : mostLoved;

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-black pt-28 text-white">

          <div className="mx-auto max-w-7xl px-5">

            <div className="animate-pulse">

              <div className="mb-5 h-10 w-64 rounded bg-zinc-800" />

              <div className="mb-12 h-5 w-96 max-w-full rounded bg-zinc-900" />

              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded bg-zinc-900"
                  >
                    <div className="aspect-[2/3] bg-zinc-800" />
                    <div className="space-y-2 p-3">
                      <div className="h-4 rounded bg-zinc-700" />
                      <div className="h-3 w-20 rounded bg-zinc-800" />
                    </div>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black pt-24 text-white">

        <section className="relative overflow-hidden border-b border-white/10">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,.18),transparent_55%)]" />

          <div className="relative mx-auto max-w-7xl px-5 py-14">

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-400">
              Explore
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight">
              Discover Games
            </h1>

            <p className="mt-5 max-w-2xl text-gray-400">
              Browse our curated collection of critically acclaimed
              titles and community favorites.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <button
                onClick={() => setTab("critics")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition",
                  tab === "critics"
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/5 hover:bg-white/10"
                )}
              >
                <Trophy size={18} />
                Critics Choice
              </button>

              <button
                onClick={() => setTab("loved")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition",
                  tab === "loved"
                    ? "bg-pink-500 text-white"
                    : "border border-white/10 bg-white/5 hover:bg-white/10"
                )}
              >
                <Heart size={18} />
                Most Loved
              </button>

            </div>

          </div>

        </section>

        <section className="mx-auto max-w-7xl px-5 py-12">

          <AnimatePresence mode="wait">
                    <motion.div
            key={tab}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {games.map((game, index) => (
              <motion.div
                key={game._id}
                initial={{ opacity: 0, y: 18 }}
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
                        src={game.coverImage}
                        alt={game.name}
                        fill
                        unoptimized
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

                        {tab === "critics" ? (
                          <span className="rounded bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-400">
                            Metacritic {game.metacritic ?? "--"}
                          </span>
                        ) : (
                          <span className="rounded bg-pink-500/20 px-2 py-1 text-xs font-semibold text-pink-400">
                            ★ {game.rawgRating ?? "--"}
                          </span>
                        )}

                        <span className="text-xs text-gray-300">
                          {game.released?.slice(0, 4)}
                        </span>

                      </div>

                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

        </AnimatePresence>
                </section>

      </main>
    </>
  );
}