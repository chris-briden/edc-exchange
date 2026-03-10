import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';
import { RUCK_IMAGES } from '@/lib/images';
import { getArticlesByCategory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Ruck Events & Challenges — GORUCK, Star Course & Community Events',
  description:
    'GORUCK events, Star Course, ruck marches, and community challenges. Find your next rucking challenge.',
  alternates: { canonical: 'https://jointhecarry.com/ruck/events' },
};

const features = [
  'GORUCK event guides: Tough, Heavy, Light, Star Course prep',
  'Community ruck challenge calendar and registration links',
  'After-action reports and event recaps from the community',
  'Virtual ruck challenges you can do from anywhere',
  'Charity ruck events and fundraising rucks',
  'Event packing lists and gear recommendations',
];

const relatedSubcategories = [
  { title: 'Rucksacks & Packs', href: '/ruck/rucksacks' },
  { title: 'Weighted Vests & Plates', href: '/ruck/vests' },
  { title: 'Training Plans', href: '/ruck/training' },
  { title: 'Ruck Club Directory', href: '/ruck/clubs' },
  { title: 'Footwear', href: '/ruck/footwear' },
];

function getArticles() {
  return getArticlesByCategory('ruck', 'events').map((a) => ({
    title: a.frontmatter.title,
    description: a.frontmatter.description,
    href: `/blog/ruck/${a.slug}`,
    type: a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function EventsPage() {
  const articles = getArticles();
  return (
    <SubcategoryLanding
      title="Events & Challenges"
      pillarTitle="Ruck & Fitness"
      pillarHref="/ruck"
      description="GORUCK events, Star Course, ruck marches, and community challenges to keep you moving. Find your next mission."
      iconName="dumbbell"
      heroImage={RUCK_IMAGES.heroes.events}
      accentColor="green"
      features={features}
      relatedSubcategories={relatedSubcategories}
      articles={articles}
    />
  );
}
