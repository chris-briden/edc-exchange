// DLT Trading scraper — known for exclusive sprint runs
import * as cheerio from 'cheerio';
import type { RetailerScraper, ScrapedListing } from './base';
import { rateLimitedFetch } from './base';

export const dltTradingScraper: RetailerScraper = {
  retailerSlug: 'dlt-trading',

  async search(query: string): Promise<ScrapedListing[]> {
    const listings: ScrapedListing[] = [];

    try {
      const searchUrl = `https://www.dlttrading.com/catalogsearch/result/?q=${encodeURIComponent(query)}`;
      const response = await rateLimitedFetch(searchUrl);

      if (!response.ok) {
        console.error(`DLT Trading search failed: ${response.status}`);
        return [];
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // DLT Trading product listings (Magento-based)
      $('.product-item, .item.product, .product-info').each((_i, el) => {
        try {
          const $el = $(el);
          const title = $el.find('.product-item-link, .product-name a').first().text().trim();
          const priceText = $el.find('.price, [data-price-amount]').first().text().trim()
            || $el.find('[data-price-amount]').first().attr('data-price-amount')
            || '';
          const href = $el.find('.product-item-link, .product-name a').first().attr('href');
          const imgSrc = $el.find('.product-image-photo').first().attr('src')
            || $el.find('img').first().attr('src');
          const inStock = !$el.find('.stock.unavailable, .out-of-stock').length;

          if (!title || !priceText) return;

          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          if (isNaN(price) || price <= 0) return;

          const url = href?.startsWith('http')
            ? href
            : `https://www.dlttrading.com${href}`;

          listings.push({
            title,
            price,
            currency: 'USD',
            condition: 'New',
            in_stock: inStock,
            url,
            image_url: imgSrc || null,
            shipping_cost: 0, // DLT: free shipping over $75
            shipping_estimate: '3-5 business days',
            external_id: null,
          });
        } catch (err) {
          console.error('Error parsing DLT Trading product:', err);
        }
      });
    } catch (err) {
      console.error('DLT Trading scraper error:', err);
    }

    return listings;
  },
};
