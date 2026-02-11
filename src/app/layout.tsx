import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "EDC Exchange — Buy, Sell, Trade & Share Everyday Carry",
  description:
    "The community marketplace for everyday carry enthusiasts. Buy, sell, trade, lend, and rent knives, flashlights, pens, multi-tools, and more.",
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
