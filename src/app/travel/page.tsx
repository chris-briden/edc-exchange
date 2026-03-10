import type { Metadata } from 'next';
import PillarLanding from '@/components/PillarLanding';
import { PILLAR_HEROES, TRAVEL_IMAGES } from '@/lib/images';
import { getArticlesByPillar } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Travel Carry — Luggage Reviews, Packing Guides & Price Comparison',
  description:
    'Expert reviews and guides for carry-on luggage, packing systems, tech travel kits, and airline carry-on rules. Travel lighter, travel smarter.',
  alternates: { canonical: 'https://jointhecarry.com/travel' },
};

const subcategories = [
  {
    title: 'Carry-On Luggage',
    desc: 'Hardside spinners, soft-side rollers, and travel backpacks that fit every airline\'s overhead bin.',
    href: '/travel/carry-on',
    image: TRAVEL_IMAGES.cards.carryon,
  },
  {
    title: 'Packing Systems',
    desc: 'Packing cubes, compression bags, garment folders, and the art of one-bag travel.',
    href: '/travel/packing',
    image: TRAVEL_IMAGES.cards.packing,
  },
  {
    title: 'Tech Travel Kits',
    desc: 'Cable organizers, portable chargers, adapters, and everything to keep your devices alive on the road.',
    href: '/travel/tech-kits',
    image: TRAVEL_IMAGES.cards.techkits,
  },
  {
    title: 'Airline Guides',
    desc: 'Carry-on size limits, personal item rules, and weight restrictions for every major airline.',
    href: '/travel/airline-guides',
    image: TRAVEL_IMAGES.cards.airlines,
  },
  {
    title: 'Travel Accessories',
    desc: 'Neck pillows, eye masks, TSA locks, luggage tags, and the small stuff that makes travel better.',
    href: '/travel/accessories',
    image: TRAVEL_IMAGES.cards.accessories,
  },
  {
    title: 'One-Bag Travel',
    desc: 'The art of traveling with a single bag. Packing lists, bag picks, and minimalist travel philosophy.',
    href: '/travel/one-bag',
    image: TRAVEL_IMAGES.cards.onebag,
  },
];

const typeLabels: Record<string, string> = {
  review: 'Review', guide: 'Guide', comparison: 'Comparison', news: 'News', opinion: 'Opinion',
};

function getFeaturedContent() {
  const articles = getArticlesByPillar('travel');
  return articles.map((a) => ({
    title: a.frontmatter.title,
    excerpt: a.frontmatter.description,
    href: `/blog/travel/${a.slug}`,
    tag: typeLabels[a.frontmatter.type] || a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function TravelPage() {
  return (
    <PillarLanding
      title="Travel Carry"
      subtitle="On The Move"
      description="Carry-on luggage, packing systems, tech kits, and airline guides. Everything you need to travel lighter and smarter."
      iconName="plane"
      accentColor="sky"
      heroImage={PILLAR_HEROES.travel}
      subcategories={subcategories}
      featuredContent={getFeaturedContent()}
    />
  );
}
