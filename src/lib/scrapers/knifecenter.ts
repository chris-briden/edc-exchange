// KnifeCenter scraper — largest online knife retailer by selection
import * as cheerio from 'cheerio';
import type { RetailerScraper, ScrapedListing } from './base';
import { rateLimitedFetch } from './base';

export const knifecenterScraper: RetailerScraper = {
  retailerSlug: 'knifecenter',

  async search(query: string): Promise<ScrapedListing[]> {
    const listings: ScrapedListing[] = [];

    try {
      const searchUrl = `https://www.knifecenter.com/listing?q=${encodeURIComponent(query)}`;
      const response = await rateLimitedFetch(searchUrl);

      if (!response.ok) {
        console.error(`KnifeCenter search failed: ${response.status}`);
        return [];
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // KnifeCenter product listings
      $('.product-list-item, .product-card, [data-product]').each((_i, el) => {
        try {
          const $el = $(el);
          const title = $el.find('.product-title a, .product-name a, h3 a, h4 a').first().text().trim();
          const priceText = $el.find('.product-price, .price, .sale-price, [data-price]').first().text().trim();
          const href = $el.find('.product-title a, .product-name a, h3 a, h4 a').first().attr('href');
          const imgSrc = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
          const stockEl = $el.find('.out-of-stock, .oos, .sold-out');
          const inStock = stockEl.length === 0;

          if (!title || !priceText) return;

          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          if (isNaN(price) || price <= 0) return;

          const url = href?.startsWith('http')
            ? href
            : `https://www.knifecenter.com${href}`;

          listings.push({
            title,
            price,
            currency: 'USD',
            condition: 'New',
            in_stock: inStock,
            url,
            image_url: imgSrc || null,
            shipping_cost: 0, // KnifeCenter: free shipping on orders over $49
            shipping_estimate: '3-7 business days',
            external_id: null,
          });
        } catch (err) {
          console.error('Error parsing KnifeCenter product:', err);
        }
      });
    } catch (err) {
      console.error('KnifeCenter scraper error:', err);
    }

    return listings;
  },
};
