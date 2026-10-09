'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const GENRES = [
  'Action', 'RPG', 'Indie', 'Strategy', 'Shooter', 'Platformer',
  'Horror', 'Racing', 'Puzzle', 'Sports', 'Simulation', 'Adventure',
];

export default function VideoHero() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.4 });

  const clip = useTransform(
    p,
    [0, 0.55],
    ['inset(14% 10% 14% 10% round 36px)', 'inset(0% 0% 0% 0% round 0px)']
  );
  const titleScale = useTransform(p, [0, 0.4], [1, 2.4]);
  const titleOpacity = useTransform(p, [0, 0.28, 0.4], [1, 1, 0]);

  const copyOpacity = useTransform(p, [0.5, 0.72], [0, 1]);
  const copyY = useTransform(p, [0.5, 0.72], [40, 0]);

  const cueOpacity = useTransform(p, [0, 0.08], [1, 0]);

  return (
    <>
      <section ref={ref} className="relative h-[320vh] bg-black">
        <div className="sticky top-0 h-screen w-full overflow-hidden isolate bg-black">
          <motion.div style={{ clipPath: clip }} className="absolute inset-0">
            <div className="absolute inset-0 bg-zinc-950">
              <div className="absolute -left-1/4 top-0 h-[70vh] w-[70vh] rounded-full bg-violet-600/40 blur-[120px]" />
              <div className="absolute -right-1/4 bottom-0 h-[70vh] w-[70vh] rounded-full bg-fuchsia-600/30 blur-[120px]" />
            </div>

            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/hero.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          </motion.div>
          <motion.div
            style={{ scale: titleScale, opacity: titleOpacity }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black mix-blend-multiply"
          >
            <h1 className="select-none whitespace-nowrap text-center text-[14vw] font-black leading-none tracking-tighter text-white">
              BACKLOGGED
            </h1>
          </motion.div>
          <span className="sr-only">Baclogged: rate, review and track every game you play</span>
          <motion.div
            style={{ opacity: copyOpacity, y: copyY }}
            className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 pb-16 sm:pb-24"
          >
            <p className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Every game you finished, quit, or swore you'd start.
            </p>
            <p className="max-w-xl text-base text-zinc-300 sm:text-lg">
              Rate and review games, build your collection, and see what the community is
              playing.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/api/auth/signin"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Start your vault
              </a>
              <a
                href="#features"
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                See what's inside
              </a>
            </div>
          </motion.div>
          <motion.div
            style={{ opacity: cueOpacity }}
            className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-xs text-zinc-400"
          >
            <span>Scroll to open</span>
            <span className="h-10 w-px bg-gradient-to-b from-zinc-400 to-transparent" />
          </motion.div>
        </div>
      </section>
      <div className="overflow-hidden border-y border-white/10 bg-black py-5" aria-hidden="true">
        <motion.div
          className="flex w-max gap-12 whitespace-nowrap text-2xl font-semibold text-zinc-600"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
        >
          {[...GENRES, ...GENRES].map((g, i) => (
            <span key={i} className="transition-colors hover:text-violet-300">
              {g}
            </span>
          ))}
        </motion.div>
      </div>
    </>
  );
}