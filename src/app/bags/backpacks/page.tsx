import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';
import { BAGS_IMAGES } from '@/lib/images';
import { getArticlesByCategory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Backpacks — EDC Backpack Reviews, Guides & Price Comparison',
  description:
    'Expert reviews and price comparison for urban EDC backpacks, tech packs, heritage rucksacks, and ultralight daypacks.',
  alternates: { canonical: 'https://jointhecarry.com/bags/backpacks' },
};

const features = [
  'In-depth reviews of urban EDC and tech backpacks',
  'Heritage rucksack and ultralight daypack comparisons',
  'Organization layout breakdowns and capacity guides',
  'Price tracking across Peak Design, Aer, Bellroy, and more',
  'Laptop compartment sizing and protection ratings',
  'Best backpacks by use case: commute, travel, school, outdoor',
];

const relatedSubcategories = [
  { title: 'Sling Bags', href: '/bags/slings' },
  { title: 'Messenger & Briefcases', href: '/bags/messengers' },
  { title: 'Duffels', href: '/bags/duffels' },
  { title: 'Pouches & Organizers', href: '/bags/pouches' },
  { title: 'Tote Bags', href: '/bags/totes' },
];

function getArticles() {
  return getArticlesByCategory('bags', 'backpacks').map((a) => ({
    title: a.frontmatter.title,
    description: a.frontmatter.description,
    href: `/blog/bags/${a.slug}`,
    type: a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function BackpacksPage() {
  const articles = getArticles();
  return (
    <SubcategoryLanding
      title="Backpacks"
      pillarTitle="Bags & Packs"
      pillarHref="/bags"
      description="Urban EDC packs, tech backpacks, heritage rucksacks, and ultralight daypacks. Every style reviewed, compared, and priced."
      iconName="backpack"
      heroImage={BAGS_IMAGES.heroes.backpacks}
      accentColor="amber"
      features={features}
      relatedSubcategories={relatedSubcategories}
      articles={articles}
    />
  );
}
