import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';
import { EDC_IMAGES } from '@/lib/images';
import { getArticlesByCategory } from '@/lib/content';

export const metadata: Metadata = {
  title: 'EDC Wallets & Organizers — Minimalist Wallet Reviews & Prices',
  description:
    'Expert reviews and price comparison for minimalist wallets, ridge wallets, card holders, key organizers, and pocket trays.',
  alternates: { canonical: 'https://jointhecarry.com/edc/wallets' },
};

const features = [
  'Reviews of minimalist wallets, bifolds, and card holders',
  'Ridge-style vs. traditional vs. money clip comparisons',
  'Key organizers and pocket tray roundups',
  'Material guides: titanium, carbon fiber, leather, aluminum',
  'RFID blocking effectiveness tests',
  'Price tracking across wallet brands and retailers',
];

const relatedSubcategories = [
  { title: 'Knives & Blades', href: '/edc/knives' },
  { title: 'Flashlights', href: '/edc/flashlights' },
  { title: 'Multi-Tools', href: '/edc/multi-tools' },
  { title: 'Pens & Writing', href: '/edc/pens' },
  { title: 'Watches & Accessories', href: '/edc/accessories' },
];

function getArticles() {
  return getArticlesByCategory('edc', 'wallets').map((a) => ({
    title: a.frontmatter.title,
    description: a.frontmatter.description,
    href: `/blog/edc/${a.slug}`,
    type: a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function WalletsPage() {
  const articles = getArticles();
  return (
    <SubcategoryLanding
      title="Wallets & Organizers"
      pillarTitle="Everyday Carry"
      pillarHref="/edc"
      description="Minimalist wallets, ridge wallets, card holders, key organizers, and pocket trays. Slim your carry without losing function."
      iconName="pocket"
      heroImage={EDC_IMAGES.heroes.wallets}
      accentColor="orange"
      features={features}
      relatedSubcategories={relatedSubcategories}
      articles={articles}
    />
  );
}
