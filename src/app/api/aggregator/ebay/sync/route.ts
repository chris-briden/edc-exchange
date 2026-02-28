import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { searchEbay, parseEbayListing } from '@/lib/ebay/client';
import { matchProduct } from '@/lib/aggregator/matcher';
import type { Product } from '@/lib/types';

// Use service role key for write operations
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    // Verify auth — either sync key or service
    const authHeader = request.headers.get('authorization');
    const syncKey = process.env.AGGREGATOR_SYNC_KEY;

    if (syncKey && authHeader !== `Bearer ${syncKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServiceClient();

    // Get the eBay retailer ID
    const { data: ebayRetailer } = await supabase
      .from('retailers')
      .select('id')
      .eq('slug', 'ebay')
      .single();

    if (!ebayRetailer) {
      return NextResponse.json({ error: 'eBay retailer not found. Run seed first.' }, { status: 400 });
    }

    // Get all products to sync
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError || !products?.length) {
      return NextResponse.json({ error: 'No products to sync', details: productsError }, { status: 400 });
    }

    let totalListings = 0;
    let totalMatched = 0;
    const errors: string[] = [];

    // Sync each product (with rate limiting — eBay allows 5K/day)
    for (const product of products as Product[]) {
      try {
        const searchQuery = `${product.brand} ${product.name.replace(product.brand, '').trim()}`;
        const response = await searchEbay(searchQuery, { limit: 25 });

        if (!response.itemSummaries?.length) continue;

        for (const item of response.itemSummaries) {
          const parsed = parseEbayListing(item);

          // Try to match to this product (or another in catalog)
          const matched = matchProduct(item.title, products as Product[]);
          const productId = matched?.id || product.id;

          // Upsert listing
          const { error: upsertError } = await supabase
            .from('external_listings')
            .upsert(
              {
                ...parsed,
                product_id: productId,
                retailer_id: ebayRetailer.id,
                last_seen_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'retailer_id,external_id', ignoreDuplicates: false }
            );

          if (upsertError) {
            // If upsert fails on conflict (no unique constraint yet), try insert
            await supabase.from('external_listings').insert({
              ...parsed,
              product_id: productId,
              retailer_id: ebayRetailer.id,
              last_seen_at: new Date().toISOString(),
            });
          }

          totalListings++;
          if (matched) totalMatched++;
        }

        // Record price history for this product (average from eBay)
        const prices = response.itemSummaries.map(i => parseFloat(i.price.value)).filter(p => !isNaN(p));
        if (prices.length > 0) {
          const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
          await supabase.from('price_history').insert({
            product_id: product.id,
            retailer_id: ebayRetailer.id,
            price: Math.round(avgPrice * 100) / 100,
            in_stock: true,
          });
        }

        // Small delay between product searches to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${product.name}: ${msg}`);
        console.error(`eBay sync error for ${product.name}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      products_synced: products.length,
      total_listings: totalListings,
      total_matched: totalMatched,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('eBay sync error:', err);
    return NextResponse.json(
      { error: 'eBay sync failed', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
