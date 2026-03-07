import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Tote Bags — Canvas Totes, Market Bags & Carryall Reviews',
  description:
    'Expert reviews and price comparison for canvas totes, market bags, and carryalls. Versatile haulers for every occasion.',
  alternates: { canonical: 'https://jointhecarry.com/bags/totes' },
};

const features = [
  'Reviews of canvas totes, waxed cotton market bags, and nylon carryalls',
  'Capacity and load-bearing comparisons',
  'Handle and strap comfort ratings for heavy loads',
  'Price tracking across tote bag brands',
  'Best totes by use: grocery, beach, work, everyday',
  'Sustainability and material sourcing guides',
];

const relatedSubcategories = [
  { title: 'Backpacks', href: '/bags/backpacks' },
  { title: 'Sling Bags', href: '/bags/slings' },
  { title: 'Messenger & Briefcases', href: '/bags/messengers' },
  { title: 'Duffels', href: '/bags/duffels' },
  { title: 'Pouches & Organizers', href: '/bags/pouches' },
];

export default function TotesPage() {
  return (
    <SubcategoryLanding
      title="Tote Bags"
      pillarTitle="Bags & Packs"
      pillarHref="/bags"
      description="Canvas totes, market bags, and carryalls. Versatile haulers for every occasion — reviewed, compared, and priced."
      iconName="backpack"
      accentColor="amber"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
