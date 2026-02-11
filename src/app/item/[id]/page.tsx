import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Shield,
  Star,
  Flag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { edcItems, listingTypeConfig } from "@/lib/data";

export function generateStaticParams() {
  return edcItems.map((item) => ({ id: item.id }));
}

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = edcItems.find((i) => i.id === id) || edcItems[0];
  const listing = listingTypeConfig[item.listingType];

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <span className="text-7xl block mb-3">
                {item.category === "knives" && "🔪"}
                {item.category === "flashlights" && "🔦"}
                {item.category === "pens" && "🖊️"}
                {item.category === "multi-tools" && "🔧"}
                {item.category === "fidget" && "🌀"}
                {item.category === "wallets" && "👛"}
              </span>
              <p className="text-gray-400 text-sm">Product image placeholder</p>
            </div>
          </div>

          {/* Details */}
          <div>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${listing.bg} ${listing.color}`}
            >
              {listing.label}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-3">
              {item.name}
            </h1>
            <p className="text-gray-500 mt-1">
              {item.brand} &middot; Condition: {item.condition}
            </p>

            {item.price && (
              <p className="text-3xl font-extrabold text-green-700 mt-4">
                ${item.price}
              </p>
            )}
            {item.rentPrice && (
              <p className="text-3xl font-extrabold text-amber-700 mt-4">
                {item.rentPrice}
              </p>
            )}
            {!item.price && !item.rentPrice && (
              <p className="text-xl font-bold text-blue-600 mt-4">
                Open to trade offers
              </p>
            )}

            <p className="text-gray-600 mt-4 leading-relaxed">
              {item.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {item.listingType === "sell" && (
                <button className="flex-1 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition">
                  Buy Now — ${item.price}
                </button>
              )}
              {item.listingType === "trade" && (
                <button className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                  Make Trade Offer
                </button>
              )}
              {item.listingType === "lend" && (
                <button className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
                  Request to Borrow
                </button>
              )}
              {item.listingType === "rent" && (
                <button className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition">
                  Rent — {item.rentPrice}
                </button>
              )}
              <button className="py-3 px-4 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                Message Seller
              </button>
            </div>

            {/* Engagement */}
            <div className="flex items-center gap-5 mt-6 pt-5 border-t border-gray-200 text-gray-500 text-sm">
              <button className="flex items-center gap-1.5 hover:text-red-500 transition">
                <Heart className="w-5 h-5" /> {item.likes} likes
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-500 transition">
                <MessageCircle className="w-5 h-5" /> {item.comments} comments
              </button>
              <button className="flex items-center gap-1.5 hover:text-green-500 transition ml-auto">
                <Share2 className="w-5 h-5" /> Share
              </button>
              <button className="flex items-center gap-1.5 hover:text-red-400 transition">
                <Flag className="w-4 h-4" />
              </button>
            </div>

            {/* Seller info */}
            <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                  {item.owner.username.charAt(0)}
                </div>
                <div className="flex-1">
                  <Link
                    href="/profile"
                    className="font-semibold hover:text-orange-600 transition"
                  >
                    {item.owner.username}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-green-500" />{" "}
                      Verified Seller
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500" /> 4.9
                      rating
                    </span>
                    <span>{item.owner.itemCount} items</span>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
