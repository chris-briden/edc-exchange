import type { Metadata } from 'next';
import SubcategoryLanding from '@/components/SubcategoryLanding';

export const metadata: Metadata = {
  title: 'Ruck Training Plans — Beginner to Advanced Programs',
  description:
    'Beginner to advanced rucking programs. Couch to ruck, GORUCK event prep, and military fitness standards.',
  alternates: { canonical: 'https://jointhecarry.com/ruck/training' },
};

const features = [
  'Progressive training plans from couch to 12-mile ruck',
  'GORUCK event prep: Tough, Heavy, Star Course programs',
  'Military ruck march standards and training guides',
  'Interval, hill, and speed ruck workout programming',
  'Recovery and injury prevention protocols',
  'Training log templates and progress tracking tools',
];

const relatedSubcategories = [
  { title: 'Rucksacks & Packs', href: '/ruck/rucksacks' },
  { title: 'Weighted Vests & Plates', href: '/ruck/vests' },
  { title: 'Ruck Club Directory', href: '/ruck/clubs' },
  { title: 'Footwear', href: '/ruck/footwear' },
  { title: 'Events & Challenges', href: '/ruck/events' },
];

export default function TrainingPage() {
  return (
    <SubcategoryLanding
      title="Training Plans"
      pillarTitle="Ruck & Fitness"
      pillarHref="/ruck"
      description="Beginner to advanced rucking programs. Couch to ruck, GORUCK event prep, and military standards. Your training starts here."
      iconName="dumbbell"
      heroImage="/hero-ruck-training.jpg"
      accentColor="green"
      features={features}
      relatedSubcategories={relatedSubcategories}
    />
  );
}
