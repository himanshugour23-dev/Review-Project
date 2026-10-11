"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  ImagePlus,
  Pencil,
  Quote,
  Sparkles,
  X,
} from "lucide-react";

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

type ToastState = { type: "success" | "error"; msg: string } | null;

const fallbackAvatar = "/avatar-placeholder.png";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const favRef = useRef<HTMLDivElement | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/user/me", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load profile");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const nextUser = data.user as User;
        setUser(nextUser);
        setReviews(data.review ?? []);
        setBioDraft(nextUser?.bio ?? "");
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: "left" | "right") => {
    if (!ref.current) return;
    const card = ref.current.querySelector<HTMLElement>(".scroll-card");
    if (!card) return;
    ref.current.scrollBy({ left: dir === "left" ? -(card.offsetWidth + 16) : card.offsetWidth + 16, behavior: "smooth" });
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setAvatarLoading(true);
      setToast({ type: "success", msg: "Avatar submitted for moderation. This may take a few moments." });
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/user/me/avatar", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUser((prev) => (prev ? { ...prev, avatar: data.avatar } : prev));
      setToast({ type: "success", msg: "Avatar updated successfully!" });
    } catch (err) {
      setToast({ type: "error", msg: err instanceof Error ? err.message : "Avatar upload failed" });
    } finally {
      setAvatarLoading(false);
    }
  };

  const saveBio = async () => {
    try {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: bioDraft }),
      });
      if (!res.ok) throw new Error("Could not save bio");
      setUser((prev) => (prev ? { ...prev, bio: bioDraft } : prev));
      setEditingBio(false);
      setToast({ type: "success", msg: "Bio updated." });
    } catch {
      setToast({ type: "error", msg: "Could not save your bio. Try again." });
    }
  };

  const removeFromFavourites = async (gameId: string) => {
    try {
      const res = await fetch("/api/user/me/favourite/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
      });
      if (!res.ok) throw new Error("Failed to remove favourite");
      setUser((prev) => prev ? { ...prev, favoriteGames: prev.favoriteGames.filter((game) => game._id !== gameId) } : prev);
      setToast({ type: "success", msg: "Removed from favourites." });
    } catch {
      setToast({ type: "error", msg: "Could not remove that game." });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#08090c] px-5 pt-28 text-white">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-56 rounded-[2rem] border border-white/5 bg-[#101116]" />
          <div className="mt-8 h-7 w-56 rounded bg-white/10" />
          <div className="mt-5 flex gap-4 overflow-hidden">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-64 min-w-44 rounded-2xl bg-[#101116]" />)}</div>
        </div>
      </main>
    );
  }

  if (!user) {
    return <main className="flex min-h-screen items-center justify-center bg-[#08090c] px-5 text-center text-zinc-400">Couldn’t load your profile. Please refresh and try again.</main>;
  }

  const favoriteGames = user.favoriteGames ?? [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090c] pb-20 pt-24 text-white selection:bg-[#d9ff70] selection:text-black">
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent_65%)]" />
      <div className="pointer-events-none absolute -right-40 top-24 h-[30rem] w-[30rem] rounded-full bg-[#d9ff70]/[0.07] blur-[130px]" />

      {toast && (
        <div role="status" className={`fixed right-4 top-5 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl ${toast.type === "success" ? "border-[#d9ff70]/25 bg-[#171b12]/95 text-[#e8ffad]" : "border-red-500/30 bg-[#1d1012]/95 text-red-200"}`}>
          <span className="mt-0.5">{toast.type === "success" ? <Check size={16} /> : <X size={16} />}</span>{toast.msg}
          <button aria-label="Dismiss notification" onClick={() => setToast(null)} className="ml-2 text-current/60 hover:text-current"><X size={15} /></button>
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#101116]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_0%,rgba(217,255,112,.13),transparent_38%),linear-gradient(125deg,rgba(255,255,255,.035),transparent_55%)]" />
          <div className="absolute right-5 top-4 hidden select-none font-mono text-[10px] uppercase tracking-[0.35em] text-white/25 sm:block">Player archive / 001</div>
          <div className="relative grid gap-8 p-6 sm:p-9 md:grid-cols-[auto_1fr] md:items-center md:gap-10 md:p-12">
            <div className="relative mx-auto md:mx-0">
              <div className="absolute -inset-3 rounded-[2rem] border border-[#d9ff70]/20 rotate-6" />
              <div className="group relative h-32 w-32 overflow-hidden rounded-[1.65rem] bg-[#1b1d23] ring-1 ring-white/15 sm:h-40 sm:w-40">
                <Image src={user.avatar || fallbackAvatar} width={320} height={320} alt={`${user.name}'s avatar`} unoptimized className="h-full w-full object-cover" />
                {avatarLoading && <div className="absolute inset-0 flex items-center justify-center bg-black/75 text-xs text-[#d9ff70]">Uploading…</div>}
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={avatarLoading} className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 text-xs font-semibold opacity-0 transition group-hover:opacity-100 focus:opacity-100 disabled:cursor-wait">
                  <ImagePlus size={22} className="text-[#d9ff70]" /> Change portrait
                </button>
              </div>
              <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleAvatarUpload(file); event.currentTarget.value = ""; }} />
              <span className="absolute -bottom-3 -right-3 grid h-10 w-10 place-items-center rounded-full border-4 border-[#101116] bg-[#d9ff70] text-black"><Sparkles size={16} /></span>
            </div>

            <div className="min-w-0 text-center md:text-left">
              <div className="mb-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <span className="rounded-full border border-[#d9ff70]/25 bg-[#d9ff70]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#d9ff70]">Your corner of the internet</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">// profile.exe</span>
              </div>
              <h1 className="break-words text-4xl font-black tracking-[-0.06em] sm:text-6xl">{user.name}<span className="text-[#d9ff70]">.</span></h1>
              <div className="mx-auto mt-4 flex max-w-2xl items-start justify-center gap-2 text-sm leading-7 text-zinc-400 md:mx-0 md:justify-start">
                <Quote size={17} className="mt-1 shrink-0 text-[#d9ff70]/70" />
                {editingBio ? (
                  <div className="w-full max-w-xl text-left">
                    <textarea value={bioDraft} onChange={(event) => setBioDraft(event.target.value)} maxLength={280} rows={3} aria-label="Your bio" className="w-full resize-y rounded-xl border border-[#d9ff70]/25 bg-black/40 p-3 text-sm text-white outline-none transition focus:border-[#d9ff70]/60" placeholder="Tell the world what you play…" />
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-zinc-600">{bioDraft.length}/280</span>
                      <div className="flex gap-2">
                        <button onClick={() => { setBioDraft(user.bio ?? ""); setEditingBio(false); }} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/5">Cancel</button>
                        <button onClick={() => void saveBio()} className="inline-flex items-center gap-1.5 rounded-lg bg-[#d9ff70] px-3 py-2 text-xs font-bold text-black transition hover:bg-[#e5ff9d]"><Check size={14} /> Save bio</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="max-w-2xl">{user.bio || <span className="italic text-zinc-500">No bio yet. Every great player has a story.</span>}</p>
                    <button aria-label="Edit bio" onClick={() => setEditingBio(true)} className="mt-1 shrink-0 text-zinc-500 transition hover:text-[#d9ff70]"><Pencil size={14} /></button>
                  </>
                )}
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3"><span className="block font-mono text-2xl font-bold tabular-nums">{favoriteGames.length.toString().padStart(2, "0")}</span><span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">Favourites</span></div>
                <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3"><span className="block font-mono text-2xl font-bold tabular-nums">{reviews.length.toString().padStart(2, "0")}</span><span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">Reviews</span></div>
                <div className="hidden h-12 w-px bg-white/10 sm:block" />
                <p className="max-w-[190px] text-left font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-zinc-600">Curated by you.<br />Played your way.</p>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-between border-t border-white/[0.07] px-5 py-3 font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 sm:px-9"><span>Personal collection</span><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#d9ff70]" /> All systems personal</span></div>
        </section>

        <CollectionSection title="The keepers" eyebrow="01 / FAVOURITES" subtitle="Games you keep coming back to." count={favoriteGames.length} empty="Your hall of fame is empty. Add games you love and they’ll live here." scrollRef={favRef} onScroll={scroll}>
          {favoriteGames.map((game, index) => (
            <Link key={game._id} href={`/game/${game.slug}`} className="scroll-card group relative w-[158px] shrink-0 sm:w-[190px]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-[#17181e] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d9ff70]/50 group-hover:shadow-[0_16px_45px_rgba(217,255,112,.08)]">
                <Image src={game.coverImage || "/fallback.jpg"} alt={game.name} fill unoptimized sizes="(max-width: 640px) 158px, 190px" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <span className="absolute left-3 top-3 font-mono text-[10px] text-white/80">#{String(index + 1).padStart(2, "0")}</span>
                <button type="button" aria-label={`Remove ${game.name} from favourites`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); void removeFromFavourites(game._id); }} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-black/65 text-white/80 opacity-100 transition hover:border-red-400/50 hover:bg-red-500 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"><X size={15} /></button>
                <div className="absolute inset-x-0 bottom-0 p-3"><p className="line-clamp-2 text-sm font-bold leading-5 text-white">{game.name}</p><p className="mt-2 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#d9ff70]"><Heart size={11} fill="currentColor" /> In your orbit</p></div>
              </div>
            </Link>
          ))}
        </CollectionSection>

        <CollectionSection title="The play journal" eyebrow="02 / REVIEWS" subtitle="Every rating leaves a little trace." count={reviews.length} empty="No reviews in your journal yet. Rate a game and leave your mark." scrollRef={reviewRef} onScroll={scroll}>
          {reviews.map((review, index) => (
            <Link key={review._id} href={`/game/${review.gameId.slug}`} className="scroll-card group w-[158px] shrink-0 sm:w-[190px]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-[#17181e] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d9ff70]/50">
                <Image src={review.gameId.coverImage || "/fallback.jpg"} alt={review.gameId.name} fill unoptimized sizes="(max-width: 640px) 158px, 190px" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/45 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/80">Entry {String(index + 1).padStart(2, "0")}</span>
                <div className="absolute inset-x-0 bottom-0 p-3"><p className="line-clamp-2 text-sm font-bold leading-5 text-white">{review.gameId.name}</p><p className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#d9ff70]">Open entry <ArrowDownRight size={12} /></p></div>
              </div>
            </Link>
          ))}
        </CollectionSection>
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
      <div className="mb-5 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#d9ff70]">{eyebrow}</p><div className="flex flex-wrap items-baseline gap-3"><h2 className="text-3xl font-black tracking-[-0.05em] sm:text-4xl">{title}<span className="text-[#d9ff70]">.</span></h2><span className="font-mono text-xs text-zinc-600">{String(count).padStart(2, "0")}</span></div><p className="mt-2 text-sm text-zinc-500">{subtitle}</p></div>
        <div className="flex items-center gap-2 self-end sm:self-auto"><button aria-label={`Scroll ${title} left`} onClick={() => onScroll(scrollRef, "left")} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:border-[#d9ff70]/40 hover:text-[#d9ff70]"><ArrowLeft size={16} /></button><button aria-label={`Scroll ${title} right`} onClick={() => onScroll(scrollRef, "right")} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:border-[#d9ff70]/40 hover:text-[#d9ff70]"><ArrowRight size={16} /></button></div>
      </div>
      {count > 0 ? <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{children}</div> : <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center sm:py-14"><Sparkles className="mx-auto mb-3 text-[#d9ff70]/60" size={22} /><p className="mx-auto max-w-md text-sm leading-6 text-zinc-500">{empty}</p></div>}
    </section>
  );
}
