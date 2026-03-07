import type { Metadata } from 'next';
import PillarLanding from '@/components/PillarLanding';

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
  },
  {
    title: 'Weighted Vests & Plates',
    desc: 'Ruck plates, weight vests, sandbags, and loading systems for training and events.',
    href: '/ruck/vests',
  },
  {
    title: 'Training Plans',
    desc: 'Beginner to advanced rucking programs. Couch to ruck, GORUCK event prep, and military standards.',
    href: '/ruck/training',
  },
  {
    title: 'Ruck Club Directory',
    desc: 'Find a ruck club near you. Local groups, events, and community rucks across North America.',
    href: '/ruck/clubs',
  },
  {
    title: 'Footwear',
    desc: 'Boots, trail runners, and rucking-specific shoes. What works on pavement and trail.',
    href: '/ruck/footwear',
  },
  {
    title: 'Events & Challenges',
    desc: 'GORUCK events, Star Course, ruck marches, and community challenges to keep you moving.',
    href: '/ruck/events',
  },
];

const featuredContent = [
  {
    title: 'Rucking 101: The Beginner\'s Guide',
    excerpt: 'Everything you need to start rucking. What it is, why it\'s the best exercise you\'re not doing, and how to begin.',
    href: '/blog',
    tag: 'Guide',
    date: 'Coming Soon',
  },
  {
    title: 'GORUCK Rucker vs. GR1: Which to Buy?',
    excerpt: 'Two of the most popular rucking packs compared. Purpose-built fitness ruck vs. all-around legend.',
    href: '/blog',
    tag: 'Comparison',
    date: 'Coming Soon',
  },
  {
    title: '12-Week Ruck Training Plan',
    excerpt: 'A progressive training program to build your ruck fitness from zero to a 12-mile heavy ruck.',
    href: '/blog',
    tag: 'Training',
    date: 'Coming Soon',
  },
];

export default function RuckPage() {
  return (
    <PillarLanding
      title="Ruck & Fitness"
      subtitle="Loaded Carry"
      description="Rucksacks, weighted vests, training plans, and the ruck club directory. The carry culture meets fitness community."
      iconName="dumbbell"
      accentColor="green"
      heroImage="/hero-ruck.jpg"
      subcategories={subcategories}
      featuredContent={featuredContent}
    />
  );
}
