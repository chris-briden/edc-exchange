"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Package,
  Truck,
  Download,
  ArrowRight,
  Loader2,
  MessageSquare,
  MapPin,
  Clock,
  Tag,
  ShieldCheck,
  Box,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ItemImage {
  url: string;
  position: number;
}

interface OrderData {
  transaction: {
    id: string;
    listing_id: string;
    buyer_id: string;
    seller_id: string;
    amount: number;
    platform_fee: number;
    type: "sale" | "rental";
    status: string;
    rental_status?: string;
    created_at: string;
  } | null;
  listing: {
    id: string;
    name: string;
    price: string;
    listing_type: string;
    brand: string;
    description: string;
    condition: string;
    rent_price: string;
    rental_period: string;
    rental_deposit: string;
    box_and_docs: string;
    item_images: ItemImage[];
    categories: { name: string; slug: string } | null;
    profiles: { username: string; full_name: string } | null;
  } | null;
  shipment: {
    id: string;
    tracking_number: string;
    tracking_url: string;
    label_url: string;
    address_to: {
      name: string;
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    carrier: string;
    service_level: string;
    buyer_rate: string;
    status: string;
    estimated_days: number | null;
  } | null;
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="min-h-screen bg-black pt-20 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
              <p className="text-gray-400">Loading your order details...</p>
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const listingId = searchParams.get("listing_id");
  const type = searchParams.get("type") || "sale";

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!paymentIntentId && !listingId) return;

    const fetchOrder = async () => {
      try {
        const params = new URLSearchParams();
        if (paymentIntentId) params.set("payment_intent", paymentIntentId);
        if (listingId) params.set("listing_id", listingId);

        const res = await fetch(`/api/order?${params.toString()}`);
        const data = await res.json();
        setOrder(data);

        // If no transaction yet (webhook still processing), retry up to 8 times
        if (!data.transaction && retryCount < 8) {
          setTimeout(() => setRetryCount((c) => c + 1), 2000);
        }
      } catch {
        console.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [paymentIntentId, listingId, retryCount]);

  if (loading && retryCount === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-400">Loading your order details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const listing = order?.listing;
  const shipment = order?.shipment;
  const transaction = order?.transaction;
  const isRental = type === "rental";

  // Sort images by position, take the first one
  const sortedImages = (listing?.item_images || []).sort(
    (a, b) => a.position - b.position
  );
  const primaryImage = sortedImages[0]?.url;
  const sellerName =
    listing?.profiles?.full_name || listing?.profiles?.username || "Seller";
  const categoryName = listing?.categories?.name || "";
  const itemPrice = parseFloat(listing?.price || "0");
  const shippingPrice = shipment
    ? parseFloat(shipment.buyer_rate)
    : 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success header */}
          <div className="text-center mb-8 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/50 border-2 border-green-500 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isRental ? "Rental Confirmed!" : "Order Confirmed!"}
            </h1>
            <p className="text-gray-400">
              {isRental
                ? "Your rental has been confirmed and the lender has been notified."
                : "Your payment was successful and the seller has been notified."}
            </p>
          </div>

          {/* Main order card */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden mb-6">
            {/* Item details section with image */}
            <div className="p-6 border-b border-zinc-800">
              <div className="flex gap-4">
                {/* Item image */}
                {primaryImage ? (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                    <Image
                      src={primaryImage}
                      alt={listing?.name || "Item"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-zinc-800 border border-zinc-700 shrink-0 flex items-center justify-center">
                    <Package className="w-8 h-8 text-zinc-600" />
                  </div>
                )}

                {/* Item info */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-white text-lg leading-tight">
                    {listing?.name || "Item"}
                  </h2>
                  {listing?.brand && (
                    <p className="text-sm text-orange-400 font-medium mt-0.5">
                      {listing.brand}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {categoryName && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-gray-400 border border-zinc-700">
                        {categoryName}
                      </span>
                    )}
                    {listing?.condition && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-gray-400 border border-zinc-700">
                        {listing.condition}
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-800">
                      {isRental ? "Rental" : "Purchase"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Item description */}
              {listing?.description && (
                <p className="text-sm text-gray-400 mt-4 leading-relaxed line-clamp-3">
                  {listing.description}
                </p>
              )}

              {/* Extra item details */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                {listing?.box_and_docs && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Box className="w-3 h-3" />
                    <span>Box/Docs: {listing.box_and_docs}</span>
                  </div>
                )}
                {sellerName && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Tag className="w-3 h-3" />
                    <span>
                      Sold by{" "}
                      <Link
                        href={`/u/${listing?.profiles?.username || ""}`}
                        className="text-orange-400 hover:underline"
                      >
                        {sellerName}
                      </Link>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment summary */}
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                Payment Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>{isRental ? "Rental fee" : "Item price"}</span>
                  <span className="font-medium">
                    $
                    {isRental
                      ? parseFloat(listing?.rent_price || "0").toFixed(2)
                      : itemPrice.toFixed(2)}{" "}
                    CAD
                  </span>
                </div>
                {shipment && (
                  <div className="flex justify-between text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" /> Shipping
                    </span>
                    <span className="font-medium">
                      ${shippingPrice.toFixed(2)} CAD
                    </span>
                  </div>
                )}
                {isRental && listing?.rental_deposit && (
                  <div className="flex justify-between text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Security deposit
                      (hold)
                    </span>
                    <span className="font-medium text-amber-400">
                      ${parseFloat(listing.rental_deposit).toFixed(2)} CAD
                    </span>
                  </div>
                )}
                {transaction && transaction.platform_fee > 0 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Platform fee (included)</span>
                    <span>
                      ${(transaction.platform_fee / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2 border-t border-zinc-700 text-white">
                  <span>Total charged</span>
                  <span className="text-green-400 text-base">
                    {transaction
                      ? `$${(transaction.amount / 100).toFixed(2)} CAD`
                      : `$${(itemPrice + shippingPrice).toFixed(2)} CAD`}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping info */}
            {shipment && (
              <div className="p-6 border-b border-zinc-800">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                  Shipping Details
                </h3>
                <div className="space-y-3">
                  {/* Ship to address */}
                  <div className="flex items-start gap-2.5 text-sm">
                    <MapPin className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                    <div className="text-gray-300">
                      <p className="font-medium text-white">
                        {shipment.address_to.name}
                      </p>
                      <p>{shipment.address_to.street1}</p>
                      {shipment.address_to.street2 && (
                        <p>{shipment.address_to.street2}</p>
                      )}
                      <p>
                        {shipment.address_to.city}, {shipment.address_to.state}{" "}
                        {shipment.address_to.zip}
                      </p>
                    </div>
                  </div>

                  {/* Tracking */}
                  {shipment.tracking_number && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <Package className="w-4 h-4 text-orange-400 shrink-0" />
                      <div>
                        <span className="text-gray-400 mr-1.5">Tracking:</span>
                        {shipment.tracking_url ? (
                          <a
                            href={shipment.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
                          >
                            {shipment.tracking_number}
                          </a>
                        ) : (
                          <span className="text-gray-300">
                            {shipment.tracking_number}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Estimated delivery */}
                  {shipment.estimated_days && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                      <span className="text-gray-300">
                        Estimated delivery: {shipment.estimated_days} business
                        days
                      </span>
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 flex justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    </div>
                    <span className="text-sm text-amber-400 font-medium capitalize">
                      {shipment.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Label created notice */}
                  {shipment.label_url && (
                    <div className="p-3 rounded-xl bg-green-900/20 border border-green-800/50 text-sm text-green-300/80">
                      <div className="flex items-start gap-2">
                        <Download className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          A shipping label has been generated automatically. The
                          seller will ship your item soon.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Return label notice for rentals */}
                  {isRental && (
                    <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-800/50 text-sm text-amber-300/80">
                      <div className="flex items-start gap-2">
                        <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          A prepaid return shipping label will be included in
                          your package. No return shipping cost to you!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* What happens next timeline */}
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                What happens next
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-green-900/50 border border-green-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-sm pt-0.5">
                    <p className="text-white font-medium">Payment confirmed</p>
                    <p className="text-gray-500">
                      Your payment has been processed successfully
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-900/50 border border-amber-700 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-sm pt-0.5">
                    <p className="text-white font-medium">
                      Seller prepares shipment
                    </p>
                    <p className="text-gray-500">
                      {shipment
                        ? "A shipping label has been created — the seller just needs to drop it off"
                        : "The seller will arrange shipping with you"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="text-sm pt-0.5">
                    <p className="text-gray-400 font-medium">
                      Item ships to you
                    </p>
                    <p className="text-gray-500">
                      {isRental
                        ? "A prepaid return label will be included in your package"
                        : shipment?.tracking_number
                          ? "Track your package using the tracking number above"
                          : "You'll receive tracking info once the seller ships"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/messages"
              className="flex-1 py-3 px-4 rounded-xl border border-zinc-700 text-gray-300 hover:bg-zinc-900 transition flex items-center justify-center gap-2 text-sm font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              Message Seller
            </Link>
            <Link
              href="/categories"
              className="flex-1 py-3 px-4 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition flex items-center justify-center gap-2 text-sm font-medium"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Retry notice while waiting for webhook */}
          {!transaction && retryCount > 0 && retryCount < 8 && (
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Finalizing order details...
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
