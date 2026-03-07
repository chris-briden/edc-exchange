import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Multi-Tools — Leatherman, Victorinox & More Reviews & Prices',
  description:
    'Expert reviews and price comparison for multi-tools. Leatherman, Victorinox, and boutique brands compared.',
  alternates: { canonical: 'https://jointhecarry.com/edc/multi-tools' },
};

const features = [
  'Head-to-head comparisons of Leatherman, Victorinox, and boutique brands',
  'Tool-count breakdowns and real-world usability ratings',
  'Price tracking across authorized retailers',
  'One-hand opening, locking mechanisms, and build quality deep dives',
  'Best multi-tools by use case: urban EDC, camping, tradework, travel',
  'Warranty and repair service comparisons',
];

const relatedSubcategories = [
  { title: 'Knives & Blades', href: '/edc/knives' },
  { title: 'Flashlights', href: '/edc/flashlights' },
  { title: 'Pens & Writing', href: '/edc/pens' },
  { title: 'Wallets & Organizers', href: '/edc/wallets' },
  { title: 'Watches & Accessories', href: '/edc/accessories' },
];

export default function MultiToolsPage() {
  return (
    <SubcategoryLanding
      title="Multi-Tools"
      pillarTitle="Everyday Carry"
      pillarHref="/edc"
      description="Leatherman, Victorinox, and boutique multi-tools. The Swiss Army knife and beyond — every tool compared, reviewed, and priced."
      iconName="pocket"
      accentColor="orange"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
