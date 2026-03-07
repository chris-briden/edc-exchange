import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'EDC Flashlights — Reviews, Guides & Price Comparison',
  description:
    'Expert reviews and price comparison for EDC flashlights, keychain lights, headlamps, and tactical torches. Lumens compared.',
  alternates: { canonical: 'https://jointhecarry.com/edc/flashlights' },
};

const features = [
  'Reviews of EDC pocket lights, keychain torches, and headlamps',
  'Lumen, candela, and runtime comparisons across models',
  'Battery type guides: 18650, 21700, AAA, and built-in rechargeable',
  'Price tracking across major flashlight retailers',
  'Beam pattern comparisons and tint guides',
  'Budget picks and premium recommendations by use case',
];

const relatedSubcategories = [
  { title: 'Knives & Blades', href: '/edc/knives' },
  { title: 'Multi-Tools', href: '/edc/multi-tools' },
  { title: 'Pens & Writing', href: '/edc/pens' },
  { title: 'Wallets & Organizers', href: '/edc/wallets' },
  { title: 'Watches & Accessories', href: '/edc/accessories' },
];

export default function FlashlightsPage() {
  return (
    <SubcategoryLanding
      title="Flashlights"
      pillarTitle="Everyday Carry"
      pillarHref="/edc"
      description="EDC lights, keychain torches, headlamps, and tactical lights. Lumens, runtimes, and beam patterns compared across every budget."
      iconName="pocket"
      accentColor="orange"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
