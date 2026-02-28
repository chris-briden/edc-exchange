'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

interface ProductFiltersProps {
  brands: string[];
}

export default function ProductFilters({ brands }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <div className="relative">
        <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        <select
          className="appearance-none pl-9 pr-8 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:ring-orange-500"
          defaultValue={searchParams.get('brand') || ''}
          onChange={(e) => updateParam('brand', e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <select
        className="appearance-none px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:ring-orange-500"
        defaultValue={searchParams.get('category') || ''}
        onChange={(e) => updateParam('category', e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="knives">Knives</option>
        <option value="multi-tools">Multi-Tools</option>
      </select>

      <select
        className="appearance-none px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:ring-orange-500"
        defaultValue={searchParams.get('sort') || ''}
        onChange={(e) => updateParam('sort', e.target.value)}
      >
        <option value="">Sort: A-Z</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="listings">Most Listings</option>
      </select>
    </div>
  );
}
