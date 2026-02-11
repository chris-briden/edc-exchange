import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { listingTypeConfig, type EDCItem } from "@/lib/data";

export default function ItemCard({ item }: { item: EDCItem }) {
  const listing = listingTypeConfig[item.listingType];

  return (
    <Link
      href={`/item/${item.id}`}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5"
    >
      {/* Image placeholder */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            <span className="text-4xl block mb-2">
              {item.category === "knives" && "🔪"}
              {item.category === "flashlights" && "🔦"}
              {item.category === "pens" && "🖊️"}
              {item.category === "multi-tools" && "🔧"}
              {item.category === "fidget" && "🌀"}
              {item.category === "wallets" && "👛"}
            </span>
            <p className="text-xs text-gray-400 font-medium">{item.brand}</p>
          </div>
        </div>
        {/* Listing type badge */}
        <div className={`absolute top-3 left-3 ${listing.bg} ${listing.color} px-2.5 py-1 rounded-full text-xs font-semibold`}>
          {listing.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-sm group-hover:text-orange-600 transition line-clamp-1">
          {item.name}
        </h3>
        <p className="text-gray-500 text-xs mt-1">{item.brand} &middot; {item.condition}</p>

        {item.price && (
          <p className="text-lg font-bold text-green-700 mt-2">
            ${item.price}
          </p>
        )}
        {item.rentPrice && (
          <p className="text-lg font-bold text-amber-700 mt-2">
            {item.rentPrice}
          </p>
        )}
        {!item.price && !item.rentPrice && (
          <p className="text-sm font-semibold text-blue-600 mt-2">
            Open to offers
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-red-500" />
            <span className="text-xs text-gray-500">{item.owner.username}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400 text-xs">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" /> {item.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" /> {item.comments}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
