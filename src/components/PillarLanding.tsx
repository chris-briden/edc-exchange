'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, ChevronRight, Pocket, Backpack, Plane, Dumbbell, Clock, Calendar } from 'lucide-react';

export interface SubCategory {
  title: string;
  desc: string;
  href: string;
  itemCount?: number;
  image?: string; // Unsplash URL for card background
}

export interface FeaturedContent {
  title: string;
  excerpt: string;
  href: string;
  tag: string;
  date?: string;
  readingTime?: string;
  tags?: string[];
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
  iconName?: IconName;
  accentColor: string; // e.g. "orange", "amber", "sky", "green"
  heroImage?: string; // e.g. Unsplash URL or "/hero-edc.jpg"
  subcategories: SubCategory[];
  featuredContent: FeaturedContent[];
  ctaText?: string;
  ctaHref?: string;
}

const colorMap: Record<string, { gradient: string; text: string; bg: string; border: string; borderHover: string; badge: string; shadow: string; hoverText: string; overlay: string }> = {
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    borderHover: 'hover:border-orange-500/50',
    badge: 'bg-orange-500/20 text-orange-400',
    shadow: 'shadow-orange-600/30',
    hoverText: 'group-hover:text-orange-400',
    overlay: 'from-orange-950/80 via-black/60 to-transparent',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    borderHover: 'hover:border-amber-500/50',
    badge: 'bg-amber-500/20 text-amber-400',
    shadow: 'shadow-amber-600/30',
    hoverText: 'group-hover:text-amber-400',
    overlay: 'from-amber-950/80 via-black/60 to-transparent',
  },
  sky: {
    gradient: 'from-sky-500 to-sky-600',
    text: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    borderHover: 'hover:border-sky-500/50',
    badge: 'bg-sky-500/20 text-sky-400',
    shadow: 'shadow-sky-600/30',
    hoverText: 'group-hover:text-sky-400',
    overlay: 'from-sky-950/80 via-black/60 to-transparent',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    borderHover: 'hover:border-green-500/50',
    badge: 'bg-green-500/20 text-green-400',
    shadow: 'shadow-green-600/30',
    hoverText: 'group-hover:text-green-400',
    overlay: 'from-green-950/80 via-black/60 to-transparent',
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

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
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
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
          </div>
        )}
        {/* Background glow */}
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] ${colors.bg} rounded-full blur-[120px] opacity-30`} />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Breadcrumb — top left */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-10 sm:mb-14">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className={colors.text}>{title}</span>
          </nav>

          {/* Title + Badge */}
          <div className="text-center">
            <div className={`inline-block px-3 py-1 rounded-full ${colors.badge} text-xs font-semibold tracking-wide uppercase mb-4`}>
              {subtitle}
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 sm:mb-6">
              {title}
            </h1>

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
                className={`group relative rounded-xl overflow-hidden border border-zinc-800 ${colors.borderHover} transition-all ${sub.image ? 'aspect-[4/3]' : ''}`}
              >
                {/* Card background image */}
                {sub.image ? (
                  <>
                    <Image
                      src={sub.image}
                      alt={sub.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${colors.overlay}`} />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                    {/* Content over image */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-1 drop-shadow-lg">
                        {sub.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-2 mb-2">{sub.desc}</p>
                      {sub.itemCount !== undefined && (
                        <span className={`text-xs font-medium ${colors.text}`}>
                          {sub.itemCount} products tracked
                        </span>
                      )}
                      <div className={`mt-2 flex items-center gap-1 text-sm font-medium ${colors.text} group-hover:gap-2 transition-all`}>
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </>
                ) : (
                  /* Fallback: text-only card (original style) */
                  <div className="bg-zinc-900/50 backdrop-blur p-6 sm:p-8">
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
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED CONTENT ═══════════════ */}
      {featuredContent.length > 0 && (
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10 sm:mb-14">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  Latest Reviews &amp; Guides
                </h2>
                <p className="text-gray-400 max-w-xl">
                  {featuredContent.length} articles — expert takes and deep dives from the community.
                </p>
              </div>
            </div>

            {/* Featured article (first) */}
            <Link
              href={featuredContent[0].href}
              className={`group block bg-zinc-900/60 border border-zinc-800 ${colors.borderHover} rounded-2xl p-6 sm:p-8 mb-6 transition-all hover:bg-zinc-900/80`}
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                  {featuredContent[0].tag}
                </span>
                {featuredContent[0].date && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {featuredContent[0].date}
                  </span>
                )}
                {featuredContent[0].readingTime && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {featuredContent[0].readingTime}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-white transition-colors">
                {featuredContent[0].title}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4 max-w-3xl">
                {featuredContent[0].excerpt}
              </p>
              {featuredContent[0].tags && (
                <div className="flex flex-wrap gap-2">
                  {featuredContent[0].tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-xs bg-zinc-800 text-gray-400 rounded-full px-2.5 py-0.5">{tag}</span>
                  ))}
                </div>
              )}
            </Link>

            {/* Remaining articles in grid */}
            {featuredContent.length > 1 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {featuredContent.slice(1).map((content) => (
                  <Link
                    key={content.title}
                    href={content.href}
                    className={`group bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-5 sm:p-6 ${colors.borderHover} transition-all hover:bg-zinc-900/70 flex flex-col`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                        {content.tag}
                      </span>
                      {content.readingTime && (
                        <span className="text-xs text-gray-500">{content.readingTime}</span>
                      )}
                    </div>
                    <h3 className={`text-base sm:text-lg font-bold mb-2 group-hover:text-white transition-colors leading-snug`}>
                      {content.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-3 line-clamp-3">{content.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto">
                      {content.date && (
                        <span className="text-xs text-gray-500">{content.date}</span>
                      )}
                      <div className={`flex items-center gap-1 text-sm font-medium ${colors.text} group-hover:gap-2 transition-all`}>
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
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
