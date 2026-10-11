"use client";

import { useEffect, useState } from "react";
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
  Shield,
  ArrowUpRight,
  Gamepad2,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useUser } from "@/app/providers/UserProvider";

interface Game {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
}

const navItems = [
  { href: "/discover", label: "Discover", icon: Compass, mark: "01" },
  { href: "/browse", label: "Browse", icon: Gamepad2, mark: "02" },
  { href: "/checkoutPageDetails", label: "Premium", icon: Sparkles, mark: "03" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { user } = useUser();

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const [navAvatar, setNavAvatar] = useState<string | undefined>(user?.avatar);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      fetch("/api/user/me", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data?.user?.avatar) setNavAvatar(data.user.avatar);
        })
        .catch(() => {});
    }, 3000);

    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    if (user?.avatar) setNavAvatar(user.avatar);
  }, [user?.avatar]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/games/search?query=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setResults(Array.isArray(data) ? data : []))
        .catch((error) => {
          if (error.name !== "AbortError") setResults([]);
        });
    }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const closeMobile = () => setMenuOpen(false);
  const selectGame = () => {
    setQuery("");
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const searchResults = (mobile = false) => (
    <AnimatePresence>
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.16 }}
          className={`overflow-hidden rounded-2xl border border-white/10 bg-[#101116]/[.98] shadow-[0_24px_80px_rgba(0,0,0,.65)] backdrop-blur-2xl ${mobile ? "mt-2" : "absolute left-0 right-0 top-[calc(100%+10px)] z-50"}`}
        >
          <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#d9ff70]">
              Found in the archive
            </span>
            <span className="text-[10px] tabular-nums text-white/35">{results.length} results</span>
          </div>
          {results.map((game, index) => (
            <Link
              key={game._id}
              href={`/game/${game.slug}`}
              onClick={selectGame}
              className="group flex items-center gap-3 border-b border-white/[0.045] px-3 py-3 transition last:border-0 hover:bg-[#d9ff70]/[0.07]"
            >
              <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md bg-white/5 ring-1 ring-white/10">
                <Image
                  src={game.coverImage || "/fallback.jpg"}
                  alt={game.name}
                  fill
                  unoptimized
                  className="object-cover transition duration-300 group-hover:scale-110"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/85 transition group-hover:text-[#d9ff70]">
                  {game.name}
                </p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                  ARCHIVE ENTRY / {String(index + 1).padStart(2, "0")}
                </p>
              </div>
              <ArrowUpRight size={15} className="shrink-0 text-white/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d9ff70]" />
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      {/* Fine lime hairline keeps the bar feeling like part of the game world. */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#d9ff70]/70 to-transparent" />
      <div className="border-b border-white/[0.08] bg-[#08090c]/[.88] backdrop-blur-2xl">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center gap-5 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="baclogged home">
                      <Image
              src="/pikachu.png"
              alt="baclogged logo"
              width={40}
              height={40}
              priority
              className="h-10 w-10 shrink-0 object-contain transition duration-300 group-hover:scale-110"
            />
            <span className="leading-none">
              <span className="block text-[19px] font-black tracking-[-0.07em] transition group-hover:text-[#d9ff70] sm:text-[21px]">
                baclogged<span className="text-[#d9ff70]">.</span>
              </span>
              <span className="mt-1 hidden font-mono text-[8px] uppercase tracking-[0.25em] text-white/35 sm:block">
                your player archive
              </span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
            {navItems.map(({ href, label, icon: Icon, mark }) => (
              <Link
                key={href}
                href={href}
                className="group relative flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-white/55 transition hover:bg-white/[0.045] hover:text-white"
              >
                <Icon size={15} className="text-white/35 transition group-hover:text-[#d9ff70]" />
                <span>{label}</span>
                <span className="ml-0.5 font-mono text-[9px] text-white/20 transition group-hover:text-[#d9ff70]/70">{mark}</span>
                <span className="absolute bottom-1 left-3.5 right-3.5 h-px origin-left scale-x-0 bg-[#d9ff70] transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
            {session?.user?.role === "admin" && (
              <Link href="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#ff9a9a]/80 transition hover:bg-red-400/[0.07] hover:text-[#ffb4b4]">
                <Shield size={15} /> Admin
              </Link>
            )}
          </div>

          <div className="ml-auto hidden min-w-0 items-center gap-3 lg:flex xl:ml-0">
            <div className="relative w-[clamp(180px,20vw,270px)]">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 transition peer-focus:text-[#d9ff70]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 160)}
                onKeyDown={(e) => { if (e.key === "Escape") { setQuery(""); setSearchOpen(false); } }}
                placeholder="Find your next obsession…"
                aria-label="Search games"
                className="peer w-full rounded-xl border border-white/[0.09] bg-white/[0.035] py-2.5 pl-10 pr-12 text-xs text-white outline-none transition placeholder:text-white/25 hover:border-white/15 focus:border-[#d9ff70]/45 focus:bg-[#d9ff70]/[0.035] focus:ring-2 focus:ring-[#d9ff70]/[0.06]"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/25">⌕</span>
              {searchOpen && searchResults()}
            </div>

            {session ? (
              <div className="flex items-center gap-2.5 border-l border-white/10 pl-3">
                <Link href="/user/me" aria-label="Open your profile" className="group relative block rounded-full p-[2px] transition hover:bg-[#d9ff70]">
                  <Image
                    src={navAvatar || "/avatar-placeholder.png"}
                    alt="Your avatar"
                    width={38}
                    height={38}
                    unoptimized
                    className="h-[38px] w-[38px] rounded-full border border-white/15 object-cover transition group-hover:border-[#d9ff70]"
                  />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#08090c] bg-[#d9ff70]" />
                </Link>
                <button
                  onClick={() => signOut()}
                  aria-label="Log out"
                  title="Log out"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] text-white/35 transition hover:border-red-400/25 hover:bg-red-400/[0.07] hover:text-red-300"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="group flex shrink-0 items-center gap-2 rounded-xl bg-[#d9ff70] px-4 py-2.5 text-xs font-bold text-[#08090c] transition hover:bg-white">
                Enter the archive <ArrowUpRight size={14} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>

          {/* Compact search affordance for medium screens, where full nav is hidden. */}
          <div className="relative ml-auto hidden md:block lg:hidden">
            <button
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Toggle game search"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/60 transition hover:border-[#d9ff70]/40 hover:text-[#d9ff70]"
            >
              <Search size={17} />
            </button>
            <AnimatePresence>
              {searchOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-12 z-50 w-[min(86vw,360px)] rounded-2xl border border-white/10 bg-[#101116] p-3 shadow-2xl">
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search games…" autoFocus className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-9 pr-3 text-sm outline-none focus:border-[#d9ff70]/45" />
                  </div>
                  {searchResults(true)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/75 transition hover:border-[#d9ff70]/35 hover:text-[#d9ff70] md:ml-0 xl:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden border-t border-white/[0.08] bg-[#08090c]/[.98] xl:hidden"
            >
              <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                <div className="mb-5 md:hidden">
                  <div className="relative">
                    <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search the game archive…"
                      aria-label="Search games"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-white/30 focus:border-[#d9ff70]/45"
                    />
                  </div>
                  {searchResults(true)}
                </div>

                <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.28em] text-[#d9ff70]/65">Navigate the archive / 01—03</p>
                <nav className="grid gap-2 sm:grid-cols-3">
                  {navItems.map(({ href, label, icon: Icon, mark }) => (
                    <Link key={href} href={href} onClick={closeMobile} className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition hover:border-[#d9ff70]/25 hover:bg-[#d9ff70]/[0.055]">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035] text-white/45 transition group-hover:border-[#d9ff70]/25 group-hover:text-[#d9ff70]"><Icon size={18} /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-white/85">{label}</span>
                        <span className="mt-0.5 block font-mono text-[9px] tracking-[0.18em] text-white/30">SECTION {mark}</span>
                      </span>
                      <ArrowUpRight size={15} className="text-white/20 transition group-hover:text-[#d9ff70]" />
                    </Link>
                  ))}
                  {session?.user?.role === "admin" && (
                    <Link href="/admin" onClick={closeMobile} className="flex items-center gap-3 rounded-xl border border-red-400/15 bg-red-400/[0.035] p-3.5 text-red-200/80 transition hover:bg-red-400/[0.08]">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-400/15"><Shield size={18} /></span>
                      <span className="text-sm font-semibold">Admin</span>
                    </Link>
                  )}
                </nav>

                <div className="mt-5 border-t border-white/[0.08] pt-5">
                  {session ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Link href="/user/me" onClick={closeMobile} className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 transition hover:border-[#d9ff70]/25">
                        <div className="relative shrink-0 rounded-full p-[2px] ring-1 ring-[#d9ff70]/30">
                          <Image src={navAvatar || "/avatar-placeholder.png"} alt="Your avatar" width={44} height={44} unoptimized className="h-11 w-11 rounded-full object-cover" />
                        </div>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{user?.name || session.user?.name || "My Profile"}</span>
                          <span className="mt-0.5 block text-xs text-white/40">Your player archive</span>
                        </span>
                        <ArrowUpRight size={16} className="text-white/25 group-hover:text-[#d9ff70]" />
                      </Link>
                      <button onClick={() => signOut()} className="flex items-center justify-center gap-2 rounded-xl border border-red-400/20 px-4 py-3 text-sm font-medium text-red-300/80 transition hover:bg-red-400/[0.08] sm:w-auto">
                        <LogOut size={16} /> Log out
                      </button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={closeMobile} className="flex items-center justify-center gap-2 rounded-xl bg-[#d9ff70] px-4 py-3 text-sm font-bold text-[#08090c] transition hover:bg-white">
                      <UserRound size={16} /> Enter the archive <ArrowUpRight size={15} />
                    </Link>
                  )}
                </div>
                <div className="mt-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
                  <span>PLAY · COLLECT · REPEAT</span><span>BC / 001</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
