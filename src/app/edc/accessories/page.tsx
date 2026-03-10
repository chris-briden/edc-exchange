import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';
import { EDC_IMAGES } from '@/lib/images';
import { getArticlesByCategory } from '@/lib/content';

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

function getArticles() {
  return getArticlesByCategory('edc', 'accessories').map((a) => ({
    title: a.frontmatter.title,
    description: a.frontmatter.description,
    href: `/blog/edc/${a.slug}`,
    type: a.frontmatter.type,
    date: new Date(a.frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readingTime: a.readingTime,
    tags: a.frontmatter.tags,
  }));
}

export default function AccessoriesPage() {
  const articles = getArticles();
  return (
    <SubcategoryLanding
      title="Watches & Accessories"
      pillarTitle="Everyday Carry"
      pillarHref="/edc"
      description="Field watches, G-Shocks, watch straps, coins, beads, and pocket accessories. The finishing touches on your everyday carry."
      iconName="pocket"
      heroImage={EDC_IMAGES.heroes.accessories}
      accentColor="orange"
      features={features}
      relatedSubcategories={relatedSubcategories}
      articles={articles}
    />
  );
}
