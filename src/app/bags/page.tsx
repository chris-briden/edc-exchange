import type { Metadata } from 'next';
import PillarLanding from '@/components/PillarLanding';

export const metadata: Metadata = {
  title: 'Bags & Packs — Backpack Reviews, Guides & Price Comparison',
  description:
    'Expert reviews, buyer\'s guides, and price comparison for backpacks, sling bags, messengers, duffels, and carry systems.',
  alternates: { canonical: 'https://jointhecarry.com/bags' },
};

const subcategories = [
  {
    title: 'Backpacks',
    desc: 'Urban EDC packs, tech backpacks, heritage rucksacks, and ultralight daypacks reviewed.',
    href: '/bags/backpacks',
  },
  {
    title: 'Sling Bags',
    desc: 'Crossbody slings, chest packs, and hip bags. The fastest-growing carry category.',
    href: '/bags/slings',
  },
  {
    title: 'Messenger & Briefcases',
    desc: 'Laptop messengers, leather briefcases, and professional bags for the office commute.',
    href: '/bags/messengers',
  },
  {
    title: 'Duffels',
    desc: 'Gym duffels, weekenders, and expedition bags. From GORUCK to Patagonia.',
    href: '/bags/duffels',
  },
  {
    title: 'Pouches & Organizers',
    desc: 'Tech pouches, dopp kits, admin panels, and modular organizers that keep your carry tidy.',
    href: '/bags/pouches',
  },
  {
    title: 'Tote Bags',
    desc: 'Canvas totes, market bags, and carryalls. Versatile haulers for every occasion.',
    href: '/bags/totes',
  },
];

const featuredContent = [
  {
    title: 'Best EDC Backpacks for 2026',
    excerpt: 'Our top picks across budgets for the best everyday carry backpacks — from commuter to weekend warrior.',
    href: '/blog',
    tag: 'Review',
    date: 'Coming Soon',
  },
  {
    title: 'Sling Bag Buyer\'s Guide',
    excerpt: 'How to choose the right sling for your carry style, body type, and use case.',
    href: '/blog',
    tag: 'Guide',
    date: 'Coming Soon',
  },
  {
    title: 'Peak Design vs. Aer vs. Bellroy',
    excerpt: 'Three of the biggest names in urban carry bags go head to head. Which brand fits you?',
    href: '/blog',
    tag: 'Comparison',
    date: 'Coming Soon',
  },
];

export default function BagsPage() {
  return (
    <PillarLanding
      title="Bags & Packs"
      subtitle="Carry Systems"
      description="Backpacks, slings, messengers, duffels, and organizers. How you haul your world — reviewed, compared, and priced."
      iconName="backpack"
      accentColor="amber"
      subcategories={subcategories}
      featuredContent={featuredContent}
    />
  );
}
