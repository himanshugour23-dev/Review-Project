"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Rating from "@mui/material/Rating";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CircleHelp,
  ExternalLink,
  Gamepad2,
  Heart,
  MessageCircle,
  Send,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  UserRound,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import SleepLoader from "@/components/SleepLoader";

type PremiumTab = "info" | "dlc";

interface GamePageData {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
  released?: string;
  metacritic?: number;
  averageRating?: number;
  genres?: string[];
  platforms?: string[];
  rawgDetails?: {
    developers?: { name: string }[];
    publishers?: { name: string }[];
    stores?: { id?: string | number; name: string; url?: string }[];
    dlc?: {
      id?: string | number;
      slug: string;
      name: string;
      image?: string;
      released?: string;
    }[];
  };
  [key: string]: any;
}

interface ReviewData {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  reviewText?: string;
  likes?: number;
  dislikes?: number;
  reaction?: "like" | "dislike" | null;
  [key: string]: any;
}

const formatDate = (value?: string) => {
  if (!value) return "Release date unknown";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Release date unknown"
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
};

const initials = (name?: string) =>
  (name || "Player")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function GamePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const { data: session } = useSession();

  const [game, setGame] = useState<GamePageData | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [premiumTab, setPremiumTab] = useState<PremiumTab>("info");

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/games/${slug}`, { signal: controller.signal, cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load this game.");
        return res.json();
      })
      .then((data) => {
        setGame(data?.game ?? null);
        setReviews(data?.reviews ?? []);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(error);
          toast.error("Could not load this game.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (!session?.user?.id || reviews.length === 0) return;

    const existingReview = reviews.find(
      (review) => review.userId?._id === session.user.id,
    );

    if (existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.reviewText ?? "");
    }
  }, [session, reviews]);

  const addToFavourite = async () => {
    if (!session) {
      toast.error("Login required");
      return;
    }
    if (!game) return;

    try {
      const res = await fetch("/api/user/me/favourite/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: game._id }),
      });
      if (res.ok) toast.success("Added to favourites");
      else toast.error("Failed to add favourite");
    } catch {
      toast.error("Network error while adding favourite");
    }
  };

  const submitReview = async () => {
    if (!session) {
      toast.error("Login required");
      return;
    }
    if (!game) return;
    if (!rating) {
      toast.error("Select a rating first");
      return;
    }

    const toastId = toast.loading("Submitting your review...");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: game._id, rating, reviewText }),
      });

      if (!res.ok) {
        toast.error("Submission failed", { id: toastId });
        return;
      }

      const updatedResponse = await fetch(`/api/games/${slug}`, {
        cache: "no-store",
      });
      if (!updatedResponse.ok) throw new Error("Could not refresh reviews.");
      const updated = await updatedResponse.json();

      setReviews(updated?.reviews ?? []);
      setGame(updated?.game ?? game);
      setReviewText("");
      setRating(null);
      toast.success("Review submitted!", { id: toastId });
    } catch {
      toast.error("Network error", { id: toastId });
    }
  };

  const reactToReview = async (reviewId: string, type: "like" | "dislike") => {
    if (!session) {
      toast.error("Login required to react");
      return;
    }

    setReviews((current) =>
      current.map((review) => {
        if (review._id !== reviewId) return review;

        if (type === "like") {
          const removingLike = review.reaction === "like";
          return {
            ...review,
            reaction: removingLike ? null : "like",
            likes: Math.max((review.likes || 0) + (removingLike ? -1 : 1), 0),
            dislikes: Math.max(
              (review.dislikes || 0) - (review.reaction === "dislike" ? 1 : 0),
              0,
            ),
          };
        }

        const removingDislike = review.reaction === "dislike";
        return {
          ...review,
          reaction: removingDislike ? null : "dislike",
          dislikes: Math.max(
            (review.dislikes || 0) + (removingDislike ? -1 : 1),
            0,
          ),
          likes: Math.max(
            (review.likes || 0) - (review.reaction === "like" ? 1 : 0),
            0,
          ),
        };
      }),
    );

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, type }),
      });
      if (!res.ok) toast.error("Could not save reaction");
    } catch {
      toast.error("Could not save reaction");
    }
  };

  const reportReview = async (reviewId: string) => {
    if (!session) {
      toast.error("Login required to report");
      return;
    }

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, reason: "Inappropriate content" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Report failed");
      toast.success("Review reported");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to report review");
    }
  };

  const ratingData = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      const index = Math.floor(Number(review.rating)) - 1;
      if (index >= 0 && index < buckets.length) buckets[index] += 1;
    });
    return buckets.map((count, index) => ({ star: `${index + 1}`, count }));
  }, [reviews]);

  const orderedReviews = useMemo(() => {
    const ordered = [...reviews];
    if (session?.user?.id) {
      const index = ordered.findIndex(
        (review) => review.userId?._id === session.user.id,
      );
      if (index > -1) ordered.unshift(...ordered.splice(index, 1));
    }
    return ordered;
  }, [reviews, session]);

  const writtenReviews = orderedReviews.filter(
    (review) => review.reviewText && review.reviewText.trim().length > 0,
  );
  const ownReviewExists = reviews.some(
    (review) => review.userId?._id === session?.user?.id,
  );
  const dlcList = game?.rawgDetails?.dlc ?? [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08090c]">
        <SleepLoader />
      </div>
    );
  }

  if (!game) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090c] px-6 text-white">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d9ff70]/20 bg-[#d9ff70]/5 text-[#d9ff70]">
            <CircleHelp size={28} />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-[#d9ff70]">
            Lost in the backlog
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Game not found.</h1>
          <p className="mt-3 text-sm leading-6 text-white/50">
            This page may have moved, or the game is no longer available.
          </p>
          <Link
            href="/discover"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#d9ff70] px-5 py-3 text-sm font-bold text-[#08090c] transition hover:bg-white"
          >
            <ArrowLeft size={16} /> Back to discovery
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#08090c] text-white selection:bg-[#d9ff70] selection:text-[#08090c]">
      {/* Cinematic cover / editorial masthead */}
      <section className="relative isolate min-h-[520px] overflow-hidden sm:min-h-[620px]">
        <div className="absolute inset-0 -z-20">
          {game.coverImage ? (
            <Image
              src={game.coverImage}
              alt={`${game.name} artwork`}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center opacity-55 blur-[1px]"
            />
          ) : null}
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#08090c_0%,rgba(8,9,12,.9)_32%,rgba(8,9,12,.36)_75%,rgba(8,9,12,.62)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,#08090c_0%,rgba(8,9,12,.15)_65%,rgba(8,9,12,.55)_100%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="absolute right-[-8rem] top-16 -z-10 h-72 w-72 rounded-full bg-[#d9ff70]/10 blur-[100px]" />

        <div className="mx-auto flex min-h-[520px] max-w-[1400px] flex-col justify-between px-5 pb-24 pt-28 sm:min-h-[620px] sm:px-8 sm:pb-32 lg:px-12">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55 transition hover:text-[#d9ff70]"
            >
              <ArrowLeft size={15} /> Back to the wild
            </Link>
            <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 backdrop-blur-md sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d9ff70] shadow-[0_0_12px_#d9ff70]" />
              Player archive / 001
            </span>
          </div>

          <div className="grid items-end gap-10 md:grid-cols-[minmax(0,1fr)_190px] lg:grid-cols-[minmax(0,1fr)_230px]">
            <div className="max-w-4xl">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d9ff70]/25 bg-[#d9ff70]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#d9ff70]">
                  <Gamepad2 size={13} /> Game file
                </span>
                {game.metacritic !== undefined && game.metacritic !== null && (
                  <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/70 backdrop-blur-md">
                    Metacritic <span className="ml-1 text-white">{game.metacritic}</span>
                  </span>
                )}
              </div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                The next chapter is yours
              </p>
              <h1 className="max-w-5xl text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[6.5rem]">
                {game.name}
                <span className="text-[#d9ff70]">.</span>
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={15} className="text-[#d9ff70]" />
                  {formatDate(game.released)}
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
                <span className="inline-flex items-center gap-2">
                  <Sparkles size={15} className="text-[#d9ff70]" />
                  {game.genres?.length ? game.genres.join(" / ") : "Genre unknown"}
                </span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative mx-auto w-full max-w-[230px] rotate-[2deg] transition duration-500 hover:rotate-0">
                <div className="absolute -inset-2 rounded-[5px] border border-[#d9ff70]/30" />
                <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-[#17181e] shadow-[0_24px_80px_rgba(0,0,0,.65)]">
                  {game.coverImage ? (
                    <Image
                      src={game.coverImage}
                      alt={game.name}
                      fill
                      unoptimized
                      sizes="230px"
                      className="object-cover transition duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/20"><Gamepad2 size={42} /></div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.24em] text-white/35">
                  <span>BACLOGGED FILE</span><span>№ 01</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d9ff70]/35 to-transparent" />
      </section>

      <main className="relative mx-auto -mt-10 max-w-[1400px] px-5 pb-24 sm:px-8 lg:px-12">
        {/* The game dossier */}
        <section className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#101116] p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#d9ff70]/[0.07] blur-[80px]" />
            <div className="relative flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#d9ff70]">01 / The pulse</p>
                <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">What players think.</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/45">A score made from real player ratings, not just marketing noise.</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d9ff70]/20 bg-[#d9ff70]/[0.08] text-[#d9ff70]">
                <Trophy size={19} />
              </div>
            </div>
            <div className="relative mt-8 flex flex-wrap items-end gap-x-5 gap-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black leading-none tracking-[-0.07em] text-white sm:text-7xl">
                  {Number(game.averageRating || 0).toFixed(1)}
                </span>
                <span className="text-lg text-[#d9ff70]">/ 5</span>
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-1 text-[#d9ff70]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={13} fill={index < Math.round(Number(game.averageRating || 0)) ? "currentColor" : "none"} className={index < Math.round(Number(game.averageRating || 0)) ? "" : "text-white/20"} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-white/40">{reviews.length} {reviews.length === 1 ? "rating" : "ratings"} logged</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {(game.genres ?? []).map((genre: string) => (
                <span key={genre} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] font-medium text-white/65 transition hover:border-[#d9ff70]/30 hover:text-[#d9ff70]">{genre}</span>
              ))}
            </div>
            <div className="mt-7 border-t border-white/[0.08] pt-5">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/35">Available worlds</p>
              <p className="mt-2 text-sm leading-6 text-white/65">{game.platforms?.length ? game.platforms.join(" · ") : "Platform information unavailable"}</p>
            </div>
            {session && (
              <button
                type="button"
                onClick={addToFavourite}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d9ff70]/25 bg-[#d9ff70]/[0.08] px-4 py-2.5 text-xs font-bold text-[#d9ff70] transition hover:bg-[#d9ff70] hover:text-[#08090c]"
              >
                <Heart size={15} /> Add to favourites <ArrowUpRight size={13} />
              </button>
            )}
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#101116] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#d9ff70]">02 / The numbers</p>
                <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Rating breakdown.</h2>
                <p className="mt-2 text-sm text-white/45">Every star tells a different story.</p>
              </div>
              <span className="font-mono text-xs text-white/25">1 — 5 ★</span>
            </div>
            <div className="mt-5 h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingData} margin={{ top: 10, right: 4, left: -24, bottom: 0 }}>
                  <XAxis dataKey="star" tick={{ fill: "#777b82", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}★`} />
                  <YAxis hide allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(217,255,112,.05)" }}
                    contentStyle={{ background: "#17181e", border: "1px solid rgba(217,255,112,.2)", borderRadius: 12, color: "#fff", fontSize: 12 }}
                    labelFormatter={(value) => `${value} star${value === "1" ? "" : "s"}`}
                    formatter={(value) => [`${value} rating${Number(value) === 1 ? "" : "s"}`, "Players"]}
                  />
                  <Bar dataKey="count" fill="#d9ff70" radius={[7, 7, 2, 2]} maxBarSize={38} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 text-[10px] uppercase tracking-[0.18em] text-white/30">
              <span>Community signal</span><span>{reviews.length} total entries</span>
            </div>
          </div>
        </section>

        {/* Premium / extra insights */}
        {game.rawgDetails && (
          <section className="relative mt-6 overflow-hidden rounded-[1.75rem] border border-[#d9ff70]/15 bg-[#0e100d]">
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#d9ff70]/[0.06] blur-[90px]" />
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9ff70]/25 bg-[#d9ff70]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-[#d9ff70]"><Sparkles size={11} /> Extra signal</span>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-white/25">03 / Deep cuts</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Beyond the cover.</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">The people behind it, where to find it, and the worlds that came after.</p>
                </div>
                <Link href={`/game/${slug}/creators`} className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#d9ff70] px-5 py-3 text-xs font-black text-[#08090c] transition hover:bg-white sm:self-auto">
                  Meet the creators <ArrowUpRight size={15} />
                </Link>
              </div>

              <div className="mt-8 flex gap-6 border-b border-white/10">
                <button type="button" onClick={() => setPremiumTab("info")} className={cn("relative -mb-px flex items-center gap-2 border-b-2 px-1 pb-3 text-xs font-bold transition", premiumTab === "info" ? "border-[#d9ff70] text-[#d9ff70]" : "border-transparent text-white/40 hover:text-white")}>
                  <CircleHelp size={14} /> Field notes
                </button>
                <button type="button" onClick={() => setPremiumTab("dlc")} className={cn("relative -mb-px flex items-center gap-2 border-b-2 px-1 pb-3 text-xs font-bold transition", premiumTab === "dlc" ? "border-[#d9ff70] text-[#d9ff70]" : "border-transparent text-white/40 hover:text-white")}>
                  <Gamepad2 size={14} /> Expansion worlds <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px]">{dlcList.length}</span>
                </button>
              </div>

              {premiumTab === "info" && (
                <div className="grid gap-7 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">Built by</p>
                    <p className="mt-2 text-sm leading-6 text-white/75">{game.rawgDetails.developers?.length ? game.rawgDetails.developers.map((item: any) => item.name).join(", ") : "Developer information unavailable"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">Put out into the world by</p>
                    <p className="mt-2 text-sm leading-6 text-white/75">{game.rawgDetails.publishers?.length ? game.rawgDetails.publishers.map((item: any) => item.name).join(", ") : "Publisher information unavailable"}</p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">Find your copy</p>
                    {game.rawgDetails.stores?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {game.rawgDetails.stores.map((store: any) => store.url ? (
                          <a key={store.id ?? store.name} href={store.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[11px] text-white/65 transition hover:border-[#d9ff70]/30 hover:text-[#d9ff70]">{store.name}<ExternalLink size={11} /></a>
                        ) : (
                          <span key={store.id ?? store.name} className="rounded-full border border-white/10 px-3 py-2 text-[11px] text-white/40">{store.name}</span>
                        ))}
                      </div>
                    ) : <p className="mt-2 text-sm text-white/40">No store links available.</p>}
                  </div>
                </div>
              )}

              {premiumTab === "dlc" && (
                <div className="pt-6">
                  {dlcList.length ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {dlcList.map((item: any) => (
                        <Link key={item.id ?? item.slug} href={`/game/${item.slug}`} className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] transition hover:-translate-y-1 hover:border-[#d9ff70]/30 hover:bg-white/[0.045]">
                          <div className="relative aspect-[16/9] overflow-hidden bg-[#17181e]">
                            {item.image ? <Image src={item.image} alt={item.name} fill unoptimized sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-white/20"><Gamepad2 size={24} /></div>}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <span className="absolute bottom-2 left-3 text-[9px] font-black uppercase tracking-[0.2em] text-[#d9ff70]">Expansion file</span>
                          </div>
                          <div className="p-3 sm:p-4">
                            <p className="truncate text-xs font-bold text-white/85">{item.name}</p>
                            {item.released && <p className="mt-1.5 text-[10px] text-white/35">{formatDate(item.released)}</p>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 px-5 py-12 text-center">
                      <Gamepad2 size={24} className="mx-auto text-white/25" />
                      <p className="mt-3 text-sm font-semibold text-white/60">No extra worlds found.</p>
                      <p className="mt-1 text-xs text-white/30">This file has no DLC listed right now.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Player reviews */}
        <section className="mt-16 sm:mt-20">
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-12">
            <div className="lg:sticky lg:top-8 lg:self-start">
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#d9ff70]">04 / The campfire</p>
              <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl">Your turn<br />to talk.</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/45">Games are better when the stories get shared. Leave a signal for the next player.</p>
              <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d9ff70]/20 bg-[#d9ff70]/[0.07] text-[#d9ff70]"><MessageCircle size={18} /></div>
                <div>
                  <p className="text-sm font-bold">{writtenReviews.length} written {writtenReviews.length === 1 ? "review" : "reviews"}</p>
                  <p className="mt-0.5 text-xs text-white/35">From the baclogged community</p>
                </div>
              </div>
            </div>

            <div className="min-w-0">
              {session ? (
                <div className="relative overflow-hidden rounded-[1.75rem] border border-[#d9ff70]/20 bg-[#11130e] p-5 sm:p-7">
                  <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#d9ff70]/[0.07] blur-[90px]" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#d9ff70]">Your field notes</p>
                        <h3 className="mt-2 text-xl font-black tracking-tight">{ownReviewExists ? "Change your verdict." : "Leave your mark."}</h3>
                        <p className="mt-1 text-xs leading-5 text-white/40">A rating is enough. A story is even better.</p>
                      </div>
                      <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#d9ff70] sm:flex"><Send size={17} /></div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/25 p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold">Rate this adventure</p>
                          <p className="mt-1 text-[11px] text-white/35">Half stars count. Go with your gut.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-[#d9ff70]">{rating ? rating.toFixed(1) : "—"}</span>
                          <Star size={16} fill={rating ? "currentColor" : "none"} className="text-[#d9ff70]" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <Rating
                          value={rating}
                          precision={0.5}
                          size="large"
                          onChange={(_, value) => { if (value !== null) setRating(value); }}
                          sx={{
                            "& .MuiRating-iconEmpty": { color: "#35382e" },
                            "& .MuiRating-iconFilled": { color: "#d9ff70" },
                            "& .MuiRating-iconHover": { color: "#f0ffb8" },
                            "& .MuiRating-icon": { fontSize: { xs: "1.8rem", sm: "2rem" } },
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label htmlFor="game-review" className="text-xs font-bold text-white/75">The actual review</label>
                        <span className={cn("font-mono text-[10px]", reviewText.length >= 950 ? "text-[#d9ff70]" : "text-white/30")}>{reviewText.length}/1000</span>
                      </div>
                      <textarea
                        id="game-review"
                        value={reviewText}
                        maxLength={1000}
                        onChange={(event) => setReviewText(event.target.value)}
                        placeholder="Did it live rent-free in your head? Did the final boss ruin your evening? Tell us."
                        className="min-h-[150px] w-full resize-y rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-sm leading-7 text-white/85 outline-none transition placeholder:text-white/25 hover:border-white/15 focus:border-[#d9ff70]/45 focus:ring-2 focus:ring-[#d9ff70]/[0.08]"
                      />
                    </div>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-xs text-[10px] leading-5 text-white/30">Your text is optional. Your rating will still be saved.</p>
                      <button type="button" onClick={submitReview} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9ff70] px-5 py-3 text-xs font-black text-[#08090c] transition hover:bg-white active:scale-[0.98]">
                        {ownReviewExists ? "Update review" : "Post review"} <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[1.75rem] border border-white/10 bg-[#101116] p-7 sm:p-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d9ff70]/20 bg-[#d9ff70]/[0.07] text-[#d9ff70]"><UserRound size={20} /></div>
                  <h3 className="mt-5 text-2xl font-black tracking-tight">Played it? Prove it.</h3>
                  <p className="mt-2 max-w-md text-sm leading-7 text-white/45">Log in to rate {game.name} and leave a note for the next person adding it to their backlog.</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#d9ff70]"><LockNote /> Your verdict belongs here.</div>
                </div>
              )}

              <div className="mt-8 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">From the community</p>
                  <h3 className="mt-2 text-xl font-black tracking-tight">Player notes <span className="ml-1 text-[#d9ff70]">({writtenReviews.length})</span></h3>
                </div>
                <span className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 sm:block">Unfiltered opinions</span>
              </div>

              {writtenReviews.length === 0 ? (
                <div className="mt-4 rounded-[1.5rem] border border-dashed border-white/10 px-6 py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/35"><MessageCircle size={20} /></div>
                  <h4 className="mt-4 text-sm font-bold text-white/70">The page is quiet. For now.</h4>
                  <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-white/35">Be the first to leave a written review and start the conversation.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {writtenReviews.map((review) => {
                    const isOwnReview = !!session?.user?.id && review.userId?._id === session.user.id;
                    return (
                      <article key={review._id} className={cn("group relative overflow-hidden rounded-[1.5rem] border p-5 transition sm:p-6", isOwnReview ? "border-[#d9ff70]/25 bg-[#d9ff70]/[0.035]" : "border-white/[0.08] bg-[#101116] hover:border-white/[0.15] hover:bg-[#131419]")}>
                        {isOwnReview && <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-[#d9ff70]" />}
                        <div className="flex items-start justify-between gap-3">
                          <Link href={`/user/${review.userId?._id}`} className="flex min-w-0 items-center gap-3">
                            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#1b1d21] text-xs font-black text-[#d9ff70] transition group-hover:border-[#d9ff70]/25">
                              {review.userId?.avatar ? <img src={review.userId.avatar} alt={review.userId?.name || "Player avatar"} className="h-full w-full object-cover" /> : initials(review.userId?.name)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="truncate text-sm font-bold text-white/85 transition group-hover:text-white">{review.userId?.name || "Unknown player"}</span>
                                {isOwnReview && <span className="inline-flex items-center gap-1 rounded-full bg-[#d9ff70]/10 px-2 py-0.5 text-[9px] font-bold text-[#d9ff70]"><Check size={10} /> Yours</span>}
                              </div>
                              <div className="mt-1.5 flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={11} fill={star <= Number(review.rating) ? "currentColor" : "none"} className={star <= Number(review.rating) ? "text-[#d9ff70]" : "text-white/15"} />)}
                                </div>
                                <span className="font-mono text-[10px] text-white/40">{Number(review.rating).toFixed(1)}</span>
                              </div>
                            </div>
                          </Link>
                          <button type="button" onClick={() => reportReview(review._id)} className="shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold text-white/30 transition hover:bg-red-400/10 hover:text-red-300">Report</button>
                        </div>

                        <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-white/65">{review.reviewText}</p>

                        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-4">
                          <button type="button" onClick={() => reactToReview(review._id, "like")} className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-bold transition", review.reaction === "like" ? "border-[#d9ff70]/30 bg-[#d9ff70]/10 text-[#d9ff70]" : "border-white/10 text-white/40 hover:border-[#d9ff70]/25 hover:text-[#d9ff70]")}>
                            <ThumbsUp size={12} /> Helpful <span>{review.likes || 0}</span>
                          </button>
                          <button type="button" onClick={() => reactToReview(review._id, "dislike")} className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-bold transition", review.reaction === "dislike" ? "border-red-400/30 bg-red-400/10 text-red-300" : "border-white/10 text-white/40 hover:border-red-400/25 hover:text-red-300")}>
                            <ThumbsDown size={12} /> Not for me <span>{review.dislikes || 0}</span>
                          </button>
                          <span className="ml-auto hidden items-center gap-1 text-[9px] uppercase tracking-[0.16em] text-white/20 sm:inline-flex"><Sparkles size={11} /> Player signal</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className="mt-20 flex flex-col gap-3 border-t border-white/[0.08] pt-6 text-[9px] font-bold uppercase tracking-[0.24em] text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <span>baclogged / player archive</span>
          <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#d9ff70]" /> Keep the good games close.</span>
        </footer>
      </main>
    </div>
  );
}

function LockNote() {
  return <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#d9ff70]/30 text-[9px]">↗</span>;
}
