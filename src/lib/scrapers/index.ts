// Scraper registry — all retailer scrapers in one place
export { bladehqScraper } from './bladehq';
export { knifecenterScraper } from './knifecenter';
export { dltTradingScraper } from './dlt-trading';
export { knivesShipFreeScraper } from './knivesshipfree';

import type { RetailerScraper } from './base';
import { bladehqScraper } from './bladehq';
import { knifecenterScraper } from './knifecenter';
import { dltTradingScraper } from './dlt-trading';
import { knivesShipFreeScraper } from './knivesshipfree';

export const allScrapers: RetailerScraper[] = [
  bladehqScraper,
  knifecenterScraper,
  dltTradingScraper,
  knivesShipFreeScraper,
];

export function getScraperBySlug(slug: string): RetailerScraper | undefined {
  return allScrapers.find(s => s.retailerSlug === slug);
}
