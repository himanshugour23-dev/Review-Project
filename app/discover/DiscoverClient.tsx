"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
      .then(res => res.json())
      .then(data => {
        setCriticsChoice(data.criticsChoice || []);
        setMostLoved(data.mostLoved || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const games = tab === "critics" ? criticsChoice : mostLoved;

  if (loading)
    return <p className="text-center mt-32 text-gray-400">Loading...</p>;

  return (
    <>
      <Navbar />

      <main className="pt-24 px-4 max-w-7xl mx-auto text-white">
       
        <div className="sticky top-16 z-40 bg-black/60 backdrop-blur border-b border-white/10 mb-6">
          <div className="flex gap-8 text-sm font-medium">
            <button
              onClick={() => setTab("critics")}
              className={cn(
                "pb-3 border-b-2 transition-colors",
                tab === "critics"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-gray-400"
              )}
            >
              🎯 Critics Choice
            </button>

            <button
              onClick={() => setTab("loved")}
              className={cn(
                "pb-3 border-b-2 transition-colors",
                tab === "loved"
                  ? "border-pink-500 text-white"
                  : "border-transparent text-gray-400"
              )}
            >
              ❤️ Most Loved
            </button>
          </div>
        </div>

     
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
          >
            {games.map(game => (
              <Link
                href={`/game/${game.slug}`}
                key={game._id}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-900/40 border border-white/5">
                  <Image
                    src={game.coverImage}
                    unoptimized
                    alt={game.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <p className="mt-2 text-sm font-medium line-clamp-2">
                  {game.name}
                </p>
                <p className="text-xs text-gray-400">
                  {tab === "critics"
                    ? `Metacritic ${game.metacritic}`
                    : `Rating ${game.rawgRating}`}
                </p>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
