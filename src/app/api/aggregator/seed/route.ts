import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SEED_RETAILERS, SEED_PRODUCTS } from '@/lib/aggregator/seed';

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

    // Seed retailers
    const { data: retailers, error: retailerError } = await supabase
      .from('retailers')
      .upsert(SEED_RETAILERS, { onConflict: 'slug', ignoreDuplicates: true })
      .select();

    if (retailerError) {
      return NextResponse.json({ error: 'Failed to seed retailers', details: retailerError }, { status: 500 });
    }

    // Seed products
    const { data: products, error: productError } = await supabase
      .from('products')
      .upsert(SEED_PRODUCTS, { onConflict: 'slug', ignoreDuplicates: true })
      .select();

    if (productError) {
      return NextResponse.json({ error: 'Failed to seed products', details: productError }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      retailers_seeded: retailers?.length || 0,
      products_seeded: products?.length || 0,
    });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json(
      { error: 'Seed failed', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
