import { MDXRemote } from 'next-mdx-remote/rsc';
import AffiliateLink from './AffiliateLink';
import ReviewCard from './ReviewCard';
import BuyersGuide from './BuyersGuide';

const components = {
  AffiliateLink,
  ReviewCard,
  BuyersGuide,
  // Responsive table wrapper for mobile
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto -mx-4 sm:mx-0 my-8">
      <div className="inline-block min-w-full align-middle px-4 sm:px-0">
        <table {...props} className="min-w-full" />
      </div>
    </div>
  ),
  // Override default anchor tags to use nofollow for external links
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = props.href?.startsWith('http');
    if (isExternal) {
      return (
        <a
          {...props}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
        />
      );
    }
    return <a {...props} className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors" />;
  },
};

interface MDXContentProps {
  source: string;
}

export default function MDXContent({ source }: MDXContentProps) {
  return <MDXRemote source={source} components={components} />;
}
