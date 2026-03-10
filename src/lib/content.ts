import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type Pillar = 'edc' | 'bags' | 'travel' | 'ruck';
export type ContentType = 'review' | 'guide' | 'comparison' | 'news' | 'opinion';

export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string;            // ISO date string
  updated?: string;        // ISO date string
  author?: string;
  pillar: Pillar;
  category?: string;       // subcategory e.g. "knives", "backpacks"
  type: ContentType;
  tags: string[];
  image?: string;          // hero/og image path
  featured?: boolean;      // show on homepage / pillar landing
  draft?: boolean;         // exclude from production builds
  affiliateDisclosure?: boolean; // show affiliate disclosure banner
  rating?: number;         // 0-10 for reviews
  prosAndCons?: {
    pros: string[];
    cons: string[];
  };
  product?: {
    name: string;
    brand: string;
    price: string;
    url?: string;          // primary purchase link
    image?: string;
  };
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;         // raw MDX string
  readingTime: string;
  pillar: Pillar;
}

export interface ArticleMeta {
  slug: string;
  frontmatter: ArticleFrontmatter;
  readingTime: string;
  pillar: Pillar;
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), 'content');

function getPillarDir(pillar: Pillar): string {
  return path.join(CONTENT_DIR, pillar);
}

function isPublished(frontmatter: ArticleFrontmatter): boolean {
  if (process.env.NODE_ENV === 'development') return true;
  return !frontmatter.draft;
}

// ──────────────────────────────────────────────
// Core API
// ──────────────────────────────────────────────

/**
 * Get a single article by pillar and slug.
 */
export function getArticle(pillar: Pillar, slug: string): Article | null {
  const filePath = path.join(getPillarDir(pillar), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = data as ArticleFrontmatter;

  if (!isPublished(frontmatter)) return null;

  return {
    slug,
    frontmatter,
    content,
    readingTime: readingTime(content).text,
    pillar,
  };
}

/**
 * Get all articles for a specific pillar, sorted by date descending.
 */
export function getArticlesByPillar(pillar: Pillar): ArticleMeta[] {
  const dir = getPillarDir(pillar);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8');
      const { data, content } = matter(raw);
      const frontmatter = data as ArticleFrontmatter;

      return {
        slug,
        frontmatter,
        readingTime: readingTime(content).text,
        pillar,
      };
    })
    .filter((a) => isPublished(a.frontmatter))
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

/**
 * Get all articles across all pillars, sorted by date descending.
 */
export function getAllArticles(): ArticleMeta[] {
  const pillars: Pillar[] = ['edc', 'bags', 'travel', 'ruck'];
  return pillars
    .flatMap((pillar) => getArticlesByPillar(pillar))
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

/**
 * Get featured articles (for homepage / pillar landing pages).
 */
export function getFeaturedArticles(pillar?: Pillar, limit = 6): ArticleMeta[] {
  const articles = pillar ? getArticlesByPillar(pillar) : getAllArticles();
  return articles
    .filter((a) => a.frontmatter.featured)
    .slice(0, limit);
}

/**
 * Get all unique tags across articles.
 */
export function getAllTags(pillar?: Pillar): string[] {
  const articles = pillar ? getArticlesByPillar(pillar) : getAllArticles();
  const tags = new Set<string>();
  articles.forEach((a) => a.frontmatter.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

/**
 * Get articles by tag.
 */
export function getArticlesByTag(tag: string, pillar?: Pillar): ArticleMeta[] {
  const articles = pillar ? getArticlesByPillar(pillar) : getAllArticles();
  return articles.filter((a) => a.frontmatter.tags.includes(tag));
}

/**
 * Get articles for a specific subcategory within a pillar.
 */
export function getArticlesByCategory(pillar: Pillar, category: string): ArticleMeta[] {
  return getArticlesByPillar(pillar).filter(
    (a) => a.frontmatter.category === category
  );
}

/**
 * Get all slugs for static generation (generateStaticParams).
 */
export function getAllArticleSlugs(): { pillar: Pillar; slug: string }[] {
  const pillars: Pillar[] = ['edc', 'bags', 'travel', 'ruck'];
  return pillars.flatMap((pillar) => {
    const dir = getPillarDir(pillar);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => ({ pillar, slug: f.replace(/\.mdx$/, '') }));
  });
}
