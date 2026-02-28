import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PriceTable from '@/components/aggregator/PriceTable';
import { ArrowLeft, Tag, Ruler, Scale, Layers, Plus } from 'lucide-react';
import type { ExternalListing } from '@/lib/types';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('name, brand')
    .eq('slug', slug)
    .single();

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} — Price Comparison`,
    description: `Compare prices on ${product.name} by ${product.brand} from eBay, BladeHQ, KnifeCenter, and more. Find the best deal.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Get product
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product) notFound();

  // Get all external listings for this product, joined with retailer info
  const { data: listings } = await supabase
    .from('external_listings')
    .select('*, retailers(*)')
    .eq('product_id', product.id)
    .order('price', { ascending: true });

  // Get native listings (items on The Carry Exchange)
  const { data: nativeItems } = await supabase
    .from('items')
    .select('*, profiles(username, avatar_url), item_images(url, position)')
    .or(`name.ilike.%${product.name.split(' ').slice(-2).join(' ')}%`)
    .eq('status', 'active')
    .in('listing_type', ['sell', 'trade'])
    .limit(6);

  // Price stats
  const allListings = (listings || []) as ExternalListing[];
  const inStockPrices = allListings
    .filter(l => l.in_stock)
    .map(l => l.price)
    .filter(p => p > 0);

  const bestPrice = inStockPrices.length > 0 ? Math.min(...inStockPrices) : null;
  const avgPrice = inStockPrices.length > 0
    ? Math.round((inStockPrices.reduce((a, b) => a + b, 0) / inStockPrices.length) * 100) / 100
    : null;

  const specs = product.specs as Record<string, string | number> || {};
  const specIcons: Record<string, typeof Ruler> = {
    blade_length: Ruler,
    steel: Layers,
    weight: Scale,
    tools: Layers,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Price Check
        </Link>

        {/* Product Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          {/* Image */}
          <div className="lg:w-80 shrink-0">
            <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="object-contain p-6 w-full h-full"
                />
              ) : (
                <span className="text-6xl opacity-50">
                  {product.category === 'multi-tools' ? '🔧' : '🔪'}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <p className="text-orange-400 font-medium text-sm mb-1">{product.brand}</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-zinc-400 text-sm mb-4 max-w-2xl">{product.description}</p>
            )}

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6">
                {Object.entries(specs).map(([key, value]) => {
                  const Icon = specIcons[key] || Tag;
                  const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg"
                    >
                      <Icon className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-xs text-zinc-400">{label}:</span>
                      <span className="text-xs font-medium text-white">{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Price Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {bestPrice && (
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                  <p className="text-xs text-green-400 font-medium mb-1">Best Price</p>
                  <p className="text-xl font-bold text-green-400">${bestPrice.toLocaleString()}</p>
                </div>
              )}
              {avgPrice && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-xs text-zinc-400 font-medium mb-1">Average Price</p>
                  <p className="text-xl font-bold text-white">${avgPrice.toLocaleString()}</p>
                </div>
              )}
              {product.msrp && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-xs text-zinc-400 font-medium mb-1">MSRP</p>
                  <p className="text-xl font-bold text-white">${product.msrp.toLocaleString()}</p>
                </div>
              )}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-400 font-medium mb-1">Listings Found</p>
                <p className="text-xl font-bold text-white">{allListings.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Comparison Table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Price Comparison</h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6">
            <PriceTable listings={allListings} />
          </div>
        </section>

        {/* Native Listings Section */}
        {nativeItems && nativeItems.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Listed on The Carry Exchange</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {nativeItems.map(item => (
                <Link
                  key={item.id}
                  href={`/items/${item.id}`}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-orange-500/40 transition"
                >
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {item.condition} · {item.listing_type}
                  </p>
                  {item.price && (
                    <p className="text-lg font-bold text-orange-400 mt-2">
                      ${item.price.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-zinc-500 mt-1">
                    by {item.profiles?.username || 'Unknown'}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center py-10 bg-zinc-900/30 border border-zinc-800 rounded-xl">
          <h3 className="text-lg font-bold mb-2">Have this item?</h3>
          <p className="text-sm text-zinc-400 mb-4">
            List it on The Carry Exchange and reach EDC enthusiasts
          </p>
          <Link
            href="/items/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            List Yours for Sale
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
