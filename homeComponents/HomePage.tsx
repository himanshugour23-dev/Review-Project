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
      .then(res => res.json())
      .then(data => {

        setGames(data?.recommended || []);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="bg-black text-white px-4 py-10 sm:px-6">
      {/* Banner */}
      <section className="bg-black text-white py-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-2">VaultggB</h1>
          <p className="text-lg text-blue-400">
            Discover, collect, analyze your games.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto mt-10 mb-6">
        <h2 className="text-2xl font-semibold">Recommended Games</h2>
      </div>


      {loading && (
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400">Loading...</p>
        </div>
      )}

  
      {!loading && games.length === 0 && (
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500">No featured games found.</p>
        </div>
      )}


      {!loading && games.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
        >
          {games.map((game, index) => (
            <motion.div
              key={game._id || game.slug || index}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
              className="
                group relative rounded-xl overflow-hidden
                bg-zinc-900 transition-transform duration-300
                hover:-translate-y-1
              "
            >
              <Link href={`/game/${game.slug}`}>
     
                <div className="relative w-full h-48">
                  <Image
                    src={game.coverImage || '/fallback.jpg'}
                    alt={game.name}
                    fill
                    unoptimized
                    className="
                      object-cover
                      transition-transform duration-700 ease-out
                      group-hover:scale-110
                      group-hover:rotate-[0.5deg]
                    "
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 15vw"
                  />
                </div>

                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t from-black/80 via-black/30 to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-500
                  "
                />

                <div
                  className="
                    absolute inset-0
                    ring-1 ring-white/5
                    group-hover:ring-indigo-400/30
                    transition-all duration-500
                  "
                />

                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 text-sm text-white">
                  {game.name}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}
