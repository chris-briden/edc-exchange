import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TrustSafetyPage() {
  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-extrabold mb-6 text-white">Trust &amp; Safety</h1>
          <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
            <p>
              At EDC Exchange, we are committed to creating a safe and trustworthy marketplace for
              the EDC community. Here are the measures we take and the guidelines we ask our members
              to follow.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">Safe Trading Guidelines</h2>
            <p>
              Always communicate through the platform&apos;s messaging system. Be cautious of deals
              that seem too good to be true. Verify item conditions through photos and detailed
              descriptions before committing to a purchase or trade.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">Prohibited Items</h2>
            <p>
              Items that are illegal, counterfeit, stolen, or that violate local regulations may
              not be listed on EDC Exchange. We reserve the right to remove any listing that violates
              our policies.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">Reporting Issues</h2>
            <p>
              If you encounter suspicious activity, fraudulent listings, or inappropriate behavior,
              please use the report button on any listing or profile. Our team reviews all reports
              and takes appropriate action.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">Account Verification</h2>
            <p>
              We encourage all members to complete their profiles with accurate information.
              Verified members with established transaction histories build trust within the community.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">Dispute Resolution</h2>
            <p>
              If a transaction does not go as expected, we encourage buyers and sellers to work
              together to find a resolution. Our support team is available to help mediate disputes
              when needed.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

