import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Travel Accessories — Neck Pillows, TSA Locks, Luggage Tags & More',
  description:
    'Expert reviews for neck pillows, eye masks, TSA locks, luggage tags, and the small stuff that makes travel better.',
  alternates: { canonical: 'https://jointhecarry.com/travel/accessories' },
};

const features = [
  'Reviews of neck pillows, eye masks, and sleep accessories',
  'TSA lock and luggage tag comparisons',
  'Travel wallet and document organizer roundups',
  'Price tracking for popular travel accessories',
  'Comfort and noise-canceling earbud recommendations',
  'Best accessories for long-haul flights and road trips',
];

const relatedSubcategories = [
  { title: 'Carry-On Luggage', href: '/travel/carry-on' },
  { title: 'Packing Systems', href: '/travel/packing' },
  { title: 'Tech Travel Kits', href: '/travel/tech-kits' },
  { title: 'Airline Guides', href: '/travel/airline-guides' },
  { title: 'One-Bag Travel', href: '/travel/one-bag' },
];

export default function TravelAccessoriesPage() {
  return (
    <SubcategoryLanding
      title="Travel Accessories"
      pillarTitle="Travel Carry"
      pillarHref="/travel"
      description="Neck pillows, eye masks, TSA locks, luggage tags, and the small stuff that makes travel better. Comfort on the go."
      iconName="plane"
      heroImage="/hero-travel-accessories.jpg"
      accentColor="sky"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
