// src/app/page.tsx (waitlist landing page)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import WaitlistForm from '@/components/WaitlistForm';
import { PocketKnife, Flashlight, PenTool, Wrench, ArrowRight, ShieldCheck, RefreshCw, Package, Search, Trophy, Wallet } from 'lucide-react';

export default function WaitlistPage() {

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient with EDC Icons */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* EDC Item Hints */}
          <div className="absolute inset-0 opacity-[0.07]">
            <PocketKnife className="absolute top-10 left-10 w-24 h-24 text-orange-400" />
            <Flashlight className="absolute top-20 right-20 w-20 h-20 text-blue-400" />
            <PenTool className="absolute bottom-10 left-1/3 w-16 h-16 text-orange-300" />
            <Wrench className="absolute bottom-20 right-10 w-24 h-24 text-blue-300" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          {/* Logo - Smaller brand pill */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-zinc-900/60 border border-zinc-700 backdrop-blur">
              <Image
                src="/icon-new-white.png"
                alt="The Carry Exchange"
                width={568}
                height={556}
                className="w-[50px] h-[50px] opacity-95"
                priority
              />
              <span className="text-xl font-bold tracking-wide text-white">
                The Carry Exchange
              </span>
            </div>
          </div>

          {/* Benefit-driven Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
            Stop Selling Your Grails to People Who Don't Get It
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            The first marketplace built exclusively for EDC enthusiasts. Buy, sell,
            trade, and <span className="text-orange-400 font-semibold">rent</span> the gear you carry every day.
          </p>

          {/* Exclusivity hook */}
          <p className="mb-6 text-lg text-orange-400 font-semibold">
            Join the first 100 founding members
          </p>

          {/* Email Form */}
          <WaitlistForm
            signupType="general"
            source="homepage-hero"
            className="max-w-xl mx-auto mb-4"
            variant="hero"
            buttonText="Get Early Access"
          />

          {/* Fine print */}
          <p className="text-sm text-gray-500">
            Be first in line when we launch. No spam, ever.
          </p>

          {/* Social Links */}
          <div className="mt-8 flex justify-center items-center gap-6">
            <a
              href="https://www.instagram.com/thecarryexchange/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-orange-400 transition-colors"
              aria-label="Follow us on Instagram"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61587984548075"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-orange-400 transition-colors"
              aria-label="Follow us on Facebook"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            <a
              href="https://x.com/jointhecarry"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-orange-400 transition-colors"
              aria-label="Follow us on X"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Marketplace Preview Mockup */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 mt-6 mb-20">
          <div className="relative rounded-xl border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-sm shadow-2xl shadow-black/50 overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800/80 border-b border-zinc-700/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-zinc-700/50 rounded-md px-3 py-1 text-xs text-zinc-400 max-w-xs mx-auto text-center">
                  jointhecarry.com/marketplace
                </div>
              </div>
            </div>
            {/* Marketplace grid preview */}
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-zinc-300">Browse EDC Gear</div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">Knives</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">Lights</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">Pens</span>
                  <span className="hidden sm:inline-block px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">Watches</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Item cards */}
                {[
                  { name: 'Chris Reeve Sebenza 31', price: '$425', tag: 'For Sale', tagColor: 'bg-green-500/20 text-green-400' },
                  { name: 'Benchmade Bugout 535', price: '$15/week', tag: 'Try Before Buy', tagColor: 'bg-orange-500/20 text-orange-400' },
                  { name: 'Muyshondt Aeon Mk. III', price: '$280', tag: 'For Sale', tagColor: 'bg-green-500/20 text-green-400' },
                  { name: 'Tactile Turn Side Click', price: 'Trade', tag: 'Open to Trades', tagColor: 'bg-blue-500/20 text-blue-400' },
                ].map((item, i) => (
                  <div key={i} className="bg-zinc-800/50 rounded-lg border border-zinc-700/50 overflow-hidden group hover:border-orange-500/30 transition-all">
                    <div className="aspect-square bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 flex items-center justify-center">
                      <PocketKnife className={`w-8 h-8 text-zinc-500 group-hover:text-orange-400/60 transition-colors ${i === 1 ? 'rotate-45' : i === 2 ? '-rotate-12' : i === 3 ? 'rotate-90' : ''}`} />
                    </div>
                    <div className="p-2.5">
                      <div className="text-xs font-medium text-zinc-300 truncate mb-1">{item.name}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{item.price}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.tagColor}`}>{item.tag}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Gradient overlay at bottom to fade out */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-900/90 to-transparent" />
          </div>
          <p className="text-center text-xs text-zinc-500 mt-3">Preview of The Carry Exchange marketplace</p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* The Old Way vs. The Carry Way */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            There Has to Be a Better Way
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto text-lg">
            Sound familiar? We built The Carry Exchange because we were tired of it too.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-400">The Old Way</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  <span className="text-gray-300">Handwritten timestamps on Reddit posts</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  <span className="text-gray-300">PayPal F&F with zero buyer protection</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  <span className="text-gray-300">eBay fees eating into every sale</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  <span className="text-gray-300">Spending $300 on a knife you've never held</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  <span className="text-gray-300">Explaining to non-EDC buyers why your knife is worth it</span>
                </li>
              </ul>
            </div>

            {/* The Carry Way */}
            <div className="bg-zinc-900/50 backdrop-blur border border-orange-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-orange-400">The Carry Way</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-400/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Purpose-built marketplace for EDC gear</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-400/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Stripe-powered secure payments built in</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-400/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Starting at just 3% — the lowest fees around</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-400/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Rent gear to try before you commit</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-400/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">A community that gets why a Sebenza is worth every penny</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-6 bg-zinc-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-center mb-16 text-lg">
            Three steps. Zero handwritten timestamps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 md:gap-4 items-start">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                <Package className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-sm font-bold text-orange-400 mb-2">STEP 1</div>
              <h3 className="text-xl font-bold mb-3">List Your Gear</h3>
              <p className="text-gray-400 leading-relaxed">
                Snap a photo, set your price, and choose to sell, trade, or rent. Takes less than a minute.
              </p>
            </div>

            {/* Arrow 1→2 */}
            <div className="hidden md:flex items-center justify-center pt-8">
              <ArrowRight className="w-6 h-6 text-zinc-600" />
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-sm font-bold text-orange-400 mb-2">STEP 2</div>
              <h3 className="text-xl font-bold mb-3">Connect & Pay Securely</h3>
              <p className="text-gray-400 leading-relaxed">
                Find your next grail or the perfect buyer. Stripe handles the money — no PayPal F&F risk.
              </p>
            </div>

            {/* Arrow 2→3 */}
            <div className="hidden md:flex items-center justify-center pt-8">
              <ArrowRight className="w-6 h-6 text-zinc-600" />
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-sm font-bold text-orange-400 mb-2">STEP 3</div>
              <h3 className="text-xl font-bold mb-3">Ship & Rotate</h3>
              <p className="text-gray-400 leading-relaxed">
                Ship your gear, fund your next purchase, and keep your collection fresh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Try Before You Buy — Dedicated Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-zinc-900 to-black overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-full mb-6">
              <span className="text-orange-400 font-semibold text-sm">
                ONLY ON THE CARRY EXCHANGE
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Try Before You Buy
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Curious about that $400 Sebenza? Rent it for a week before you commit.
              Sellers earn rental income. Buyers try with confidence. Everyone wins.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6 hover:border-orange-500/50 transition-all">
                <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                  <Search className="w-6 h-6 text-orange-500" />
                </div>
                <h4 className="font-bold mb-2">For Buyers</h4>
                <p className="text-gray-400 text-sm">Try premium gear risk-free before dropping hundreds</p>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6 hover:border-orange-500/50 transition-all">
                <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-orange-500" />
                </div>
                <h4 className="font-bold mb-2">For Sellers</h4>
                <p className="text-gray-400 text-sm">Earn rental income on gear that's sitting in a drawer</p>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6 hover:border-orange-500/50 transition-all">
                <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-orange-500" />
                </div>
                <h4 className="font-bold mb-2">No One Else Has This</h4>
                <p className="text-gray-400 text-sm">The only EDC marketplace with a rental model. Period.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We're Building Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What We're Building
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-8 hover:border-orange-500/50 transition-all group">
              <div className="w-14 h-14 mb-6 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Buy & Sell</h3>
              <p className="text-gray-400 leading-relaxed">
                List your gear in minutes. Find your next grail from verified sellers.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-8 hover:border-orange-500/50 transition-all group">
              <div className="w-14 h-14 mb-6 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Lowest Fees</h3>
              <p className="text-gray-400 leading-relaxed">
                Starting at just 3% commission. Keep more of every sale.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-8 hover:border-orange-500/50 transition-all group">
              <div className="w-14 h-14 mb-6 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Rentals</h3>
              <p className="text-gray-400 leading-relaxed mb-2">
                Earn rental income on your valuable items or offer try before you buy.
              </p>
              <p className="text-orange-500 text-sm font-semibold">
                *Not available anywhere else!
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-8 hover:border-orange-500/50 transition-all group">
              <div className="w-14 h-14 mb-6 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Community First</h3>
              <p className="text-gray-400 leading-relaxed">
                Build your collection and proudly share it with a growing community of carry enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Seller CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-zinc-900 to-black border border-orange-500/30 rounded-2xl p-12 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <div className="inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-full mb-6">
                <span className="text-orange-400 font-semibold text-sm">
                  LIMITED SPOTS
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Become a Founding Seller
              </h2>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Our first 100 sellers get permanently locked at our lowest commission
                rate, plus a Founding Seller badge on their profile. List knives,
                pens, watches, flashlights, multi-tools, and more.
              </p>

              <WaitlistForm
                signupType="founding_seller"
                source="homepage-founding-seller"
                buttonText="Claim Your Spot"
                className="max-w-xl mx-auto mb-4"
              />

              <p className="text-sm text-gray-500">
                Founding Seller spots are limited
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            {/* Logo: Icon + Text */}
            <div className="flex items-center gap-3">
              <Image
                src="/icon-new-white.png"
                alt="The Carry Exchange"
                width={568}
                height={556}
                className="h-10 w-10"
              />
              <span className="text-lg font-bold tracking-wide text-white">
                The Carry Exchange
              </span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/blog"
                className="text-gray-400 hover:text-orange-400 transition-colors font-medium"
              >
                Blog
              </Link>
              <a
                href="https://instagram.com/jointhecarry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              The Carry Exchange — Buy, Sell, Trade & Rent Everyday Carry
            </p>
            <p>&copy; 2026 The Carry Exchange</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
