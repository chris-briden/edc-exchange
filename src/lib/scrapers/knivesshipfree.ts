// KnivesShipFree scraper — all orders ship free
import * as cheerio from 'cheerio';
import type { RetailerScraper, ScrapedListing } from './base';
import { rateLimitedFetch } from './base';

export const knivesShipFreeScraper: RetailerScraper = {
  retailerSlug: 'knivesshipfree',

  async search(query: string): Promise<ScrapedListing[]> {
    const listings: ScrapedListing[] = [];

    try {
      const searchUrl = `https://www.knivesshipfree.com/search?type=product&q=${encodeURIComponent(query)}`;
      const response = await rateLimitedFetch(searchUrl);

      if (!response.ok) {
        console.error(`KnivesShipFree search failed: ${response.status}`);
        return [];
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // KnivesShipFree product listings (Shopify-based)
      $('.product-card, .grid-product, .product-item').each((_i, el) => {
        try {
          const $el = $(el);
          const title = $el.find('.product-card__title, .product-title, h3 a, a.product-card__link').first().text().trim();
          const priceText = $el.find('.price, .product-price, .money, [data-product-price]').first().text().trim();
          const href = $el.find('a').first().attr('href');
          const imgSrc = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
          const soldOut = $el.find('.sold-out, .badge--sold-out, [data-sold-out]').length > 0;

          if (!title || !priceText) return;

          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          if (isNaN(price) || price <= 0) return;

          const url = href?.startsWith('http')
            ? href
            : `https://www.knivesshipfree.com${href}`;

          listings.push({
            title,
            price,
            currency: 'USD',
            condition: 'New',
            in_stock: !soldOut,
            url,
            image_url: imgSrc?.startsWith('//') ? `https:${imgSrc}` : imgSrc || null,
            shipping_cost: 0, // KnivesShipFree: always free shipping
            shipping_estimate: '2-5 business days',
            external_id: null,
          });
        } catch (err) {
          console.error('Error parsing KnivesShipFree product:', err);
        }
      });
    } catch (err) {
      console.error('KnivesShipFree scraper error:', err);
    }

    return listings;
  },
};
