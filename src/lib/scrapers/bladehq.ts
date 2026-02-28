// BladeHQ scraper — largest online knife retailer
import * as cheerio from 'cheerio';
import type { RetailerScraper, ScrapedListing } from './base';
import { rateLimitedFetch } from './base';

export const bladehqScraper: RetailerScraper = {
  retailerSlug: 'bladehq',

  async search(query: string): Promise<ScrapedListing[]> {
    const listings: ScrapedListing[] = [];

    try {
      const searchUrl = `https://www.bladehq.com/cat--All--1?search=${encodeURIComponent(query)}`;
      const response = await rateLimitedFetch(searchUrl);

      if (!response.ok) {
        console.error(`BladeHQ search failed: ${response.status}`);
        return [];
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // BladeHQ uses a product grid with .product-item or similar classes
      $('[data-product-id], .product-cell, .product').each((_i, el) => {
        try {
          const $el = $(el);
          const title = $el.find('.product-name a, .product-title a, h3 a').first().text().trim();
          const priceText = $el.find('.product-price, .price, .sale-price').first().text().trim();
          const href = $el.find('.product-name a, .product-title a, h3 a').first().attr('href');
          const imgSrc = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
          const inStock = !$el.find('.out-of-stock, .sold-out').length;

          if (!title || !priceText) return;

          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          if (isNaN(price) || price <= 0) return;

          const url = href?.startsWith('http')
            ? href
            : `https://www.bladehq.com${href}`;

          const productId = $el.attr('data-product-id') || null;

          listings.push({
            title,
            price,
            currency: 'USD',
            condition: 'New',
            in_stock: inStock,
            url,
            image_url: imgSrc || null,
            shipping_cost: 0, // BladeHQ: free shipping over $99
            shipping_estimate: '3-7 business days',
            external_id: productId,
          });
        } catch (err) {
          console.error('Error parsing BladeHQ product:', err);
        }
      });
    } catch (err) {
      console.error('BladeHQ scraper error:', err);
    }

    return listings;
  },
};
