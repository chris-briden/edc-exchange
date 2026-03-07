import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Messenger Bags & Briefcases — Reviews & Price Comparison',
  description:
    'Expert reviews and price comparison for laptop messengers, leather briefcases, and professional carry bags.',
  alternates: { canonical: 'https://jointhecarry.com/bags/messengers' },
};

const features = [
  'Reviews of laptop messengers and professional briefcases',
  'Leather vs. nylon vs. waxed canvas material comparisons',
  'Laptop protection and organization layout breakdowns',
  'Price tracking across professional bag brands',
  'Best bags for office commute, business travel, and creative work',
  'Strap and handle ergonomics ratings',
];

const relatedSubcategories = [
  { title: 'Backpacks', href: '/bags/backpacks' },
  { title: 'Sling Bags', href: '/bags/slings' },
  { title: 'Duffels', href: '/bags/duffels' },
  { title: 'Pouches & Organizers', href: '/bags/pouches' },
  { title: 'Tote Bags', href: '/bags/totes' },
];

export default function MessengersPage() {
  return (
    <SubcategoryLanding
      title="Messenger & Briefcases"
      pillarTitle="Bags & Packs"
      pillarHref="/bags"
      description="Laptop messengers, leather briefcases, and professional bags for the office commute. Style meets function."
      iconName="backpack"
      accentColor="amber"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
