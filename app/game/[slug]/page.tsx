"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
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

  useEffect(() => {
    fetch(`/api/games/${slug}`)
      .then(res => res.json())
      .then(data => {
        setGame(data.game);
        setReviews(data.reviews);
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
        setReviewText(existingReview.reviewText);
      }
    }
  }, [session, reviews]);




const DarkRating = styled(Rating)({
  "& .MuiRating-iconEmpty": {
    color: "#27272a", // zinc-800
  },
  "& .MuiRating-iconFilled": {
    color: "#facc15", // yellow-400
  },
  "& .MuiRating-iconHover": {
    color: "#fde047",
  },
});

 function StarRating({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <Stack spacing={1}>
      <DarkRating
        value={value}
        precision={0.5}
        onChange={(e, v) => v && onChange(v)}
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

      setReviews(updated.reviews);
      setGame(updated.game);

      // ✅ Clear text field and rating after successful submission
      setReviewText("");
      setRating(null);

      toast.success("Review submitted!", { id: toastId });
    } catch {
      toast.error("Network error", { id: toastId });
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

  // ✅ Reorder reviews so the logged-in user's review appears on top
  let orderedReviews = [...reviews];
  if (session) {
    const idx = orderedReviews.findIndex(r => r.userId._id === session.user.id);
    if (idx > -1) {
      const [userReview] = orderedReviews.splice(idx, 1);
      orderedReviews.unshift(userReview);
    }
  }

  return (
    <>
     
      <div className="relative h-[40vh] sm:h-[80vh] w-full ">
        <Image
          src={game.coverImage}
          unoptimized
          alt={game.name}
          fill
          className="object-cover brightness-50 pt-16.5"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <main className="relative -mt-20 sm:-mt-32 max-w-6xl mx-auto px-4 sm:px-6 text-white">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          {/* Poster */}
          <Image
            src={game.coverImage}
            unoptimized
            alt={game.name}
            width={300}
            height={280}
            className="rounded-xl shadow-xl mx-auto md:mx-0"
          />


          <div className="flex-1">
            <h1 className="text-2xl sm:text-4xl font-semibold">{game.name}</h1>
            <p className="mt-2 text-gray-400 text-sm sm:text-base">
              Released {new Date(game.released).toDateString()}
            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-300">
              <span>⭐ {game.averageRating?.toFixed(1) || "0"} Avg Rating</span>
              <span>MC {game.metacritic}</span>
            </div>

            <div className="mt-4 w-full sm:w-64 rounded-lg bg-white/5 p-3 border border-white/10">
              <p className="text-xs text-gray-400 text-center mb-1">
                Rating Distribution
              </p>

              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingData}>
                    <XAxis
                      dataKey="star"
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                    />
                    <YAxis hide />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1★</span>
                <span>5★</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {game.genres?.map((g: string) => (
                <span
                  key={g}
                  className="px-3 py-1 text-xs rounded-full bg-white/10"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="mt-2 text-sm text-gray-400">
              Platforms: {game.platforms?.join(", ")}
            </div>
                        {session && (
              <button
                onClick={addToFavourite}
                className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-gray-800 transition text-sm"
              >
                ❤️ Add to Favourites
              </button>
            )}
          </div>
        </div>

      
     {session ? (
  <div className="mt-10 p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
    <h3 className="text-lg font-semibold mb-3">Your Rating</h3>


   <StarRating value={rating} onChange={setRating} />

<p className="text-xs text-gray-400 mt-1">
  Selected: {rating ? rating.toFixed(1) : "None"}
</p>


    <textarea
      placeholder="Write your review (optional)"
      value={reviewText}
      onChange={e => setReviewText(e.target.value)}
      className="mt-4 w-full h-24 rounded-lg bg-zinc-900 p-3 text-sm outline-none"
    />

    <button
      onClick={submitReview}
      className="mt-3 w-full sm:w-auto px-5 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition"
    >
      {reviews.some(r => r.userId._id === session?.user.id)
        ? "Edit Review"
        : "Submit Review"}
    </button>
  </div>
) : (
  <p className="mt-10 text-gray-400 text-center sm:text-left">
    Log in to rate and review this game.
  </p>
)}

     
<section className="mt-12">
  <h2 className="text-lg sm:text-xl font-semibold mb-4">Reviews</h2>

  <div className="space-y-4">
    {orderedReviews
      .filter(r => r.reviewText && r.reviewText.trim().length > 0)
      .map(r => (
        <div
          key={r._id}
          className="p-4 bg-white/5 hover:bg-white/10 transition rounded-xl"
        >
          
          <Link
            href={`/user/${r.userId._id}`}
            className="flex items-center gap-3 mb-2 cursor-pointer"
          >
            <img
              src={r.userId.avatar}
              className="w-9 h-9 rounded-full ring-1 ring-white/20 hover:ring-indigo-500 transition"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium hover:underline">
                {r.userId.name}
              </span>
              <span className="text-xs text-gray-400">
                ⭐ {r.rating}
              </span>
            </div>
          </Link>

          <p className="text-gray-300 text-sm leading-relaxed">
            {r.reviewText}
          </p>

         
          <div className="mt-3 flex flex-wrap gap-3 text-sm items-center">
            
     
            <button
              onClick={async () => {
                if (!session) {
                  toast.error("Login required to react");
                  return;
                }

                setReviews(prev =>
                  prev.map(review =>
                    review._id === r._id
                      ? {
                          ...review,
                          reaction: review.reaction === "like" ? null : "like",
                          likes:
                            review.reaction === "like"
                              ? (review.likes || 1) - 1
                              : (review.likes || 0) + 1,
                          dislikes:
                            review.reaction === "dislike"
                              ? (review.dislikes || 1) - 1
                              : review.dislikes || 0,
                        }
                      : review
                  )
                );

                await fetch("/api/reactions", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ reviewId: r._id, type: "like" }),
                });
              }}
              className={cn(
                "px-3 py-1 rounded-md border transition",
                r.reaction === "like"
                  ? "bg-green-500 border-green-500"
                  : "border-white/20 hover:bg-white/10"
              )}
            >
              Like {r.likes || 0}
            </button>

         
            <button
              onClick={async () => {
                if (!session) {
                  toast.error("Login required to react");
                  return;
                }

                setReviews(prev =>
                  prev.map(review =>
                    review._id === r._id
                      ? {
                          ...review,
                          reaction:
                            review.reaction === "dislike" ? null : "dislike",
                          dislikes:
                            review.reaction === "dislike"
                              ? (review.dislikes || 1) - 1
                              : (review.dislikes || 0) + 1,
                          likes:
                            review.reaction === "like"
                              ? (review.likes || 1) - 1
                              : review.likes || 0,
                        }
                      : review
                  )
                );

                await fetch("/api/reactions", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ reviewId: r._id, type: "dislike" }),
                });
              }}
              className={cn(
                "px-3 py-1 rounded-md border transition",
                r.reaction === "dislike"
                  ? "bg-red-500 border-red-500"
                  : "border-white/20 hover:bg-white/10"
              )}
            >
              Dislike {r.dislikes || 0}
            </button>

      
     <button
  onClick={async () => {
    if (!session) {
      toast.error("Login required to report");
      return;
    }

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: r._id,
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
  }}
  className="ml-auto text-xs text-gray-400 hover:text-red-400 transition"
>
  Report
</button>

          </div>
        </div>
      ))}
  </div>
</section>



      </main>
    </>
  );
}