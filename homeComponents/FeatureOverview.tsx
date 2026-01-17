'use client';

import Image from 'next/image';

export default function FeatureOverview() {
  return (
    <section className="bg-black text-white py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-20">

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden">
            <Image
              src="/774617.png"
              alt="Track your collection"
              fill
              unoptimized
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Track your personal game collection</h2>
            <p className="text-gray-300 text-base">
              Track every game you've played, are currently playing, or want to play.  VaultggB helps you stay organized .
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center md:flex-row-reverse">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Express your thoughts with reviews</h2>
            <p className="text-gray-300 text-base">
              Share your experience and rate games. your review defines what it means to you. Help others discover what’s worth playing.
            </p>
          </div>
          <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden">
            <Image
              src="/1123.jpg" 
              alt="Review games"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

     
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden">
            <Image
              src="/23456.jpg"
              alt="Friend activity feed"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Keep up with the latest from friends</h2>
            <p className="text-gray-300 text-base">
            see people ,reviews, and curated lists of games.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}