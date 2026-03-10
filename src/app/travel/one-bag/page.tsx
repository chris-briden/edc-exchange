import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';
import { TRAVEL_IMAGES } from '@/lib/images';
import { getArticlesByCategory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'One-Bag Travel — Packing Lists, Bag Picks & Minimalist Travel',
  description:
    'The art of traveling with a single bag. Packing lists, bag recommendations, and minimalist travel philosophy.',
  alternates: { canonical: 'https://jointhecarry.com/travel/one-bag' },
};

const features = [
  'Curated packing lists for one-bag travel by destination and season',
  'Best travel backpacks for one-bag setups: 25L to 45L',
  'Minimalist wardrobe and merino wool clothing guides',
  'Lessons learned from experienced one-bag travelers',
  'Weight tracking spreadsheets and packing templates',
  'One-bag travel philosophy and lifestyle guides',
];

const relatedSubcategories = [
  { title: 'Carry-On Luggage', href: '/travel/carry-on' },
  { title: 'Packing Systems', href: '/travel/packing' },
  { title: 'Tech Travel Kits', href: '/travel/tech-kits' },
  { title: 'Airline Guides', href: '/travel/airline-guides' },
  { title: 'Travel Accessories', href: '/travel/accessories' },
];

function getArticles() {
  return getArticlesByCategory('travel', 'one-bag').map((a) => ({
    title: a.frontmatter.title,
    description: a.frontmatter.description,
    href: `/blog/travel/${a.slug}`,
    type: a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function OneBagPage() {
  const articles = getArticles();
  return (
    <SubcategoryLanding
      title="One-Bag Travel"
      pillarTitle="Travel Carry"
      pillarHref="/travel"
      description="The art of traveling with a single bag. Packing lists, bag picks, and minimalist travel philosophy for the carry-on purist."
      iconName="plane"
      heroImage={TRAVEL_IMAGES.heroes.onebag}
      accentColor="sky"
      features={features}
      relatedSubcategories={relatedSubcategories}
      articles={articles}
    />
  );
}
