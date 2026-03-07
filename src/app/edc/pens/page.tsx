import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'EDC Pens & Writing — Bolt-Action, Tactical & Fountain Pen Reviews',
  description:
    'Expert reviews and price comparison for EDC pens. Bolt-action pens, tactical pens, fountain pens, and refill guides.',
  alternates: { canonical: 'https://jointhecarry.com/edc/pens' },
};

const features = [
  'Reviews of bolt-action, click, and tactical pens',
  'Fountain pen and refill compatibility guides',
  'Material and machining quality comparisons',
  'Price tracking for popular EDC pen brands',
  'Best pens by budget: under $50, under $100, grail tier',
  'Ink and refill recommendations by writing style',
];

const relatedSubcategories = [
  { title: 'Knives & Blades', href: '/edc/knives' },
  { title: 'Flashlights', href: '/edc/flashlights' },
  { title: 'Multi-Tools', href: '/edc/multi-tools' },
  { title: 'Wallets & Organizers', href: '/edc/wallets' },
  { title: 'Watches & Accessories', href: '/edc/accessories' },
];

export default function PensPage() {
  return (
    <SubcategoryLanding
      title="Pens & Writing"
      pillarTitle="Everyday Carry"
      pillarHref="/edc"
      description="Bolt-action pens, tactical pens, fountain pens, and refills for everyday writers. The write stuff for your pocket."
      iconName="pocket"
      accentColor="orange"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
