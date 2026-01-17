"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");

  const favRef = useRef<HTMLDivElement | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    fetch("/api/user/me", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setReviews(data.review);
        setBioDraft(data.user.bio || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);


  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    dir: "left" | "right"
  ) => {
    if (!ref.current) return;

    const card = ref.current.querySelector<HTMLElement>(".scroll-card");
    if (!card) return;

    const gap = 16; 
    const amount = card.offsetWidth + gap;

    ref.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  
  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/user/me/avatar", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) return alert("Avatar upload failed");

    const data = await res.json();
    setUser(prev => (prev ? { ...prev, avatar: data.avatar } : prev));
  };

  /* ---------- Save bio ---------- */
  const saveBio = async () => {
    const res = await fetch("/api/user/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: bioDraft }),
    });

    if (res.ok) {
      setUser(prev => (prev ? { ...prev, bio: bioDraft } : prev));
      setEditingBio(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen px-6 pt-24 max-w-7xl mx-auto">

    
      <section className="flex items-start gap-6 mb-10">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-800">
          <Image
            src={user.avatar || "/avatar-placeholder.png"}
            alt={user.name}
            fill
            className="object-cover"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition text-sm"
          >
            Change
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={e => e.target.files && handleAvatarUpload(e.target.files[0])}
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{user.name}</h1>

          <div className="mt-2 text-sm text-gray-400 flex items-start gap-2">
            {editingBio ? (
              <div className="w-full">
                <textarea
                  value={bioDraft}
                  onChange={e => setBioDraft(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded p-2 text-sm"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={saveBio} className="px-3 py-1 bg-indigo-600 rounded">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setBioDraft(user.bio || "");
                      setEditingBio(false);
                    }}
                    className="px-3 py-1 bg-zinc-800 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span>{user.bio || "Add a bio…"}</span>
                <button onClick={() => setEditingBio(true)}>(Edit)</button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">My Favourites</h2>
          <div className="flex gap-2">
            <button onClick={() => scroll(favRef, "left")}>←</button>
            <button onClick={() => scroll(favRef, "right")}>→</button>
          </div>
        </div>

        <div
          ref={favRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {user.favoriteGames.map(g => (
            <Link
              key={g._id}
              href={`/game/${g.slug}`}
              className="group min-w-[180px] scroll-card"
            >
              <div
                className="
                  relative w-[180px] h-[240px] rounded-xl overflow-hidden
                  bg-zinc-900
                  transition-transform duration-300
                  hover:-translate-y-1
                  will-change-transform
                  transform-gpu
                "
              >
                <Image
                  src={g.coverImage}
                  alt={g.name}
                  fill
                  unoptimized
                  className="
                    object-cover
                    transition-transform duration-700 ease-out
                    group-hover:scale-110
                    group-hover:rotate-[0.5deg]
                    will-change-transform
                    transform-gpu
                    backface-hidden
                  "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 ring-1 ring-white/5 group-hover:ring-indigo-400/30 transition-all duration-500" />
              </div>
              <p className="text-sm mt-1 truncate">{g.name}</p>
            </Link>
          ))}
        </div>
      </section>

   
      <section>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">My Reviews</h2>
          <div className="flex gap-2">
            <button onClick={() => scroll(reviewRef, "left")}>←</button>
            <button onClick={() => scroll(reviewRef, "right")}>→</button>
          </div>
        </div>

        <div
          ref={reviewRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {reviews.map(r => (
            <Link
              key={r._id}
              href={`/game/${r.gameId.slug}`}
              className="group min-w-[180px] scroll-card"
            >
              <div
                className="
                  relative w-[180px] h-[240px] rounded-xl overflow-hidden
                  bg-zinc-900
                  transition-transform duration-300
                  hover:-translate-y-1
                  will-change-transform
                  transform-gpu
                "
              >
                <Image
                  src={r.gameId.coverImage}
                  alt={r.gameId.name}
                  fill
                  unoptimized
                  className="
                    object-cover
                    transition-transform duration-700 ease-out
                    group-hover:scale-110
                    group-hover:rotate-[0.5deg]
                    will-change-transform
                    transform-gpu
                    backface-hidden
                  "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 ring-1 ring-white/5 group-hover:ring-indigo-400/30 transition-all duration-500" />
              </div>
              <p className="text-sm mt-1 truncate">{r.gameId.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
