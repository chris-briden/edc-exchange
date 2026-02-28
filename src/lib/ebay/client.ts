// eBay Browse API client — OAuth2 Client Credentials flow
// Free tier: 5,000 calls/day

import type { EbayTokenResponse, EbaySearchResponse, EbayItemSummary } from './types';

const EBAY_AUTH_URL = 'https://api.ebay.com/identity/v1/oauth2/token';
const EBAY_BROWSE_URL = 'https://api.ebay.com/buy/browse/v1';
const EBAY_KNIVES_CATEGORY = '42577';

let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get an eBay OAuth2 application token (Client Credentials grant).
 */
async function getAppToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const appId = process.env.EBAY_APP_ID;
  const certId = process.env.EBAY_CERT_ID;

  if (!appId || !certId) {
    throw new Error('Missing EBAY_APP_ID or EBAY_CERT_ID environment variables');
  }

  const credentials = Buffer.from(`${appId}:${certId}`).toString('base64');

  const response = await fetch(EBAY_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`eBay auth failed (${response.status}): ${text}`);
  }

  const data: EbayTokenResponse = await response.json();

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.token;
}

/**
 * Search eBay Browse API for items matching a query.
 */
export async function searchEbay(
  query: string,
  options: {
    categoryId?: string;
    limit?: number;
    offset?: number;
    filter?: string;
    sort?: string;
  } = {}
): Promise<EbaySearchResponse> {
  const token = await getAppToken();

  const params = new URLSearchParams({
    q: query,
    category_ids: options.categoryId || EBAY_KNIVES_CATEGORY,
    limit: String(options.limit || 50),
    offset: String(options.offset || 0),
  });

  if (options.filter) {
    params.set('filter', options.filter);
  }

  if (options.sort) {
    params.set('sort', options.sort);
  }

  const response = await fetch(
    `${EBAY_BROWSE_URL}/item_summary/search?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`eBay search failed (${response.status}): ${text}`);
  }

  return response.json();
}

/**
 * Parse an eBay item summary into a normalized format for our external_listings table.
 */
export function parseEbayListing(item: EbayItemSummary) {
  const shippingOption = item.shippingOptions?.[0];
  const shippingCost = shippingOption?.shippingCost
    ? parseFloat(shippingOption.shippingCost.value)
    : shippingOption?.shippingCostType === 'FIXED'
      ? 0
      : null;

  // Estimate shipping days from delivery dates
  let shippingEstimate: string | null = null;
  if (shippingOption?.minEstimatedDeliveryDate && shippingOption?.maxEstimatedDeliveryDate) {
    const minDays = Math.ceil(
      (new Date(shippingOption.minEstimatedDeliveryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    const maxDays = Math.ceil(
      (new Date(shippingOption.maxEstimatedDeliveryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (minDays > 0 && maxDays > 0) {
      shippingEstimate = minDays === maxDays ? `${minDays} days` : `${minDays}-${maxDays} days`;
    }
  }

  const isAuction = item.buyingOptions?.includes('AUCTION') && !item.buyingOptions?.includes('FIXED_PRICE');

  return {
    external_id: item.itemId,
    title: item.title,
    price: isAuction && item.currentBidPrice
      ? parseFloat(item.currentBidPrice.value)
      : parseFloat(item.price.value),
    currency: item.price.currency,
    condition: item.condition || null,
    in_stock: true,
    url: item.itemWebUrl,
    image_url: item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl || null,
    shipping_cost: shippingCost,
    shipping_estimate: shippingEstimate,
    location_country: item.itemLocation?.country || null,
    location_region: item.itemLocation?.stateOrProvince || null,
    seller_name: item.seller?.username || null,
    seller_rating: item.seller?.feedbackScore || null,
    listing_type: isAuction ? 'auction' as const : 'buy_now' as const,
    auction_end_time: item.itemEndDate || null,
    raw_data: item as unknown as Record<string, unknown>,
  };
}
