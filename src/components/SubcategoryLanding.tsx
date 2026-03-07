'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, ArrowLeft, Pocket, Backpack, Plane, Dumbbell, Bell } from 'lucide-react';

const iconMap = {
  pocket: Pocket,
  backpack: Backpack,
  plane: Plane,
  dumbbell: Dumbbell,
} as const;

type IconName = keyof typeof iconMap;

const colorMap: Record<string, { gradient: string; text: string; bg: string; border: string; badge: string; shadow: string; hoverBorder: string }> = {
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-400',
    shadow: 'shadow-orange-600/30',
    hoverBorder: 'hover:border-orange-500/50',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-400',
    shadow: 'shadow-amber-600/30',
    hoverBorder: 'hover:border-amber-500/50',
  },
  sky: {
    gradient: 'from-sky-500 to-sky-600',
    text: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    badge: 'bg-sky-500/20 text-sky-400',
    shadow: 'shadow-sky-600/30',
    hoverBorder: 'hover:border-sky-500/50',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    badge: 'bg-green-500/20 text-green-400',
    shadow: 'shadow-green-600/30',
    hoverBorder: 'hover:border-green-500/50',
  },
};

export interface RelatedSubcategory {
  title: string;
  href: string;
}

interface SubcategoryLandingProps {
  title: string;
  pillarTitle: string;
  pillarHref: string;
  description: string;
  iconName: IconName;
  accentColor: string;
  features: string[];
  relatedSubcategories: RelatedSubcategory[];
}

export default function SubcategoryLanding({
  title,
  pillarTitle,
  pillarHref,
  description,
  iconName,
  accentColor,
  features,
  relatedSubcategories,
}: SubcategoryLandingProps) {
  const colors = colorMap[accentColor] || colorMap.orange;
  const Icon = iconMap[iconName];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] ${colors.bg} rounded-full blur-[120px] opacity-50`} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <Link
            href={pillarHref}
            className={`inline-flex items-center gap-2 text-sm ${colors.text} hover:underline mb-6`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to {pillarTitle}
          </Link>

          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${colors.gradient} mb-6`}>
            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          {/* Badge */}
          <div className={`inline-block px-4 py-1.5 rounded-full ${colors.badge} text-xs sm:text-sm font-semibold mb-4`}>
            Coming Soon
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 sm:mb-6">
            {title}
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            {description}
          </p>
        </div>
      </section>

      {/* ═══════════════ WHAT TO EXPECT ═══════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            What You&apos;ll Find Here
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div
                key={feature}
                className={`flex items-start gap-3 bg-zinc-900/50 border border-zinc-800 rounded-xl p-5`}
              >
                <div className={`mt-0.5 w-2 h-2 rounded-full bg-gradient-to-br ${colors.gradient} shrink-0`} />
                <span className="text-sm text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ NOTIFY CTA ═══════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-zinc-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} mb-6`}>
            <Bell className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Be the First to Know
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            We&apos;re building expert reviews, price comparison, and buyer&apos;s guides for this category. Join The Collective to get notified when it launches.
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
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-zinc-900 to-black">
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
                  <h3 className="text-base font-bold mb-1 group-hover:text-white transition-colors">
                    {sub.title}
                  </h3>
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
