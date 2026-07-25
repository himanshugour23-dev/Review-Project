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

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [toast, setToast] = useState<null | { type: "success" | "error"; msg: string }>(null);

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
    try {
      setAvatarLoading(true);
      setToast({ type: "success", msg: "Uploading avatar..." });

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/user/me/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUser(prev => (prev ? { ...prev, avatar: data.avatar } : prev));

      setToast({ type: "success", msg: "Avatar updated successfully!" });
    } catch (err: any) {
      setToast({
        type: "error",
        msg: err.message || "Avatar upload failed",
      });
    } finally {
      setAvatarLoading(false);

      // Auto-hide toast
      setTimeout(() => setToast(null), 3000);
    }
  };

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


  const removeFromFavourites = async (gameId: string) => {
    try {
      const res = await fetch("/api/user/me/favourite/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
      });

      if (!res.ok) throw new Error("Failed to remove");

      setUser(prev =>
        prev
          ? {
              ...prev,
              favoriteGames: prev.favoriteGames.filter(g => g._id !== gameId),
            }
          : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#14181c] text-[#e8e8e8] flex items-center justify-center text-sm tracking-wide">
        Loading profile…
      </div>
    );
  }

  return (
    <>

      {toast && (
        <div
          className={`
            fixed top-6 right-6 z-50 px-4 py-2.5 rounded-md text-sm font-medium shadow-[0_10px_30px_rgba(0,0,0,0.5)]
            ${toast.type === "success" ? "bg-[#00e054] text-[#0a0f0c]" : "bg-[#ff4d4d] text-white"}
          `}
        >
          {toast.msg}
        </div>
      )}

      <div className="bg-[#14181c] text-[#e8e8e8] min-h-screen px-6 pt-24 pb-16 max-w-7xl mx-auto">

        <section className="flex items-start gap-6 mb-14">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[#1c2228] ring-2 ring-[#00e054]/40 shrink-0">
            <Image
              src={user.avatar ? user.avatar : "/avatar-placeholder.png"}
              width={100}
              height={100}
              alt="Profile"
            />

            {/* Loading overlay on avatar */}
            {avatarLoading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[10px] tracking-wide">
                Uploading...
              </div>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition text-xs font-medium"
            >
              Change
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={e =>
              e.target.files && handleAvatarUpload(e.target.files[0])
            }
          />

          <div className="flex-1 pt-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">{user.name}</h1>

            <div className="mt-2 text-sm text-[#9ab] flex items-start gap-2">
              {editingBio ? (
                <div className="w-full">
                  <textarea
                    value={bioDraft}
                    onChange={e => setBioDraft(e.target.value)}
                    className="w-full bg-[#1c2228] border border-white/10 rounded-md p-2.5 text-sm text-[#e8e8e8] outline-none focus:border-[#00e054]/50 transition"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={saveBio}
                      className="px-4 py-1.5 bg-[#00e054] text-[#0a0f0c] text-sm font-semibold rounded-md hover:bg-[#2fe873] transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setBioDraft(user.bio || "");
                        setEditingBio(false);
                      }}
                      className="px-4 py-1.5 bg-[#1c2228] text-sm rounded-md border border-white/10 hover:bg-white/5 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span>{user.bio || "Add a bio…"}</span>
                  <button
                    onClick={() => setEditingBio(true)}
                    className="text-[#40bcf4] hover:text-[#6fd0fb] transition text-xs"
                  >
                    (Edit)
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="mb-14">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#9ab]">
              My Favourites
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scroll(favRef, "left")}
                className="w-7 h-7 rounded-md border border-white/10 hover:bg-white/5 transition text-[#9ab] text-sm"
              >
                ←
              </button>
              <button
                onClick={() => scroll(favRef, "right")}
                className="w-7 h-7 rounded-md border border-white/10 hover:bg-white/5 transition text-[#9ab] text-sm"
              >
                →
              </button>
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
                <div className="relative w-[180px] h-[240px] rounded-md overflow-hidden bg-[#1c2228] ring-1 ring-white/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-[#00e054]/40">
                  <button
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromFavourites(g._id);
                    }}
                    className="absolute top-2 right-2 z-20 h-7 w-7 rounded-full bg-black/60 text-white text-xs hover:bg-[#ff4d4d] transition"
                  >
                    ✕
                  </button>

                  <Image
                    src={g.coverImage}
                    alt={g.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <p className="text-sm mt-2 truncate text-[#c5c9cc] group-hover:text-white transition">
                  {g.name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#9ab]">
              My Reviews
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scroll(reviewRef, "left")}
                className="w-7 h-7 rounded-md border border-white/10 hover:bg-white/5 transition text-[#9ab] text-sm"
              >
                ←
              </button>
              <button
                onClick={() => scroll(reviewRef, "right")}
                className="w-7 h-7 rounded-md border border-white/10 hover:bg-white/5 transition text-[#9ab] text-sm"
              >
                →
              </button>
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
                <div className="relative w-[180px] h-[240px] rounded-md overflow-hidden bg-[#1c2228] ring-1 ring-white/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-[#40bcf4]/40">
                  <Image
                    src={r.gameId.coverImage}
                    alt={r.gameId.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <p className="text-sm mt-2 truncate text-[#c5c9cc] group-hover:text-white transition">
                  {r.gameId.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}