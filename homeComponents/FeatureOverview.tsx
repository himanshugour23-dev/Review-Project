'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
const features = [
  {
    number: '01',
    eyebrow: 'YOUR COLLECTION',
    title: 'Every game has a place.',
    description: "Keep track of the games you've played, the ones you're playing now, and the adventures waiting in your backlog. Build a gaming library that feels like yours.",
    image: '/774617.png',
    alt: 'Gaming collection',
    tag: 'Organize your library',
    layout: 'large',
  },
  {
    number: '02',
    eyebrow: 'YOUR OPINION',
    title: 'Play it. Feel it. Review it.',
    description: 'Rate your experiences, put your thoughts into words, and create a record of the games that made an impression on you.',
    image: '/johnny-silverhand-3840x2160-27680.jpg',
    alt: 'Game reviews',
    tag: 'Share your perspective',
    layout: 'small',
  },
  {
    number: '03',
    eyebrow: 'DISCOVER SOMETHING NEW',
    title: 'Your next favourite is out there.',
    description: 'Explore the available game catalogue, browse titles you have not played, and find your next adventure.',
    image: '/23456.jpg',
    alt: 'Discover new games',
    tag: 'Explore the catalogue',
    layout: 'small',
  },
  {
    number: '04',
    eyebrow: 'THE BIG PICTURE',
    title: 'Get to know the game.',
    description: 'Explore individual game pages to learn more about titles before deciding which ones deserve a place in your collection.',
    image: '/grand-theft-auto-vi-3840x2160-27417.jpg',
    alt: 'Game artwork and details',
    tag: 'Explore game pages',
    layout: 'large',
  },
  {
    number: '05',
    eyebrow: 'YOUR NEXT SESSION',
    title: 'Keep your backlog in sight.',
    description: 'Keep the games you want to play on your radar and make it easier to decide what to play next.',
    image: '/1123.jpg',
    alt: 'Games waiting to be played',
    tag: 'Find your next game',
    layout: 'small',
  },
  {
    number: '06',
    eyebrow: 'GAMING, SHARED',
    title: 'Good games spark conversations.',
    description: 'Use reviews and community features to share opinions, find other perspectives, and discover games through the experiences of other players.',
    image: '/the-witcher-3-wild-3840x2160-27787.jpg',
    alt: 'Gaming community and reviews',
    tag: 'Explore player perspectives',
    layout: 'small',
  },
];
export default function FeatureOverview() {
  return (
    <section id="baclogged-features" className="relative isolate overflow-hidden border-t border-[#ff557d]/15 bg-[#0c0911] py-16 text-white sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute -left-40 top-32 h-72 w-72 rounded-full bg-[#ff477e]/[0.09] blur-[110px] sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -right-40 bottom-16 h-72 w-72 rounded-full bg-[#00d9e8]/[0.07] blur-[110px] sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#ff557d]/50 to-transparent" />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10 max-w-3xl sm:mb-14 lg:mb-16">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-[#ff557d]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#ff8ba3] sm:text-xs sm:tracking-[0.35em]">Built around your gaming life</p>
          </div>
          <h2 className="mt-5 text-[clamp(2.25rem,6vw,4.5rem)] font-black leading-[0.98] tracking-[-0.045em]">
            More than a list.
            <br />
            <span className="bg-gradient-to-r from-[#ff668c] via-[#ff9b79] to-[#00d9e8] bg-clip-text text-transparent">A life in games.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:mt-6 sm:text-base sm:leading-8">
            baclogged brings your collection, reviews, discovery, and gaming experiences together in one place. Spend less time figuring out what to play and more time playing.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((feature, index) => (
            <motion.article key={feature.number} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.45, delay: (index % 3) * 0.07 }} className={`group min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#15101b] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff668c]/45 hover:shadow-[0_18px_55px_rgba(255,65,112,0.10)] ${feature.layout === 'large' ? 'lg:col-span-2' : ''}`}>
              <Link href="/browse" aria-label={`${feature.title} — browse games`} className="block h-full">
                <div className="relative aspect-[16/9] overflow-hidden bg-[#1b1220]">
                  <Image src={feature.image} alt={feature.alt} fill unoptimized sizes={feature.layout === 'large' ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'} className="object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15101b] via-[#15101b]/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff477e]/10 via-transparent to-[#00d9e8]/10 opacity-70 transition group-hover:opacity-100" />
                  <span className="absolute left-3 top-3 rounded-full border border-[#ff8ba3]/35 bg-[#170c19]/70 px-3 py-1.5 font-mono text-[9px] font-semibold tracking-[0.16em] text-[#ffc0ce] backdrop-blur-md sm:left-5 sm:top-5 sm:text-[10px] sm:tracking-[0.2em]">{feature.number} / 06</span>
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#00d9e8]/35 bg-[#100d18]/65 text-lg text-[#8ff8ff] backdrop-blur-md transition group-hover:border-[#ff668c] group-hover:bg-[#ff668c] group-hover:text-white sm:bottom-5 sm:right-5 sm:h-10 sm:w-10">↗</span>
                </div>
                <div className="flex h-full flex-col p-5 sm:p-6 lg:p-7">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff8ba3] sm:text-[10px] sm:tracking-[0.25em]">{feature.eyebrow}</p>
                  <h3 className="mt-3 break-words text-[clamp(1.35rem,3vw,1.875rem)] font-bold leading-tight tracking-[-0.025em] text-white transition-colors group-hover:text-[#ffb1c2]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/50 sm:mt-4 sm:leading-7">{feature.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-4 sm:mt-6">
                    <span className="text-xs font-semibold text-white/65">{feature.tag}</span>
                    <span className="shrink-0 text-sm text-[#00d9e8] transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-[#ff668c]/20 bg-[#170e1a] p-5 sm:mt-12 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-20 -top-32 h-64 w-64 rounded-full bg-[#ff477e]/15 blur-[100px] sm:h-80 sm:w-80" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-56 w-56 rounded-full bg-[#00d9e8]/10 blur-[100px] sm:h-72 sm:w-72" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#00d9e8] sm:text-[10px] sm:tracking-[0.3em]">Ready when you are</p>
              <h3 className="mt-3 text-[clamp(1.5rem,4vw,1.875rem)] font-black leading-tight tracking-tight">There is always another game.</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">Start exploring the catalogue and find something worth adding to your story.</p>
            </div>
            <Link href="/browse" className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#ff527c] to-[#ff795f] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(255,65,112,0.2)] transition hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(255,65,112,0.35)] sm:w-auto">
              Explore games <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
