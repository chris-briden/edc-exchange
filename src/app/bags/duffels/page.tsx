import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Duffel Bags — Gym, Weekender & Expedition Bag Reviews & Prices',
  description:
    'Expert reviews and price comparison for gym duffels, weekenders, and expedition bags. From GORUCK to Patagonia.',
  alternates: { canonical: 'https://jointhecarry.com/bags/duffels' },
};

const features = [
  'Reviews of gym duffels, weekenders, and expedition bags',
  'Capacity and packing efficiency comparisons',
  'Material durability tests: Cordura, X-Pac, ripstop nylon',
  'Price tracking across outdoor and urban bag brands',
  'Carry-on compliance sizing guides',
  'Best duffels by use: gym, weekend trips, overlanding, travel',
];

const relatedSubcategories = [
  { title: 'Backpacks', href: '/bags/backpacks' },
  { title: 'Sling Bags', href: '/bags/slings' },
  { title: 'Messenger & Briefcases', href: '/bags/messengers' },
  { title: 'Pouches & Organizers', href: '/bags/pouches' },
  { title: 'Tote Bags', href: '/bags/totes' },
];

export default function DuffelsPage() {
  return (
    <SubcategoryLanding
      title="Duffels"
      pillarTitle="Bags & Packs"
      pillarHref="/bags"
      description="Gym duffels, weekenders, and expedition bags. From GORUCK to Patagonia — hauling capacity reviewed and compared."
      iconName="backpack"
      heroImage="/hero-bags-duffels.jpg"
      accentColor="amber"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
