import type { Metadata } from 'next';
import PillarLanding from '@/components/PillarLanding';
import { PILLAR_HEROES, RUCK_IMAGES } from '@/lib/images';
import { getArticlesByPillar } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Ruck & Fitness — Rucking Gear Reviews, Training Plans & Community',
  description:
    'Expert reviews and guides for rucksacks, weighted vests, ruck plates, training plans, and ruck club directory. The rucking community hub.',
  alternates: { canonical: 'https://jointhecarry.com/ruck' },
};

const subcategories = [
  {
    title: 'Rucksacks & Packs',
    desc: 'GORUCK, Mystery Ranch, 5.11, and more. Purpose-built rucking packs reviewed and compared.',
    href: '/ruck/rucksacks',
    image: RUCK_IMAGES.cards.rucksacks,
  },
  {
    title: 'Weighted Vests & Plates',
    desc: 'Ruck plates, weight vests, sandbags, and loading systems for training and events.',
    href: '/ruck/vests',
    image: RUCK_IMAGES.cards.vests,
  },
  {
    title: 'Training Plans',
    desc: 'Beginner to advanced rucking programs. Couch to ruck, GORUCK event prep, and military standards.',
    href: '/ruck/training',
    image: RUCK_IMAGES.cards.training,
  },
  {
    title: 'Ruck Club Directory',
    desc: 'Find a ruck club near you. Local groups, events, and community rucks across North America.',
    href: '/ruck/clubs',
    image: RUCK_IMAGES.cards.clubs,
  },
  {
    title: 'Footwear',
    desc: 'Boots, trail runners, and rucking-specific shoes. What works on pavement and trail.',
    href: '/ruck/footwear',
    image: RUCK_IMAGES.cards.footwear,
  },
  {
    title: 'Events & Challenges',
    desc: 'GORUCK events, Star Course, ruck marches, and community challenges to keep you moving.',
    href: '/ruck/events',
    image: RUCK_IMAGES.cards.events,
  },
];

const typeLabels: Record<string, string> = {
  review: 'Review', guide: 'Guide', comparison: 'Comparison', news: 'News', opinion: 'Opinion',
};

function getFeaturedContent() {
  const articles = getArticlesByPillar('ruck');
  return articles.map((a) => ({
    title: a.frontmatter.title,
    excerpt: a.frontmatter.description,
    href: `/blog/ruck/${a.slug}`,
    tag: typeLabels[a.frontmatter.type] || a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function RuckPage() {
  return (
    <PillarLanding
      title="Ruck & Fitness"
      subtitle="Loaded Carry"
      description="Rucksacks, weighted vests, training plans, and the ruck club directory. The carry culture meets fitness community."
      iconName="dumbbell"
      accentColor="green"
      heroImage={PILLAR_HEROES.ruck}
      subcategories={subcategories}
      featuredContent={getFeaturedContent()}
    />
  );
}
