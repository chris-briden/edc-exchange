import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';
import { TRAVEL_IMAGES } from '@/lib/images';
import { getArticlesByCategory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Carry-On Luggage — Reviews, Size Guides & Price Comparison',
  description:
    'Expert reviews and price comparison for carry-on luggage. Hardside spinners, soft-side rollers, and travel backpacks that fit every airline.',
  alternates: { canonical: 'https://jointhecarry.com/travel/carry-on' },
};

const features = [
  'Reviews of hardside spinners, soft-side rollers, and hybrid carry-ons',
  'Airline-specific sizing compliance charts',
  'Wheel, handle, and zipper durability comparisons',
  'Price tracking across luggage brands and retailers',
  'Weight vs. capacity efficiency ratings',
  'Best carry-ons by airline, budget, and travel style',
];

const relatedSubcategories = [
  { title: 'Packing Systems', href: '/travel/packing' },
  { title: 'Tech Travel Kits', href: '/travel/tech-kits' },
  { title: 'Airline Guides', href: '/travel/airline-guides' },
  { title: 'Travel Accessories', href: '/travel/accessories' },
  { title: 'One-Bag Travel', href: '/travel/one-bag' },
];

function getArticles() {
  return getArticlesByCategory('travel', 'carry-on').map((a) => ({
    title: a.frontmatter.title,
    description: a.frontmatter.description,
    href: `/blog/travel/${a.slug}`,
    type: a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function CarryOnPage() {
  const articles = getArticles();
  return (
    <SubcategoryLanding
      title="Carry-On Luggage"
      pillarTitle="Travel Carry"
      pillarHref="/travel"
      description="Hardside spinners, soft-side rollers, and travel backpacks that fit every airline's overhead bin. Never check a bag again."
      iconName="plane"
      heroImage={TRAVEL_IMAGES.heroes.carryon}
      accentColor="sky"
      features={features}
      relatedSubcategories={relatedSubcategories}
      articles={articles}
    />
  );
}
