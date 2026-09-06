"use client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {BarChart,Bar,XAxis,YAxis,ResponsiveContainer,} from "recharts";
import { cn } from "@/lib/utils";
import SleepLoader from "@/components/SleepLoader";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: session } = useSession();

  const [game, setGame] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);

  // Which tab is active inside the premium "Extra Insights" section
  const [premiumTab, setPremiumTab] = useState<"info" | "dlc">("info");

  useEffect(() => {
    fetch(`/api/games/${slug}`)
      .then(res => res.json())
      .then(data => {
        setGame(data.game);
        setReviews(data.reviews ?? []);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (session && reviews.length > 0) {
      const existingReview = reviews.find(
        r => r.userId._id === session.user.id
      );

      if (existingReview) {
        setRating(existingReview.rating);
        setReviewText(existingReview.reviewText ?? "");
      }
    }
  }, [session, reviews]);

  const DarkRating = styled(Rating)({
    "& .MuiRating-iconEmpty": {
      color: "#27272a",
    },
    "& .MuiRating-iconFilled": {
      color: "#facc15",
    },
    "& .MuiRating-iconHover": {
      color: "#fde047",
    },
  });

  function StarRating({value,onChange}: {
    value: number | null;
    onChange: (v: number) => void;
  }) {
    return (
      <Stack spacing={1}>
        <DarkRating
          value={value}
          precision={0.5}
          size="large"
          onChange={(e, v) => {
            if (v !== null) onChange(v);
          }}
        />
      </Stack>
    );
  }

  const addToFavourite = async () => {
    if (!session) {
      toast.error("Login required");
      return;
    }

    const res = await fetch("/api/user/me/favourite/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: game._id }),
    });

    if (res.ok) toast.success("Added to favourites");
    else toast.error("Failed to add favourite");
  };

  const submitReview = async () => {
    if (!rating) {
      toast.error("Select rating first");
      return;
    }

    const toastId = toast.loading("Submitting...");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: game._id,
          rating,
          reviewText,
        }),
      });

      if (!res.ok) {
        toast.error("Submission failed", { id: toastId });
        return;
      }

      const updated = await fetch(`/api/games/${slug}`).then(r => r.json());

      setReviews(updated.reviews ?? []);
      setGame(updated.game);

      setReviewText("");
      setRating(null);

      toast.success("Review submitted!", { id: toastId });
    } catch {
      toast.error("Network error", { id: toastId });
    }
  };

  const reactToReview = async (
    reviewId: string,
    type: "like" | "dislike"
  ) => {
    if (!session) {
      toast.error("Login required to react");
      return;
    }

    setReviews(prev =>
      prev.map(review => {
        if (review._id !== reviewId) return review;

        if (type === "like") {
          return {
            ...review,reaction: review.reaction === "like" ? null : "like",likes:
              review.reaction === "like"
                ? Math.max((review.likes || 1) - 1, 0)
                : (review.likes || 0) + 1,
            dislikes:
              review.reaction === "dislike"
                ? Math.max((review.dislikes || 1) - 1, 0)
                : review.dislikes || 0,
          };
        }

        return {
          ...review,
          reaction: review.reaction === "dislike" ? null : "dislike",
          dislikes:
            review.reaction === "dislike"
              ? Math.max((review.dislikes || 1) - 1, 0)
              : (review.dislikes || 0) + 1,
          likes:
            review.reaction === "like"
              ? Math.max((review.likes || 1) - 1, 0)
              : review.likes || 0,
        };
      })
    );

    await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, type }),
    });
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
        body: JSON.stringify({
          reviewId,
          reason: "Inappropriate content",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Report failed");
      }

      toast.success("Review reported");
    } catch (err: any) {
      toast.error(err.message || "Failed to report review");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <SleepLoader />
      </div>
    );
  }

  const ratingBuckets = [0, 0, 0, 0, 0];

  reviews.forEach(r => {
    const idx = Math.floor(r.rating) - 1;
    if (idx >= 0 && idx < 5) ratingBuckets[idx]++;
  });

  const ratingData = ratingBuckets.map((count, i) => ({
    star: `${i + 1}`,
    count,
  }));

  let orderedReviews = [...reviews];

  if (session) {
    const idx = orderedReviews.findIndex(
      r => r.userId._id === session.user.id
    );

    if (idx > -1) {
      const [userReview] = orderedReviews.splice(idx, 1);
      orderedReviews.unshift(userReview);
    }
  }

  const writtenReviews = orderedReviews.filter(
    r => r.reviewText && r.reviewText.trim().length > 0
  );

  const ownReviewExists = reviews.some(
    r => r.userId._id === session?.user.id
  );

  const dlcList: any[] = game.rawgDetails?.dlc ?? [];

  return (
    <>

      <div className="relative h-[45vh] sm:h-[72vh] w-full overflow-hidden">
        <Image
          src={game.coverImage}
          unoptimized
          alt={game.name}
          fill
          priority
          className="object-cover object-center brightness-[0.45]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
      </div>

      <main className="relative -mt-24 sm:-mt-32 max-w-6xl mx-auto px-4 sm:px-6 pb-20 text-white">
   
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-7 sm:gap-9 items-start">
          <div className="relative mx-auto md:mx-0 w-full max-w-[260px]">
            <div className="absolute -inset-1 rounded-2xl bg-indigo-500/10 blur-xl" />
            <Image
              src={game.coverImage}
              unoptimized
              alt={game.name}
              width={300}
              height={280}
              className="relative w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl ring-1 ring-white/10"
            />
          </div>

          <div className="min-w-0 pt-1 sm:pt-4">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-[11px] font-medium text-indigo-300">
                GAME
              </span>

              {game.metacritic && (
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-400">
                  Metacritic {game.metacritic}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              {game.name}
            </h1>

            <p className="mt-2 text-sm sm:text-base text-gray-400">
              Released {new Date(game.released).toDateString()}
            </p>

   
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 max-w-2xl">
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4 min-w-[170px]">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  Community rating
                </p>

                <div className="flex items-end gap-2 mt-2">
                  <span className="text-4xl font-bold text-white">
                    {game.averageRating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-yellow-400 text-xl mb-1">★</span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {reviews.length} {reviews.length === 1 ? "rating" : "ratings"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 min-w-0">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500 mb-1">
                  Rating distribution
                </p>

                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratingData}>
                      <XAxis
                        dataKey="star"
                        tick={{ fill: "#71717a", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Bar
                        dataKey="count"
                        radius={[5, 5, 2, 2]}
                        fill="#6366f1"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          
            <div className="mt-5 flex flex-wrap gap-2">
              {game.genres?.map((g: string) => (
                <span
                  key={g}
                  className="px-3 py-1.5 text-xs rounded-full bg-white/[0.06] border border-white/10 text-gray-300"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-500 leading-6">
              <span className="text-gray-400">Platforms:</span>{" "}
              {game.platforms?.join(", ")}
            </div>

            {session && (
              <button
                onClick={addToFavourite}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 hover:border-white/20 transition text-sm"
              >
                <span>♥</span>
                Add to Favourites
              </button>
            )}
          </div>
        </div>

        {game.rawgDetails && (
          <section className="mt-12 overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/35 via-white/[0.025] to-transparent">
            <div className="p-5 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-1 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 font-semibold tracking-wider">
                      PREMIUM
                    </span>
                    <h3 className="text-lg font-semibold">Extra Insights</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    More information about this game and its content.
                  </p>
                </div>

                <Link
                  href={`/game/${slug}/creators`}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition text-sm font-medium"
                >
                  See Creators →
                </Link>
              </div>

              <div className="mt-6 flex gap-1 border-b border-white/10">
                <button
                  onClick={() => setPremiumTab("info")}
                  className={cn(
                    "px-4 py-2.5 text-sm border-b-2 transition",
                    premiumTab === "info"
                      ? "border-indigo-500 text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  )}
                >
                  Info
                </button>
                <button
                  onClick={() => setPremiumTab("dlc")}
                  className={cn(
                    "px-4 py-2.5 text-sm border-b-2 transition",
                    premiumTab === "dlc"
                      ? "border-indigo-500 text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  )}
                >
                  DLC {dlcList.length > 0 && `(${dlcList.length})`}
                </button>
              </div>

              {premiumTab === "info" && (
                <div className="mt-5 space-y-4">
                  {game.rawgDetails.developers?.length > 0 && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-600 mb-1">
                        Developers
                      </p>
                      <p className="text-sm text-gray-300">
                        {game.rawgDetails.developers
                          .map((d: any) => d.name)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {game.rawgDetails.publishers?.length > 0 && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-600 mb-1">
                        Publishers
                      </p>
                      <p className="text-sm text-gray-300">
                        {game.rawgDetails.publishers
                          .map((p: any) => p.name)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {game.rawgDetails.stores?.length > 0 && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-600 mb-2">
                        Available on
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {game.rawgDetails.stores.map((s: any) =>
                          s.url ? (
                            <a
                              key={s.id ?? s.name}
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 hover:bg-white/10 transition text-xs text-gray-300"
                            >
                              {s.name}
                            </a>
                          ) : (
                            <span
                              key={s.id ?? s.name}
                              className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-gray-400"
                            >
                              {s.name}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {!game.rawgDetails.developers?.length &&
                    !game.rawgDetails.publishers?.length &&
                    !game.rawgDetails.stores?.length && (
                      <p className="text-sm text-gray-500">
                        No extra info available.
                      </p>
                    )}
                </div>
              )}

              {premiumTab === "dlc" && (
                <div className="mt-5">
                  {dlcList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {dlcList.map((item: any) => (
                        <Link
                          key={item.id ?? item.slug}
                          href={`/game/${item.slug}`}
                          className="group block rounded-xl overflow-hidden bg-white/[0.035] border border-white/10 hover:border-indigo-500/40 transition"
                        >
                          {item.image && (
                            <div className="relative w-full h-24 overflow-hidden">
                              <Image
                                src={item.image}
                                unoptimized
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition duration-300"
                              />
                            </div>
                          )}
                          <div className="p-3">
                            <p className="text-xs font-medium truncate text-gray-200">
                              {item.name}
                            </p>
                            {item.released && (
                              <p className="text-[10px] text-gray-600 mt-1">
                                {new Date(item.released).toDateString()}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No DLC found for this game.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mt-14">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Reviews
              </h2>
              <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs text-gray-500">
                {writtenReviews.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Honest opinions from players in the VaultGG community.
            </p>
          </div>

          {session ? (
            <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.09] via-white/[0.025] to-transparent p-5 sm:p-7 mb-8">
              <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-indigo-500/[0.08] blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {ownReviewExists ? "Edit your review" : "Write a review"}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 uppercase tracking-wider">
                        Your opinion matters
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Rate {game.name} and tell other players what you think.
                    </p>
                  </div>

                  <div className="hidden sm:flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-lg">
                    ✎
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        Give it a rating
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Half-star ratings are supported.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {rating ? (
                        <>
                          <span className="text-2xl font-bold text-white">
                            {rating.toFixed(1)}
                          </span>
                          <span className="text-yellow-400">★</span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-600">
                          Not rated yet
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <StarRating value={rating} onChange={setRating} />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">
                      Your review
                    </label>
                    <span className="text-xs text-gray-600">
                      {reviewText.length}/1000
                    </span>
                  </div>

                  <textarea
                    placeholder="What did you like? What could be better? Would you recommend it?"
                    value={reviewText}
                    maxLength={1000}
                    onChange={e => setReviewText(e.target.value)}
                    className="w-full min-h-[145px] resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-4 text-sm leading-6 text-gray-200 placeholder:text-gray-600 outline-none transition hover:border-white/15 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-xs text-gray-600">
                    Review text is optional. Your rating will still be saved.
                  </p>

                  <button
                    onClick={submitReview}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 shadow-lg shadow-indigo-500/10 transition text-sm font-semibold"
                  >
                    {ownReviewExists ? "Update Review" : "Post Review"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.025] p-7 sm:p-9 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl">
                ★
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Have you played {game.name}?
              </h3>
              <p className="mt-1 max-w-md mx-auto text-sm text-gray-500">
                Log in to rate this game and share your experience with other
                players.
              </p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Player opinions</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Reviews from the VaultGG community
                </p>
              </div>
            </div>

            {writtenReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-xl text-gray-500">
                  💬
                </div>
                <h4 className="mt-4 text-sm font-medium text-gray-300">
                  No written reviews yet
                </h4>
                <p className="mt-1 text-xs text-gray-600">
                  Be the first player to share your thoughts.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {writtenReviews.map(r => {
                  const isOwnReview =
                    !!session && r.userId._id === session.user.id;

                  return (
                    <article
                      key={r._id}
                      className={cn(
                        "group rounded-2xl border p-5 sm:p-6 transition duration-200",
                        isOwnReview
                          ? "border-indigo-500/25 bg-indigo-500/[0.045]"
                          : "border-white/8 bg-white/[0.025] hover:bg-white/[0.04] hover:border-white/15"
                      )}
                    >
                
                      <div className="flex items-start justify-between gap-4">
                        <Link
                          href={`/user/${r.userId._id}`}
                          className="flex items-center gap-3 min-w-0"
                        >
                          <div className="relative shrink-0">
                            <img
                              src={r.userId.avatar}
                              alt={r.userId.name}
                              className="w-11 h-11 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-indigo-500/40 transition"
                            />

                            {isOwnReview && (
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-black flex items-center justify-center text-[8px] text-white">
                                ✓
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition truncate">
                                {r.userId.name}
                              </span>

                              {isOwnReview && (
                                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300">
                                  Your review
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <span
                                    key={star}
                                    className={cn(
                                      "text-xs",
                                      star <= r.rating
                                        ? "text-yellow-400"
                                        : "text-zinc-700"
                                    )}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs font-medium text-gray-400">
                                {Number(r.rating).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </Link>

                        <button
                          onClick={() => reportReview(r._id)}
                          className="shrink-0 text-xs text-gray-600 hover:text-red-400 transition"
                        >
                          Report
                        </button>
                      </div>

              
                      <div className="mt-5 pl-0 sm:pl-14">
                        <p className="text-sm leading-7 text-gray-300 whitespace-pre-wrap">
                          {r.reviewText}
                        </p>
                      </div>

                    
                      <div className="mt-5 pt-4 border-t border-white/5 pl-0 sm:pl-14 flex items-center gap-2">
                        <button
                          onClick={() => reactToReview(r._id, "like")}
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition",
                            r.reaction === "like"
                              ? "bg-green-500/10 border-green-500/30 text-green-400"
                              : "bg-white/[0.02] border-white/10 text-gray-500 hover:text-green-400 hover:border-green-500/20"
                          )}
                        >
                          <span>👍</span>
                          <span>{r.likes || 0}</span>
                        </button>

                        <button
                          onClick={() => reactToReview(r._id, "dislike")}
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition",
                            r.reaction === "dislike"
                              ? "bg-red-500/10 border-red-500/30 text-red-400"
                              : "bg-white/[0.02] border-white/10 text-gray-500 hover:text-red-400 hover:border-red-500/20"
                          )}
                        >
                          <span>👎</span>
                          <span>{r.dislikes || 0}</span>
                        </button>

                        <div className="flex-1" />

                        {(r.likes || 0) > 0 && (
                          <span className="hidden sm:block text-[11px] text-gray-600">
                            {r.likes === 1
                              ? "1 player found this helpful"
                              : `${r.likes} players found this helpful`}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
