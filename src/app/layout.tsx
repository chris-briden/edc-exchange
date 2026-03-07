import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Carry Collective — Gear Reviews, Guides & Marketplace",
    template: "%s | The Carry Collective",
  },
  description:
    "The carry culture community. Expert reviews, buyer's guides, and marketplace for EDC, bags, travel gear, and rucking. Join the collective at jointhecarry.com.",
  keywords: [
    "everyday carry",
    "EDC",
    "EDC reviews",
    "gear reviews",
    "carry culture",
    "backpack reviews",
    "travel carry",
    "rucking gear",
    "EDC marketplace",
    "carry-on luggage",
    "sling bags",
    "pocket knife reviews",
    "flashlight reviews",
    "carry collective",
    "best EDC gear",
    "rucking community",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
  },
  openGraph: {
    title: "The Carry Collective — Gear Reviews, Guides & Marketplace",
    description:
      "The carry culture community. Reviews, guides, and marketplace for EDC, bags, travel gear, and rucking. Join the collective.",
    url: "https://jointhecarry.com",
    siteName: "The Carry Collective",
    type: "website",
    images: [
      {
        url: "https://jointhecarry.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Carry Collective — Gear Reviews, Guides & Community Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Carry Collective — Gear Reviews, Guides & Marketplace",
    description:
      "The carry culture community. Reviews, guides, and marketplace for EDC, bags, travel gear, and rucking.",
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
  name: "The Carry Collective",
  url: "https://jointhecarry.com",
  logo: "https://jointhecarry.com/tcc-shield-logo.png",
  description:
    "The carry culture community. Expert reviews, buyer's guides, and marketplace for EDC, bags, travel gear, and rucking.",
  sameAs: [
    "https://www.instagram.com/thecarrycollective/",
    "https://www.facebook.com/profile.php?id=61587984548075",
    "https://x.com/jointhecarry",
  ],
  foundingDate: "2024",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://jointhecarry.com",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Carry Collective",
  url: "https://jointhecarry.com",
  description:
    "Expert reviews, buyer's guides, and marketplace for EDC, bags, travel gear, and rucking. The carry culture community.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://jointhecarry.com/categories?search={search_term_string}",
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
