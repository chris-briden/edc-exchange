import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl font-extrabold mb-2 text-white">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: February 12, 2026</p>
          <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
            <p>
              Your privacy matters to us. This policy explains how EDC Exchange collects, uses, and
              protects your personal information.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">Information We Collect</h2>
            <p>
              We collect information you provide directly, such as your name, email address, username,
              and profile details. We also collect usage data to improve the platform experience.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">How We Use Your Information</h2>
            <p>
              Your information is used to provide and improve our services, facilitate marketplace
              transactions, communicate with you about your account, and maintain the security of
              our platform.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share limited information with other
              users as necessary to facilitate transactions (e.g., showing your username on listings
              and community posts).
            </p>
            <h2 className="text-xl font-bold text-white pt-4">Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. However, no
              method of transmission over the internet is 100% secure.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">Your Rights</h2>
            <p>
              You may access, update, or delete your personal information at any time through your
              profile settings. You may also request a copy of your data by contacting us.
            </p>
            <h2 className="text-xl font-bold text-white pt-4">Contact Us</h2>
            <p>
              If you have questions about this privacy policy, please reach out through the platform.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
