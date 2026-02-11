"use client";

import Link from "next/link";
import Image from "next/image";
import CategoryIcon from "@/components/CategoryIcon";
import type { Item } from "@/lib/types";

const listingTypeConfig: Record<
  string,
  { color: string; label: string; bg: string }
> = {
  sell: { color: "text-green-700", label: "For Sale", bg: "bg-green-100" },
  trade: { color: "text-blue-700", label: "For Trade", bg: "bg-blue-100" },
  lend: {
    color: "text-purple-700",
    label: "Available to Lend",
    bg: "bg-purple-100",
  },
  rent: { color: "text-amber-700", label: "For Rent", bg: "bg-amber-100" },
  showcase: { color: "text-gray-700", label: "Showcase", bg: "bg-gray-100" },
};

export default function DbItemCard({ item }: { item: Item }) {
  const listing =
    listingTypeConfig[item.listing_type] || listingTypeConfig.showcase;
  const firstImage = item.item_images?.[0]?.url;
  const categorySlug = item.categories?.slug || "";
  const ownerUsername = item.profiles?.username || "Unknown";
  const ownerAvatar = item.profiles?.avatar_url;

  return (
    <Link
      href={`/item/${item.id}`}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
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
              <p className="text-xs text-gray-400 font-medium">{item.brand}</p>
            </div>
          </div>
        )}
        <div
          className={`absolute top-3 left-3 ${listing.bg} ${listing.color} px-2.5 py-1 rounded-full text-xs font-semibold`}
        >
          {listing.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-sm group-hover:text-orange-600 transition line-clamp-1">
          {item.name}
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          {item.brand} &middot; {item.condition}
        </p>

        {item.price && (
          <p className="text-lg font-bold text-green-700 mt-2">
            ${Number(item.price).toFixed(0)}
          </p>
        )}
        {item.rent_price && (
          <p className="text-lg font-bold text-amber-700 mt-2">
            {item.rent_price}
          </p>
        )}
        {!item.price && !item.rent_price && (
          <p className="text-sm font-semibold text-blue-600 mt-2">
            Open to offers
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {ownerAvatar ? (
              <Image
                src={ownerAvatar}
                alt={ownerUsername}
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-blue-500" />
            )}
            <span className="text-xs text-gray-500">{ownerUsername}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
