"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  LogOut,
  Compass,
  Library,
  Shield,
} from "lucide-react";
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
  const [navAvatar, setNavAvatar] = useState<string | undefined>(
    user?.avatar
  );
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      fetch("/api/user/me", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data?.user?.avatar) {
            setNavAvatar(data.user.avatar);
          }
        })
        .catch(() => {});
    }, 3000);

    return () => clearInterval(interval);
  }, [session]);

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
        .then((res) => res.json())
        .then((data) => setResults(data || []));
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);
return (
  <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-5">

      <Link
        href="/"
        className="text-2xl font-black tracking-tight hover:text-blue-400 transition"
      >
        VaultggB
      </Link>

      <div className="hidden lg:flex items-center gap-8">

        <Link
          href="/discover"
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
        >
          <Compass size={16} />
          Discover
        </Link>

        <Link
          href="/browse"
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
        >
          <Library size={16} />
          Browse
        </Link>

        <div className="relative w-72">

          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full rounded-full border border-white/10 bg-zinc-900 pl-11 pr-4 py-2 text-sm outline-none transition focus:border-blue-500"
          />

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute top-12 w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl"
              >
                {results.map((game) => (
                  <Link
                    key={game._id}
                    href={`/game/${game.slug}`}
                    onClick={() => setQuery("")}
                    className="flex items-center gap-3 px-3 py-3 hover:bg-white/5"
                  >
                    <img
                      src={game.coverImage}
                      className="h-12 w-9 rounded object-cover"
                    />

                    <span className="truncate text-sm">
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
            className="flex items-center gap-2 text-pink-400 hover:text-pink-300 text-sm"
          >
            <Shield size={15} />
            Admin
          </Link>
        )}

        {!session ? (
          <Link
            href="/login"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-gray-200"
          >
            Sign In
          </Link>
        ) : (
          <>
            <Link href="/user/me">
              <Image
                src={navAvatar || "/avatar-placeholder.png"}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full border border-white/20 hover:border-blue-500 transition"
              />
            </Link>

            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="lg:hidden rounded-md p-2 hover:bg-white/10"
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

    </div>
          <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-xl"
          >
            <div className="mx-auto max-w-7xl space-y-6 px-5 py-6">

              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search games..."
                  className="w-full rounded-full border border-white/10 bg-zinc-900 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Search Results */}
              {results.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
                  {results.map((game) => (
                    <Link
                      key={game._id}
                      href={`/game/${game.slug}`}
                      onClick={() => {
                        setQuery("");
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-3 border-b border-white/5 px-4 py-3 last:border-0 hover:bg-white/5"
                    >
                      <img
                        src={game.coverImage}
                        alt={game.name}
                        className="h-14 w-10 rounded object-cover"
                      />

                      <span className="text-sm text-gray-200">
                        {game.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <nav className="space-y-2">

                <Link
                  href="/discover"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-300 transition hover:bg-white/5 hover:text-white"
                >
                  <Compass size={18} />
                  Discover
                </Link>

                <Link
                  href="/browse"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-300 transition hover:bg-white/5 hover:text-white"
                >
                  <Library size={18} />
                  Browse
                </Link>

                {session?.user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-pink-400 transition hover:bg-pink-500/10"
                  >
                    <Shield size={18} />
                    Admin
                  </Link>
                )}
              </nav>

              {/* User */}
              {session ? (
                <>
                  <Link
                    href="/user/me"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-zinc-900 p-4 hover:border-blue-500/40"
                  >
                    <Image
                      src={navAvatar || "/avatar-placeholder.png"}
                      alt="Avatar"
                      width={52}
                      height={52}
                      unoptimized
                      className="rounded-full border border-white/20"
                    />

                    <div>
                      <p className="font-medium text-white">
                        {user?.name || "My Profile"}
                      </p>

                      <p className="text-sm text-gray-400">
                        View Profile
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 py-3 text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg bg-white py-3 text-center font-semibold text-black transition hover:bg-gray-200"
                >
                  Sign In
                </Link>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
          </header>
  );
}