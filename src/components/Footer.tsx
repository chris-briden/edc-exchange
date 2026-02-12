import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo-white.png"
                alt="EDC Exchange"
                width={182}
                height={52}
              />
            </div>
            <p className="text-sm leading-relaxed">
              The community marketplace for everyday carry enthusiasts.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories" className="hover:text-white transition">Browse All</Link></li>
              <li><Link href="/categories?category=knives" className="hover:text-white transition">Knives</Link></li>
              <li><Link href="/categories?category=flashlights" className="hover:text-white transition">Flashlights</Link></li>
              <li><Link href="/categories?category=pens" className="hover:text-white transition">Pens</Link></li>
              <li><Link href="/categories?category=multi-tools" className="hover:text-white transition">Multi-Tools</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/community" className="hover:text-white transition">Feed</Link></li>
              <li><Link href="/community?filter=collection" className="hover:text-white transition">Collections</Link></li>
              <li><Link href="/community?filter=review" className="hover:text-white transition">Reviews</Link></li>
              <li><Link href="/community?filter=discussion" className="hover:text-white transition">Discussions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/trust-safety" className="hover:text-white transition">Trust & Safety</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
          &copy; 2026 EDC Exchange. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
