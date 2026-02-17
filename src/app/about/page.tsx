import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-extrabold mb-6 text-white">About EDC Exchange</h1>
          <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
            <p>
              EDC Exchange is the community marketplace built by and for everyday carry enthusiasts.
              Whether you collect knives, flashlights, pens, multi-tools, or watches, this is the place
              to buy, sell, trade, lend, and showcase the gear you love.
            </p>
            <p>
              Founded in 2026, our mission is to connect EDC hobbyists with a trusted platform where
              they can discover new gear, share their collections, write honest reviews, and build
              relationships with fellow enthusiasts around the world.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">What makes us different</h2>
            <p>
              Unlike generic marketplaces, EDC Exchange is purpose-built for the everyday carry
              community. We understand the nuances of knife steels, lumen counts, and pen mechanisms.
              Our category system, item conditions, and community features are all tailored to how EDC
              collectors actually buy, sell, and discuss their gear.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">Community first</h2>
            <p>
              Beyond the marketplace, EDC Exchange is a community hub. Share your daily carry loadouts,
              write in-depth reviews, join discussions, and follow your favorite collectors. We believe
              the best gear recommendations come from real enthusiasts, not algorithms.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
