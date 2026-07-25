'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Game {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
}

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/games/Home')
      .then((res) => res.json())
      .then((data) => {
        setGames(data?.recommended || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_55%)]" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 pt-28 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.35em] text-blue-400">
              VaultggB
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
              Track.
              <br />
              Review.
              <br />
              Discover.
            </h1>

            <p className="mt-7 max-w-xl text-base sm:text-lg text-gray-400 leading-8">
              Build your personal gaming library, review what you've played,
              discover your next favorite title, and keep up with your friends.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/browse"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                Browse Games
              </Link>

              <Link
                href="/discover"
                className="rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:border-blue-500 hover:bg-white/10"
              >
                Discover
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Recommended ---------------- */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-14">
        <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
              Featured
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Recommended Games
            </h2>
          </div>

          {!loading && games.length > 0 && (
            <Link
              href="/browse"
              className="text-xs font-semibold uppercase tracking-widest text-gray-400 transition hover:text-white"
            >
              View More →
            </Link>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
              >
                <div className="aspect-[2/3] rounded bg-zinc-900" />
                <div className="mt-3 h-4 rounded bg-zinc-900" />
              </div>
            ))}
          </div>
        )}
        {!loading && games.length === 0 && (
          <div className="rounded-lg border border-white/10 bg-zinc-950 py-16 text-center">
            <p className="text-gray-500">
              No featured games found.
            </p>
          </div>
        )}
        {!loading && games.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          >
            {games.map((game, index) => (
              <motion.div
                key={game._id || game.slug || index}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
              >
                <Link
                  href={`/game/${game.slug}`}
                  className="group block"
                >
                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded
                      bg-zinc-900
                      shadow-xl
                      ring-1
                      ring-white/5
                      transition-all
                      duration-300
                      group-hover:ring-blue-500/60
                    "
                  >
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={game.coverImage || '/fallback.jpg'}
                        alt={game.name}
                        fill
                        unoptimized
                        sizes="(max-width:768px)50vw,(max-width:1200px)25vw,16vw"
                        className=" object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    </div>

                    <div
                      className=" absolute inset-0  bg-gradient-to-t  from-black/80  via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-10 "
                    />

                    <div
                      className=" absolute inset-0 bg-gradient-to-b  from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100
                      "
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p
                      className=" truncate text-[14px] font-medium  text-gray-200  transition-colors  group-hover:text-blue-400
                      ">
                      {game.name}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}