"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowDownRight, ArrowLeft, ArrowRight, Heart, MessageSquare, Sparkles } from "lucide-react";

interface Game {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
}

interface Review {
  _id: string;
  gameId: Game;
}

interface User {
  name: string;
  avatar?: string;
  bio?: string;
  favoriteGames: Game[];
}

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const favRef = useRef<HTMLDivElement | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch(`/api/user/${id}`, { cache: "no-store", signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        setUser(data.user ?? null);
        setReviews(data.reviews ?? []);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: "left" | "right") => {
    if (!ref.current) return;
    const card = ref.current.querySelector<HTMLElement>(".scroll-card");
    if (!card) return;
    ref.current.scrollBy({ left: dir === "left" ? -(card.offsetWidth + 16) : card.offsetWidth + 16, behavior: "smooth" });
  };

  if (loading) {
    return <main className="min-h-screen bg-[#08090c] px-5 pt-28 text-white"><div className="mx-auto max-w-6xl animate-pulse"><div className="h-64 rounded-[2rem] border border-white/5 bg-[#101116]" /><div className="mt-9 h-8 w-60 rounded bg-white/10" /><div className="mt-5 flex gap-4 overflow-hidden">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-64 min-w-44 rounded-2xl bg-[#101116]" />)}</div></div></main>;
  }

  if (error || !user) {
    return <main className="flex min-h-screen items-center justify-center bg-[#08090c] px-5 text-center text-white"><div className="max-w-md rounded-3xl border border-white/10 bg-[#101116] p-9"><Sparkles className="mx-auto mb-4 text-[#d9ff70]" size={26} /><h1 className="text-2xl font-black tracking-tight">Player not found<span className="text-[#d9ff70]">.</span></h1><p className="mt-3 text-sm leading-6 text-zinc-500">This profile may have moved, or the link might be out of date.</p><Link href="/" className="mt-6 inline-flex rounded-full bg-[#d9ff70] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#e7ffa0]">Back to baclogged</Link></div></main>;
  }

  const favoriteGames = user.favoriteGames ?? [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090c] pb-20 pt-24 text-white selection:bg-[#d9ff70] selection:text-black">
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent_65%)]" />
      <div className="pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-[#d9ff70]/[0.06] blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#101116]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(217,255,112,.12),transparent_40%),linear-gradient(120deg,rgba(255,255,255,.035),transparent_55%)]" />
          <div className="absolute right-5 top-4 hidden font-mono text-[10px] uppercase tracking-[0.35em] text-white/25 sm:block">Community file / public</div>
          <div className="relative grid gap-8 p-6 sm:p-10 md:grid-cols-[auto_1fr] md:items-center md:gap-10 md:p-14">
            <div className="relative mx-auto md:mx-0">
              <div className="absolute -inset-3 rotate-6 rounded-[2rem] border border-[#d9ff70]/20" />
              <div className="relative h-32 w-32 overflow-hidden rounded-[1.65rem] bg-[#1b1d23] ring-1 ring-white/15 sm:h-44 sm:w-44">
                <Image src={user.avatar || "/avatar-placeholder.png"} alt={user.name} fill unoptimized sizes="176px" className="object-cover" />
              </div>
              <span className="absolute -bottom-3 -right-3 grid h-10 w-10 place-items-center rounded-full border-4 border-[#101116] bg-[#d9ff70] text-black"><Sparkles size={16} /></span>
            </div>
            <div className="min-w-0 text-center md:text-left">
              <div className="mb-3 flex flex-wrap items-center justify-center gap-2 md:justify-start"><span className="rounded-full border border-[#d9ff70]/25 bg-[#d9ff70]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#d9ff70]">Player profile</span><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">// community archive</span></div>
              <h1 className="break-words text-4xl font-black tracking-[-0.06em] sm:text-6xl">{user.name}<span className="text-[#d9ff70]">.</span></h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400 md:mx-0">{user.bio || <span className="italic text-zinc-600">This player lets their collection do the talking.</span>}</p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3"><span className="block font-mono text-2xl font-bold tabular-nums">{favoriteGames.length.toString().padStart(2, "0")}</span><span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">Favourites</span></div>
                <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3"><span className="block font-mono text-2xl font-bold tabular-nums">{reviews.length.toString().padStart(2, "0")}</span><span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">Reviews</span></div>
                <div className="hidden h-12 w-px bg-white/10 sm:block" />
                <p className="max-w-[190px] text-left font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-zinc-600">A player’s taste,<br />on full display.</p>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-between border-t border-white/[0.07] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 sm:px-9"><span>Open collection</span><span>Made of games & opinions</span></div>
        </section>

        {favoriteGames.length > 0 && (
          <CollectionSection title="Their orbit" eyebrow="01 / FAVOURITES" subtitle={`Games ${user.name} keeps close.`} count={favoriteGames.length} empty="No favourites to show." scrollRef={favRef} onScroll={scroll}>
            {favoriteGames.map((game, index) => (
              <Link key={game._id} href={`/game/${game.slug}`} className="scroll-card group w-[158px] shrink-0 sm:w-[200px]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-[#17181e] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d9ff70]/50 group-hover:shadow-[0_16px_45px_rgba(217,255,112,.08)]">
                  <Image src={game.coverImage || "/fallback.jpg"} alt={game.name} fill unoptimized sizes="(max-width: 640px) 158px, 200px" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <span className="absolute left-3 top-3 font-mono text-[10px] text-white/80">#{String(index + 1).padStart(2, "0")}</span>
                  <div className="absolute inset-x-0 bottom-0 p-3"><h3 className="line-clamp-2 text-sm font-bold leading-5">{game.name}</h3><p className="mt-2 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#d9ff70]"><Heart size={11} fill="currentColor" /> In their orbit</p></div>
                </div>
              </Link>
            ))}
          </CollectionSection>
        )}

        {reviews.length > 0 && (
          <CollectionSection title="The play journal" eyebrow="02 / REVIEWS" subtitle={`Latest reviews written by ${user.name}.`} count={reviews.length} empty="No reviews to show." scrollRef={reviewRef} onScroll={scroll}>
            {reviews.map((review, index) => (
              <Link key={review._id} href={`/game/${review.gameId.slug}`} className="scroll-card group w-[158px] shrink-0 sm:w-[200px]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-[#17181e] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d9ff70]/50">
                  <Image src={review.gameId.coverImage || "/fallback.jpg"} alt={review.gameId.name} fill unoptimized sizes="(max-width: 640px) 158px, 200px" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/45 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/80">Entry {String(index + 1).padStart(2, "0")}</span>
                  <div className="absolute inset-x-0 bottom-0 p-3"><h3 className="line-clamp-2 text-sm font-bold leading-5">{review.gameId.name}</h3><p className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#d9ff70]">View game <ArrowDownRight size={12} /></p></div>
                </div>
              </Link>
            ))}
          </CollectionSection>
        )}

        {favoriteGames.length === 0 && reviews.length === 0 && <div className="mt-12 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center"><MessageSquare className="mx-auto mb-4 text-[#d9ff70]/60" size={24} /><h2 className="text-2xl font-black tracking-tight">A blank save slot<span className="text-[#d9ff70]">.</span></h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">This player hasn’t added favourites or written reviews yet. Check back after their next session.</p></div>}
      </div>
    </main>
  );
}

type CollectionSectionProps = {
  title: string;
  eyebrow: string;
  subtitle: string;
  count: number;
  empty: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (ref: React.RefObject<HTMLDivElement | null>, dir: "left" | "right") => void;
  children: React.ReactNode;
};

function CollectionSection({ title, eyebrow, subtitle, count, empty, scrollRef, onScroll, children }: CollectionSectionProps) {
  return (
    <section className="mt-14 sm:mt-20">
      <div className="mb-5 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#d9ff70]">{eyebrow}</p><div className="flex flex-wrap items-baseline gap-3"><h2 className="text-3xl font-black tracking-[-0.05em] sm:text-4xl">{title}<span className="text-[#d9ff70]">.</span></h2><span className="font-mono text-xs text-zinc-600">{String(count).padStart(2, "0")}</span></div><p className="mt-2 text-sm text-zinc-500">{subtitle}</p></div><div className="flex items-center gap-2 self-end sm:self-auto"><button aria-label={`Scroll ${title} left`} onClick={() => onScroll(scrollRef, "left")} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:border-[#d9ff70]/40 hover:text-[#d9ff70]"><ArrowLeft size={16} /></button><button aria-label={`Scroll ${title} right`} onClick={() => onScroll(scrollRef, "right")} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:border-[#d9ff70]/40 hover:text-[#d9ff70]"><ArrowRight size={16} /></button></div></div>
      {count > 0 ? <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{children}</div> : <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center sm:py-14"><Sparkles className="mx-auto mb-3 text-[#d9ff70]/60" size={22} /><p className="mx-auto max-w-md text-sm leading-6 text-zinc-500">{empty}</p></div>}
    </section>
  );
}
