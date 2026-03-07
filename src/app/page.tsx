// src/app/page.tsx — The Carry Collective Homepage
'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Pocket, Backpack, Plane, Dumbbell, Star, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const PILLARS = [
  {
    icon: Pocket,
    title: 'EDC',
    subtitle: 'Everyday Carry',
    desc: 'Knives, flashlights, multi-tools, pens, wallets — the gear in your pockets.',
    href: '/edc',
    color: 'from-orange-500/20 to-orange-600/20',
    accent: 'text-orange-400',
    border: 'hover:border-orange-500/50',
  },
  {
    icon: Backpack,
    title: 'Bags & Packs',
    subtitle: 'Carry Systems',
    desc: 'Backpacks, slings, messengers, duffels — how you haul your world.',
    href: '/bags',
    color: 'from-amber-500/20 to-amber-600/20',
    accent: 'text-amber-400',
    border: 'hover:border-amber-500/50',
  },
  {
    icon: Plane,
    title: 'Travel Carry',
    subtitle: 'On The Move',
    desc: 'Carry-on luggage, packing systems, tech kits, airline guides.',
    href: '/travel',
    color: 'from-sky-500/20 to-sky-600/20',
    accent: 'text-sky-400',
    border: 'hover:border-sky-500/50',
  },
  {
    icon: Dumbbell,
    title: 'Ruck & Fitness',
    subtitle: 'Loaded Carry',
    desc: 'Rucksacks, weighted vests, training plans, and ruck club directory.',
    href: '/ruck',
    color: 'from-green-500/20 to-green-600/20',
    accent: 'text-green-400',
    border: 'hover:border-green-500/50',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/hero-edc-layout.jpg"
            alt="Gear flatlay — knife, flashlight, wallet, watch, pen, multi-tool"
            fill
            className="object-cover object-center scale-105"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-28 sm:pt-32 pb-20 text-center">
          {/* Shield logo */}
          <div className="mb-8 sm:mb-10">
            <Image
              src="/tcc-shield-logo.png"
              alt="The Carry Collective shield logo"
              width={643}
              height={874}
              className="mx-auto h-48 sm:h-64 md:h-72 lg:h-80 w-auto drop-shadow-2xl"
              priority
            />
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-6 sm:mb-8">
            <span className="block text-white">
              Reviews. Guides. Gear.
            </span>
            <span className="block mt-2">
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                Everything You Carry.
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            The carry culture community. Expert reviews, buyer&apos;s guides, price comparison, and marketplace for{' '}
            <span className="text-orange-400 font-medium">EDC</span>,{' '}
            <span className="text-amber-400 font-medium">bags</span>,{' '}
            <span className="text-sky-400 font-medium">travel gear</span>, and{' '}
            <span className="text-green-400 font-medium">rucking</span>.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-base font-bold tracking-wide transition-all transform hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-orange-600/30"
            >
              Join The Collective
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/reviews"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-sm font-medium transition-all"
            >
              Browse Reviews
            </Link>
          </div>

          <p className="text-xs text-gray-500 mb-12">
            Free to join &bull; Expert reviews &bull; Price comparison &bull; Community marketplace
          </p>

          {/* Scroll indicator */}
          <div className="animate-bounce opacity-40">
            <svg className="w-5 h-5 mx-auto text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ═══════════════ 4 PILLARS ═══════════════ */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3">
            One Community. Every Carry.
          </h2>
          <p className="text-gray-400 text-center mb-10 sm:mb-16 max-w-2xl mx-auto text-base sm:text-lg">
            Whether it&apos;s in your pocket, on your back, at the airport, or on the trail — we cover it all.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Link
                  key={pillar.title}
                  href={pillar.href}
                  className={`bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6 sm:p-8 ${pillar.border} transition-all group`}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-5 rounded-lg bg-gradient-to-br ${pillar.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${pillar.accent}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">{pillar.title}</h3>
                  <p className={`text-xs font-semibold ${pillar.accent} mb-2 uppercase tracking-wider`}>{pillar.subtitle}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{pillar.desc}</p>
                  <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${pillar.accent} group-hover:gap-2 transition-all`}>
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHAT WE OFFER ═══════════════ */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-zinc-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-16">
            Everything You Need. One Place.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: Star,
                title: 'Expert Reviews',
                desc: 'In-depth, honest reviews of the gear that matters. No fluff, no paid placements.',
                color: 'text-orange-500',
              },
              {
                icon: TrendingUp,
                title: 'Price Comparison',
                desc: 'Track prices across retailers. Find the best deal before you buy.',
                color: 'text-orange-500',
              },
              {
                icon: Users,
                title: 'Community',
                desc: 'Share your carry, get recommendations, and connect with fellow gear enthusiasts.',
                color: 'text-orange-500',
              },
              {
                icon: ShieldCheck,
                title: 'Marketplace',
                desc: 'Buy, sell, trade, and rent gear with Stripe-powered secure payments.',
                color: 'text-orange-500',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6 hover:border-orange-500/50 transition-all">
                  <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICE CHECK HIGHLIGHT ═══════════════ */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-zinc-900 to-black overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-full mb-6">
            <span className="text-orange-400 font-semibold text-xs sm:text-sm">
              LIVE NOW — 49 PRODUCTS TRACKED
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Never Overpay for Gear Again
          </h2>
          <p className="text-base sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Our price comparison engine tracks prices across BladeHQ, KnifeCenter, SMKW, and more. Compare prices across retailers before you buy.
          </p>

          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-base font-bold tracking-wide transition-all transform hover:scale-[1.03] shadow-lg shadow-orange-600/30"
          >
            Compare Prices
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ═══════════════ FOUNDING MEMBER CTA ═══════════════ */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-zinc-900 to-black border border-orange-500/30 rounded-2xl p-8 sm:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-orange-600/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <div className="inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-full mb-6">
                <span className="text-orange-400 font-semibold text-xs sm:text-sm">
                  LIMITED SPOTS
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Become a Founding Member
              </h2>

              <p className="text-base sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Our first 100 members get permanently locked at our lowest marketplace commission
                rate, plus a Founding Member badge on their profile. Early access to reviews, deals, and Pro features.
              </p>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-base font-bold tracking-wide transition-all transform hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-orange-600/30"
              >
                Join The Collective
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>

              <p className="text-xs sm:text-sm text-gray-500 mt-4">
                Founding Member spots are limited
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
