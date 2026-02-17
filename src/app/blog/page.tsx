import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { blogPosts } from './blogData';

export const metadata: Metadata = {
  title: 'Blog — EDC Guides, Tips & Gear Talk',
  description:
    'Guides on buying, selling, and trading everyday carry gear. Pocket dump inspiration, pricing tips, and community stories from The Carry Exchange.',
  alternates: {
    canonical: 'https://jointhecarry.com/blog',
  },
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <Image
              src="/icon-new-white.png"
              alt="The Carry Exchange"
              width={40}
              height={40}
              className="w-8 h-8"
            />
            <span className="font-bold text-lg">The Carry Exchange</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-orange-400 hover:text-orange-300 transition font-medium"
          >
            Join the Waitlist &rarr;
          </Link>
        </div>
      </header>

      {/* Blog Hero */}
      <section className="py-16 px-6 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">The Carry Blog</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Gear guides, community stories, and everything you need to know about buying, selling,
            and carrying EDC.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-orange-500/50 transition-all"
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
                <h2 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{post.description}</p>
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
      <section className="py-16 px-6 border-t border-zinc-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to join the community?</h2>
          <p className="text-gray-400 mb-8">
            The Carry Exchange is building the marketplace the EDC community deserves.
            Get on the waitlist and be first to know when we launch.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 rounded-full font-semibold bg-orange-700 text-white hover:bg-orange-600 transition shadow-lg shadow-orange-900/50"
          >
            Join the Waitlist
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-6 text-center text-sm text-gray-500">
        <p>&copy; 2026 The Carry Exchange</p>
      </footer>
    </div>
  );
}
