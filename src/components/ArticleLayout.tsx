'use client';

import Link from 'next/link';
import { ChevronRight, Clock, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { ArticleFrontmatter, Pillar } from '@/lib/content';

const pillarMeta: Record<Pillar, { label: string; href: string; color: string }> = {
  edc: { label: 'EDC', href: '/edc', color: 'text-orange-400' },
  bags: { label: 'Bags & Packs', href: '/bags', color: 'text-amber-400' },
  travel: { label: 'Travel Carry', href: '/travel', color: 'text-sky-400' },
  ruck: { label: 'Ruck & Fitness', href: '/ruck', color: 'text-green-400' },
};

const typeBadgeColors: Record<string, string> = {
  review: 'bg-orange-500/20 text-orange-400',
  guide: 'bg-sky-500/20 text-sky-400',
  comparison: 'bg-amber-500/20 text-amber-400',
  news: 'bg-green-500/20 text-green-400',
  opinion: 'bg-purple-500/20 text-purple-400',
};

interface ArticleLayoutProps {
  frontmatter: ArticleFrontmatter;
  pillar: Pillar;
  readingTime: string;
  children: React.ReactNode;
}

export default function ArticleLayout({
  frontmatter,
  pillar,
  readingTime,
  children,
}: ArticleLayoutProps) {
  const pm = pillarMeta[pillar];
  const badgeColor = typeBadgeColors[frontmatter.type] || typeBadgeColors.guide;

  const formattedDate = new Date(frontmatter.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <article className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <Link href={pm.href} className={`${pm.color} hover:underline`}>{pm.label}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gray-300 truncate max-w-[200px]">{frontmatter.title}</span>
          </nav>

          {/* Meta header */}
          <div className="mb-10">
            {/* Type badge + tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${badgeColor}`}>
                {frontmatter.type}
              </span>
              {frontmatter.tags.map((tag) => (
                <span key={tag} className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-800 text-gray-400">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              {frontmatter.title}
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed mb-5">
              {frontmatter.description}
            </p>

            {/* Date + reading time */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <time>{formattedDate}</time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{readingTime}</span>
              </div>
              {frontmatter.author && (
                <>
                  <span className="text-gray-700">·</span>
                  <span>By {frontmatter.author}</span>
                </>
              )}
            </div>
          </div>

          {/* Affiliate disclosure */}
          {frontmatter.affiliateDisclosure && (
            <div className="mb-8 p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-gray-500 leading-relaxed">
              <strong className="text-gray-400">Disclosure:</strong> This article contains affiliate links. If you purchase through these links, we may earn a small commission at no extra cost to you. This helps support The Carry Collective and allows us to continue creating free content.
            </div>
          )}

          {/* MDX Content */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-gray-300 prose-a:text-orange-400 prose-strong:text-white prose-li:text-gray-300 prose-blockquote:border-orange-500/40 prose-blockquote:text-gray-400 prose-code:text-orange-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-img:rounded-xl prose-table:border-collapse prose-table:w-full prose-table:text-sm prose-th:bg-zinc-800 prose-th:text-white prose-th:font-semibold prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:border prose-th:border-zinc-700 prose-td:px-4 prose-td:py-2.5 prose-td:border prose-td:border-zinc-700/60 prose-td:text-gray-300 prose-thead:border-b-2 prose-thead:border-zinc-600 [&_tbody_tr:nth-child(even)]:bg-zinc-900/40 [&_tbody_tr:hover]:bg-zinc-800/50 [&_table]:rounded-lg [&_table]:overflow-hidden [&_figure]:overflow-x-auto [&_table]:my-8">
            {children}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 p-8 rounded-2xl border border-orange-500/30 bg-zinc-900/50 text-center">
            <h3 className="text-2xl font-bold mb-3">Join The Carry Collective</h3>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Get expert reviews, price alerts, and exclusive deals delivered to your inbox.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white text-base font-bold tracking-wide transition-all transform hover:scale-[1.03] shadow-lg shadow-orange-600/30"
            >
              Join The Collective
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
