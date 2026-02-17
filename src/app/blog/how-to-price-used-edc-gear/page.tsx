import type { Metadata } from 'next';
import BlogPostLayout from '../BlogPostLayout';

export const metadata: Metadata = {
  title: 'How to Price Your Used EDC Gear (Without Getting Burned)',
  description:
    "Selling a knife you barely carried? A flashlight that sat in a drawer? Here's how to figure out what your gear is actually worth.",
  alternates: {
    canonical: 'https://jointhecarry.com/blog/how-to-price-used-edc-gear',
  },
  openGraph: {
    title: 'How to Price Your Used EDC Gear (Without Getting Burned)',
    description: "Here's how to figure out what your used EDC gear is actually worth.",
    url: 'https://jointhecarry.com/blog/how-to-price-used-edc-gear',
    type: 'article',
  },
};

export default function Post() {
  return (
    <BlogPostLayout
      title="How to Price Your Used EDC Gear (Without Getting Burned)"
      date="2026-02-13"
      readTime="7 min read"
      tags={['selling', 'pricing', 'tips']}
    >
      <p>
        You bought a knife six months ago for $180. You carried it twice, decided it
        wasn&apos;t for you, and now it&apos;s sitting in a drawer. What&apos;s it worth?
      </p>

      <p>
        This is one of the most common questions in the EDC secondary market, and getting
        it wrong means either leaving money on the table or watching your listing sit
        untouched for weeks. Here&apos;s how to think about pricing.
      </p>

      <h2>The Condition Scale That Actually Matters</h2>

      <p>
        The EDC community has developed its own shorthand for condition, and it&apos;s
        worth knowing because buyers expect it:
      </p>

      <p>
        <strong>BNIB (Brand New In Box).</strong> Literally never carried, never cut
        anything, still in the original packaging. This is rare in the secondary market
        and commands the highest prices — usually 80-95% of retail depending on availability.
      </p>

      <p>
        <strong>LNIB (Like New In Box).</strong> Opened, maybe flipped a few times
        or carried once, but no visible wear. Box and papers included. Expect 75-90%
        of retail.
      </p>

      <p>
        <strong>Excellent/A condition.</strong> Carried a few times, might have light
        wear on the clip, but no scratches on the blade or body. Still has the original
        edge. This is where most &quot;I tried it and moved on&quot; gear falls.
        Usually 65-80% of retail.
      </p>

      <p>
        <strong>Good/B condition.</strong> Regular carry signs — light scratches,
        clip wear, maybe been sharpened once. Fully functional, just not pristine.
        Typically 50-70% of retail.
      </p>

      <p>
        <strong>Fair/C condition.</strong> Obvious use — scratches, wear, maybe a
        mod or repair. Still works fine, but it&apos;s been used hard. 35-55% of retail,
        sometimes less.
      </p>

      <h2>Factors That Move the Price Up</h2>

      <p>
        <strong>Discontinued models.</strong> If the manufacturer stopped making it,
        the secondary market price often goes up, sometimes significantly. Certain
        Benchmade and Spyderco sprint runs can sell for double retail years later.
      </p>

      <p>
        <strong>Limited editions and sprint runs.</strong> Exclusive steel, special
        handle materials, numbered runs — these all command premiums. A Spyderco
        Para 3 in standard S45VN is one price. The same knife in Maxamet with natural
        G-10 is a different conversation.
      </p>

      <p>
        <strong>Box, papers, and original accessories.</strong> This matters more
        than you&apos;d think. A used Chris Reeve Sebenza with the birth card, cloth,
        allen wrench, and original box will sell for meaningfully more than the same
        knife without them.
      </p>

      <p>
        <strong>Custom work (sometimes).</strong> Professional mods from known
        modders can add value — aftermarket scales, anodizing, mirror-polished blades.
        But this is subjective. Your taste might not be the buyer&apos;s taste.
      </p>

      <h2>Factors That Push the Price Down</h2>

      <p>
        <strong>Currently in production and widely available.</strong> If someone
        can buy it new from a dozen retailers, your used one needs to be priced
        competitively against the convenience of buying new with a warranty.
      </p>

      <p>
        <strong>Sharpening.</strong> A reprofiled or poorly sharpened edge
        reduces value. Factory edge is always preferred in the secondary market
        unless the new edge is done exceptionally well.
      </p>

      <p>
        <strong>Missing parts.</strong> Lost the clip? Can&apos;t find the box?
        Deep carry clip replaced the original? Each missing piece drops the price
        a bit.
      </p>

      <p>
        <strong>Odors.</strong> This sounds weird but it comes up. Gear that smells
        like cigarette smoke, cologne, or anything else that&apos;s hard to remove
        will sit on the market.
      </p>

      <h2>How to Actually Set Your Price</h2>

      <p>
        Here&apos;s the practical approach that works:
      </p>

      <p>
        First, search for your exact item on r/Knife_Swap, r/EDCexchange, and eBay
        sold listings (not active listings — sold). This tells you what people actually
        paid, not what sellers wished they could get. Sort by recent.
      </p>

      <p>
        Second, honestly assess your condition using the scale above. Most people
        overrate their own gear. If you&apos;re not sure, call it one grade lower
        than you think — a quick sale is almost always better than sitting on a
        listing for weeks.
      </p>

      <p>
        Third, price it to sell. The sweet spot is usually 5-10% below the average
        recent sale price for the same condition. You&apos;ll sell faster, avoid
        the back-and-forth of lowball offers, and can move on to your next purchase
        sooner.
      </p>

      <p>
        And fourth, factor in fees. If you&apos;re selling on eBay, that 13% hit
        is real. Reddit swaps avoid platform fees but require PayPal G&amp;S (about 3%).
        When The Carry Exchange launches, we&apos;re starting at just 3% commission —
        designed specifically so you keep more of what your gear is worth.
      </p>

      <h2>One Last Tip</h2>

      <p>
        Good photos sell gear. Shoot in natural light, show the blade centering,
        lockup, any wear honestly, and include the box contents laid out. A listing
        with five clear, honest photos will outsell a listing with one blurry
        shot every time.
      </p>

      <p>
        Happy selling.
      </p>
    </BlogPostLayout>
  );
}
