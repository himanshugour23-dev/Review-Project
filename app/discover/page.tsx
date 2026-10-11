'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Gamepad2, Heart, ChevronLeft, ChevronRight, Sparkles, Trophy } from 'lucide-react';

type DiscoverType = 'critics' | 'most-loved';

interface Game {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
  metacritic?: number;
  rawgRating?: number;
}

function GameCard({ game, index, active }: { game: Game; index: number; active: DiscoverType }) {
  const score = active === 'critics' ? game.metacritic : game.rawgRating;
  return (
    <motion.article initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.035, 0.28), duration: 0.35 }} className="min-w-0">
      <Link href={`/game/${game.slug}`} className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ff70] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090c]">
        <div className="relative isolate aspect-[2/3] overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900 shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d9ff70]/50 group-hover:shadow-[0_18px_45px_rgba(217,255,112,0.10)]">
          <Image src={game.coverImage || '/fallback.jpg'} alt={game.name} fill unoptimized sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/5 opacity-90" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${active === 'critics' ? 'border-[#d9ff70]/20 bg-[#d9ff70]/10 text-[#e5ff9e]' : 'border-[#d9ff70]/20 bg-[#d9ff70]/10 text-[#e5ff9e]'}`}>{active === 'critics' ? 'Critics pick' : 'Community love'}</span>
            <span className="grid h-8 w-8 translate-y-1 place-items-center rounded-full border border-white/15 bg-black/40 text-white opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={16} /></span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white sm:text-base">{game.name}</h3>
            <div className="mt-3 flex items-center justify-between gap-2"><span className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-semibold ${active === 'critics' ? 'border-[#d9ff70]/20 bg-[#d9ff70]/10 text-[#d9ff70]' : 'border-[#d9ff70]/20 bg-[#d9ff70]/10 text-[#d9ff70]'}`}>{active === 'critics' ? <Trophy size={12} /> : <Heart size={12} fill="currentColor" />}{score ?? '—'}</span><span className="text-xs font-medium text-zinc-300">{game.metacritic !== undefined && active === 'critics' ? 'Metacritic' : active === 'most-loved' ? 'RAWG rating' : 'Score'}</span></div>
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

export default function DiscoverPage() {
  const [active, setActive] = useState<DiscoverType>('critics');
  const [page, setPage] = useState(1);
  const [games, setGames] = useState<Game[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchGames() {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`/api/games/discover?type=${active}&page=${page}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        if (cancelled) return;
        setGames(data?.games ?? []);
        setTotalPages(data?.totalPages ?? 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        if (!cancelled) setErr('Failed to load games. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchGames();
    return () => { cancelled = true; };
  }, [active, page]);

  const switchTo = (type: DiscoverType) => { setActive(type); setPage(1); };

  return (
    <div className="min-h-screen overflow-hidden bg-[#08090c] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_0%,rgba(217,255,112,0.14),transparent_42%),radial-gradient(ellipse_at_88%_30%,rgba(217,255,112,0.055),transparent_34%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-24 sm:pb-16 sm:pt-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d9ff70]/20 bg-[#d9ff70]/[0.07] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#e5ff9e]"><Sparkles size={13} /> FOR THE GAMES THAT STAY WITH YOU</div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.35em] text-[#d9ff70]">BACLOGGED  /  THE PLAYLIST IS YOURS</p>
            <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div className="max-w-3xl"><h1 className="text-4xl font-black tracking-[-0.045em] sm:text-6xl lg:text-7xl">Find your <span className="bg-gradient-to-r from-[#d9ff70] via-[#efffb8] to-white bg-clip-text text-transparent">next world.</span></h1><p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">The all-timers. The cult favourites. The one you somehow missed. Pick a lane and see what calls your name.</p></div><div className="flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#d9ff70]/10 text-[#d9ff70]"><Gamepad2 size={20} /></div><div><p className="text-xs text-zinc-500">A little direction</p><p className="text-sm font-bold">No bad rabbit holes</p></div></div></div>
            <div className="mt-9 flex flex-wrap gap-3" role="tablist" aria-label="Game collections">
              <button role="tab" aria-selected={active === 'critics'} onClick={() => switchTo('critics')} className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${active === 'critics' ? 'border-[#d9ff70] bg-[#d9ff70] text-[#08090c] shadow-lg shadow-lime-950/20' : 'border-white/10 bg-white/[0.035] text-zinc-300 hover:border-[#d9ff70]/25 hover:bg-[#d9ff70]/[0.04]'}`}><Trophy size={17} /> Critics’ Choice</button>
              <button role="tab" aria-selected={active === 'most-loved'} onClick={() => switchTo('most-loved')} className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${active === 'most-loved' ? 'border-[#d9ff70] bg-[#d9ff70] text-[#08090c] shadow-lg shadow-lime-950/20' : 'border-white/10 bg-white/[0.035] text-zinc-300 hover:border-[#d9ff70]/30 hover:bg-[#d9ff70]/[0.06]'}`}><Heart size={17} /> Most Loved</button>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-9 sm:py-12">
        {err && <div role="alert" className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-200">{err}</div>}
        <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">Page {page} of {totalPages}</p><h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">{active === 'critics' ? 'The ones critics remember' : 'Loved for a reason'}</h2></div>{!loading && !err && <p className="text-xs text-zinc-500">{games.length} titles on this page</p>}</div>
        {loading ? <LoadingGrid /> : !err && games.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-16 text-center"><Gamepad2 className="mx-auto text-zinc-600" size={32} /><p className="mt-4 font-semibold text-zinc-300">No games found</p><p className="mt-1 text-sm text-zinc-500">There aren’t any titles in this collection right now.</p></div> : !err && <AnimatePresence mode="wait"><motion.div key={`${active}-${page}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }} className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{games.map((game, index) => <GameCard key={game._id || `${game.slug}-${index}`} game={game} index={index} active={active} />)}</motion.div></AnimatePresence>}

        {!loading && !err && games.length > 0 && <div className="mt-14 flex flex-col items-center gap-5">
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-2 shadow-xl shadow-black/20 backdrop-blur">
            <button aria-label="Previous page" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"><ChevronLeft size={18} /></button>
            <div className="min-w-20 px-2 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Page</p><p className="mt-0.5 text-base font-bold tabular-nums">{page}<span className="mx-2 text-zinc-600">/</span>{totalPages}</p></div>
            <button aria-label="Next page" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"><ChevronRight size={18} /></button>
          </div>
          <p className="text-center text-xs text-zinc-500">{active === 'critics' ? 'Ranked by Metacritic score.' : 'Ranked by RAWG community rating.'}</p>
        </div>}
      </main>
    </div>
  );
}
