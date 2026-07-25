'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Track your personal game collection',
    description:
      "Track every game you've played, are currently playing, or want to play. VaultggB helps you stay organized and build your personal gaming library effortlessly.",
    image: '/774617.png',
    alt: 'Track your collection',
  },
  {
    title: 'Express your thoughts with reviews',
    description:
      'Share your experience, rate games, and write meaningful reviews. Help others discover what is worth playing while building your own gaming profile.',
    image: '/1123.jpg',
    alt: 'Review games',
  },
  {
    title: 'Keep up with the latest from friends',
    description:
      'See what your friends are playing, discover new reviews, and explore curated lists of games from people you follow.',
    image: '/23456.jpg',
    alt: 'Friend activity',
  },
];

export default function FeatureOverview() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black py-24 text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mb-16 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-blue-400">
            Why VaultggB
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">
            Everything a Gamer Needs
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-gray-400 leading-8">
            Organize your library, share your opinions, and discover great games
            through a clean, modern experience built for players.
          </p>
        </div>

        <div className="space-y-28">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className={`grid items-center gap-10 lg:gap-16 md:grid-cols-2
                ${
                  index % 2 === 1
                    ? 'md:[&>*:first-child]:order-2'
                    : ''
                }
              `}
            >
              {/* Image */}
              <div className="group">
                <div
                  className=" relative aspect-[16/10] overflow-hidden rounded-xl  bg-zinc-900 shadow-2xl ring-1  ring-white/10 transition-all duration-500  group-hover:ring-blue-500/40
                  "
                >
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    fill
                    unoptimized
                    className=" object-cover transition-transform duration-700 group-hover:scale-105
                    "
                    sizes="(max-width:768px)100vw,50vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </div>

              {/* Content */}
              <div className="max-w-xl">
                <div className="mb-5 h-px w-16 bg-blue-500" />

                <h3 className="text-3xl font-bold leading-tight sm:text-4xl">
                  {feature.title}
                </h3>

                <p className="mt-6 text-base leading-8 text-gray-400">
                  {feature.description}
                </p>

                <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-400">
                  Learn More
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}