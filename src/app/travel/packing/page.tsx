import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Packing Systems — Packing Cubes, Compression Bags & Guides',
  description:
    'Expert reviews and guides for packing cubes, compression bags, garment folders, and the art of one-bag travel packing.',
  alternates: { canonical: 'https://jointhecarry.com/travel/packing' },
};

const features = [
  'Reviews of packing cubes, compression bags, and garment folders',
  'Packing efficiency comparisons: cube vs. compression vs. roll',
  'System-by-system breakdowns: Peak Design, Eagle Creek, Away',
  'Price tracking across packing accessory brands',
  'Capsule wardrobe and packing list templates',
  'Tips for maximizing space in any carry-on',
];

const relatedSubcategories = [
  { title: 'Carry-On Luggage', href: '/travel/carry-on' },
  { title: 'Tech Travel Kits', href: '/travel/tech-kits' },
  { title: 'Airline Guides', href: '/travel/airline-guides' },
  { title: 'Travel Accessories', href: '/travel/accessories' },
  { title: 'One-Bag Travel', href: '/travel/one-bag' },
];

export default function PackingPage() {
  return (
    <SubcategoryLanding
      title="Packing Systems"
      pillarTitle="Travel Carry"
      pillarHref="/travel"
      description="Packing cubes, compression bags, garment folders, and the art of one-bag travel. Pack smarter, travel lighter."
      iconName="plane"
      accentColor="sky"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
