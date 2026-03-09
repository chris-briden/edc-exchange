'use client';

import { ExternalLink } from 'lucide-react';

interface AffiliateLinkProps {
  href: string;
  retailer?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps outbound affiliate links with UTM tracking params and
 * a subtle external-link icon. Clicking logs to console for now;
 * will be wired to Supabase `affiliate_clicks` table later.
 */
export default function AffiliateLink({
  href,
  retailer,
  children,
  className = '',
}: AffiliateLinkProps) {
  const trackedHref = addUtmParams(href, retailer);

  const handleClick = () => {
    // TODO: POST to /api/affiliate-click with { href, retailer, timestamp }
    if (typeof window !== 'undefined') {
      console.log('[Affiliate Click]', { href: trackedHref, retailer });
    }
  };

  return (
    <a
      href={trackedHref}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 underline underline-offset-2 decoration-orange-400/40 hover:decoration-orange-300/60 transition-colors ${className}`}
    >
      {children}
      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
    </a>
  );
}

function addUtmParams(url: string, retailer?: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'thecarrycollective');
    u.searchParams.set('utm_medium', 'affiliate');
    if (retailer) u.searchParams.set('utm_campaign', retailer.toLowerCase().replace(/\s+/g, '-'));
    return u.toString();
  } catch {
    return url;
  }
}
