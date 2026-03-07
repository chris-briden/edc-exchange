import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Pouches & Organizers — Tech Pouch, Dopp Kit & Admin Panel Reviews',
  description:
    'Expert reviews and price comparison for tech pouches, dopp kits, admin panels, and modular organizers.',
  alternates: { canonical: 'https://jointhecarry.com/bags/pouches' },
};

const features = [
  'Reviews of tech pouches, dopp kits, and admin panels',
  'Modular organizer systems compared: Evergoods, Bellroy, Peak Design',
  'Cable and charger organizer roundups',
  'Price tracking across pouch and organizer brands',
  'Best organizers by bag size and carry style',
  'Packing cube and compression sack comparisons',
];

const relatedSubcategories = [
  { title: 'Backpacks', href: '/bags/backpacks' },
  { title: 'Sling Bags', href: '/bags/slings' },
  { title: 'Messenger & Briefcases', href: '/bags/messengers' },
  { title: 'Duffels', href: '/bags/duffels' },
  { title: 'Tote Bags', href: '/bags/totes' },
];

export default function PouchesPage() {
  return (
    <SubcategoryLanding
      title="Pouches & Organizers"
      pillarTitle="Bags & Packs"
      pillarHref="/bags"
      description="Tech pouches, dopp kits, admin panels, and modular organizers that keep your carry tidy. Small bags, big impact."
      iconName="backpack"
      heroImage="/hero-bags-pouches.jpg"
      accentColor="amber"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
