import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Knives & Blades — EDC Knife Reviews, Guides & Price Comparison',
  description:
    'Expert reviews and price comparison for folding knives, fixed blades, OTF automatics, and slip joints. From budget blades to grail knives.',
  alternates: { canonical: 'https://jointhecarry.com/edc/knives' },
};

const features = [
  'In-depth reviews of folding knives, fixed blades, and OTF automatics',
  'Price comparison across BladeHQ, KnifeCenter, DLT Trading, and more',
  'Steel comparison charts and blade geometry guides',
  'Secondary market price tracking for popular models',
  'Buyer\'s guides by budget, use case, and blade style',
  'New release coverage and limited edition alerts',
];

const relatedSubcategories = [
  { title: 'Flashlights', href: '/edc/flashlights' },
  { title: 'Multi-Tools', href: '/edc/multi-tools' },
  { title: 'Pens & Writing', href: '/edc/pens' },
  { title: 'Wallets & Organizers', href: '/edc/wallets' },
  { title: 'Watches & Accessories', href: '/edc/accessories' },
];

export default function KnivesPage() {
  return (
    <SubcategoryLanding
      title="Knives & Blades"
      pillarTitle="Everyday Carry"
      pillarHref="/edc"
      description="Folding knives, fixed blades, OTF automatics, and slip joints. From budget beaters to grail knives — reviewed, compared, and priced."
      iconName="pocket"
      accentColor="orange"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
