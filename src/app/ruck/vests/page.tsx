import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Weighted Vests & Ruck Plates — Reviews & Price Comparison',
  description:
    'Expert reviews for ruck plates, weight vests, sandbags, and loading systems for training and events.',
  alternates: { canonical: 'https://jointhecarry.com/ruck/vests' },
};

const features = [
  'Reviews of GORUCK plates, Rogue vests, and budget alternatives',
  'Weight plate material and comfort comparisons',
  'Sandbag and filler plate options for custom loading',
  'Price tracking across weighted vest and plate brands',
  'Sizing and fit guides for different body types',
  'Training progression guides: what weight to start with',
];

const relatedSubcategories = [
  { title: 'Rucksacks & Packs', href: '/ruck/rucksacks' },
  { title: 'Training Plans', href: '/ruck/training' },
  { title: 'Ruck Club Directory', href: '/ruck/clubs' },
  { title: 'Footwear', href: '/ruck/footwear' },
  { title: 'Events & Challenges', href: '/ruck/events' },
];

export default function VestsPage() {
  return (
    <SubcategoryLanding
      title="Weighted Vests & Plates"
      pillarTitle="Ruck & Fitness"
      pillarHref="/ruck"
      description="Ruck plates, weight vests, sandbags, and loading systems for training and events. Load up and get moving."
      iconName="dumbbell"
      heroImage="/hero-ruck-vests.jpg"
      accentColor="green"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
