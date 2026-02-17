import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Carry Exchange — Buy, Sell, Trade & Share Everyday Carry",
  description:
    "The community marketplace for everyday carry enthusiasts. Buy, sell, trade, lend, and rent knives, flashlights, pens, multi-tools, and more. Join the carry at The Carry Exchange.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "The Carry Exchange — Join the Carry",
    description:
      "The community marketplace for EDC gear. Buy, sell, trade, lend, and rent everyday carry. Join the carry.",
    url: "https://jointhecarry.com",
    siteName: "The Carry Exchange",
    type: "website",
  },
  alternates: {
    canonical: "https://jointhecarry.com",
  },
    verification: {
          google: "cDFlPVDQRnk01XtKzS3e5RA2HScHB-HVssCPKx3H-qg",
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



