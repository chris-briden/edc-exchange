import type { Metadata } from 'next';
import PillarLanding from '@/components/PillarLanding';
import { PILLAR_HEROES, BAGS_IMAGES } from '@/lib/images';
import { getArticlesByPillar } from '@/lib/content';

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
    image: BAGS_IMAGES.cards.backpacks,
  },
  {
    title: 'Sling Bags',
    desc: 'Crossbody slings, chest packs, and hip bags. The fastest-growing carry category.',
    href: '/bags/slings',
    image: BAGS_IMAGES.cards.slings,
  },
  {
    title: 'Messenger & Briefcases',
    desc: 'Laptop messengers, leather briefcases, and professional bags for the office commute.',
    href: '/bags/messengers',
    image: BAGS_IMAGES.cards.messengers,
  },
  {
    title: 'Duffels',
    desc: 'Gym duffels, weekenders, and expedition bags. From GORUCK to Patagonia.',
    href: '/bags/duffels',
    image: BAGS_IMAGES.cards.duffels,
  },
  {
    title: 'Pouches & Organizers',
    desc: 'Tech pouches, dopp kits, admin panels, and modular organizers that keep your carry tidy.',
    href: '/bags/pouches',
    image: BAGS_IMAGES.cards.pouches,
  },
  {
    title: 'Tote Bags',
    desc: 'Canvas totes, market bags, and carryalls. Versatile haulers for every occasion.',
    href: '/bags/totes',
    image: BAGS_IMAGES.cards.totes,
  },
];

const typeLabels: Record<string, string> = {
  review: 'Review', guide: 'Guide', comparison: 'Comparison', news: 'News', opinion: 'Opinion',
};

function getFeaturedContent() {
  const articles = getArticlesByPillar('bags');
  return articles.map((a) => ({
    title: a.frontmatter.title,
    excerpt: a.frontmatter.description,
    href: `/blog/bags/${a.slug}`,
    tag: typeLabels[a.frontmatter.type] || a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function BagsPage() {
  return (
    <PillarLanding
      title="Bags & Packs"
      subtitle="Carry Systems"
      description="Backpacks, slings, messengers, duffels, and organizers. How you haul your world — reviewed, compared, and priced."
      iconName="backpack"
      accentColor="amber"
      heroImage={PILLAR_HEROES.bags}
      subcategories={subcategories}
      featuredContent={getFeaturedContent()}
    />
  );
}
