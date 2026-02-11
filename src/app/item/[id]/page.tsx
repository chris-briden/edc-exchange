"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Shield,
  Star,
  Flag,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { edcItems, listingTypeConfig } from "@/lib/data";
import { createClient } from "@/lib/supabase-browser";
import CategoryIcon from "@/components/CategoryIcon";
import type { Item } from "@/lib/types";

const listingConfig: Record<string, { color: string; label: string; bg: string }> = {
  sell: { color: "text-green-700", label: "For Sale", bg: "bg-green-100" },
  trade: { color: "text-blue-700", label: "For Trade", bg: "bg-blue-100" },
  lend: { color: "text-purple-700", label: "Available to Lend", bg: "bg-purple-100" },
  rent: { color: "text-amber-700", label: "For Rent", bg: "bg-amber-100" },
  showcase: { color: "text-gray-700", label: "Showcase", bg: "bg-gray-100" },
};

export default function ItemPage() {
  const params = useParams();
  const id = params.id as string;
  const [dbItem, setDbItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("items")
      .select("*, profiles(*), categories(*), item_images(*)")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) setDbItem(data as Item);
        setLoading(false);
      });
  }, [id]);

  // Mock fallback
  const mockItem = edcItems.find((i) => i.id === id);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </>
    );
  }

  // Render DB item
  if (dbItem) {
    const listing = listingConfig[dbItem.listing_type] || listingConfig.showcase;
    const images = dbItem.item_images || [];
    const categorySlug = dbItem.categories?.slug || "";
    const ownerUsername = dbItem.profiles?.username || "Unknown";
    const ownerAvatar = dbItem.profiles?.avatar_url;

    return (
      <>
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to listings
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden relative">
                {images.length > 0 ? (
                  <Image
                    src={images[selectedImage]?.url || images[0].url}
                    alt={dbItem.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        <CategoryIcon slug={categorySlug} size="xl" />
                      </div>
                      <p className="text-gray-400 text-sm">No images</p>
                    </div>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === i
                          ? "border-orange-500"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={`${dbItem.name} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${listing.bg} ${listing.color}`}
              >
                {listing.label}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold mt-3">
                {dbItem.name}
              </h1>
              <p className="text-gray-500 mt-1">
                {dbItem.brand} &middot; Condition: {dbItem.condition}
              </p>

              {dbItem.price && (
                <p className="text-3xl font-extrabold text-green-700 mt-4">
                  ${Number(dbItem.price).toFixed(0)}
                </p>
              )}
              {dbItem.rent_price && (
                <p className="text-3xl font-extrabold text-amber-700 mt-4">
                  {dbItem.rent_price}
                </p>
              )}
              {!dbItem.price && !dbItem.rent_price && (
                <p className="text-xl font-bold text-blue-600 mt-4">
                  Open to trade offers
                </p>
              )}

              <p className="text-gray-600 mt-4 leading-relaxed">
                {dbItem.description}
              </p>

              {dbItem.tags && dbItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {dbItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                {dbItem.listing_type === "sell" && dbItem.price && (
                  <button className="flex-1 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition">
                    Buy Now &mdash; ${Number(dbItem.price).toFixed(0)}
                  </button>
                )}
                {dbItem.listing_type === "trade" && (
                  <button className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                    Make Trade Offer
                  </button>
                )}
                {dbItem.listing_type === "lend" && (
                  <button className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
                    Request to Borrow
                  </button>
                )}
                {dbItem.listing_type === "rent" && (
                  <button className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition">
                    Rent &mdash; {dbItem.rent_price}
                  </button>
                )}
                <button className="py-3 px-4 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                  Message Seller
                </button>
              </div>

              {/* Engagement */}
              <div className="flex items-center gap-5 mt-6 pt-5 border-t border-gray-200 text-gray-500 text-sm">
                <button className="flex items-center gap-1.5 hover:text-red-500 transition">
                  <Heart className="w-5 h-5" /> Like
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-500 transition">
                  <MessageCircle className="w-5 h-5" /> Comment
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
                  {ownerAvatar ? (
                    <Image
                      src={ownerAvatar}
                      alt={ownerUsername}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {ownerUsername.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{ownerUsername}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-green-500" />{" "}
                        Member
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // Mock fallback
  if (!mockItem) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold">Item not found</h1>
          <p className="text-gray-500 mt-2">
            This item may have been removed or doesn&apos;t exist.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 mt-4 text-orange-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Browse listings
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const listing = listingTypeConfig[mockItem.listingType];

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
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <CategoryIcon slug={mockItem.category} size="xl" />
              </div>
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
              {mockItem.name}
            </h1>
            <p className="text-gray-500 mt-1">
              {mockItem.brand} &middot; Condition: {mockItem.condition}
            </p>

            {mockItem.price && (
              <p className="text-3xl font-extrabold text-green-700 mt-4">
                ${mockItem.price}
              </p>
            )}
            {mockItem.rentPrice && (
              <p className="text-3xl font-extrabold text-amber-700 mt-4">
                {mockItem.rentPrice}
              </p>
            )}
            {!mockItem.price && !mockItem.rentPrice && (
              <p className="text-xl font-bold text-blue-600 mt-4">
                Open to trade offers
              </p>
            )}

            <p className="text-gray-600 mt-4 leading-relaxed">
              {mockItem.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {mockItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {mockItem.listingType === "sell" && (
                <button className="flex-1 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition">
                  Buy Now &mdash; ${mockItem.price}
                </button>
              )}
              {mockItem.listingType === "trade" && (
                <button className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                  Make Trade Offer
                </button>
              )}
              {mockItem.listingType === "lend" && (
                <button className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
                  Request to Borrow
                </button>
              )}
              {mockItem.listingType === "rent" && (
                <button className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition">
                  Rent &mdash; {mockItem.rentPrice}
                </button>
              )}
              <button className="py-3 px-4 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                Message Seller
              </button>
            </div>

            <div className="flex items-center gap-5 mt-6 pt-5 border-t border-gray-200 text-gray-500 text-sm">
              <button className="flex items-center gap-1.5 hover:text-red-500 transition">
                <Heart className="w-5 h-5" /> {mockItem.likes} likes
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-500 transition">
                <MessageCircle className="w-5 h-5" /> {mockItem.comments}{" "}
                comments
              </button>
              <button className="flex items-center gap-1.5 hover:text-green-500 transition ml-auto">
                <Share2 className="w-5 h-5" /> Share
              </button>
              <button className="flex items-center gap-1.5 hover:text-red-400 transition">
                <Flag className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  {mockItem.owner.username.charAt(0)}
                </div>
                <div className="flex-1">
                  <Link
                    href="/profile"
                    className="font-semibold hover:text-orange-600 transition"
                  >
                    {mockItem.owner.username}
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
                    <span>{mockItem.owner.itemCount} items</span>
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
