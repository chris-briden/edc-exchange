'use client';

import { useState } from 'react';
import { ExternalLink, ArrowUpDown, Package, Truck, MapPin } from 'lucide-react';
import type { ExternalListing } from '@/lib/types';
import StockBadge from './StockBadge';
import RetailerBadge from './RetailerBadge';

interface PriceTableProps {
  listings: ExternalListing[];
}

type SortKey = 'price' | 'total' | 'condition' | 'retailer';
type SortDir = 'asc' | 'desc';

export default function PriceTable({ listings }: PriceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('price');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Get unique conditions and locations for filters
  const conditions = Array.from(new Set(listings.map(l => l.condition).filter(Boolean))) as string[];
  const countries = Array.from(new Set(listings.map(l => l.location_country).filter(Boolean))) as string[];

  // Filter
  let filtered = [...listings];
  if (conditionFilter !== 'all') {
    filtered = filtered.filter(l => l.condition === conditionFilter);
  }
  if (locationFilter !== 'all') {
    filtered = filtered.filter(l => l.location_country === locationFilter);
  }

  // Sort
  filtered.sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    switch (sortKey) {
      case 'price':
        return (a.price - b.price) * dir;
      case 'total': {
        const totalA = a.price + (a.shipping_cost || 0);
        const totalB = b.price + (b.shipping_cost || 0);
        return (totalA - totalB) * dir;
      }
      case 'condition':
        return (a.condition || '').localeCompare(b.condition || '') * dir;
      case 'retailer':
        return (a.retailers?.name || '').localeCompare(b.retailers?.name || '') * dir;
      default:
        return 0;
    }
  });

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg font-medium">No listings found yet</p>
        <p className="text-sm mt-1">Check back later — we sync prices every 6 hours</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {conditions.length > 1 && (
          <select
            value={conditionFilter}
            onChange={e => setConditionFilter(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Conditions</option>
            {conditions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
        {countries.length > 1 && (
          <select
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Locations</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
        <span className="text-xs text-zinc-500 self-center ml-auto">
          {filtered.length} listing{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400">
              <th className="text-left py-3 px-3 font-medium">
                <button onClick={() => toggleSort('retailer')} className="flex items-center gap-1 hover:text-white transition">
                  Source <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-3 font-medium">
                <button onClick={() => toggleSort('condition')} className="flex items-center gap-1 hover:text-white transition">
                  Condition <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-right py-3 px-3 font-medium">
                <button onClick={() => toggleSort('price')} className="flex items-center gap-1 justify-end hover:text-white transition">
                  Price <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-right py-3 px-3 font-medium hidden sm:table-cell">Shipping</th>
              <th className="text-right py-3 px-3 font-medium hidden md:table-cell">
                <button onClick={() => toggleSort('total')} className="flex items-center gap-1 justify-end hover:text-white transition">
                  Total <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-center py-3 px-3 font-medium hidden lg:table-cell">Stock</th>
              <th className="text-center py-3 px-3 font-medium hidden lg:table-cell">Location</th>
              <th className="text-right py-3 px-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((listing, i) => {
              const total = listing.price + (listing.shipping_cost || 0);
              const isBestPrice = i === 0 && sortKey === 'price' && sortDir === 'asc';

              return (
                <tr
                  key={listing.id}
                  className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition ${
                    isBestPrice ? 'bg-green-500/5' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <RetailerBadge
                      name={listing.retailers?.name || listing.seller_name || 'Unknown'}
                      type={listing.retailers?.type as 'retail' | 'secondary' || 'secondary'}
                    />
                    {listing.seller_name && listing.retailers?.slug === 'ebay' && (
                      <p className="text-xs text-zinc-500 mt-0.5">{listing.seller_name}</p>
                    )}
                  </td>
                  <td className="py-3 px-3 text-zinc-300">
                    {listing.condition || '—'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`font-semibold ${isBestPrice ? 'text-green-400' : 'text-white'}`}>
                      ${listing.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    {listing.listing_type === 'auction' && (
                      <span className="text-xs text-amber-400 ml-1">(bid)</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-zinc-400 hidden sm:table-cell">
                    {listing.shipping_cost === null ? (
                      <span className="text-zinc-600">—</span>
                    ) : listing.shipping_cost === 0 ? (
                      <span className="text-green-400 text-xs font-medium">FREE</span>
                    ) : (
                      `$${listing.shipping_cost.toFixed(2)}`
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-white hidden md:table-cell">
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-center hidden lg:table-cell">
                    <StockBadge inStock={listing.in_stock} />
                  </td>
                  <td className="py-3 px-3 text-center hidden lg:table-cell">
                    {listing.location_country ? (
                      <span className="flex items-center justify-center gap-1 text-xs text-zinc-400">
                        <MapPin className="w-3 h-3" />
                        {listing.location_region ? `${listing.location_region}, ` : ''}
                        {listing.location_country}
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <a
                      href={listing.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium transition"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Shipping disclaimer */}
      <div className="mt-4 flex items-start gap-2 text-xs text-zinc-500">
        <Truck className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Prices and availability are updated periodically. Shipping costs may vary.
          Always verify details on the retailer&apos;s site before purchasing.
        </p>
      </div>
    </div>
  );
}
