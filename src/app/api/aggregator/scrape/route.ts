import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { allScrapers } from '@/lib/scrapers';
import { matchProduct } from '@/lib/aggregator/matcher';
import type { Product, Retailer } from '@/lib/types';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const syncKey = process.env.AGGREGATOR_SYNC_KEY;

    if (syncKey && authHeader !== `Bearer ${syncKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServiceClient();

    // Get all retailers (excluding eBay — that has its own sync)
    const { data: retailers } = await supabase
      .from('retailers')
      .select('*')
      .eq('is_active', true)
      .neq('slug', 'ebay');

    if (!retailers?.length) {
      return NextResponse.json({ error: 'No active retailers found' }, { status: 400 });
    }

    // Get all products
    const { data: products } = await supabase
      .from('products')
      .select('*');

    if (!products?.length) {
      return NextResponse.json({ error: 'No products to scrape' }, { status: 400 });
    }

    let totalListings = 0;
    const results: Record<string, number> = {};
    const errors: string[] = [];

    for (const retailer of retailers as Retailer[]) {
      const scraper = allScrapers.find(s => s.retailerSlug === retailer.slug);
      if (!scraper) {
        errors.push(`No scraper for ${retailer.slug}`);
        continue;
      }

      let retailerListings = 0;

      for (const product of products as Product[]) {
        try {
          // Use shorter search query for scrapers
          const searchQuery = `${product.brand} ${product.name.replace(product.brand, '').trim()}`;
          const listings = await scraper.search(searchQuery);

          for (const listing of listings) {
            // Try to match the scraped listing to a product
            const matched = matchProduct(listing.title, products as Product[]);

            await supabase.from('external_listings').insert({
              product_id: matched?.id || product.id,
              retailer_id: retailer.id,
              external_id: listing.external_id,
              title: listing.title,
              price: listing.price,
              currency: listing.currency,
              condition: listing.condition,
              in_stock: listing.in_stock,
              url: listing.url,
              image_url: listing.image_url,
              shipping_cost: listing.shipping_cost,
              shipping_estimate: listing.shipping_estimate,
              location_country: 'US',
              seller_name: retailer.name,
              listing_type: 'buy_now',
              last_seen_at: new Date().toISOString(),
            });

            retailerListings++;
            totalListings++;
          }

          // Record price history if we got listings
          if (listings.length > 0) {
            const inStockListings = listings.filter(l => l.in_stock);
            if (inStockListings.length > 0) {
              const bestPrice = Math.min(...inStockListings.map(l => l.price));
              await supabase.from('price_history').insert({
                product_id: product.id,
                retailer_id: retailer.id,
                price: bestPrice,
                in_stock: true,
              });
            }
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`${retailer.slug}/${product.name}: ${msg}`);
        }
      }

      results[retailer.slug] = retailerListings;
    }

    return NextResponse.json({
      success: true,
      total_listings: totalListings,
      by_retailer: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('Scrape sync error:', err);
    return NextResponse.json(
      { error: 'Scrape failed', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
