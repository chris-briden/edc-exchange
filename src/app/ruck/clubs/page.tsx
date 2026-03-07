import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Ruck Club Directory — Find Local Ruck Groups Near You',
  description:
    'Find a ruck club near you. Local groups, events, and community rucks across North America.',
  alternates: { canonical: 'https://jointhecarry.com/ruck/clubs' },
};

const features = [
  'Searchable directory of ruck clubs across North America',
  'Club profiles with meeting times, routes, and contact info',
  'Tips for starting your own ruck club',
  'Community ruck event calendar',
  'Club size, pace, and experience level indicators',
  'Featured club spotlights and member stories',
];

const relatedSubcategories = [
  { title: 'Rucksacks & Packs', href: '/ruck/rucksacks' },
  { title: 'Weighted Vests & Plates', href: '/ruck/vests' },
  { title: 'Training Plans', href: '/ruck/training' },
  { title: 'Footwear', href: '/ruck/footwear' },
  { title: 'Events & Challenges', href: '/ruck/events' },
];

export default function ClubsPage() {
  return (
    <SubcategoryLanding
      title="Ruck Club Directory"
      pillarTitle="Ruck & Fitness"
      pillarHref="/ruck"
      description="Find a ruck club near you. Local groups, events, and community rucks across North America. Get out and ruck with others."
      iconName="dumbbell"
      accentColor="green"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
