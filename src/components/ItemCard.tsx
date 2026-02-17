import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import CategoryIcon from "@/components/CategoryIcon";
import { listingTypeConfig, type EDCItem } from "@/lib/data";

export default function ItemCard({ item }: { item: EDCItem }) {
  const listing = listingTypeConfig[item.listingType];

  return (
    <Link
      href={`/item/${item.id}`}
      className="group bg-zinc-900/50 backdrop-blur rounded-2xl border border-zinc-800 overflow-hidden hover:border-orange-500/50 transition-all hover:-translate-y-0.5"
    >
      {/* Image placeholder */}
      <div className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="flex justify-center mb-2">
              <CategoryIcon slug={item.category} size="xl" />
            </div>
            <p className="text-xs text-gray-500 font-medium">{item.brand}</p>
          </div>
        </div>
        {/* Listing type badge */}
        <div
          className={`absolute top-3 left-3 ${listing.bg} ${listing.color} px-2.5 py-1 rounded-full text-xs font-semibold`}
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
            ${item.price}
          </p>
        )}
        {item.rentPrice && (
          <p className="text-lg font-bold text-amber-400 mt-2">
            {item.rentPrice}
          </p>
        )}
        {!item.price && !item.rentPrice && (
          <p className="text-sm font-semibold text-blue-400 mt-2">
            Open to offers
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-blue-500" />
            <span className="text-xs text-gray-500">
              {item.owner.username}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-500 text-xs">
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
