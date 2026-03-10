'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, ChevronRight, Clock, Calendar, Pocket, Backpack, Plane, Dumbbell, Bell } from 'lucide-react';

const iconMap = {
  pocket: Pocket,
  backpack: Backpack,
  plane: Plane,
  dumbbell: Dumbbell,
} as const;

type IconName = keyof typeof iconMap;

const colorMap: Record<string, { gradient: string; text: string; bg: string; border: string; badge: string; shadow: string; hoverBorder: string; ring: string }> = {
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-400',
    shadow: 'shadow-orange-600/30',
    hoverBorder: 'hover:border-orange-500/50',
    ring: 'ring-orange-500/30',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-400',
    shadow: 'shadow-amber-600/30',
    hoverBorder: 'hover:border-amber-500/50',
    ring: 'ring-amber-500/30',
  },
  sky: {
    gradient: 'from-sky-500 to-sky-600',
    text: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    badge: 'bg-sky-500/20 text-sky-400',
    shadow: 'shadow-sky-600/30',
    hoverBorder: 'hover:border-sky-500/50',
    ring: 'ring-sky-500/30',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    badge: 'bg-green-500/20 text-green-400',
    shadow: 'shadow-green-600/30',
    hoverBorder: 'hover:border-green-500/50',
    ring: 'ring-green-500/30',
  },
};

const typeLabels: Record<string, string> = {
  review: 'Review',
  guide: 'Guide',
  comparison: 'Comparison',
  news: 'News',
  opinion: 'Opinion',
};

export interface RelatedSubcategory {
  title: string;
  href: string;
}

export interface ArticleCard {
  title: string;
  description: string;
  href: string;
  type: string;
  date: string;
  readingTime: string;
  tags: string[];
}

interface SubcategoryLandingProps {
  title: string;
  pillarTitle: string;
  pillarHref: string;
  description: string;
  iconName?: IconName;
  accentColor: string;
  heroImage?: string;
  features: string[];
  relatedSubcategories: RelatedSubcategory[];
  articles?: ArticleCard[];
}

export default function SubcategoryLanding({
  title,
  pillarTitle,
  pillarHref,
  description,
  accentColor,
  heroImage,
  features,
  relatedSubcategories,
  articles = [],
}: SubcategoryLandingProps) {
  const colors = colorMap[accentColor] || colorMap.orange;
  const hasArticles = articles.length > 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        {heroImage && (
          <div className="absolute inset-0">
            <Image src={heroImage} alt="" fill className="object-cover" priority quality={80} />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
          </div>
        )}
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] ${colors.bg} rounded-full blur-[120px] opacity-30`} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-10 sm:mb-14">
            <Link href={pillarHref} className={`${colors.text} hover:underline`}>{pillarTitle}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-300">{title}</span>
          </nav>

          <div className="text-center">
            {hasArticles && (
              <div className={`inline-block px-3 py-1 rounded-full ${colors.badge} text-xs font-semibold tracking-wide uppercase mb-4`}>
                {articles.length} {articles.length === 1 ? 'Article' : 'Articles'}
              </div>
            )}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 sm:mb-6">{title}</h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">{description}</p>
          </div>
        </div>
      </section>

      {/* ═══════════════ ARTICLES GRID ═══════════════ */}
      {hasArticles && (
        <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-black to-zinc-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
              Latest Reviews &amp; Guides
            </h2>

            {/* Featured article (first) */}
            <Link
              href={articles[0].href}
              className={`group block bg-zinc-900/60 border border-zinc-800 ${colors.hoverBorder} rounded-2xl p-6 sm:p-8 mb-6 transition-all hover:bg-zinc-900/80`}
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                  {typeLabels[articles[0].type] || articles[0].type}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {articles[0].date}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {articles[0].readingTime}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-white transition-colors">
                {articles[0].title}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4 max-w-3xl">
                {articles[0].description}
              </p>
              <div className="flex flex-wrap gap-2">
                {articles[0].tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="text-xs bg-zinc-800 text-gray-400 rounded-full px-2.5 py-0.5">{tag}</span>
                ))}
              </div>
            </Link>

            {/* Remaining articles */}
            {articles.length > 1 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {articles.slice(1).map((article) => (
                  <Link
                    key={article.href}
                    href={article.href}
                    className={`group bg-zinc-900/50 border border-zinc-800 ${colors.hoverBorder} rounded-xl p-5 sm:p-6 transition-all hover:bg-zinc-900/70 flex flex-col`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                        {typeLabels[article.type] || article.type}
                      </span>
                      <span className="text-xs text-gray-500">{article.readingTime}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-white transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-3 line-clamp-3">
                      {article.description}
                    </p>
                    <div className={`flex items-center gap-1 text-sm font-medium ${colors.text} group-hover:gap-2 transition-all mt-auto`}>
                      Read more <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════ WHAT TO EXPECT ═══════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            {hasArticles ? 'More Coming Soon' : 'What You\u0027ll Find Here'}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                <div className={`mt-0.5 w-2 h-2 rounded-full bg-gradient-to-br ${colors.gradient} shrink-0`} />
                <span className="text-sm text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ NOTIFY CTA ═══════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-3xl mx-auto text-center">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} mb-6`}>
            <Bell className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {hasArticles ? 'Never Miss a Review' : 'Be the First to Know'}
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            {hasArticles
              ? 'New reviews, comparisons, and buyer\u0027s guides drop every week. Join The Collective to get notified.'
              : 'We\u0027re building expert reviews, price comparison, and buyer\u0027s guides for this category. Join The Collective to get notified when it launches.'}
          </p>
          <Link
            href="/signup"
            className={`inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white text-base font-bold tracking-wide transition-all transform hover:scale-[1.03] active:scale-[0.98] shadow-lg ${colors.shadow}`}
          >
            Join The Collective
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ═══════════════ RELATED ═══════════════ */}
      {relatedSubcategories.length > 0 && (
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-black">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">
              Explore More in {pillarTitle}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedSubcategories.map((sub) => (
                <Link
                  key={sub.title}
                  href={sub.href}
                  className={`group bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 ${colors.hoverBorder} transition-all`}
                >
                  <h3 className="text-base font-bold mb-1 group-hover:text-white transition-colors">{sub.title}</h3>
                  <div className={`flex items-center gap-1 text-sm font-medium ${colors.text} group-hover:gap-2 transition-all`}>
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
