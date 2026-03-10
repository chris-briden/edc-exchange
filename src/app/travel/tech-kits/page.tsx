import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';
import { TRAVEL_IMAGES } from '@/lib/images';
import { getArticlesByCategory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Tech Travel Kits — Cable Organizers, Chargers & Adapter Reviews',
  description:
    'Expert reviews for cable organizers, portable chargers, adapters, and everything to keep your devices alive on the road.',
  alternates: { canonical: 'https://jointhecarry.com/travel/tech-kits' },
};

const features = [
  'Reviews of cable organizers, tech pouches, and charging kits',
  'Portable charger and power bank capacity comparisons',
  'Universal adapter and converter guides by region',
  'Price tracking for travel tech accessories',
  'Airline-safe battery and electronics guides',
  'Complete tech travel kit recommendations by trip type',
];

const relatedSubcategories = [
  { title: 'Carry-On Luggage', href: '/travel/carry-on' },
  { title: 'Packing Systems', href: '/travel/packing' },
  { title: 'Airline Guides', href: '/travel/airline-guides' },
  { title: 'Travel Accessories', href: '/travel/accessories' },
  { title: 'One-Bag Travel', href: '/travel/one-bag' },
];

function getArticles() {
  return getArticlesByCategory('travel', 'tech-kits').map((a) => ({
    title: a.frontmatter.title,
    description: a.frontmatter.description,
    href: `/blog/travel/${a.slug}`,
    type: a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function TechKitsPage() {
  const articles = getArticles();
  return (
    <SubcategoryLanding
      title="Tech Travel Kits"
      pillarTitle="Travel Carry"
      pillarHref="/travel"
      description="Cable organizers, portable chargers, adapters, and everything to keep your devices alive on the road."
      iconName="plane"
      heroImage={TRAVEL_IMAGES.heroes.techkits}
      accentColor="sky"
      features={features}
      relatedSubcategories={relatedSubcategories}
      articles={articles}
    />
  );
}
