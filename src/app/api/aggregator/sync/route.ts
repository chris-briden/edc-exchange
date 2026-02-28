import { NextResponse } from 'next/server';

// Master sync endpoint — calls eBay sync + retailer scrape
// Protected by AGGREGATOR_SYNC_KEY
// Designed to be called by Vercel Cron

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const syncKey = process.env.AGGREGATOR_SYNC_KEY;
  const cronSecret = request.headers.get('x-vercel-cron-secret');

  // Allow Vercel Cron (with CRON_SECRET) or API key auth
  if (syncKey && authHeader !== `Bearer ${syncKey}` && !cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const baseUrl = new URL(request.url).origin;
  const results: Record<string, unknown> = {};
  const errors: string[] = [];

  // 1. Run eBay sync
  try {
    const ebayRes = await fetch(`${baseUrl}/api/aggregator/ebay/sync`, {
      method: 'POST',
      headers: syncKey ? { Authorization: `Bearer ${syncKey}` } : {},
    });
    results.ebay = await ebayRes.json();
  } catch (err) {
    errors.push(`eBay sync: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 2. Run retailer scrape
  try {
    const scrapeRes = await fetch(`${baseUrl}/api/aggregator/scrape`, {
      method: 'POST',
      headers: syncKey ? { Authorization: `Bearer ${syncKey}` } : {},
    });
    results.scrapers = await scrapeRes.json();
  } catch (err) {
    errors.push(`Scrape sync: ${err instanceof Error ? err.message : String(err)}`);
  }

  return NextResponse.json({
    success: true,
    synced_at: new Date().toISOString(),
    results,
    errors: errors.length > 0 ? errors : undefined,
  });
}
