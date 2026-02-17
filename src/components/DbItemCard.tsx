"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import CategoryIcon from "@/components/CategoryIcon";
import type { Item } from "@/lib/types";

const listingTypeConfig: Record<
  string,
  { color: string; label: string; bg: string }
> = {
  sell: { color: "text-green-300", label: "For Sale", bg: "bg-green-500/20" },
  trade: { color: "text-blue-300", label: "For Trade", bg: "bg-blue-500/20" },
  lend: {
    color: "text-purple-300",
    label: "Available to Lend",
    bg: "bg-purple-500/20",
  },
  rent: { color: "text-amber-300", label: "For Rent", bg: "bg-amber-500/20" },
  showcase: { color: "text-gray-300", label: "Showcase", bg: "bg-gray-500/20" },
};

export default function DbItemCard({ item }: { item: Item }) {
  const listing =
    listingTypeConfig[item.listing_type] || listingTypeConfig.showcase;
  const firstImage = item.item_images?.[0]?.url;
  const categorySlug = item.categories?.slug || "";
  const ownerUsername = item.profiles?.username || "Unknown";
  const ownerAvatar = item.profiles?.avatar_url;
  const likesCount = item.likes?.[0]?.count ?? 0;
  const commentsCount = item.comments?.[0]?.count ?? 0;

  return (
    <Link
      href={`/item/${item.id}`}
      className="group bg-zinc-900/50 backdrop-blur rounded-2xl border border-zinc-800 overflow-hidden hover:border-orange-500/50 transition-all hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 relative overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                <CategoryIcon slug={categorySlug} size="xl" />
              </div>
              <p className="text-xs text-gray-500 font-medium">{item.brand}</p>
            </div>
          </div>
        )}
        <div
          className={`absolute top-3 left-3 ${listing.bg} ${listing.color} px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur`}
        >
          {listing.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-white group-hover:text-orange-400 transition line-clamp-1">
          {item.name}
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          {item.brand} &middot; {item.condition}
        </p>

        {item.price && (
          <p className="text-lg font-bold text-green-400 mt-2">
            ${Number(item.price).toFixed(0)}
          </p>
        )}
        {item.rent_price && (
          <p className="text-lg font-bold text-amber-400 mt-2">
            {item.rent_price}
          </p>
        )}
        {!item.price && !item.rent_price && (
          <p className="text-sm font-semibold text-blue-400 mt-2">
            Open to offers
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-1">
            {ownerAvatar ? (
              <Image
                src={ownerAvatar}
                alt={ownerUsername}
                width={20}
                height={20}
                className="rounded-full w-5 h-5 object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-blue-500" />
            )}
            <span className="text-xs text-gray-500">{ownerUsername}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {likesCount > 0 && (
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {likesCount}
              </span>
            )}
            {commentsCount > 0 && (
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {commentsCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
