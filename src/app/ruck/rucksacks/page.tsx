import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Rucksacks & Packs — GORUCK, Mystery Ranch & More Reviews',
  description:
    'Expert reviews and price comparison for rucking packs. GORUCK, Mystery Ranch, 5.11, and more purpose-built rucksacks compared.',
  alternates: { canonical: 'https://jointhecarry.com/ruck/rucksacks' },
};

const features = [
  'Reviews of purpose-built rucking packs: GORUCK, Mystery Ranch, 5.11',
  'Weight plate compatibility and loading system comparisons',
  'Frame, padding, and ventilation comfort ratings',
  'Price tracking across rucksack brands and retailers',
  'Durability testing: Cordura 1000D, 500D, and XPAC materials',
  'Best rucksacks by event type: Star Course, Heavy, Tough, training',
];

const relatedSubcategories = [
  { title: 'Weighted Vests & Plates', href: '/ruck/vests' },
  { title: 'Training Plans', href: '/ruck/training' },
  { title: 'Ruck Club Directory', href: '/ruck/clubs' },
  { title: 'Footwear', href: '/ruck/footwear' },
  { title: 'Events & Challenges', href: '/ruck/events' },
];

export default function RucksacksPage() {
  return (
    <SubcategoryLanding
      title="Rucksacks & Packs"
      pillarTitle="Ruck & Fitness"
      pillarHref="/ruck"
      description="GORUCK, Mystery Ranch, 5.11, and more. Purpose-built rucking packs reviewed, compared, and priced for every mission."
      iconName="dumbbell"
      accentColor="green"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
