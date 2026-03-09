import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getArticle, getAllArticleSlugs, type Pillar } from '@/lib/content';
import ArticleLayout from '@/components/ArticleLayout';
import MDXContent from '@/components/mdx/MDXContent';

const VALID_PILLARS: Pillar[] = ['edc', 'bags', 'travel', 'ruck'];

interface PageProps {
  params: Promise<{ pillar: string; slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map(({ pillar, slug }) => ({
    pillar,
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pillar, slug } = await params;
  if (!VALID_PILLARS.includes(pillar as Pillar)) return {};

  const article = getArticle(pillar as Pillar, slug);
  if (!article) return {};

  return {
    title: `${article.frontmatter.title} — The Carry Collective`,
    description: article.frontmatter.description,
    alternates: {
      canonical: `https://jointhecarry.com/blog/${pillar}/${slug}`,
    },
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      url: `https://jointhecarry.com/blog/${pillar}/${slug}`,
      type: 'article',
      publishedTime: article.frontmatter.date,
      ...(article.frontmatter.image && { images: [article.frontmatter.image] }),
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { pillar, slug } = await params;

  if (!VALID_PILLARS.includes(pillar as Pillar)) {
    notFound();
  }

  const article = getArticle(pillar as Pillar, slug);
  if (!article) {
    notFound();
  }

  return (
    <ArticleLayout
      frontmatter={article.frontmatter}
      pillar={article.pillar}
      readingTime={article.readingTime}
    >
      <MDXContent source={article.content} />
    </ArticleLayout>
  );
}
