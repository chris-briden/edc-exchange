import type { Metadata } from 'next';
import PillarLanding from '@/components/PillarLanding';
import { PILLAR_HEROES, TRAVEL_IMAGES } from '@/lib/images';

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

const featuredContent = [
  {
    title: 'Carry-On Size Guide: Every Airline Compared',
    excerpt: 'A regularly updated reference for carry-on dimensions and weight limits across 50+ airlines worldwide.',
    href: '/blog',
    tag: 'Reference',
    date: 'Coming Soon',
  },
  {
    title: 'One-Bag Travel: The Complete Guide',
    excerpt: 'How to travel the world with just one bag. Packing strategies, bag recommendations, and lessons learned.',
    href: '/blog',
    tag: 'Guide',
    date: 'Coming Soon',
  },
  {
    title: 'Best Travel Backpacks for 2026',
    excerpt: 'Our top picks for carry-on compliant travel backpacks that work as daily drivers too.',
    href: '/blog',
    tag: 'Review',
    date: 'Coming Soon',
  },
];

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
      featuredContent={featuredContent}
    />
  );
}
