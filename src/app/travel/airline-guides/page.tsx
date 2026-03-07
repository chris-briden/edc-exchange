import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Airline Carry-On Guides — Size Limits, Personal Item Rules & More',
  description:
    'Carry-on size limits, personal item rules, and weight restrictions for every major airline. Your complete airline carry-on reference.',
  alternates: { canonical: 'https://jointhecarry.com/travel/airline-guides' },
};

const features = [
  'Carry-on dimensions and weight limits for 50+ airlines',
  'Personal item size rules and enforcement policies',
  'Basic economy and budget airline restrictions explained',
  'Regularly updated with latest airline policy changes',
  'International vs. domestic carry-on differences',
  'Tips for maximizing what you bring on board',
];

const relatedSubcategories = [
  { title: 'Carry-On Luggage', href: '/travel/carry-on' },
  { title: 'Packing Systems', href: '/travel/packing' },
  { title: 'Tech Travel Kits', href: '/travel/tech-kits' },
  { title: 'Travel Accessories', href: '/travel/accessories' },
  { title: 'One-Bag Travel', href: '/travel/one-bag' },
];

export default function AirlineGuidesPage() {
  return (
    <SubcategoryLanding
      title="Airline Guides"
      pillarTitle="Travel Carry"
      pillarHref="/travel"
      description="Carry-on size limits, personal item rules, and weight restrictions for every major airline. Your go-to reference before you fly."
      iconName="plane"
      heroImage="/hero-travel-airlines.jpg"
      accentColor="sky"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
