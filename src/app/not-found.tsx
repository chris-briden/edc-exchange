import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Image src="/icon-new-dark-fixed.png" alt="The Carry Exchange" width={1024} height={1024} className="h-12 w-12" />
          <span className="text-xl font-bold tracking-wide text-gray-900">The Carry Exchange</span>
        </div>
        <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
        <p className="text-xl font-semibold text-gray-700 mb-2">Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-orange-700 text-white font-semibold hover:bg-orange-600 shadow-lg shadow-orange-900/50 transition"
          >
            Go Home
          </Link>
          <Link
            href="/categories"
            className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}

