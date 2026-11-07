"use client";
import { useEffect, useState } from "react";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";
export default function CheckoutPage() {
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  useEffect(() => {
    const checkPremium = async () => {
      try {
        const res = await fetch("/api/checkout");
        if (!res.ok) {
          setIsPremium(false);
          return;
        }
        const data = await res.json();
        setIsPremium(data.isPremium ?? false);
      } catch (error) {
        console.error("Failed to check premium status:", error);
        setIsPremium(false);
      }
    };
    checkPremium();
  }, []);
  if (isPremium === null) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
          <p className="text-sm text-zinc-500">Checking your subscription...</p>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[120px]" />
      </div>
      <section className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            baclogged Premium
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Go beyond the game.
            <span className="mt-2 block text-purple-400">Discover every detail.</span>
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
            Explore the people and creative work behind your favorite games.
            Unlock exclusive developer, publisher, and artwork information with baclogged Premium.
          </p>
        </div>
        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-2xl shadow-purple-950/10">
          <div className="grid lg:grid-cols-[1.35fr_0.85fr]">
            <div className="p-8 sm:p-10">
              <div className="mb-8">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">EXCLUSIVE ACCESS</span>
                </div>
                <h2 className="text-2xl font-semibold">Premium unlocks</h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Get closer to the studios, publishers, and visual worlds behind the games you love.
                </p>
              </div>
              <div className="grid gap-7 sm:grid-cols-2">
                <Benefit
                  icon="👨‍💻"
                  title="Game Developers"
                  description="Discover the studios and development teams responsible for bringing your favorite games to life."
                />
                <Benefit
                  icon="🏢"
                  title="Game Publishers"
                  description="Explore the publishers behind each title and learn more about the companies releasing the games."
                />
                <Benefit
                  icon="🎨"
                  title="Exclusive Artworks"
                  description="Explore additional game artwork and visual assets beyond the standard screenshots."
                />
              </div>
              <div className="my-9 border-t border-zinc-800" />
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">FREE FOR EVERYONE</span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-200">Already included with baclogged</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Premium doesn't take away the essentials. Everyone can explore a rich collection of game information.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                  {[
                    "Game screenshots",
                    "Videos & trailers",
                    "Websites & stores",
                    "DLC & expansions",
                    "Similar games",
                    "Ratings & reviews",
                    "Genres & platforms",
                    "Themes & game modes",
                    "Keywords & franchises",
                    "Game summaries",
                    "Storylines",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-xs text-zinc-400">
                      <span className="text-emerald-400">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-zinc-800 bg-zinc-900/40 p-8 sm:p-10 lg:border-l lg:border-t-0">
              <div className="flex h-full flex-col">
                {isPremium ? (
                  <>
                    <div className="flex-1">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-xl text-emerald-400">✓</div>
                      <p className="text-sm font-medium text-emerald-400">Subscription active</p>
                      <h2 className="mt-3 text-3xl font-bold">You're Premium</h2>
                      <p className="mt-4 text-sm leading-6 text-zinc-400">
                        Your account has access to all baclogged Premium features.
                      </p>
                      <div className="mt-8 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                        <p className="text-sm text-zinc-300">✓ Developer information</p>
                        <p className="mt-3 text-sm text-zinc-300">✓ Publisher information</p>
                        <p className="mt-3 text-sm text-zinc-300">✓ Exclusive game artworks</p>
                      </div>
                    </div>
                    <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-center text-sm text-zinc-500">
                      You're already enjoying the complete Premium experience.
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-medium text-zinc-500">baclogged Premium</p>
                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-5xl font-bold tracking-tight">₹0</span>
                        <span className="mb-2 text-sm text-zinc-500">/ test</span>
                      </div>
                      <p className="mt-3 text-sm text-zinc-400">
                        Unlock all exclusive Premium features.
                      </p>
                    </div>
                    <div className="mt-8">
                      <RazorpayCheckoutButton />
                    </div>
                    <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <div className="flex gap-3">
                        <span className="mt-0.5">🧪</span>
                        <div>
                          <p className="text-sm font-medium text-amber-300">Test payment environment</p>
                          <p className="mt-1 text-xs leading-5 text-zinc-500">
                            This is a Razorpay test integration. Use the test payment flow and select net banking to simulate a successful payment. No real money will be charged.
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-5 text-center text-xs leading-5 text-zinc-600">
                      No real payment will be processed.
                      <br />
                      This feature is available for testing purposes only.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-zinc-600">
          baclogged Premium is currently available as a free test feature while the payment system is being developed.
        </p>
      </section>
    </main>
  );
}
function Benefit({ icon, title, description }: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-lg transition group-hover:border-purple-500/30 group-hover:bg-purple-500/10">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-zinc-200">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-zinc-500">{description}</p>
      </div>
    </div>
  );
}