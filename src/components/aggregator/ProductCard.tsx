'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TrendingDown, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  slug: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  category: string;
  msrp: number | null;
  listingCount: number;
  minPrice: number | null;
  maxPrice: number | null;
}

export default function ProductCard({
  slug,
  name,
  brand,
  imageUrl,
  category,
  msrp,
  listingCount,
  minPrice,
  maxPrice,
}: ProductCardProps) {
  const displayName = name.replace(brand, '').trim();
  const hasDeal = msrp && minPrice && minPrice < msrp;
  const savingsPercent = hasDeal ? Math.round(((msrp - minPrice) / msrp) * 100) : 0;

  return (
    <Link
      href={`/products/${slug}`}
      className="group block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-square bg-zinc-800 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600">
            <span className="text-4xl">{category === 'multi-tools' ? '🔧' : '🔪'}</span>
          </div>
        )}

        {/* Savings badge */}
        {hasDeal && savingsPercent > 5 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/90 text-white text-xs font-bold">
            <TrendingDown className="w-3 h-3" />
            {savingsPercent}% below MSRP
          </div>
        )}

        {/* Listing count badge */}
        {listingCount > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 text-white text-xs font-medium backdrop-blur-sm">
            <ExternalLink className="w-3 h-3" />
            {listingCount} listing{listingCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-orange-400 font-medium mb-0.5">{brand}</p>
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-orange-300 transition-colors">
          {displayName || name}
        </h3>

        {/* Price range */}
        <div className="mt-2 flex items-baseline gap-2">
          {minPrice ? (
            <>
              <span className="text-lg font-bold text-white">
                ${minPrice.toLocaleString()}
              </span>
              {maxPrice && maxPrice !== minPrice && (
                <span className="text-xs text-zinc-500">
                  – ${maxPrice.toLocaleString()}
                </span>
              )}
            </>
          ) : msrp ? (
            <span className="text-sm text-zinc-400">MSRP ${msrp.toLocaleString()}</span>
          ) : (
            <span className="text-sm text-zinc-500">No listings yet</span>
          )}
        </div>
      </div>
    </Link>
  );
}
