import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'EDC Watches & Accessories — Field Watches, G-Shocks & More',
  description:
    'Expert reviews for EDC watches, straps, coins, beads, and pocket accessories. Field watches, G-Shocks, and carry accessories.',
  alternates: { canonical: 'https://jointhecarry.com/edc/accessories' },
};

const features = [
  'Field watch and G-Shock reviews for everyday carry',
  'Watch strap guides: NATO, rubber, leather, titanium',
  'Challenge coin and bead collections showcased',
  'Pocket accessories: hanks, prybars, carabiners',
  'Carry tray and valet tray roundups',
  'Budget to grail watch recommendations for EDC enthusiasts',
];

const relatedSubcategories = [
  { title: 'Knives & Blades', href: '/edc/knives' },
  { title: 'Flashlights', href: '/edc/flashlights' },
  { title: 'Multi-Tools', href: '/edc/multi-tools' },
  { title: 'Pens & Writing', href: '/edc/pens' },
  { title: 'Wallets & Organizers', href: '/edc/wallets' },
];

export default function AccessoriesPage() {
  return (
    <SubcategoryLanding
      title="Watches & Accessories"
      pillarTitle="Everyday Carry"
      pillarHref="/edc"
      description="Field watches, G-Shocks, watch straps, coins, beads, and pocket accessories. The finishing touches on your everyday carry."
      iconName="pocket"
      accentColor="orange"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
