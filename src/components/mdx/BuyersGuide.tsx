import { Award, ArrowRight } from 'lucide-react';
import AffiliateLink from './AffiliateLink';

interface BuyersGuideItem {
  name: string;
  brand: string;
  price: string;
  badge?: string;         // e.g. "Best Overall", "Best Budget", "Editor's Pick"
  rating: number;         // 0-10
  summary: string;
  buyUrl: string;
  retailer?: string;
  image?: string;
}

interface BuyersGuideProps {
  title?: string;
  items: BuyersGuideItem[];
}

export default function BuyersGuide({ title, items = [] }: BuyersGuideProps) {
  return (
    <div className="my-10">
      {title && (
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-orange-400" />
          {title}
        </h3>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.name}
            className="relative rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6 hover:border-zinc-700 transition-colors"
          >
            {/* Rank number */}
            <div className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              {index + 1}
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              {/* Image */}
              {item.image && (
                <div className="w-full sm:w-28 h-28 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {item.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                      {item.badge}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{item.brand}</span>
                </div>

                <h4 className="text-lg font-bold text-white mb-1">{item.name}</h4>

                <div className="flex items-center gap-3 mb-2">
                  <span className="text-base font-semibold text-orange-400">{item.price}</span>
                  <span className="text-xs text-gray-500">{item.rating}/10</span>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed mb-3">{item.summary}</p>

                <AffiliateLink
                  href={item.buyUrl}
                  retailer={item.retailer}
                  className="text-sm font-medium"
                >
                  Check Price <ArrowRight className="w-3 h-3" />
                </AffiliateLink>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
