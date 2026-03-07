import type { Metadata } from 'next';
import PillarLanding from '@/components/PillarLanding';

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
  },
  {
    title: 'Flashlights',
    desc: 'EDC lights, keychain torches, headlamps, and tactical lights. Lumens compared.',
    href: '/edc/flashlights',
    itemCount: 8,
  },
  {
    title: 'Multi-Tools',
    desc: 'Leatherman, Victorinox, and boutique multi-tools. The Swiss Army knife and beyond.',
    href: '/edc/multi-tools',
    itemCount: 6,
  },
  {
    title: 'Pens & Writing',
    desc: 'Bolt-action pens, tactical pens, fountain pens, and refills for everyday writers.',
    href: '/edc/pens',
  },
  {
    title: 'Wallets & Organizers',
    desc: 'Minimalist wallets, ridge wallets, card holders, key organizers, and pocket trays.',
    href: '/edc/wallets',
  },
  {
    title: 'Watches & Accessories',
    desc: 'Field watches, G-Shocks, watch straps, coins, beads, and pocket accessories.',
    href: '/edc/accessories',
  },
];

const featuredContent = [
  {
    title: 'What Is EDC? The Beginner\'s Guide',
    excerpt: 'Everything you need to know about everyday carry — what it is, why it matters, and how to build your first pocket dump.',
    href: '/blog/what-is-edc-everyday-carry-beginners-guide',
    tag: 'Guide',
    date: 'Jan 2026',
  },
  {
    title: 'EDC Pocket Dump Ideas for 2026',
    excerpt: 'Fresh loadout inspiration across budgets and styles. Minimalist, tactical, urban, and outdoor carries.',
    href: '/blog/edc-pocket-dump-ideas-2026',
    tag: 'Inspiration',
    date: 'Jan 2026',
  },
  {
    title: 'How to Price Used EDC Gear',
    excerpt: 'A practical guide to pricing your knives, flashlights, and multi-tools for resale on the secondary market.',
    href: '/blog/how-to-price-used-edc-gear',
    tag: 'Selling',
    date: 'Jan 2026',
  },
];

export default function EDCPage() {
  return (
    <PillarLanding
      title="Everyday Carry"
      subtitle="EDC — Pocket Gear"
      description="The gear in your pockets, on your belt, and around your neck. Expert reviews and the best prices on knives, flashlights, multi-tools, pens, and wallets."
      iconName="pocket"
      accentColor="orange"
      heroImage="/hero-edc.jpg"
      subcategories={subcategories}
      featuredContent={featuredContent}
    />
  );
}
