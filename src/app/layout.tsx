import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "EDC Exchange â Buy, Sell, Trade & Share Everyday Carry",
  description:
    "The community marketplace for everyday carry enthusiasts. Buy, sell, trade, lend, and rent knives, flashlights, pens, multi-tools, and more. Join the carry at EDC Exchange.",
  openGraph: {
    title: "EDC Exchange â Join the Carry",
    description:
      "The community marketplace for EDC gear. Buy, sell, trade, lend, and rent everyday carry. Join the carry.",
    url: "https://jointhecarry.com",
    siteName: "EDC Exchange",
    type: "website",
  },
  alternates: {
    canonical: "https://jointhecarry.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
