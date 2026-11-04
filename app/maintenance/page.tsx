
"use client";

import { useEffect, useState } from "react";
import DinoRunner from "@/components/DinoRunner";

export default function MaintenancePage() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="maintenance relative min-h-screen overflow-hidden bg-[#090a0e] text-white">

      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2200&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#08090d]/70 via-[#0b0c12]/80 to-[#090a0e]" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 scanlines opacity-[0.09]" />

      <div className="absolute -top-48 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-7 md:px-10">

        <nav className="flex items-center justify-between border-b border-white/10 pb-6">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-amber-400/40 bg-amber-400/10 text-xl">
              🎮
            </div>

            <div>
              <h2 className="text-lg font-black tracking-[0.18em]">
                BACLOGGED<span className="text-amber-400">.</span>
              </h2>

              <p className="text-[9px] tracking-[0.35em] text-gray-500">
                YOUR GAMING UNIVERSE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-amber-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            SYSTEM OFFLINE
          </div>
        </nav>

        <section className="grid items-center gap-12 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">

          <div>

            <div className="mb-7 flex flex-wrap items-center gap-3">
              <span className="border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-[10px] font-bold tracking-[0.2em] text-amber-300">
                TRANSMISSION 001
              </span>

              <span className="text-[10px] tracking-[0.2em] text-gray-500">
                {currentTime || "00:00"} // SERVER ROOM
              </span>
            </div>

            <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-[88px]">
              THE ARCADE
              <br />
              IS <span className="glitch text-amber-400">UNDER</span>
              <br />
              REPAIR<span className="text-violet-500">.</span>
            </h1>

            <div className="mt-8 flex items-center gap-3">
              <div className="h-[2px] w-12 bg-amber-400" />

              <p className="text-xs font-bold tracking-[0.3em] text-gray-400">
                MISSION: REBUILD THE EXPERIENCE
              </p>
            </div>

            <p className="mt-7 max-w-xl text-sm leading-8 text-gray-400 md:text-base">
              Something is happening behind the screens.
              We're upgrading our systems, fixing a few
              glitches and preparing the next chapter of
              Baclogged.
              <br /><br />
              Your games, reviews and collections aren't
              going anywhere. Take a breather, grab some
              loot and we'll see you back in the lobby.
            </p>
            <div className="mt-10 max-w-md border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">

              <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.2em]">
                <span className="text-gray-400">
                  SERVER STATUS
                </span>

                <span className="text-amber-400">
                  RECALIBRATING
                </span>
              </div>

              <div className="mt-4 flex gap-1.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 ${
                      i < 9
                        ? "bg-amber-400 animate-pulse"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-4 flex justify-between text-[9px] tracking-widest text-gray-500">
                <span>BACKEND OPTIMIZATION</span>
                <span>IN PROGRESS</span>
              </div>
            </div>

            <p className="mt-8 text-[10px] tracking-[0.25em] text-gray-600">
              NO GAME SAVES WERE HARMED IN THIS UPDATE.
            </p>
          </div>

          <div className="relative">

            <div className="absolute -inset-4 bg-violet-600/10 blur-[70px]" />

            <div className="relative">
              <DinoRunner />
            </div>

          </div>
        </section>

        <footer className="flex flex-col justify-between gap-4 border-t border-white/10 py-7 text-[9px] tracking-[0.2em] text-gray-600 sm:flex-row">

          <p>© 2026 BACLOGGED // BUILT BY GAMERS</p>

          <div className="flex gap-6">
            <span>GAME ON.</span>
            <span className="text-amber-400">
              SEE YOU IN THE LOBBY.
            </span>
          </div>

        </footer>
      </div>

      <style jsx global>{`
        .maintenance {
          font-family: Arial, Helvetica, sans-serif;
        }

        .scanlines {
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 3px,
            rgba(0, 0, 0, 0.5) 4px
          );
        }

        .glitch {
          text-shadow:
            2px 0 rgba(139, 92, 246, 0.8),
            -2px 0 rgba(251, 191, 36, 0.4);
          animation: glitch 4s infinite;
        }

        @keyframes glitch {
          0%, 90%, 100% {
            transform: translateX(0);
          }
          92% {
            transform: translateX(3px);
          }
          94% {
            transform: translateX(-3px);
          }
          96% {
            transform: translateX(1px);
          }
        }

        ::selection {
          background: #fbbf24;
          color: #090a0e;
        }
      `}</style>
    </main>
  );
}
