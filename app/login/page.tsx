"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";



export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center text-white">

  
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg.jpg"
          alt="background"
          fill
          className="object-cover"
          priority
        />

       
        <div className="absolute inset-0 bg-black/60" />
      </div>


      <div
        className={cn(
          "w-full max-w-md mx-4 rounded-2xl border border-white/10",
          "bg-black/70 backdrop-blur-xl shadow-2xl p-8 bg-transparent "
        )}
      >
       
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-wide">GameVault</h1>
          <p className="text-gray-400 text-sm">
            Rate. Review. Discover the games you love.
          </p>
        </div>


        <div className="mt-8 space-y-4">
          <button
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white bg-opacity-50 text-black font-medium hover:bg-gray-200 transition"
            onClick={() => signIn("google")}
          >
            <Image src="/google.svg" alt="google" width={20} height={20} />
            Continue with Google
          </button>

          <button
            className="w-full flex items-center bg-black bg-opacity-40 justify-center gap-3 py-3 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition"
            onClick={() => signIn("github")}
          >
            <Github size={20} />
            Continue with GitHub
          </button>
        </div>

        {/* Continue without login */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition underline-offset-4 hover:underline"
          >
            Continue without signing in
          </Link>
        </div>
      </div>
    </main>
  );
}
