import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Pocket, Backpack, Plane, Dumbbell, Star, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gear Reviews — Expert EDC, Bag, Travel & Rucking Reviews',
  description:
    'In-depth, honest gear reviews from The Carry Collective community. Knives, backpacks, luggage, rucking gear, and everything you carry.',
  alternates: { canonical: 'https://jointhecarry.com/reviews' },
};

const REVIEW_CATEGORIES = [
  {
    icon: Pocket,
    title: 'EDC Reviews',
    desc: 'Knives, flashlights, multi-tools, pens, and wallets.',
    href: '/edc',
    color: 'text-orange-400',
    bg: 'from-orange-500/20 to-orange-600/20',
    count: 12,
  },
  {
    icon: Backpack,
    title: 'Bag Reviews',
    desc: 'Backpacks, slings, messengers, and duffels.',
    href: '/bags',
    color: 'text-amber-400',
    bg: 'from-amber-500/20 to-amber-600/20',
    count: 0,
  },
  {
    icon: Plane,
    title: 'Travel Reviews',
    desc: 'Luggage, packing cubes, tech kits, and accessories.',
    href: '/travel',
    color: 'text-sky-400',
    bg: 'from-sky-500/20 to-sky-600/20',
    count: 0,
  },
  {
    icon: Dumbbell,
    title: 'Ruck Reviews',
    desc: 'Rucksacks, vests, plates, and training gear.',
    href: '/ruck',
    color: 'text-green-400',
    bg: 'from-green-500/20 to-green-600/20',
    count: 0,
  },
];

const RECENT_ARTICLES = [
  {
    title: 'What Is EDC? The Beginner\'s Guide to Everyday Carry',
    excerpt: 'New to the EDC world? Here\'s everything you need to know about building your first pocket dump.',
    href: '/blog/what-is-edc-everyday-carry-beginners-guide',
    tag: 'EDC',
    date: 'Jan 15, 2026',
    tagColor: 'bg-orange-500/20 text-orange-400',
  },
  {
    title: 'EDC Pocket Dump Ideas for 2026',
    excerpt: 'Fresh loadout inspiration for every budget and style. Minimalist, tactical, urban, and outdoor carries.',
    href: '/blog/edc-pocket-dump-ideas-2026',
    tag: 'EDC',
    date: 'Jan 12, 2026',
    tagColor: 'bg-orange-500/20 text-orange-400',
  },
  {
    title: 'How to Price Used EDC Gear',
    excerpt: 'A practical guide to pricing your knives, flashlights, and multi-tools for resale.',
    href: '/blog/how-to-price-used-edc-gear',
    tag: 'Selling',
    date: 'Jan 10, 2026',
    tagColor: 'bg-orange-500/20 text-orange-400',
  },
  {
    title: 'Best Places to Buy, Sell & Trade EDC Gear',
    excerpt: 'Where the EDC community buys and sells secondhand gear online.',
    href: '/blog/best-places-to-buy-sell-trade-edc-gear',
    tag: 'Guide',
    date: 'Jan 8, 2026',
    tagColor: 'bg-orange-500/20 text-orange-400',
  },
  {
    title: 'Why Founding Members Win on New Marketplaces',
    excerpt: 'The early-mover advantage of joining a marketplace from day one.',
    href: '/blog/why-founding-sellers-win-on-new-marketplaces',
    tag: 'Community',
    date: 'Jan 5, 2026',
    tagColor: 'bg-zinc-700 text-gray-300',
  },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] opacity-50" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 mb-6">
            <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 sm:mb-6">
            Gear Reviews & Guides
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            In-depth, honest reviews from the community. No fluff, no paid placements — just real opinions on the gear that matters.
          </p>

          {/* Search placeholder */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search reviews, guides, and articles..."
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-zinc-900 border border-zinc-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500/50 text-sm"
              readOnly
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ CATEGORY CARDS ═══════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEW_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="group bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-5 hover:border-orange-500/50 transition-all"
                >
                  <div className={`w-11 h-11 mb-3 rounded-lg bg-gradient-to-br ${cat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <h3 className="text-base font-bold mb-1">{cat.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{cat.desc}</p>
                  {cat.count > 0 && (
                    <p className="text-xs text-gray-500 mt-2">{cat.count} articles</p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ LATEST ARTICLES ═══════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Latest Articles</h2>
            <Link href="/blog" className="text-sm text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {RECENT_ARTICLES.map((article) => (
              <Link
                key={article.title}
                href={article.href}
                className="group block bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-5 sm:p-6 hover:border-orange-500/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${article.tagColor}`}>
                        {article.tag}
                      </span>
                      <span className="text-xs text-gray-500">{article.date}</span>
                    </div>
                    <h3 className="text-lg font-bold group-hover:text-orange-400 transition-colors leading-tight mb-1.5">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{article.excerpt}</p>
                  </div>
                  <div className="hidden sm:flex items-center text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Want to Write Reviews?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join The Carry Collective to publish your own gear reviews, share your carries, and help the community make better buying decisions.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-base font-bold tracking-wide transition-all transform hover:scale-[1.03] shadow-lg shadow-orange-600/30"
          >
            Join The Collective
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
