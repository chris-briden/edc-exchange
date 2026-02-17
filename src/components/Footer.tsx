import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
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
            <p className="text-sm leading-relaxed text-gray-400">
              The community marketplace for everyday carry enthusiasts.
            </p>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              jointhecarry.com
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories" className="text-gray-400 hover:text-orange-400 transition">Browse All</Link></li>
              <li><Link href="/categories?category=knives" className="text-gray-400 hover:text-orange-400 transition">Knives</Link></li>
              <li><Link href="/categories?category=flashlights" className="text-gray-400 hover:text-orange-400 transition">Flashlights</Link></li>
              <li><Link href="/categories?category=pens" className="text-gray-400 hover:text-orange-400 transition">Pens</Link></li>
              <li><Link href="/categories?category=multi-tools" className="text-gray-400 hover:text-orange-400 transition">Multi-Tools</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/community" className="text-gray-400 hover:text-orange-400 transition">Feed</Link></li>
              <li><Link href="/community?filter=collection" className="text-gray-400 hover:text-orange-400 transition">Collections</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-orange-400 transition">Blog</Link></li>
              <li><Link href="/community?filter=review" className="text-gray-400 hover:text-orange-400 transition">Reviews</Link></li>
              <li><Link href="/community?filter=discussion" className="text-gray-400 hover:text-orange-400 transition">Discussions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-orange-400 transition">About</Link></li>
              <li><Link href="/trust-safety" className="text-gray-400 hover:text-orange-400 transition">Trust & Safety</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-orange-400 transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-orange-400 transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-10 pt-6 text-center text-sm text-gray-500">
          &copy; 2026 The Carry Exchange. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
