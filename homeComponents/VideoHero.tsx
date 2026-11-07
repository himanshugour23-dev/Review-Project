'use client';
import Image from 'next/image';
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
      <section ref={ref} className="relative h-[320vh] bg-[#09070d]">
        <div className="sticky top-0 isolate h-screen w-full overflow-hidden bg-[#09070d]">
          <motion.div style={{ clipPath: clip }} className="absolute inset-0">
            <div className="absolute inset-0 bg-[#17101c]">
              <Image
                src="/gta-6-lock-and-load-5120x2160-27628.jpg"
                alt=""
                fill
                priority
                quality={75}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-[#170b19]/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#100912]/90 via-[#160c19]/55 to-[#100912]/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09070d] via-transparent to-[#100912]/35" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#f43f78]/15 via-transparent to-[#00d9e8]/15" />
            <div className="absolute -left-32 top-0 h-[60vh] w-[60vh] rounded-full bg-[#fa477e]/20 blur-[140px]" />
            <div className="absolute -right-32 bottom-0 h-[55vh] w-[55vh] rounded-full bg-[#00d9e8]/15 blur-[130px]" />
          </motion.div>
          <motion.div
            style={{ scale: titleScale, opacity: titleOpacity }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10"
          >
            <h1 className="select-none whitespace-nowrap text-center text-[14vw] font-black leading-none tracking-tighter text-white drop-shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
              BACKLOGGED
            </h1>
          </motion.div>
          <span className="sr-only">Baclogged: rate, review and track every game you play</span>
          <motion.div
            style={{ opacity: copyOpacity, y: copyY }}
            className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 pb-16 sm:pb-24"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#ff557d]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#ff8ba3] sm:text-xs">
                Your gaming life. Your own Vice City.
              </span>
            </div>
            <p className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
              Every game you finished, quit, or swore you&apos;d start.
            </p>
            <p className="max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              Rate and review games, build your collection, and see what the community is playing. Every experience deserves a place in your story.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/api/auth/signin"
                className="rounded-full bg-gradient-to-r from-[#ff527c] to-[#ff795f] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_35px_rgba(255,65,112,0.25)] transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,65,112,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8ba3] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Start your vault ↗
              </a>
              <a
                href="#features"
                className="rounded-full border border-[#00d9e8]/40 bg-[#00d9e8]/10 px-7 py-3.5 text-sm font-semibold text-[#8ff8ff] backdrop-blur-xl transition hover:border-[#00d9e8] hover:bg-[#00d9e8]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d9e8]"
              >
                See what&apos;s inside
              </a>
            </div>
          </motion.div>
          <motion.div
            style={{ opacity: cueOpacity }}
            className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-[#ffb4c4]"
          >
            <span>Scroll to enter</span>
            <span className="h-10 w-px bg-gradient-to-b from-[#ff557d] to-transparent" />
          </motion.div>
          <div className="pointer-events-none absolute right-6 top-7 hidden text-right font-mono text-[9px] uppercase tracking-[0.3em] text-white/50 sm:block">
            <p>BCG / 001</p>
            <p className="mt-1 text-[#ff8ba3]">The city is yours</p>
          </div>
        </div>
      </section>
      <div className="overflow-hidden border-y border-[#ff557d]/20 bg-[#100b15] py-5" aria-hidden="true">
        <motion.div
          className="flex w-max gap-12 whitespace-nowrap text-2xl font-bold tracking-tight text-white/35"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
        >
          {[...GENRES, ...GENRES].map((g, i) => (
            <span key={i} className="transition-colors hover:text-[#ff7196]">
              {g}<span className="ml-12 text-[#00d9e8]">✳</span>
            </span>
          ))}
        </motion.div>
      </div>
    </>
  );
}