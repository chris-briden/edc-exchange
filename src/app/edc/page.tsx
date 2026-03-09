import type { Metadata } from 'next';
import PillarLanding from '@/components/PillarLanding';
import { PILLAR_HEROES, EDC_IMAGES } from '@/lib/images';
import { getArticlesByPillar } from '@/lib/content';

export const metadata: Metadata = {
  title: 'EDC — Everyday Carry Reviews, Guides & Price Comparison',
  description:
    'Expert reviews, buyer\'s guides, and price comparison for everyday carry gear. Knives, flashlights, multi-tools, pens, wallets, and more.',
  alternates: { canonical: 'https://jointhecarry.com/edc' },
};

const subcategories = [
  {
    title: 'Knives & Blades',
    desc: 'Folding knives, fixed blades, OTF automatics, and slip joints. From budget to grail.',
    href: '/edc/knives',
    itemCount: 32,
    image: EDC_IMAGES.cards.knives,
  },
  {
    title: 'Flashlights',
    desc: 'EDC lights, keychain torches, headlamps, and tactical lights. Lumens compared.',
    href: '/edc/flashlights',
    itemCount: 8,
    image: EDC_IMAGES.cards.flashlights,
  },
  {
    title: 'Multi-Tools',
    desc: 'Leatherman, Victorinox, and boutique multi-tools. The Swiss Army knife and beyond.',
    href: '/edc/multi-tools',
    itemCount: 6,
    image: EDC_IMAGES.cards.multitools,
  },
  {
    title: 'Pens & Writing',
    desc: 'Bolt-action pens, tactical pens, fountain pens, and refills for everyday writers.',
    href: '/edc/pens',
    image: EDC_IMAGES.cards.pens,
  },
  {
    title: 'Wallets & Organizers',
    desc: 'Minimalist wallets, ridge wallets, card holders, key organizers, and pocket trays.',
    href: '/edc/wallets',
    image: EDC_IMAGES.cards.wallets,
  },
  {
    title: 'Watches & Accessories',
    desc: 'Field watches, G-Shocks, watch straps, coins, beads, and pocket accessories.',
    href: '/edc/accessories',
    image: EDC_IMAGES.cards.accessories,
  },
];

const typeLabels: Record<string, string> = {
  review: 'Review', guide: 'Guide', comparison: 'Comparison', news: 'News', opinion: 'Opinion',
};

const placeholderContent = [
  {
    title: 'EDC Pocket Dump Ideas for 2026',
    excerpt: 'Fresh loadout inspiration across budgets and styles. Minimalist, tactical, urban, and outdoor carries.',
    href: '/blog',
    tag: 'Inspiration',
    date: 'Coming Soon',
  },
  {
    title: 'How to Price Used EDC Gear',
    excerpt: 'A practical guide to pricing your knives, flashlights, and multi-tools for resale on the secondary market.',
    href: '/blog',
    tag: 'Selling',
    date: 'Coming Soon',
  },
];

function getFeaturedContent() {
  const articles = getArticlesByPillar('edc');
  const real = articles.slice(0, 3).map((a) => ({
    title: a.frontmatter.title,
    excerpt: a.frontmatter.description,
    href: `/blog/edc/${a.slug}`,
    tag: typeLabels[a.frontmatter.type] || a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  }));
  // Fill remaining slots with placeholders up to 3 total
  const needed = 3 - real.length;
  return [...real, ...placeholderContent.slice(0, needed)];
}

export default function EDCPage() {
  return (
    <PillarLanding
      title="Everyday Carry"
      subtitle="EDC — Pocket Gear"
      description="The gear in your pockets, on your belt, and around your neck. Expert reviews and the best prices on knives, flashlights, multi-tools, pens, and wallets."
      iconName="pocket"
      accentColor="orange"
      heroImage={PILLAR_HEROES.edc}
      subcategories={subcategories}
      featuredContent={getFeaturedContent()}
    />
  );
}
