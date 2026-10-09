
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const features = [
  {
    number: '01',
    eyebrow: 'YOUR COLLECTION',
    title: 'Every game has a place.',
    description:
      "Keep track of the games you've played, the ones you're playing now, and the adventures waiting in your backlog. Build a gaming library that feels like yours.",
    image: '/774617.png',
    alt: 'Gaming collection',
    tag: 'Organize your library',
    layout: 'large',
  },
  {
    number: '02',
    eyebrow: 'YOUR OPINION',
    title: 'Play it. Feel it. Review it.',
    description:
      'Rate your experiences, put your thoughts into words, and create a record of the games that made an impression on you.',
    image: '/1123.jpg',
    alt: 'Game reviews',
    tag: 'Share your perspective',
    layout: 'small',
  },
  {
    number: '03',
    eyebrow: 'DISCOVER SOMETHING NEW',
    title: 'Your next favourite is out there.',
    description:
      'Explore the available game catalogue, browse titles you have not played, and find your next adventure.',
    image: '/23456.jpg',
    alt: 'Discover new games',
    tag: 'Explore the catalogue',
    layout: 'small',
  },
  {
    number: '04',
    eyebrow: 'THE BIG PICTURE',
    title: 'Get to know the game.',
    description:
      'Explore individual game pages to learn more about titles before deciding which ones deserve a place in your collection.',
    image: '/774617.png',
    alt: 'Game artwork and details',
    tag: 'Explore game pages',
    layout: 'large',
  },
  {
    number: '05',
    eyebrow: 'YOUR NEXT SESSION',
    title: 'Keep your backlog in sight.',
    description:
      'Keep the games you want to play on your radar and make it easier to decide what to play next.',
    image: '/1123.jpg',
    alt: 'Games waiting to be played',
    tag: 'Find your next game',
    layout: 'small',
  },
  {
    number: '06',
    eyebrow: 'GAMING, SHARED',
    title: 'Good games spark conversations.',
    description:
      'Use reviews and community features to share opinions, find other perspectives, and discover games through the experiences of other players.',
    image: '/23456.jpg',
    alt: 'Gaming community and reviews',
    tag: 'Explore player perspectives',
    layout: 'small',
  },
];

export default function FeatureOverview() {
  return (
    <section
      id="baclogged-features"
      className="relative overflow-hidden border-t border-white/[0.08] bg-[#08090c] py-20 text-white sm:py-28"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-lime-300/[0.04] blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-emerald-400/[0.035] blur-[100px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl sm:mb-16"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-lime-300" />
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-lime-300 sm:text-xs">
              Built around your gaming life
            </p>
          </div>

          <h2 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            More than a list.
            <br />
            <span className="text-white/35">A life in games.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/50 sm:text-base sm:leading-8">
            baclogged brings your collection, reviews, discovery, and
            gaming experiences together in one place. Spend less time
            figuring out what to play and more time playing.
          </p>
        </motion.div>

        {/* Editorial feature grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.number}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.45, delay: (index % 3) * 0.07 }}
              className={`group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101116] transition-colors duration-300 hover:border-lime-300/30 ${
                feature.layout === 'large' ? 'lg:col-span-2' : ''
              }`}
            >
              <Link
                href="/browse"
                aria-label={`${feature.title} — browse games`}
                className="block h-full"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#17181d]">
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    fill
                    unoptimized
                    sizes={
                      feature.layout === 'large'
                        ? '(max-width: 1024px) 100vw, 66vw'
                        : '(max-width: 640px) 100vw, 33vw'
                    }
                    className="object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#101116] via-black/10 to-transparent" />

                  <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-white/75 backdrop-blur-md">
                    {feature.number}
                  </span>

                  <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-lg text-white transition group-hover:border-lime-300 group-hover:bg-lime-300 group-hover:text-black">
                    ↗
                  </span>
                </div>

                <div className="p-6 pt-2 sm:p-7 sm:pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-lime-300">
                    {feature.eyebrow}
                  </p>

                  <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/45">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
                    <span className="text-xs font-semibold text-white/65">
                      {feature.tag}
                    </span>
                    <span className="text-sm text-lime-300 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Final call to action */}
        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-lime-300/15 bg-lime-300/[0.035] p-7 sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-lime-300">
              Ready when you are
            </p>
            <h3 className="mt-3 text-2xl font-black sm:text-3xl">
              There is always another game.
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
              Start exploring the catalogue and find something worth
              adding to your story.
            </p>
          </div>

          <Link
            href="/browse"
            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-lime-300 px-6 py-3.5 text-sm font-bold text-black transition hover:bg-lime-200"
          >
            Explore games <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
