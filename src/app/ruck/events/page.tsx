import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Ruck Events & Challenges — GORUCK, Star Course & Community Events',
  description:
    'GORUCK events, Star Course, ruck marches, and community challenges. Find your next rucking challenge.',
  alternates: { canonical: 'https://jointhecarry.com/ruck/events' },
};

const features = [
  'GORUCK event guides: Tough, Heavy, Light, Star Course prep',
  'Community ruck challenge calendar and registration links',
  'After-action reports and event recaps from the community',
  'Virtual ruck challenges you can do from anywhere',
  'Charity ruck events and fundraising rucks',
  'Event packing lists and gear recommendations',
];

const relatedSubcategories = [
  { title: 'Rucksacks & Packs', href: '/ruck/rucksacks' },
  { title: 'Weighted Vests & Plates', href: '/ruck/vests' },
  { title: 'Training Plans', href: '/ruck/training' },
  { title: 'Ruck Club Directory', href: '/ruck/clubs' },
  { title: 'Footwear', href: '/ruck/footwear' },
];

export default function EventsPage() {
  return (
    <SubcategoryLanding
      title="Events & Challenges"
      pillarTitle="Ruck & Fitness"
      pillarHref="/ruck"
      description="GORUCK events, Star Course, ruck marches, and community challenges to keep you moving. Find your next mission."
      iconName="dumbbell"
      accentColor="green"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
