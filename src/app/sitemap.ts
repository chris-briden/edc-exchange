import type { MetadataRoute } from 'next';
import { getArticlesByPillar, type Pillar } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jointhecarry.com';
  const now = new Date();

  // ── Static pages ──────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // ── Pillar landing pages ──────────────────────────────────────
  const pillars: { slug: Pillar; subcategories: string[] }[] = [
    { slug: 'edc', subcategories: ['knives', 'flashlights', 'multi-tools', 'pens', 'wallets', 'accessories'] },
    { slug: 'bags', subcategories: ['backpacks', 'slings', 'messengers', 'duffels', 'pouches', 'totes'] },
    { slug: 'travel', subcategories: ['carry-on', 'packing', 'tech-kits', 'airline-guides', 'accessories', 'one-bag'] },
    { slug: 'ruck', subcategories: ['rucksacks', 'training', 'vests', 'footwear', 'events', 'clubs'] },
  ];

  const pillarPages: MetadataRoute.Sitemap = pillars.map((p) => ({
    url: `${baseUrl}/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // ── Subcategory pages ─────────────────────────────────────────
  const subcategoryPages: MetadataRoute.Sitemap = pillars.flatMap((p) =>
    p.subcategories.map((sub) => ({
      url: `${baseUrl}/${p.slug}/${sub}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  );

  // ── All MDX articles (dynamically from content/) ──────────────
  const articlePages: MetadataRoute.Sitemap = pillars.flatMap((p) =>
    getArticlesByPillar(p.slug).map((a) => ({
      url: `${baseUrl}/blog/${p.slug}/${a.slug}`,
      lastModified: new Date(a.frontmatter.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  );

  return [...staticPages, ...pillarPages, ...subcategoryPages, ...articlePages];
}
