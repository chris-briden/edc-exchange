import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-extrabold mb-2 text-white">Terms of Service</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: February 12, 2026</p>
          <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
            <p>
              Welcome to EDC Exchange. By accessing or using our platform, you agree to be bound by
              these Terms of Service. Please read them carefully before using the site.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using EDC Exchange, you agree to these terms. If you do not
              agree, please do not use the platform.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and
              for all activities that occur under your account. You must provide accurate information
              when creating your account.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">3. Marketplace Conduct</h2>
            <p>
              All listings must accurately represent the items being offered. Sellers are responsible
              for the accuracy of their item descriptions, conditions, and pricing. Prohibited items
              include anything illegal in the seller or buyer&apos;s jurisdiction.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">4. Community Guidelines</h2>
            <p>
              Users are expected to engage respectfully in all community interactions. Harassment,
              spam, and fraudulent behavior will result in account suspension or termination.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">5. Limitation of Liability</h2>
            <p>
              EDC Exchange facilitates connections between buyers and sellers but is not a party to
              any transaction. We are not responsible for the quality, safety, or legality of items
              listed on the platform.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">6. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the platform after changes
              constitutes acceptance of the updated terms.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

