import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';
import { EDC_IMAGES } from '@/lib/images';
import { getArticlesByCategory } from '@/lib/content';

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

function getArticles() {
  return getArticlesByCategory('edc', 'flashlights').map((a) => ({
    title: a.frontmatter.title,
    description: a.frontmatter.description,
    href: `/blog/edc/${a.slug}`,
    type: a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function FlashlightsPage() {
  const articles = getArticles();
  return (
    <SubcategoryLanding
      title="Flashlights"
      pillarTitle="Everyday Carry"
      pillarHref="/edc"
      description="EDC lights, keychain torches, headlamps, and tactical lights. Lumens, runtimes, and beam patterns compared across every budget."
      iconName="pocket"
      heroImage={EDC_IMAGES.heroes.flashlights}
      accentColor="orange"
      features={features}
      relatedSubcategories={relatedSubcategories}
      articles={articles}
    />
  );
}
