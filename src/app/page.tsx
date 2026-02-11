import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Users,
  PocketKnife,
  Flashlight,
  PenTool,
  Wrench,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import ItemCard from "@/components/ItemCard";
import CommunityPostCard from "@/components/CommunityPostCard";
import { categories, edcItems, communityPosts } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-[0.07]">
          <PocketKnife className="absolute top-10 left-10 w-24 h-24 text-orange-400" />
          <Flashlight className="absolute top-20 right-20 w-20 h-20 text-blue-400" />
          <PenTool className="absolute bottom-10 left-1/3 w-16 h-16 text-orange-300" />
          <Wrench className="absolute bottom-20 right-10 w-24 h-24 text-blue-300" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-600/20 border border-orange-500/30 text-orange-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              Now in Beta
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              The marketplace for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-400">
                everyday carry
              </span>{" "}
              enthusiasts
            </h1>
            <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-lg">
              Buy, sell, trade, lend, and rent EDC gear. Share your collection.
              Join a community that speaks your language.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/community"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-600 text-white font-semibold hover:bg-orange-700 transition shadow-lg shadow-orange-600/25"
              >
                Explore Community <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition backdrop-blur"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-green-600" />
              <div className="text-left">
                <p className="font-semibold text-sm">Verified Sellers</p>
                <p className="text-xs text-gray-500">
                  Community-vetted traders
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-sm">10,000+ Listings</p>
                <p className="text-xs text-gray-500">
                  Knives, lights, pens & more
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold text-sm">5,000+ Members</p>
                <p className="text-xs text-gray-500">
                  Growing EDC community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Browse Categories</h2>
          <Link
            href="/categories"
            className="text-orange-600 text-sm font-medium hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Listings</h2>
          <Link
            href="/categories"
            className="text-orange-600 text-sm font-medium hover:underline flex items-center gap-1"
          >
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {edcItems.slice(0, 4).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">From the Community</h2>
          <Link
            href="/community"
            className="text-orange-600 text-sm font-medium hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityPosts.slice(0, 4).map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-3xl bg-gradient-to-br from-orange-600 to-blue-600 text-white p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Ready to join the carry?
          </h2>
          <p className="mt-3 text-blue-100 max-w-md mx-auto">
            Share your collection, find your next grail, and connect with EDC
            enthusiasts worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-full bg-white text-orange-600 font-semibold hover:bg-blue-50 transition"
            >
              Create Account
            </Link>
            <Link
              href="/community"
              className="px-6 py-3 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition backdrop-blur"
            >
              Explore First
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
