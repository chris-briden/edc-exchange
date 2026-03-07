import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/tcc-icon.png"
                alt="The Carry Collective"
                width={620}
                height={640}
                className="h-10 w-auto"
              />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-wide text-white uppercase">The Carry</span>
                <span className="text-[9px] font-semibold tracking-[0.2em] text-orange-400 uppercase">Collective</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              The gear culture community. Reviews, guides, and marketplace for everything you carry.
            </p>
            <p className="text-[10px] text-gray-600 mt-2 font-medium">
              jointhecarry.com
            </p>
          </div>

          {/* EDC */}
          <div>
            <h4 className="font-semibold text-white mb-2 md:mb-3 text-xs uppercase tracking-wider">
              EDC
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/edc" className="text-gray-400 hover:text-orange-400 transition">All EDC</Link></li>
              <li><Link href="/edc/knives" className="text-gray-400 hover:text-orange-400 transition">Knives & Blades</Link></li>
              <li><Link href="/edc/flashlights" className="text-gray-400 hover:text-orange-400 transition">Flashlights</Link></li>
              <li><Link href="/edc/multi-tools" className="text-gray-400 hover:text-orange-400 transition">Multi-Tools</Link></li>
              <li><Link href="/edc/pens" className="text-gray-400 hover:text-orange-400 transition">Pens & Writing</Link></li>
            </ul>
          </div>

          {/* Bags & Travel */}
          <div>
            <h4 className="font-semibold text-white mb-2 md:mb-3 text-xs uppercase tracking-wider">
              Bags & Travel
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/bags" className="text-gray-400 hover:text-orange-400 transition">Bags & Packs</Link></li>
              <li><Link href="/bags/backpacks" className="text-gray-400 hover:text-orange-400 transition">Backpacks</Link></li>
              <li><Link href="/travel" className="text-gray-400 hover:text-orange-400 transition">Travel Carry</Link></li>
              <li><Link href="/travel/carry-on" className="text-gray-400 hover:text-orange-400 transition">Carry-On Luggage</Link></li>
              <li><Link href="/ruck" className="text-gray-400 hover:text-orange-400 transition">Ruck & Fitness</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-white mb-2 md:mb-3 text-xs uppercase tracking-wider">
              Community
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/reviews" className="text-gray-400 hover:text-orange-400 transition">Reviews</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-orange-400 transition">Blog & Guides</Link></li>
              <li><Link href="/community" className="text-gray-400 hover:text-orange-400 transition">Community</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-orange-400 transition">Marketplace</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-orange-400 transition">Price Check</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-2 md:mb-3 text-xs uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/about" className="text-gray-400 hover:text-orange-400 transition">About</Link></li>
              <li><Link href="/trust-safety" className="text-gray-400 hover:text-orange-400 transition">Trust & Safety</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-orange-400 transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-orange-400 transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-6 md:mt-10 pt-4 md:pt-6 text-center text-xs text-gray-500">
          &copy; 2026 The Carry Collective. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
