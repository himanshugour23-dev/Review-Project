"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowUpRight, Github, Gamepad2, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#08090c] px-4 py-10 text-white sm:px-6">
      {/* Full-bleed artwork */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/bg.jpg"
          alt="Atmospheric gaming artwork"
          fill
          priority
          unoptimized
          className="object-cover object-center opacity-55"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[#08090c]/75" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_22%,rgba(217,255,112,0.15),transparent_36%),radial-gradient(ellipse_at_85%_78%,rgba(217,255,112,0.09),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0d11]/75 shadow-[0_35px_120px_rgba(0,0,0,0.65)] backdrop-blur-2xl lg:min-h-[620px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Editorial side */}
        <section className="relative hidden overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -right-24 top-24 h-72 w-72 rounded-full border border-[#d9ff70]/15" />
          <div className="absolute -right-12 top-36 h-48 w-48 rounded-full border border-[#d9ff70]/20" />
          <div className="absolute bottom-20 right-16 h-28 w-28 rotate-12 border border-[#d9ff70]/20 bg-[#d9ff70]/[0.04]" />

          <Link href="/" className="relative z-10 inline-flex w-fit items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d9ff70] text-lg font-black tracking-tighter text-[#08090c] shadow-[0_0_35px_rgba(217,255,112,0.2)]">
              b.
            </span>
            <span className="text-sm font-black uppercase tracking-[0.24em]">baclogged</span>
          </Link>

          <div className="relative z-10 max-w-md py-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d9ff70]/20 bg-[#d9ff70]/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#d9ff70]">
              <Sparkles size={13} /> Your next obsession awaits
            </div>
            <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.065em] xl:text-7xl">
              Games leave
              <br />
              <span className="font-serif font-medium italic text-[#d9ff70]">a mark.</span>
              <br />
              Keep yours.
            </h1>
            <p className="mt-7 max-w-sm text-sm leading-7 text-white/55">
              A home for the games you finish, the worlds you get lost in, and the opinions you can’t keep to yourself.
            </p>
            <div className="mt-9 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              <span className="h-px w-10 bg-[#d9ff70]" />
              Play · Collect · Remember
            </div>
          </div>

          <div className="relative z-10 flex items-end justify-between gap-4 text-[10px] uppercase tracking-[0.18em] text-white/30">
            <span>Player archive / No. 001</span>
            <Gamepad2 size={21} strokeWidth={1.3} />
          </div>
        </section>

        {/* Sign-in panel */}
        <section className="relative flex items-center justify-center px-6 py-12 sm:px-10 lg:px-9 xl:px-14">
          <div className="absolute right-7 top-7 hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25 sm:block">
            PLAYER ACCESS <span className="ml-2 text-[#d9ff70]">●</span>
          </div>

          <div className="w-full max-w-sm">
            <div className="mb-9 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d9ff70] text-lg font-black tracking-tighter text-[#08090c]">b.</span>
                <span className="text-sm font-black uppercase tracking-[0.24em]">baclogged</span>
              </Link>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d9ff70]">Come on in</p>
              <h2 className="text-3xl font-black tracking-[-0.045em] sm:text-4xl">Your save point.</h2>
              <p className="mt-3 text-sm leading-6 text-white/45">
                Sign in to rate, review, and keep your gaming life together.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => signIn("google")}
                className="group flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/[0.94] px-5 py-4 text-sm font-bold text-[#101116] transition duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ff70]"
              >
                <span className="flex items-center gap-3">
                  <Image src="/google.svg" alt="" width={20} height={20} />
                  Continue with Google
                </span>
                <ArrowUpRight size={17} className="opacity-40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </button>

              <button
                type="button"
                onClick={() => signIn("github")}
                className="group flex w-full items-center justify-between rounded-2xl border border-white/12 bg-white/[0.045] px-5 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#d9ff70]/40 hover:bg-[#d9ff70]/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ff70]"
              >
                <span className="flex items-center gap-3">
                  <Github size={20} />
                  Continue with GitHub
                </span>
                <ArrowUpRight size={17} className="text-white/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d9ff70]" />
              </button>
            </div>

            <div className="my-7 flex items-center gap-4">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/25">Your journey, your call</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <Link
              href="/"
              className="group flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] px-5 py-3.5 text-sm text-white/55 transition hover:border-[#d9ff70]/25 hover:text-[#d9ff70]"
            >
              Continue without signing in
              <ArrowUpRight size={15} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <p className="mt-8 text-center text-[10px] leading-5 text-white/25">
              No pressure. No gatekeeping. Just games.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
