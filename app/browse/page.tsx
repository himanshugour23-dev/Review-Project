 "use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Gamepad2, Sparkles, Star } from "lucide-react";
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

        const res = await fetch(`/api/games/browse?page=${page}&limit=15`, {
          cache: "no-store",
        });

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
    <div className="relative min-h-screen overflow-hidden bg-[#08090c] text-white">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-[8%] h-[28rem] w-[28rem] rounded-full bg-lime-300/[0.035] blur-[130px]" />
        <div className="absolute right-[-10rem] top-[35rem] h-[30rem] w-[30rem] rounded-full bg-lime-300/[0.045] blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      </div>

      {/* Hero */}
      <section className="relative isolate border-b border-white/[0.08]">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,255,112,0.10),transparent_58%)]" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-300/25 bg-lime-300/[0.07] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-lime-200 shadow-[0_0_32px_rgba(217,255,112,0.07)] sm:text-xs">
              <Sparkles size={14} />
              YOUR BACKLOG STARTS HERE
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl">
              Find your next
              <span className="mt-2 block bg-gradient-to-r from-lime-200 via-lime-300 to-[#a3e635] bg-clip-text text-transparent">
                great adventure.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
              From all-time classics to hidden gems, explore a collection built for your next
              gaming obsession.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-zinc-400 sm:gap-4">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-2.5">
                <Gamepad2 size={15} className="text-lime-300" />
                15 games per page
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-2.5">
                <Star size={14} className="text-amber-300" />
                Find your next fixation
              </span>
            </div>
          </motion.div>

          <div aria-hidden="true" className="absolute -right-10 bottom-[-5rem] hidden h-80 w-80 rounded-full border border-lime-300/[0.10] md:block" />
          <div aria-hidden="true" className="absolute -right-2 bottom-[-3rem] hidden h-64 w-64 rounded-full border border-lime-300/[0.07] md:block" />
        </div>
      </section>

      <main className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-lime-300">THE BACKLOG UNIVERSE</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Pick your next obsession</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(217,255,112,0.55)]" />
            {loading ? "Refreshing collection…" : `Page ${page} of ${totalPages}`}
          </div>
        </div>

        {err && (
          <div role="alert" className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/[0.08] p-4 text-sm text-red-300">
            {err}
          </div>
        )}

        {loading && games.length > 0 && (
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300" />
            Updating results…
          </div>
        )}

        {!loading && !err && games.length === 0 && (
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400">
              <Gamepad2 size={25} />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">No games found</h3>
            <p className="mt-2 text-sm text-zinc-500">There are no titles to show on this page just yet.</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 md:grid-cols-4 lg:grid-cols-5",
              loading && "opacity-70"
            )}
          >
            {games.map((game, index) => (
              <motion.div
                key={game._id || index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.035, 0.35), duration: 0.35 }}
              >
                <Link href={`/game/${game.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101116] shadow-[0_12px_35px_rgba(0,0,0,0.22)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-lime-300/45 group-hover:shadow-[0_18px_45px_rgba(163,230,53,0.10)]">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <Image
                        src={game.coverImage || "/fallback.jpg"}
                        alt={game.name}
                        fill
                        unoptimized
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(320, 480))}`}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-br from-lime-300/[0.10] via-transparent to-lime-200/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
                        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-white drop-shadow sm:text-[15px]">
                          {game.name}
                        </h3>

                        <div className="mt-2.5 flex min-h-7 flex-wrap items-center gap-1.5">
                          {game.averageRating !== undefined && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-pink-300/15 bg-pink-500/15 px-2 py-1 text-[11px] font-bold text-pink-200 backdrop-blur-md">
                              <Star size={11} fill="currentColor" />
                              {game.averageRating}
                            </span>
                          )}
                          {game.metacritic !== undefined && (
                            <span className="rounded-lg border border-emerald-300/15 bg-emerald-500/15 px-2 py-1 text-[11px] font-bold text-emerald-200 backdrop-blur-md">
                              MC {game.metacritic}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04] transition-colors group-hover:ring-lime-300/20" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {games.length > 0 && (
          <div className="mt-14 flex flex-col items-center gap-5 border-t border-white/[0.07] pt-8 sm:mt-16 sm:pt-10">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-[#101014]/90 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <button
                aria-label="Previous page"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] transition-all",
                  page === 1 || loading
                    ? "cursor-not-allowed text-zinc-700"
                    : "bg-white/[0.04] text-zinc-300 hover:border-lime-300/35 hover:bg-lime-300/[0.08] hover:text-white"
                )}
              >
                <ChevronLeft size={19} />
              </button>

              <div className="min-w-24 px-2 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500">Page</p>
                <p className="mt-0.5 text-lg font-bold tabular-nums text-white">
                  {page}<span className="mx-2 text-zinc-600">/</span>{totalPages}
                </p>
              </div>

              <button
                aria-label="Next page"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] transition-all",
                  page === totalPages || loading
                    ? "cursor-not-allowed text-zinc-700"
                    : "bg-white/[0.04] text-zinc-300 hover:border-lime-300/35 hover:bg-lime-300/[0.08] hover:text-white"
                )}
              >
                <ChevronRight size={19} />
              </button>
            </div>

            <p className="max-w-xl text-center text-xs leading-6 text-zinc-500 sm:text-sm">
              Every cover hides another world. Keep scrolling until one grabs you.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
