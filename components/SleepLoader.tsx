"use client";

export default function SleepLoader() {
  return (
    <div
      className="relative flex h-32 w-32 items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <style jsx>{`
        @keyframes sleep-float {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-7px) rotate(5deg); }
        }

        @keyframes sleep-glow {
          0%, 100% { opacity: 0.35; transform: scale(0.92); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }

        @keyframes sleep-rise {
          0% { opacity: 0; transform: translate(0, 8px) scale(0.7); }
          20% { opacity: 1; }
          80% { opacity: 0.8; }
          100% { opacity: 0; transform: translate(9px, -29px) scale(1.1); }
        }

        .sleep-float { animation: sleep-float 3s ease-in-out infinite; }
        .sleep-glow { animation: sleep-glow 3s ease-in-out infinite; }
        .sleep-z { animation: sleep-rise 2.8s ease-out infinite; }
        .sleep-z:nth-child(2) { animation-delay: 0.7s; }
        .sleep-z:nth-child(3) { animation-delay: 1.4s; }
      `}</style>

      {/* Ambient glow */}
      <div className="sleep-glow absolute h-20 w-20 rounded-full bg-[#d9ff70]/10 blur-2xl" />

      {/* Orbit */}
      <div className="absolute h-[76px] w-[76px] rounded-full border border-white/[0.07]" />
      <div className="absolute h-[100px] w-[100px] rounded-full border border-dashed border-white/[0.06]" />

      {/* Tiny stars */}
      <span className="absolute left-5 top-7 h-1 w-1 rounded-full bg-[#d9ff70] shadow-[0_0_8px_#d9ff70]" />
      <span className="absolute right-5 top-10 h-1.5 w-1.5 rounded-full bg-white/70" />
      <span className="absolute bottom-7 left-8 h-1 w-1 rounded-full bg-white/40" />

      {/* Moon */}
      <div className="sleep-float relative z-10">
        <svg
          viewBox="0 0 64 64"
          className="h-14 w-14 drop-shadow-[0_0_18px_rgba(217,255,112,0.2)]"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M43.8 43.2A23 23 0 0 1 20.7 8.5 23.5 23.5 0 1 0 55.5 36a23 23 0 0 1-11.7 7.2Z"
            fill="#d9ff70"
          />
          <path
            d="M43.8 43.2A23 23 0 0 1 20.7 8.5 23.5 23.5 0 1 0 55.5 36a23 23 0 0 1-11.7 7.2Z"
            stroke="#e8ffab"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Floating Zs — same sleep-loader idea, cleaner execution */}
      <span className="sleep-z absolute right-5 top-5 text-xs font-medium text-[#d9ff70]/90">
        z
      </span>
      <span className="sleep-z absolute right-3 top-3 text-sm font-semibold text-[#d9ff70]/70">
        z
      </span>
      <span className="sleep-z absolute right-1 top-1 text-lg font-bold text-[#d9ff70]/50">
        z
      </span>

      {/* Loading indicator */}
      <div className="absolute bottom-0 flex items-center gap-1.5">
        <span className="h-1 w-1 animate-pulse rounded-full bg-[#d9ff70]/50" />
        <span className="h-1 w-1 animate-pulse rounded-full bg-[#d9ff70]/75 [animation-delay:200ms]" />
        <span className="h-1 w-1 animate-pulse rounded-full bg-[#d9ff70] [animation-delay:400ms]" />
      </div>
    </div>
  );
}