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
 * a subtle external-link icon. Clicks are logged to Supabase
 * via /api/affiliate-click for analytics.
 */
export default function AffiliateLink({
  href,
  retailer,
  children,
  className = '',
}: AffiliateLinkProps) {
  const trackedHref = addUtmParams(href, retailer);

  const handleClick = () => {
    // Extract article context from the current URL path
    // e.g. /blog/edc/best-edc-knives-under-100 → pillar=edc, slug=best-edc-knives-under-100
    let articleSlug: string | undefined;
    let articlePillar: string | undefined;

    if (typeof window !== 'undefined') {
      const segments = window.location.pathname.split('/').filter(Boolean);
      // Expected pattern: /blog/{pillar}/{slug}
      if (segments[0] === 'blog' && segments.length >= 3) {
        articlePillar = segments[1];
        articleSlug = segments[2];
      }
    }

    // Fire-and-forget POST to tracking endpoint
    fetch('/api/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        href: trackedHref,
        retailer,
        articleSlug,
        articlePillar,
      }),
    }).catch(() => {
      // Silently fail — don't block the user from navigating
    });
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
