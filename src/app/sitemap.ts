import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jointhecarry.com';

  // Blog posts with their publish dates
  const blogPosts = [
    { slug: 'best-places-to-buy-sell-trade-edc-gear', date: '2026-02-15' },
    { slug: 'what-is-edc-everyday-carry-beginners-guide', date: '2026-02-14' },
    { slug: 'how-to-price-used-edc-gear', date: '2026-02-13' },
    { slug: 'why-founding-sellers-win-on-new-marketplaces', date: '2026-02-12' },
    { slug: 'edc-pocket-dump-ideas-2026', date: '2026-02-11' },
  ];

  const blogEntries = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogEntries,
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}
