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
          <p className="text-sm text-zinc-500">
            Checking your subscription...
          </p>
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

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Unlock the full{" "}
            <span className="text-purple-400">gaming experience.</span>
          </h1>

          <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
            Get deeper information about games, creators, developers,
            communities, stores and DLCs  all in one place.
          </p>
        </div>

        
        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-2xl shadow-purple-950/10">
          <div className="grid lg:grid-cols-[1.4fr_0.8fr]">
            <div className="p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold">
                  Premium benefits
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Everything you need to explore your favorite games deeper.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Benefit
                  icon="🎮"
                  title="See which creators played a game"
                  description="Discover which creators have played and featured the game you're viewing."
                />

                <Benefit
                  icon="🛒"
                  title="Available on which store"
                  description="Quickly find out where the game is available to buy or play."
                />

                <Benefit
                  icon="👨‍💻"
                  title="Developer section"
                  description="Want to know more about the developers? Get additional developer information."
                />

                <Benefit
                  icon="📰"
                  title="Latest subreddit posts"
                  description="See the latest community discussions and posts related to the game."
                />

                <Benefit
                  icon="📦"
                  title="DLC alongside the game"
                  description="Explore downloadable content and expansions without leaving the game page."
                />

                <Benefit
                  icon="✨"
                  title="More game insights"
                  description="Unlock additional information designed for deeper game discovery."
                />
              </div>
            </div>

            
            <div className="border-t border-zinc-800 bg-zinc-900/40 p-8 sm:p-10 lg:border-l lg:border-t-0">
              <div className="flex h-full flex-col">
                {isPremium ? (
                  <>
                    <div className="flex-1">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-xl">
                        ✓
                      </div>

                      <p className="text-sm font-medium text-emerald-400">
                        Subscription active
                      </p>

                      <h2 className="mt-3 text-3xl font-bold">
                        You&apos;re Premium
                      </h2>

                      <p className="mt-4 text-sm leading-6 text-zinc-400">
                        You already have Premium benefits enabled on your
                        account.
                      </p>

                      <div className="mt-8 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                        <p className="text-sm text-zinc-300">
                          ✓ Creator information
                        </p>
                        <p className="mt-2 text-sm text-zinc-300">
                          ✓ Store availability
                        </p>
                        <p className="mt-2 text-sm text-zinc-300">
                          ✓ Developer section
                        </p>
                        <p className="mt-2 text-sm text-zinc-300">
                          ✓ Latest subreddit posts
                        </p>
                        <p className="mt-2 text-sm text-zinc-300">
                          ✓ DLC information
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-center text-sm text-zinc-500">
                      You already have all Premium benefits.
                    </div>
                  </>
                ) : (
                  <>
    
                    <div>
                      <p className="text-sm font-medium text-zinc-500">
                        Premium
                      </p>

                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-5xl font-bold tracking-tight">
                          ₹0
                        </span>

                        <span className="mb-2 text-sm text-zinc-500">
                          / test
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-zinc-400">
                        Full Premium access for testing.
                      </p>
                    </div>

                    <div className="mt-8">
                      <RazorpayCheckoutButton />
                    </div>

                    <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <div className="flex gap-3">
                        <span className="mt-0.5">🧪</span>

                        <div>
                          <p className="text-sm font-medium text-amber-300">
                            Test payment build
                          </p>

                          <p className="mt-1 text-xs leading-5 text-zinc-500">
                            This is only a Razorpay test environment.
                            Simply click the payment button  choose net banking to get Premium.
                            It is completely free and no real money will be
                            charged just click on any bank and complete the payment to get Premium access it's free for testing.
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
          Premium is currently available as a free test feature while the
          payment system is being developed.
        </p>
      </section>
    </main>
  );
}


function Benefit({icon,title,description,}: {
  icon: string;title: string; description: string;
}){
  return (
    <div className="group flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-lg transition group-hover:border-purple-500/30 group-hover:bg-purple-500/10">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-200">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-5 text-zinc-500">
          {description}
        </p>
      </div>
    </div>
  );
}