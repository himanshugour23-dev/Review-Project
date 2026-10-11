"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Gamepad2, Heart, Sparkles, Trophy } from "lucide-react";

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

type DiscoverTab = "critics" | "loved";

function GameCard({ game, index, tab }: { game: Game; index: number; tab: DiscoverTab }) {
  const score = tab === "critics" ? game.metacritic : game.rawgRating;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.035, 0.28), duration: 0.35 }}
      className="min-w-0"
    >
      <Link href={`/game/${game.slug}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ff70] focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-2xl">
        <div className="relative isolate aspect-[2/3] overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900 shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d9ff70]/50 group-hover:shadow-[0_18px_45px_rgba(217,255,112,0.10)]">
          <Image
            src={game.coverImage || "/fallback.jpg"}
            alt={game.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/5 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md", tab === "critics" ? "border-[#d9ff70]/20 bg-[#d9ff70]/10 text-[#e5ff9e]" : "border-[#d9ff70]/20 bg-[#d9ff70]/10 text-[#e5ff9e]")}>
              {tab === "critics" ? "Critics pick" : "Community love"}
            </span>
            <span className="grid h-8 w-8 translate-y-1 place-items-center rounded-full border border-white/15 bg-black/40 text-white opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white sm:text-base">{game.name}</h3>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className={cn("inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-semibold", tab === "critics" ? "border-[#d9ff70]/20 bg-[#d9ff70]/10 text-[#d9ff70]" : "border-[#d9ff70]/20 bg-[#d9ff70]/10 text-[#d9ff70]")}>
                {tab === "critics" ? <Trophy size={12} /> : <Heart size={12} fill="currentColor" />}
                {score ?? "—"}
              </span>
              <span className="text-xs font-medium text-zinc-300">{game.released?.slice(0, 4) || "Release TBA"}</span>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 transition group-hover:ring-[#d9ff70]/30" />
        </div>
      </Link>
    </motion.article>
  );
}

function LoadingGrid() {
  return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-950"><div className="aspect-[2/3] bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800" /><div className="space-y-2 p-3"><div className="h-3 w-4/5 rounded bg-zinc-800" /><div className="h-3 w-2/5 rounded bg-zinc-900" /></div></div>)}</div>;
}

export default function DiscoverClient() {
  const [criticsChoice, setCriticsChoice] = useState<Game[]>([]);
  const [mostLoved, setMostLoved] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<DiscoverTab>("critics");
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/games/discover")
      .then((res) => {
        if (!res.ok) throw new Error("Could not load games");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setCriticsChoice(data.criticsChoice || []);
        setMostLoved(data.mostLoved || []);
        setError(false);
      })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const games = tab === "critics" ? criticsChoice : mostLoved;

  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-[#08090c] pb-16 text-white">
        <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_0%,rgba(217,255,112,0.14),transparent_42%),radial-gradient(ellipse_at_88%_30%,rgba(217,255,112,0.055),transparent_34%)]" />
          <div className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="mx-auto max-w-7xl px-5 pb-12 pt-32 sm:pb-16 sm:pt-36">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d9ff70]/20 bg-[#d9ff70]/[0.07] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#e5ff9e]"><Sparkles size={13} /> FOR THE GAMES THAT STAY WITH YOU</div>
              <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div className="max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d9ff70]">THE GOOD STUFF, SORTED</p>
                  <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] sm:text-6xl lg:text-7xl">Find your <span className="bg-gradient-to-r from-[#d9ff70] via-[#efffb8] to-white bg-clip-text text-transparent">next world.</span></h1>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">The all-timers. The cult favourites. The one you somehow missed. Pick a lane and see what calls your name.</p>
                </div>
                <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#d9ff70]/10 text-[#d9ff70]"><Gamepad2 size={20} /></div><div><p className="text-xs text-zinc-500">A little direction</p><p className="text-sm font-bold">No bad rabbit holes</p></div></div>
              </div>
              <div className="mt-9 flex flex-wrap gap-3" role="tablist" aria-label="Game collections">
                <button role="tab" aria-selected={tab === "critics"} onClick={() => setTab("critics")} className={cn("inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition duration-200", tab === "critics" ? "border-[#d9ff70] bg-[#d9ff70] text-[#08090c] shadow-lg shadow-lime-950/20" : "border-white/10 bg-white/[0.035] text-zinc-300 hover:border-[#d9ff70]/25 hover:bg-[#d9ff70]/[0.04]")}><Trophy size={17} /> Critics’ Choice <span className={cn("rounded-md px-1.5 py-0.5 text-xs", tab === "critics" ? "bg-black/10" : "bg-white/10")}>{criticsChoice.length}</span></button>
                <button role="tab" aria-selected={tab === "loved"} onClick={() => setTab("loved")} className={cn("inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition duration-200", tab === "loved" ? "border-[#d9ff70] bg-[#d9ff70] text-[#08090c] shadow-lg shadow-lime-950/20" : "border-white/10 bg-white/[0.035] text-zinc-300 hover:border-[#d9ff70]/30 hover:bg-[#d9ff70]/[0.06]")}><Heart size={17} /> Most Loved <span className={cn("rounded-md px-1.5 py-0.5 text-xs", tab === "loved" ? "bg-white/15" : "bg-white/10")}>{mostLoved.length}</span></button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-9 sm:py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div><p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">THE COLLECTIONS</p><h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">{tab === "critics" ? "The ones critics remember" : "Loved for a reason"}</h2></div>
            {!loading && <p className="text-xs text-zinc-500">{games.length} {games.length === 1 ? "game" : "games"}</p>}
          </div>
          {loading ? <LoadingGrid /> : error ? <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-5 py-12 text-center"><p className="font-semibold text-red-200">We couldn’t load the collection.</p><p className="mt-2 text-sm text-zinc-400">Please refresh the page and try again.</p></div> : games.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-16 text-center"><Gamepad2 className="mx-auto text-zinc-600" size={32} /><p className="mt-4 font-semibold text-zinc-300">No games to show just yet</p><p className="mt-1 text-sm text-zinc-500">Try the other collection in the meantime.</p></div> : (
            <AnimatePresence mode="wait"><motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }} className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{games.map((game, index) => <GameCard key={game._id} game={game} index={index} tab={tab} />)}</motion.div></AnimatePresence>
          )}
        </section>
      </main>
    </>
  );
}
