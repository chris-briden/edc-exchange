import { createClient } from '@/lib/supabase-server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/aggregator/ProductCard';
import ProductFilters from '@/components/aggregator/ProductFilters';
import { Search } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Price Check — Compare Knife & Multi-Tool Prices',
  description:
    'Compare prices on knives, blades, and multi-tools from eBay, BladeHQ, KnifeCenter, and more. Find the best deals on EDC gear.',
};

interface Props {
  searchParams: Promise<{ q?: string; brand?: string; category?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  // Build query
  let query = supabase
    .from('products')
    .select('*, external_listings(id, price, in_stock)')
    .order('name');

  // Text search
  if (params.q) {
    query = query.or(
      `name.ilike.%${params.q}%,brand.ilike.%${params.q}%,tags.cs.{${params.q.toLowerCase()}}`
    );
  }

  // Brand filter
  if (params.brand) {
    query = query.eq('brand', params.brand);
  }

  // Category filter
  if (params.category) {
    query = query.eq('category', params.category);
  }

  const { data: products } = await query;

  // Compute min/max prices and listing counts
  const enriched = (products || []).map(product => {
    const listings = product.external_listings || [];
    const inStockListings = listings.filter((l: { in_stock: boolean; price: number }) => l.in_stock);
    const prices = inStockListings.map((l: { price: number }) => l.price).filter((p: number) => p > 0);

    return {
      ...product,
      listing_count: listings.length,
      min_price: prices.length > 0 ? Math.min(...prices) : null,
      max_price: prices.length > 0 ? Math.max(...prices) : null,
    };
  });

  // Sort
  const sorted = [...enriched];
  if (params.sort === 'price_asc') {
    sorted.sort((a, b) => (a.min_price || Infinity) - (b.min_price || Infinity));
  } else if (params.sort === 'price_desc') {
    sorted.sort((a, b) => (b.min_price || 0) - (a.min_price || 0));
  } else if (params.sort === 'listings') {
    sorted.sort((a, b) => b.listing_count - a.listing_count);
  }

  // Get unique brands for filter
  const brands = Array.from(new Set((products || []).map(p => p.brand))).sort();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Price Check
          </h1>
          <p className="mt-2 text-zinc-400 text-sm sm:text-base">
            Compare prices on knives and multi-tools across eBay, BladeHQ, KnifeCenter, and more.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <form className="flex-1 relative" action="/products" method="GET">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              name="q"
              defaultValue={params.q || ''}
              placeholder="Search knives, brands, models..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            />
            {/* Preserve filters */}
            {params.brand && <input type="hidden" name="brand" value={params.brand} />}
            {params.category && <input type="hidden" name="category" value={params.category} />}
            {params.sort && <input type="hidden" name="sort" value={params.sort} />}
          </form>

          <ProductFilters brands={brands} />
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-zinc-500">
          {sorted.length} product{sorted.length !== 1 ? 's' : ''} found
          {params.q && <span> for &ldquo;{params.q}&rdquo;</span>}
        </div>

        {/* Product Grid */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {sorted.map(product => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                brand={product.brand}
                imageUrl={product.image_url}
                category={product.category}
                msrp={product.msrp}
                listingCount={product.listing_count}
                minPrice={product.min_price}
                maxPrice={product.max_price}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl font-medium text-zinc-400">No products found</p>
            <p className="text-sm text-zinc-600 mt-2">
              Try a different search or clear your filters
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
