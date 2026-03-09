import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { blogPosts } from './blogData';
import { getAllArticles, type ArticleMeta } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Blog — Reviews, Guides & Gear Talk | The Carry Collective',
  description:
    'Expert reviews, buyer\'s guides, and deep dives on EDC, bags, travel carry, and rucking gear from The Carry Collective community.',
  alternates: {
    canonical: 'https://jointhecarry.com/blog',
  },
};

const pillarColors: Record<string, string> = {
  edc: 'bg-orange-500/20 text-orange-400',
  bags: 'bg-amber-500/20 text-amber-400',
  travel: 'bg-sky-500/20 text-sky-400',
  ruck: 'bg-green-500/20 text-green-400',
};

const typeLabels: Record<string, string> = {
  review: 'Review',
  guide: 'Guide',
  comparison: 'Comparison',
  news: 'News',
  opinion: 'Opinion',
};

export default function BlogIndex() {
  const mdxArticles = getAllArticles();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-orange-400">Blog</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            The Carry Blog
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed">
            Expert reviews, buyer&apos;s guides, and deep dives on everything you carry — from pocket gear to rucking fitness.
          </p>
        </div>
      </section>

      {/* MDX Articles (new content system) */}
      {mdxArticles.length > 0 && (
        <section className="pb-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Latest
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mdxArticles.map((article: ArticleMeta) => (
                <Link
                  key={`${article.pillar}-${article.slug}`}
                  href={`/blog/${article.pillar}/${article.slug}`}
                  className="group block bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all"
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${pillarColors[article.pillar] || pillarColors.edc}`}>
                      {article.pillar}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-gray-400">
                      {typeLabels[article.frontmatter.type] || article.frontmatter.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-orange-400 transition-colors leading-tight">
                    {article.frontmatter.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-3">
                    {article.frontmatter.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <time>
                      {new Date(article.frontmatter.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <span>·</span>
                    <span>{article.readingTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Legacy Blog Posts (existing hardcoded content) */}
      <section className="pb-16 px-4 sm:px-6 border-t border-zinc-800/50 pt-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            Archive
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-800 text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-orange-400 transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-3">
                  {post.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <time>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Get new reviews, guides, and deals delivered to your inbox. No spam, just gear.
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
