// Fuzzy product matcher — maps messy listing titles to canonical products
// Uses Fuse.js for fuzzy text matching

import Fuse from 'fuse.js';
import type { Product } from '@/lib/types';

// Known brand aliases → canonical brand name
const BRAND_ALIASES: Record<string, string> = {
  'crk': 'Chris Reeve Knives',
  'chris reeve': 'Chris Reeve Knives',
  'bm': 'Benchmade',
  'spydie': 'Spyderco',
  'zt': 'Zero Tolerance',
  'mt': 'Microtech',
  'rick hinderer': 'Hinderer',
  'hinderer knives': 'Hinderer',
  'victorinox': 'Victorinox',
  'sak': 'Victorinox',
  'leatherman': 'Leatherman',
};

/**
 * Extract likely brand from a listing title.
 */
export function extractBrand(title: string): string | null {
  const lower = title.toLowerCase();
  for (const [alias, brand] of Object.entries(BRAND_ALIASES)) {
    if (lower.includes(alias)) {
      return brand;
    }
  }
  return null;
}

/**
 * Clean a listing title for better matching.
 * Removes common noise like "LNIB", "BNIB", seller notes, etc.
 */
function cleanTitle(title: string): string {
  return title
    .replace(/\b(LNIB|BNIB|NIB|NIT|BNIT|A\+?|B\+?|C\+?|D)\b/gi, '')
    .replace(/\b(free shipping|fast ship|ships free|priority)\b/gi, '')
    .replace(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>?\/~`]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Match a listing title against a catalog of products.
 * Returns the best matching product or null if no good match.
 */
export function matchProduct(
  title: string,
  products: Product[],
  threshold: number = 0.4
): Product | null {
  const cleanedTitle = cleanTitle(title);
  const detectedBrand = extractBrand(title);

  // If we detected a brand, filter to products of that brand first
  const candidates = detectedBrand
    ? products.filter(p => p.brand.toLowerCase() === detectedBrand.toLowerCase())
    : products;

  if (candidates.length === 0) {
    // Fall back to all products if brand filter yielded nothing
    return matchAgainstList(cleanedTitle, products, threshold);
  }

  return matchAgainstList(cleanedTitle, candidates, threshold);
}

function matchAgainstList(
  cleanedTitle: string,
  products: Product[],
  threshold: number
): Product | null {
  const fuse = new Fuse(products, {
    keys: [
      { name: 'name', weight: 0.6 },
      { name: 'brand', weight: 0.2 },
      { name: 'tags', weight: 0.2 },
    ],
    threshold,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 3,
  });

  const results = fuse.search(cleanedTitle);

  if (results.length > 0 && results[0].score !== undefined && results[0].score <= threshold) {
    return results[0].item;
  }

  return null;
}

/**
 * Batch match multiple listing titles against the product catalog.
 */
export function batchMatch(
  titles: string[],
  products: Product[],
  threshold?: number
): Map<string, Product | null> {
  const results = new Map<string, Product | null>();
  for (const title of titles) {
    results.set(title, matchProduct(title, products, threshold));
  }
  return results;
}
