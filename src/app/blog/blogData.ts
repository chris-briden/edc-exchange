export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'best-places-to-buy-sell-trade-edc-gear',
    title: 'The Best Places to Buy, Sell & Trade EDC Gear in 2026',
    description:
      'A no-nonsense breakdown of where to buy and sell everyday carry gear online — from Reddit swaps to dedicated marketplaces — and what to watch out for.',
    date: '2026-02-15',
    readTime: '8 min read',
    tags: ['marketplace', 'buying', 'selling'],
  },
  {
    slug: 'what-is-edc-everyday-carry-beginners-guide',
    title: "What is EDC? A Beginner's Guide to Everyday Carry",
    description:
      "New to everyday carry? Here's what EDC actually means, why people are into it, and how to start building a carry that works for your life.",
    date: '2026-02-14',
    readTime: '6 min read',
    tags: ['beginner', 'guide', 'EDC basics'],
  },
  {
    slug: 'how-to-price-used-edc-gear',
    title: 'How to Price Your Used EDC Gear (Without Getting Burned)',
    description:
      'Selling a knife you barely carried? A flashlight that sat in a drawer? Here\'s how to figure out what your gear is actually worth.',
    date: '2026-02-13',
    readTime: '7 min read',
    tags: ['selling', 'pricing', 'tips'],
  },
  {
    slug: 'why-founding-sellers-win-on-new-marketplaces',
    title: 'Why Early Sellers Always Win on New Marketplaces',
    description:
      "The sellers who show up first get the most visibility, the best fees, and the strongest reputations. Here's why timing matters.",
    date: '2026-02-12',
    readTime: '5 min read',
    tags: ['founding seller', 'marketplace', 'strategy'],
  },
  {
    slug: 'edc-pocket-dump-ideas-2026',
    title: 'EDC Pocket Dump Ideas: What People Are Actually Carrying in 2026',
    description:
      "Forget the Instagram-perfect flatlay. Here's what real everyday carries look like right now — and some gear worth checking out.",
    date: '2026-02-11',
    readTime: '9 min read',
    tags: ['pocket dump', 'gear', 'inspiration'],
  },
];
