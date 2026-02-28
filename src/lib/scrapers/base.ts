// Base scraper interface for knife retailers

export interface ScrapedListing {
  title: string;
  price: number;
  currency: string;
  condition: string;
  in_stock: boolean;
  url: string;
  image_url: string | null;
  shipping_cost: number | null;
  shipping_estimate: string | null;
  external_id: string | null;
}

export interface RetailerScraper {
  retailerSlug: string;
  /**
   * Search the retailer's site for products matching the query.
   * Returns normalized listing data.
   */
  search(query: string): Promise<ScrapedListing[]>;
}

/**
 * Rate-limited fetch — waits between requests to be respectful.
 */
const lastFetchTime: Record<string, number> = {};
const MIN_DELAY_MS = 1500; // 1.5 seconds between requests per domain

export async function rateLimitedFetch(url: string, options?: RequestInit): Promise<Response> {
  const domain = new URL(url).hostname;
  const now = Date.now();
  const lastTime = lastFetchTime[domain] || 0;
  const elapsed = now - lastTime;

  if (elapsed < MIN_DELAY_MS) {
    await new Promise(resolve => setTimeout(resolve, MIN_DELAY_MS - elapsed));
  }

  lastFetchTime[domain] = Date.now();

  return fetch(url, {
    ...options,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; TheCarryExchange/1.0; +https://jointhecarry.com)',
      ...options?.headers,
    },
  });
}
