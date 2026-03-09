import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import AffiliateLink from './AffiliateLink';

interface ReviewCardProps {
  productName: string;
  brand: string;
  price: string;
  rating: number;        // 0-10
  image?: string;
  buyUrl?: string;
  retailer?: string;
  verdict?: string;
  pros?: string[];
  cons?: string[];
}

export default function ReviewCard({
  productName,
  brand,
  price,
  rating,
  image,
  buyUrl,
  retailer,
  verdict,
  pros = [],
  cons = [],
}: ReviewCardProps) {
  const ratingOutOf5 = Math.round((rating / 10) * 5 * 10) / 10; // e.g. 8.5 → 4.3

  return (
    <div className="my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-6 p-6">
        {/* Product image */}
        {image && (
          <div className="w-full sm:w-40 h-40 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={productName} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">{brand}</p>
          <h3 className="text-xl font-bold text-white mb-2">{productName}</h3>
          <p className="text-lg font-semibold text-orange-400 mb-3">{price}</p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(ratingOutOf5)
                      ? 'text-orange-400 fill-orange-400'
                      : i < ratingOutOf5
                      ? 'text-orange-400 fill-orange-400/50'
                      : 'text-zinc-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">
              {rating}/10
            </span>
          </div>
        </div>
      </div>

      {/* Verdict */}
      {verdict && (
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-orange-500/40 pl-4">
            {verdict}
          </p>
        </div>
      )}

      {/* Pros & Cons */}
      {(pros.length > 0 || cons.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-px bg-zinc-800">
          {pros.length > 0 && (
            <div className="bg-zinc-900/80 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ThumbsUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">Pros</span>
              </div>
              <ul className="space-y-2">
                {pros.map((pro) => (
                  <li key={pro} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-500 mt-1 shrink-0">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cons.length > 0 && (
            <div className="bg-zinc-900/80 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ThumbsDown className="w-4 h-4 text-red-400" />
                <span className="text-sm font-semibold text-red-400">Cons</span>
              </div>
              <ul className="space-y-2">
                {cons.map((con) => (
                  <li key={con} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-red-500 mt-1 shrink-0">−</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      {buyUrl && (
        <div className="p-5 bg-zinc-900/40 border-t border-zinc-800">
          <AffiliateLink href={buyUrl} retailer={retailer} className="text-base font-semibold no-underline bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-full inline-flex items-center gap-2 transition-colors">
            Check Price
          </AffiliateLink>
        </div>
      )}
    </div>
  );
}
