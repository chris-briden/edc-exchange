'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Pocket, Backpack, Plane, Dumbbell } from 'lucide-react';

export interface SubCategory {
  title: string;
  desc: string;
  href: string;
  itemCount?: number;
}

export interface FeaturedContent {
  title: string;
  excerpt: string;
  href: string;
  tag: string;
  date?: string;
}

const iconMap = {
  pocket: Pocket,
  backpack: Backpack,
  plane: Plane,
  dumbbell: Dumbbell,
} as const;

type IconName = keyof typeof iconMap;

interface PillarLandingProps {
  title: string;
  subtitle: string;
  description: string;
  iconName: IconName;
  accentColor: string; // e.g. "orange", "amber", "sky", "green"
  heroImage?: string; // e.g. "/hero-edc.jpg"
  subcategories: SubCategory[];
  featuredContent: FeaturedContent[];
  ctaText?: string;
  ctaHref?: string;
}

const colorMap: Record<string, { gradient: string; text: string; bg: string; border: string; badge: string; shadow: string }> = {
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-400',
    shadow: 'shadow-orange-600/30',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-400',
    shadow: 'shadow-amber-600/30',
  },
  sky: {
    gradient: 'from-sky-500 to-sky-600',
    text: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    badge: 'bg-sky-500/20 text-sky-400',
    shadow: 'shadow-sky-600/30',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    badge: 'bg-green-500/20 text-green-400',
    shadow: 'shadow-green-600/30',
  },
};

export default function PillarLanding({
  title,
  subtitle,
  description,
  iconName,
  accentColor,
  heroImage,
  subcategories,
  featuredContent,
  ctaText = 'Join The Collective',
  ctaHref = '/signup',
}: PillarLandingProps) {
  const colors = colorMap[accentColor] || colorMap.orange;
  const Icon = iconMap[iconName];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Background image */}
        {heroImage && (
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt=""
              fill
              className="object-cover"
              priority
              quality={80}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
          </div>
        )}
        {/* Background glow */}
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] ${colors.bg} rounded-full blur-[120px] opacity-60`} />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${colors.gradient} mb-6 sm:mb-8`}>
            <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>

          {/* Badge */}
          <div className={`inline-block px-4 py-1.5 rounded-full ${colors.badge} text-xs sm:text-sm font-semibold mb-4`}>
            {subtitle}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 sm:mb-6">
            {title}
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
            {description}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className={`inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white text-base font-bold tracking-wide transition-all transform hover:scale-[1.03] active:scale-[0.98] shadow-lg ${colors.shadow}`}
            >
              Compare Prices
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/reviews"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-sm font-medium transition-all"
            >
              Browse Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ SUBCATEGORIES GRID ═══════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Browse by Category
          </h2>
          <p className="text-gray-400 text-center mb-10 sm:mb-14 max-w-xl mx-auto">
            Dive into specific gear categories with reviews, guides, and the best prices.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {subcategories.map((sub) => (
              <Link
                key={sub.title}
                href={sub.href}
                className={`group bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6 sm:p-8 hover:${colors.border} transition-all`}
              >
                <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-white transition-colors">
                  {sub.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{sub.desc}</p>
                {sub.itemCount !== undefined && (
                  <span className={`text-xs font-medium ${colors.text}`}>
                    {sub.itemCount} products tracked
                  </span>
                )}
                <div className={`mt-3 flex items-center gap-1 text-sm font-medium ${colors.text} group-hover:gap-2 transition-all`}>
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED CONTENT ═══════════════ */}
      {featuredContent.length > 0 && (
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-zinc-900">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
              Latest Reviews & Guides
            </h2>
            <p className="text-gray-400 text-center mb-10 sm:mb-14 max-w-xl mx-auto">
              Expert takes and deep dives from the community.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredContent.map((content) => (
                <Link
                  key={content.title}
                  href={content.href}
                  className="group bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6 hover:border-orange-500/50 transition-all"
                >
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge} mb-3`}>
                    {content.tag}
                  </span>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-orange-400 transition-colors leading-tight">
                    {content.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3">{content.excerpt}</p>
                  {content.date && (
                    <span className="text-xs text-gray-500">{content.date}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ JOIN CTA ═══════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Join The Carry Collective
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Get access to expert reviews, price alerts, community discussions, and the gear marketplace.
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-base font-bold tracking-wide transition-all transform hover:scale-[1.03] shadow-lg shadow-orange-600/30"
          >
            {ctaText}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
