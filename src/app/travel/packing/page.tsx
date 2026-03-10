import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';
import { TRAVEL_IMAGES } from '@/lib/images';
import { getArticlesByCategory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Packing Systems — Packing Cubes, Compression Bags & Guides',
  description:
    'Expert reviews and guides for packing cubes, compression bags, garment folders, and the art of one-bag travel packing.',
  alternates: { canonical: 'https://jointhecarry.com/travel/packing' },
};

const features = [
  'Reviews of packing cubes, compression bags, and garment folders',
  'Packing efficiency comparisons: cube vs. compression vs. roll',
  'System-by-system breakdowns: Peak Design, Eagle Creek, Away',
  'Price tracking across packing accessory brands',
  'Capsule wardrobe and packing list templates',
  'Tips for maximizing space in any carry-on',
];

const relatedSubcategories = [
  { title: 'Carry-On Luggage', href: '/travel/carry-on' },
  { title: 'Tech Travel Kits', href: '/travel/tech-kits' },
  { title: 'Airline Guides', href: '/travel/airline-guides' },
  { title: 'Travel Accessories', href: '/travel/accessories' },
  { title: 'One-Bag Travel', href: '/travel/one-bag' },
];

function getArticles() {
  return getArticlesByCategory('travel', 'packing').map((a) => ({
    title: a.frontmatter.title,
    description: a.frontmatter.description,
    href: `/blog/travel/${a.slug}`,
    type: a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function PackingPage() {
  const articles = getArticles();
  return (
    <SubcategoryLanding
      title="Packing Systems"
      pillarTitle="Travel Carry"
      pillarHref="/travel"
      description="Packing cubes, compression bags, garment folders, and the art of one-bag travel. Pack smarter, travel lighter."
      iconName="plane"
      heroImage={TRAVEL_IMAGES.heroes.packing}
      accentColor="sky"
      features={features}
      relatedSubcategories={relatedSubcategories}
      articles={articles}
    />
  );
}
