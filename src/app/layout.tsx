import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Carry Exchange — Buy, Sell, Trade & Rent Everyday Carry",
    template: "%s | The Carry Exchange",
  },
  description:
    "The community marketplace for everyday carry enthusiasts. Buy, sell, trade, lend, and rent knives, flashlights, pens, multi-tools, and more. Join the carry at The Carry Exchange.",
  keywords: [
    "everyday carry",
    "EDC",
    "EDC marketplace",
    "buy sell EDC",
    "trade EDC gear",
    "pocket knife marketplace",
    "flashlight marketplace",
    "EDC community",
    "sell EDC gear",
    "buy used knives",
    "EDC exchange",
    "everyday carry marketplace",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
  },
  openGraph: {
    title: "The Carry Exchange — Buy, Sell, Trade & Rent Everyday Carry",
    description:
      "The community marketplace for EDC gear. Buy, sell, trade, lend, and rent everyday carry. Join the carry.",
    url: "https://jointhecarry.com",
    siteName: "The Carry Exchange",
    type: "website",
    images: [
      {
        url: "https://jointhecarry.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Carry Exchange — The EDC Community Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Carry Exchange — Buy, Sell, Trade & Rent Everyday Carry",
    description:
      "The community marketplace for EDC gear. Buy, sell, trade, lend, and rent everyday carry. Join the carry.",
    images: ["https://jointhecarry.com/og-image.png"],
  },
  alternates: {
    canonical: "https://jointhecarry.com",
  },
  verification: {
    google: "cDFlPVDQRnk01XtKzS3e5RA2HScHB-HVssCPKx3H-qg",
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Carry Exchange",
  url: "https://jointhecarry.com",
  logo: "https://jointhecarry.com/icon-new-white.png",
  description:
    "The community marketplace for everyday carry enthusiasts. Buy, sell, trade, lend, and rent EDC gear.",
  sameAs: [
    "https://www.instagram.com/thecarryexchange/",
    "https://www.facebook.com/profile.php?id=61587984548075",
    "https://x.com/jointhecarry",
  ],
  foundingDate: "2026",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://jointhecarry.com",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Carry Exchange",
  url: "https://jointhecarry.com",
  description:
    "Buy, sell, trade, lend, and rent everyday carry gear. The community marketplace for EDC enthusiasts.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://jointhecarry.com/marketplace?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
