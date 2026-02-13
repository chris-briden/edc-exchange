// src/app/page.tsx (waitlist landing page)
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WaitlistForm from '@/components/WaitlistForm';
import { PocketKnife, Flashlight, PenTool, Wrench } from 'lucide-react';

export default function WaitlistPage() {
  const [signupCount, setSignupCount] = useState<number | null>(null);

  // Fetch current signup count on mount
  useEffect(() => {
    fetch('/api/waitlist')
      .then((res) => res.json())
      .then((data) => setSignupCount(data.count))
      .catch((err) => console.error('Failed to fetch count:', err));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient with EDC Icons - matching old homepage */}
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
          {/* Logo: Icon + Text */}
          <div className="mb-12 flex flex-col items-center gap-6">
            {/* Icon */}
            <Image
              src="/icon-new-white.png"
              alt="The Carry Exchange Icon"
              width={568}
              height={556}
              className="w-48 h-48 md:w-64 md:h-64 opacity-95 drop-shadow-2xl"
              priority
            />
            {/* Brand Text */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white">
              The Carry Exchange
            </h1>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Join the Carry Exchange
          </h2>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            A marketplace built by the community, for the community. Buy, sell,
            trade, and rent the gear you carry every day.
          </p>

          {/* Email Form */}
          <WaitlistForm
            signupType="general"
            source="homepage-hero"
            className="max-w-xl mx-auto mb-6"
            variant="hero"
          />

          {/* Fine print */}
          <p className="text-sm text-gray-500">
            Be first in line when we launch. No spam, ever.
          </p>

          {/* Live counter */}
          {signupCount !== null && signupCount > 0 && (
            <p className="mt-6 text-lg text-orange-400 font-semibold">
              {signupCount.toLocaleString()} {signupCount === 1 ? 'person has' : 'people have'} joined
            </p>
          )}
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
              <p className="text-gray-400 leading-relaxed">
                Earn rental income on your valuable items or offer try before you buy arrangements. Something no other marketplace offers.
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
                Ratings, reviews, and a growing community of carry enthusiasts.
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

            {/* Links */}
            <nav className="flex gap-8 text-sm">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
            </nav>

            {/* Social */}
            <div className="flex gap-4">
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
              The Carry Exchange — Buy, Sell, Trade & Share Everyday Carry
            </p>
            <p>© 2026 The Carry Exchange</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
