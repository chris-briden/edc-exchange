import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * POST /api/affiliate-click
 * Logs an affiliate link click to Supabase for analytics.
 * No auth required — fires from anonymous blog visitors.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { href, retailer, articleSlug, articlePillar } = body;

    if (!href) {
      return NextResponse.json({ error: 'href is required' }, { status: 400 });
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => [],
          setAll: () => {},
        },
      }
    );

    const { error } = await supabase.from('affiliate_clicks').insert({
      href,
      retailer: retailer || null,
      article_slug: articleSlug || null,
      article_pillar: articlePillar || null,
      referrer: req.headers.get('referer') || null,
      user_agent: req.headers.get('user-agent') || null,
    });

    if (error) {
      console.error('[Affiliate Click] Supabase error:', error.message);
      return NextResponse.json({ error: 'Failed to log click' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Affiliate Click] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
