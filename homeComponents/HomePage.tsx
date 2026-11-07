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
    <main className="min-h-screen overflow-hidden bg-[#0c0911] text-white">
      {/* CINEMATIC HERO */}
      <section className="relative isolate min-h-[640px] overflow-hidden border-b border-[#ff668c]/15 sm:min-h-[720px] lg:min-h-[780px]">
<div className="absolute inset-0 -z-20 bg-[#17101c]">
  <Image
    src="/gta-6-lock-and-load-5120x2160-27628.jpg"
    alt=""
    fill
    priority
    quality={75}
    sizes="100vw"
    className="object-cover object-center opacity-45"
  />
</div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#100912]/90 via-[#160c19]/60 to-[#100912]/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0c0911] via-transparent to-[#100912]/35" />
<div className="relative mx-auto flex min-h-[640px] max-w-[1440px] items-center px-5 pb-16 pt-28 sm:min-h-[720px] sm:px-10 sm:pb-24 lg:min-h-[780px] lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full min-w-0 max-w-[850px]"
          >
            <div className="mb-5 flex items-center gap-3 sm:mb-8">
              <span className="h-px w-10 bg-[#ff557d]" />
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff8ba3] sm:text-xs sm:tracking-[0.32em]">
                Your gaming life, documented
              </p>
            </div>
            <h1 className="max-w-full text-[clamp(2.65rem,10vw,6.5rem)] font-black leading-[1.04] tracking-[-0.055em] [text-wrap:balance] sm:leading-[1.02] lg:tracking-[-0.065em]">
              Every game.
              <br />
              <span className="text-white/45">Every memory.</span>
              <br />
              <span className="text-[#ff8ba3]">Your story.</span>
            </h1>
            <p className="mt-6 max-w-[54ch] text-[0.925rem] leading-[1.8] text-white/75 sm:mt-8 sm:text-lg sm:leading-8">
              Your gaming life deserves more than a list. Track the games
              you play, keep the ones you want to play close, and share
              the experiences that stay with you.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 min-[420px]:flex-row min-[420px]:items-center sm:mt-10">
              <Link
                href="/discover"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#ff527c] to-[#ff795f] px-6 py-3 text-center text-sm font-bold text-black transition hover:brightness-110"
              >
                Explore the library
                <span className="transition-transform group-hover:translate-x-1">
                  ↗
                </span>
              </Link>
              {featured && (
                <Link
                  href={`/game/${featured.slug}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-black/20 px-6 py-3 text-center text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/50 hover:bg-white/10"
                >
                  <span aria-hidden="true">▶</span>
                  Featured game
                </Link>
              )}
            </div>
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-[#ff668c]/20 pt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55 min-[420px]:flex min-[420px]:flex-wrap sm:mt-14 sm:gap-x-8 sm:tracking-[0.2em] sm:text-xs">
              <span>Discover</span>
              <span>Collect</span>
              <span>Review</span>
              <span>Remember</span>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 right-0 hidden h-24 w-1/3 bg-gradient-to-l from-[#00d9e8]/[0.08] to-transparent lg:block" />
      </section>
      {/* FEATURED GAME */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#ff8ba3]">
              The starting point
            </p>
            <h2 className="mt-3 max-w-[20ch] text-[clamp(1.75rem,5vw,2.5rem)] font-black leading-[1.12] tracking-[-0.035em] [text-wrap:balance]">
              Find your next world.
            </h2>
          </div>
          <Link
            href="/browse"
            className="text-sm font-semibold text-white/55 transition hover:text-[#ff8ba3]"
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
            className="group grid overflow-hidden rounded-2xl border border-white/10 bg-[#15101b] transition hover:border-[#ff668c]/45 md:grid-cols-2"
          >
            <div className="relative min-h-[300px] overflow-hidden bg-[#1b1220] sm:min-h-[400px]">
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
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff8ba3]">
                Your next adventure
              </p>
              <h3 className="mt-4 break-words text-[clamp(1.8rem,4vw,3.25rem)] font-black leading-[1.12] tracking-[-0.035em] [text-wrap:balance]">
                {featured.name}
              </h3>
              <p className="mt-5 max-w-[46ch] text-sm leading-7 text-white/65 sm:text-base">
                Explore the game, discover its details, and decide whether
                it belongs in your gaming story.
              </p>
              <span className="mt-8 inline-flex items-center gap-3 text-sm font-bold text-[#ff8ba3]">
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
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-[#ff527c] to-[#ff795f] px-5 py-3 text-sm font-bold text-black transition hover:brightness-110"
            >
              Browse the library
            </Link>
          </div>
        )}
      </section>
      {/* GAME DISCOVERY GRID */}
      <section className="border-y border-[#ff668c]/15 bg-[#100b15]">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#ff8ba3]">
                Curated for discovery
              </p>
              <h2 className="mt-3 max-w-[20ch] text-[clamp(1.75rem,5vw,2.5rem)] font-black leading-[1.12] tracking-[-0.035em] [text-wrap:balance]">
                Games worth your time.
              </h2>
              <p className="mt-4 max-w-[56ch] text-sm leading-7 text-white/60 sm:text-base">
                Explore the games available in baclogged and find the next
                title for your backlog.
              </p>
            </div>
            <Link
              href="/browse"
              className="rounded-full border border-[#ff668c]/20 px-5 py-3 text-xs font-bold transition hover:border-[#ff668c]/50 hover:text-[#ff8ba3]"
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
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#ff668c]/15 bg-[#1b1220] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#ff668c]/45">
                      <Image
                        src={game.coverImage }
                        alt={game.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />
                      <span className="absolute bottom-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-gradient-to-r from-[#ff527c] to-[#ff795f] text-black opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                        ↗
                      </span>
                    </div>
                    <h3 className="mt-3 line-clamp-2 break-words text-[13px] font-semibold leading-snug tracking-[-0.01em] text-white/85 transition group-hover:text-[#ff8ba3] sm:text-sm">
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
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#ff527c] to-[#ff795f]/[0.06] blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-1 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff8ba3] sm:tracking-[0.4em]">
            Make every play count
          </p>
          <h2 className="mt-5 text-[clamp(2.5rem,9vw,4.75rem)] font-black leading-[1.08] tracking-[-0.055em] [text-wrap:balance]">
            Your backlog.
            <br />
            <span className="text-white/40">Your story.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-sm leading-7 text-white/65 sm:text-lg sm:leading-8">
            Build your collection, remember your favourite experiences,
            and find the next game you won't want to put down.
          </p>
          <Link
            href="/browse"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#ff527c] to-[#ff795f] px-7 py-3.5 text-center text-sm font-bold text-black transition hover:brightness-110"
          >
            Start exploring <span>↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
