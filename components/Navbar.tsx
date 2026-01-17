"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/app/providers/UserProvider";

interface Game {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
}

export default function Navbar() {
  const { data: session } = useSession();
  const { user } = useUser(); 

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);

  // 🔥 KEY FIX — Navbar keeps its own live avatar
  const [navAvatar, setNavAvatar] = useState<string | undefined>(
    user?.avatar
  );

  // 🔥 GUARANTEED SYNC (POLLING) — runs every 3 seconds
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      fetch("/api/user/me", { cache: "no-store" })
        .then(res => res.json())
        .then(data => {
          if (data?.user?.avatar) {
            setNavAvatar(data.user.avatar);
          }
        })
        .catch(() => {});
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [session]);

  // also sync instantly if provider ever changes
  useEffect(() => {
    if (user?.avatar) {
      setNavAvatar(user.avatar);
    }
  }, [user?.avatar]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`/api/games/search?query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => setResults(data || []));
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">

        <Link href="/" className="text-xl font-semibold text-white">
          VaultggB
        </Link>

        <div className="hidden sm:flex items-center gap-6">

          <Link href="/discover" className="text-gray-300 hover:text-white text-sm">
            Discover
          </Link>

          <Link href="/browse" className="text-gray-300 hover:text-white text-sm">
            Browse
          </Link>

          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games..."
              className="w-56 bg-zinc-800 text-white px-4 py-1.5 rounded-full text-sm outline-none"
            />

            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-10 left-0 w-full bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  {results.map(game => (
                    <Link
                      key={game._id}
                      href={`/game/${game.slug}`}
                      onClick={() => setQuery("")}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-white/5"
                    >
                      <img
                        src={game.coverImage}
                        className="w-8 h-10 rounded object-cover"
                      />
                      <span className="text-sm text-white">
                        {game.name}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {session?.user?.role === "admin" && (
            <Link
              href="/admin"
              className="text-pink-500 hover:text-pink-600 text-sm"
            >
              Admin
            </Link>
          )}

          {!session ? (
            <Link href="/login" className="text-pink-500 hover:text-pink-600 text-sm">
              Sign In
            </Link>
          ) : (
            <>
              <Link href="/user/me">
                <Image
                  src={navAvatar || "/avatar-placeholder.png"}  // LIVE AVATAR
                  alt="Avatar"
                  width={36}
                  height={36}
                  className="rounded-full border border-white/20 cursor-pointer"
                />
              </Link>

              <button
                onClick={() => signOut()}
                className="text-xs text-gray-400 hover:text-gray-300"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-white text-3xl active:scale-90"
        >
          ⋮
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden bg-black/80 border-t border-white/10 px-4 py-4 space-y-5"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full rounded-full bg-zinc-800 px-4 py-2 text-sm outline-none text-white"
            />

            {results.map(game => (
              <Link
                key={game._id}
                href={`/game/${game.slug}`}
                onClick={() => {
                  setQuery("");
                  setMenuOpen(false);
                }}
                className="block text-gray-300"
              >
                {game.name}
              </Link>
            ))}

            <Link href="/discover" className="block text-gray-300">
              Discover
            </Link>

            <Link href="/browse" className="block text-gray-300">
              Browse
            </Link>

            {session && (
              <Link
                href="/user/me"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 pt-2"
              >
                <Image
                  src={navAvatar || "/avatar-placeholder.png"} 
                  alt="Avatar"
                  width={40}
                  height={40}
                  unoptimized
                  className="rounded-full border border-white/20"
                />
                <span className="text-gray-200 text-sm">
                  {user?.name || "My Profile"}
                </span>
              </Link>
            )}

            {!session ? (
              <Link href="/login" className="block text-pink-500">
                Sign In
              </Link>
            ) : (
              <button
                onClick={() => signOut()}
                className="text-xs text-gray-400"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
