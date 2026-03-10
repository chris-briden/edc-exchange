import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';
import { BAGS_IMAGES } from '@/lib/images';
import { getArticlesByCategory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Sling Bags — Crossbody & Chest Pack Reviews & Price Comparison',
  description:
    'Expert reviews and price comparison for crossbody slings, chest packs, and hip bags. The fastest-growing carry category.',
  alternates: { canonical: 'https://jointhecarry.com/bags/slings' },
};

const features = [
  'Reviews of crossbody slings, chest packs, and hip bags',
  'Capacity comparisons: 2L to 10L sling bags tested',
  'Strap comfort and weight distribution ratings',
  'Price tracking across major sling bag brands',
  'Best slings by body type, carry style, and use case',
  'Quick-access and anti-theft feature comparisons',
];

const relatedSubcategories = [
  { title: 'Backpacks', href: '/bags/backpacks' },
  { title: 'Messenger & Briefcases', href: '/bags/messengers' },
  { title: 'Duffels', href: '/bags/duffels' },
  { title: 'Pouches & Organizers', href: '/bags/pouches' },
  { title: 'Tote Bags', href: '/bags/totes' },
];

function getArticles() {
  return getArticlesByCategory('bags', 'slings').map((a) => ({
    title: a.frontmatter.title,
    description: a.frontmatter.description,
    href: `/blog/bags/${a.slug}`,
    type: a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function SlingsPage() {
  const articles = getArticles();
  return (
    <SubcategoryLanding
      title="Sling Bags"
      pillarTitle="Bags & Packs"
      pillarHref="/bags"
      description="Crossbody slings, chest packs, and hip bags. The fastest-growing carry category — reviewed, compared, and priced."
      iconName="backpack"
      heroImage={BAGS_IMAGES.heroes.slings}
      accentColor="amber"
      features={features}
      relatedSubcategories={relatedSubcategories}
      articles={articles}
    />
  );
}
