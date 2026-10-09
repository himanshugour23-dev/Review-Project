
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

// Replace this file with your own trailer:
// public/videos/baclogged-trailer.mp4
const HERO_VIDEO = '/videos/VideoProject1.mp4';
// const HERO_POSTER = '/774617.png';

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGames() {
      try {
        const response = await fetch('/api/games/Home', {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('Unable to load games');

        const data = await response.json();
        setGames(Array.isArray(data?.recommended) ? data.recommended : []);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Homepage games:', error);
          setGames([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadGames();
    return () => controller.abort();
  }, []);

  const featured = games[0];
  const remainingGames = games.slice(1);

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090c] text-white">
      {/* CINEMATIC HERO */}
      <section className="relative isolate min-h-[680px] overflow-hidden border-b border-white/[0.08] sm:min-h-[760px]">
        {/* <div className="absolute inset-0 -z-20 bg-[#101219]">
          <Image
            src={HERO_POSTER}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover opacity-40"
          />
        </div> */}

        {videoEnabled && (
          <video
            key={HERO_VIDEO}
            autoPlay
            muted={muted}
            loop
            playsInline
            // poster={HERO_POSTER}
            onError={() => setVideoEnabled(false)}
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
            aria-hidden="true"
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        )}

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#08090c] via-[#08090c]/85 to-[#08090c]/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#08090c] via-transparent to-black/30" />

        <div className="absolute right-6 top-6 z-10 flex gap-2 sm:right-10 sm:top-10">
          <button
            type="button"
            onClick={() => setMuted((value) => !value)}
            className="rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white/10"
            aria-label={muted ? 'Unmute trailer' : 'Mute trailer'}
          >
            {muted ? 'Sound off' : 'Sound on'}
          </button>

          <button
            type="button"
            onClick={() => setVideoEnabled((value) => !value)}
            className="rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white/10"
          >
            {videoEnabled ? 'Pause visual' : 'Play visual'}
          </button>
        </div>

        <div className="mx-auto flex min-h-[680px] max-w-[1440px] items-center px-5 pb-20 pt-28 sm:min-h-[760px] sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-lime-400" />
              <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-lime-300 sm:text-xs">
                Your gaming life, documented
              </p>
            </div>

            <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[92px]">
              Every game.
              <br />
              <span className="text-white/45">Every memory.</span>
              <br />
              <span className="text-lime-300">Your story.</span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
              Your gaming life deserves more than a list. Track the games
              you play, keep the ones you want to play close, and share
              the experiences that stay with you.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/discover"
                className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-lime-300 px-6 py-3 text-sm font-bold text-black transition hover:bg-lime-200"
              >
                Explore the library
                <span className="transition-transform group-hover:translate-x-1">
                  ↗
                </span>
              </Link>

              {featured && (
                <Link
                  href={`/game/${featured.slug}`}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-black/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/50 hover:bg-white/10"
                >
                  <span aria-hidden="true">▶</span>
                  Featured game
                </Link>
              )}
            </div>

            <div className="mt-14 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 sm:text-xs">
              <span>Discover</span>
              <span>Collect</span>
              <span>Review</span>
              <span>Remember</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 right-0 hidden h-24 w-1/3 bg-gradient-to-l from-lime-300/[0.06] to-transparent lg:block" />
      </section>

      {/* FEATURED GAME */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-lime-300">
              The starting point
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Find your next world.
            </h2>
          </div>

          <Link
            href="/browse"
            className="text-sm font-semibold text-white/55 transition hover:text-lime-300"
          >
            Explore all games ↗
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="aspect-[16/10] animate-pulse rounded-2xl bg-white/[0.05]" />
            <div className="space-y-4 py-5">
              <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-full animate-pulse rounded bg-white/10" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        ) : featured ? (
          <Link
            href={`/game/${featured.slug}`}
            className="group grid overflow-hidden rounded-2xl border border-white/10 bg-[#101116] transition hover:border-lime-300/30 md:grid-cols-2"
          >
            <div className="relative min-h-[300px] overflow-hidden bg-[#15161b] sm:min-h-[400px]">
              <Image
                src={featured.coverImage }
                alt={featured.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
              <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                Featured selection
              </span>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-lime-300">
                Your next adventure
              </p>
              <h3 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                {featured.name}
              </h3>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/50">
                Explore the game, discover its details, and decide whether
                it belongs in your gaming story.
              </p>
              <span className="mt-8 inline-flex items-center gap-3 text-sm font-bold text-lime-300">
                Explore this game
                <span className="transition-transform group-hover:translate-x-2">
                  →
                </span>
              </span>
            </div>
          </Link>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-14 text-center">
            <p className="text-lg font-semibold">Your next game is waiting.</p>
            <p className="mt-2 text-sm text-white/45">
              There are no featured games available right now.
            </p>
            <Link
              href="/browse"
              className="mt-6 inline-flex rounded-full bg-lime-300 px-5 py-3 text-sm font-bold text-black transition hover:bg-lime-200"
            >
              Browse the library
            </Link>
          </div>
        )}
      </section>

      {/* GAME DISCOVERY GRID */}
      <section className="border-y border-white/[0.07] bg-[#0c0d11]">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-lime-300">
                Curated for discovery
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Games worth your time.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/45">
                Explore the games available in baclogged and find the next
                title for your backlog.
              </p>
            </div>

            <Link
              href="/browse"
              className="rounded-full border border-white/15 px-5 py-3 text-xs font-bold transition hover:border-lime-300/50 hover:text-lime-300"
            >
              Browse library ↗
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[3/4] rounded-xl bg-white/[0.05]" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-white/[0.07]" />
                </div>
              ))}
            </div>
          ) : remainingGames.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
              className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-5 xl:grid-cols-6"
            >
              {remainingGames.map((game, index) => (
                <motion.div
                  key={game._id || game.slug || index}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <Link
                    href={`/game/${game.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/[0.08] bg-[#17181e] transition duration-300 group-hover:-translate-y-1 group-hover:border-lime-300/40">
                      <Image
                        src={game.coverImage }
                        alt={game.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />
                      <span className="absolute bottom-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-lime-300 text-black opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                        ↗
                      </span>
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-white/80 transition group-hover:text-lime-300">
                      {game.name}
                    </h3>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/30">
                      Game details
                    </p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="rounded-xl border border-white/10 py-10 text-center text-sm text-white/45">
              More games will appear here as they become available.
            </p>
          )}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="relative overflow-hidden px-5 py-20 sm:px-10 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-300/[0.06] blur-[100px]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-lime-300">
            Make every play count
          </p>
          <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
            Your backlog.
            <br />
            <span className="text-white/40">Your story.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
            Build your collection, remember your favourite experiences,
            and find the next game you won't want to put down.
          </p>
          <Link
            href="/browse"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-lime-300 px-7 py-4 text-sm font-bold text-black transition hover:bg-lime-200"
          >
            Start exploring <span>↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
