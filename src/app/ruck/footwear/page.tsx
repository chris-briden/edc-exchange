import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';
import { RUCK_IMAGES } from '@/lib/images';
import { getArticlesByCategory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Rucking Footwear — Boots, Trail Runners & Shoe Reviews',
  description:
    'Expert reviews for rucking boots, trail runners, and rucking-specific shoes. What works on pavement and trail.',
  alternates: { canonical: 'https://jointhecarry.com/ruck/footwear' },
};

const features = [
  'Reviews of rucking boots, trail runners, and hybrid shoes',
  'Sole durability and traction comparisons by terrain',
  'Ankle support and cushioning ratings for loaded carry',
  'Price tracking across footwear brands',
  'Break-in guides and blister prevention tips',
  'Best footwear by surface: pavement, trail, mixed terrain',
];

const relatedSubcategories = [
  { title: 'Rucksacks & Packs', href: '/ruck/rucksacks' },
  { title: 'Weighted Vests & Plates', href: '/ruck/vests' },
  { title: 'Training Plans', href: '/ruck/training' },
  { title: 'Ruck Club Directory', href: '/ruck/clubs' },
  { title: 'Events & Challenges', href: '/ruck/events' },
];

function getArticles() {
  return getArticlesByCategory('ruck', 'footwear').map((a) => ({
    title: a.frontmatter.title,
    description: a.frontmatter.description,
    href: `/blog/ruck/${a.slug}`,
    type: a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function FootwearPage() {
  const articles = getArticles();
  return (
    <SubcategoryLanding
      title="Footwear"
      pillarTitle="Ruck & Fitness"
      pillarHref="/ruck"
      description="Boots, trail runners, and rucking-specific shoes. What works on pavement, trail, and everything in between."
      iconName="dumbbell"
      heroImage={RUCK_IMAGES.heroes.footwear}
      accentColor="green"
      features={features}
      relatedSubcategories={relatedSubcategories}
      articles={articles}
    />
  );
}
