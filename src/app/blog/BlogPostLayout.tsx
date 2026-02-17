import Link from 'next/link';
import Image from 'next/image';
import WaitlistForm from '@/components/WaitlistForm';

interface BlogPostLayoutProps {
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  children: React.ReactNode;
}

export default function BlogPostLayout({
  title,
  date,
  readTime,
  tags,
  children,
}: BlogPostLayoutProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
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
            href="/blog"
            className="text-sm text-gray-400 hover:text-white transition font-medium"
          >
            &larr; All Posts
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Meta */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2 py-1 rounded-full bg-orange-500/20 text-orange-400"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <time>{formattedDate}</time>
            <span>·</span>
            <span>{readTime}</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-orange-400 prose-strong:text-white prose-li:text-gray-300">
          {children}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 rounded-2xl border border-orange-500/30 bg-zinc-900/50 text-center">
          <h3 className="text-2xl font-bold mb-3">Join the Carry Exchange</h3>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            We&apos;re building the marketplace the EDC community actually deserves.
            Low fees, rentals, and a community-first approach. Get on the list.
          </p>
          <WaitlistForm
            signupType="general"
            source="blog-post"
            className="max-w-md mx-auto"
            variant="hero"
          />
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-6 text-center text-sm text-gray-500">
        <Link href="/blog" className="text-orange-400 hover:text-orange-300 transition">
          Read more on the blog
        </Link>
        <p className="mt-2">&copy; 2026 The Carry Exchange</p>
      </footer>
    </div>
  );
}
