"use client";

import { useState, useEffect } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Loader2,
  X,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import ShippingAddressForm from "@/components/ShippingAddressForm";
import type { ShippingAddress, ShippingRate } from "@/lib/types";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Inner form that uses Stripe hooks
function CheckoutForm({
  onSuccess,
  onCancel,
  type,
  listingId,
}: {
  onSuccess: (paymentIntentId?: string) => void;
  onCancel: () => void;
  type: "sale" | "rental";
  listingId?: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const returnParams = new URLSearchParams({
      type,
      ...(listingId ? { listing_id: listingId } : {}),
    });

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/confirmation?${returnParams.toString()}`,
      },
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message || "Payment failed");
      setProcessing(false);
    } else {
      onSuccess(paymentIntent?.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />
      {error && (
        <div className="p-3 rounded-lg bg-red-900/50 border border-red-500 text-red-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {processing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4" />
          )}
          {processing ? "Processing..." : "Confirm Payment"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="px-4 py-3 rounded-xl border border-zinc-700 text-gray-300 hover:bg-zinc-800 transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Buy Now payment form — now with shipping step
export function BuyNowForm({
  listingId,
  itemName,
  price,
  sellerAddress,
  onClose,
}: {
  listingId: string;
  itemName: string;
  price: number;
  sellerAddress: ShippingAddress | null;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"shipping" | "payment">(
    sellerAddress ? "shipping" : "payment"
  );
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [platformFee, setPlatformFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingCost = selectedRate?.buyerPrice || 0;
  const total = price + shippingCost;

  const handleRateSelected = (rate: ShippingRate, addr: ShippingAddress) => {
    setSelectedRate(rate);
    setStep("payment");
    createPayment(rate, addr);
  };

  // If seller has no address, skip shipping and create payment right away
  useEffect(() => {
    if (!sellerAddress) {
      createPayment(null, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPayment = async (
    rate: ShippingRate | null,
    addr: ShippingAddress | null
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listingId,
          shipping_rate: rate
            ? {
                rateId: rate.rateId,
                carrierRate: rate._internal.carrierRate,
                buyerRate: rate.buyerPrice,
                shipmentId: rate._internal.shippoShipmentId,
                carrier: rate.carrier,
                serviceName: rate.serviceName,
              }
            : null,
          buyer_address: addr,
          seller_address: sellerAddress,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create payment");
        setLoading(false);
        return;
      }

      setClientSecret(data.client_secret);
      setPlatformFee(data.platform_fee);
    } catch {
      setError("Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (paymentIntentId?: string) => {
    const params = new URLSearchParams({
      type: "sale",
      listing_id: listingId,
    });
    if (paymentIntentId) params.set("payment_intent", paymentIntentId);
    // Navigate to confirmation page immediately — don't close modal first
    window.location.href = `/order/confirmation?${params.toString()}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Complete Purchase</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Order summary */}
          <div className="p-3 sm:p-4 rounded-xl bg-zinc-800 mb-6">
            <h3 className="font-semibold text-xs sm:text-sm mb-3 text-white line-clamp-2">{itemName}</h3>
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Item price</span>
                <span>${price.toFixed(2)} CAD</span>
              </div>
              {selectedRate && (
                <div className="flex justify-between text-gray-300">
                  <span className="flex items-center gap-1">
                    <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Shipping
                  </span>
                  <span>${shippingCost.toFixed(2)} CAD</span>
                </div>
              )}
              {!sellerAddress && !selectedRate && (
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Shipping</span>
                  <span>Arrange with seller</span>
                </div>
              )}
              {platformFee > 0 && (
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Platform fee (included)</span>
                  <span>${(platformFee / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-1.5 border-t border-zinc-700 text-gray-300">
                <span>Total</span>
                <span className="text-green-400">${total.toFixed(2)} CAD</span>
              </div>
            </div>
          </div>

          {/* Step 1: Shipping address & rate selection */}
          {step === "shipping" && sellerAddress && (
            <ShippingAddressForm
              sellerAddress={sellerAddress}
              onRateSelected={handleRateSelected}
              onBack={onClose}
            />
          )}

          {/* Step 2: Payment */}
          {step === "payment" && (
            <>
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-900/50 border border-red-500 text-red-300 text-sm mb-4">
                  {error}
                </div>
              )}

              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#ea580c",
                        borderRadius: "12px",
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    onSuccess={handleSuccess}
                    onCancel={onClose}
                    type="sale"
                    listingId={listingId}
                  />
                </Elements>
              )}
            </>
          )}

          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4" />
            Payments secured by Stripe. Your card details are never stored on our
            servers.
          </div>
        </div>
      </div>
    </div>
  );
}

// Rental payment form with shipping + deposit
export function RentalPaymentForm({
  listingId,
  itemName,
  rentPrice,
  rentalPeriod,
  depositAmount,
  sellerAddress,
  onClose,
}: {
  listingId: string;
  itemName: string;
  rentPrice: string;
  rentalPeriod: string | null;
  depositAmount: number | null;
  sellerAddress: ShippingAddress | null;
  onClose: () => void;
}) {
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);

  const [rentalClientSecret, setRentalClientSecret] = useState<string | null>(null);
  const [depositClientSecret, setDepositClientSecret] = useState<string | null>(null);
  const [rentalAmountCents, setRentalAmountCents] = useState(0);
  const [depositAmountCents, setDepositAmountCents] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<
    "shipping" | "review" | "rental_payment" | "deposit_payment"
  >(sellerAddress ? "shipping" : "review");
  const [acknowledged, setAcknowledged] = useState(false);

  const rentalPriceNum = parseFloat(
    String(rentPrice).replace(/[^0-9.]/g, "")
  );
  const periodLabel = rentalPeriod || "period";
  const shippingCost = selectedRate?.buyerPrice || 0;

  const handleRateSelected = (rate: ShippingRate, addr: ShippingAddress) => {
    setSelectedRate(rate);
    setStep("review");
    createRental(rate, addr);
  };

  // If seller has no shipping address, create rental immediately
  useEffect(() => {
    if (!sellerAddress) {
      createRental(null, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createRental = async (
    rate: ShippingRate | null,
    addr: ShippingAddress | null
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/rental", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listingId,
          shipping_rate: rate
            ? {
                rateId: rate.rateId,
                carrierRate: rate._internal.carrierRate,
                buyerRate: rate.buyerPrice,
                shipmentId: rate._internal.shippoShipmentId,
                carrier: rate.carrier,
                serviceName: rate.serviceName,
              }
            : null,
          buyer_address: addr,
          seller_address: sellerAddress,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create rental payment");
        setLoading(false);
        return;
      }

      setRentalClientSecret(data.rental_client_secret);
      setDepositClientSecret(data.deposit_client_secret);
      setRentalAmountCents(data.rental_amount);
      setDepositAmountCents(data.deposit_amount);
      setPlatformFee(data.platform_fee);
    } catch {
      setError("Failed to initialize rental");
    } finally {
      setLoading(false);
    }
  };

  const handleRentalSuccess = (paymentIntentId?: string) => {
    if (depositClientSecret) {
      setStep("deposit_payment");
    } else {
      const params = new URLSearchParams({
        type: "rental",
        listing_id: listingId,
      });
      if (paymentIntentId) params.set("payment_intent", paymentIntentId);
      window.location.href = `/order/confirmation?${params.toString()}`;
    }
  };

  const handleDepositSuccess = (paymentIntentId?: string) => {
    const params = new URLSearchParams({
      type: "rental",
      listing_id: listingId,
    });
    if (paymentIntentId) params.set("payment_intent", paymentIntentId);
    window.location.href = `/order/confirmation?${params.toString()}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Rent Item</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Order summary */}
          <div className="p-3 sm:p-4 rounded-xl bg-zinc-800 mb-4">
            <h3 className="font-semibold text-xs sm:text-sm mb-3 text-white line-clamp-2">{itemName}</h3>
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Rental fee ({periodLabel})</span>
                <span className="font-medium">
                  ${rentalPriceNum.toFixed(2)} CAD
                </span>
              </div>
              {selectedRate && (
                <div className="flex justify-between text-gray-300">
                  <span className="flex items-center gap-1">
                    <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Outbound shipping
                  </span>
                  <span>${shippingCost.toFixed(2)} CAD</span>
                </div>
              )}
              {sellerAddress && (
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Return shipping</span>
                  <span className="text-green-400">Provided by seller</span>
                </div>
              )}
              {depositAmount && depositAmount > 0 && (
                <div className="flex justify-between text-gray-300">
                  <span>Security deposit (hold)</span>
                  <span className="font-medium text-amber-400">
                    ${Number(depositAmount).toFixed(2)} CAD
                  </span>
                </div>
              )}
              {platformFee > 0 && (
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Platform fee (included in rental)</span>
                  <span>${(platformFee / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-1.5 border-t border-zinc-700 text-gray-300">
                <span>Charged now</span>
                <span className="text-amber-400">
                  ${(rentalPriceNum + shippingCost).toFixed(2)} CAD
                </span>
              </div>
            </div>
          </div>

          {/* Security deposit explanation */}
          {depositAmount && depositAmount > 0 && step !== "shipping" && (
            <div className="p-4 rounded-xl bg-amber-900/30 border border-amber-700 mb-4">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-300 mb-1">
                    Security Deposit Hold
                  </p>
                  <p className="text-amber-200/70 text-xs leading-relaxed">
                    Your card will be charged{" "}
                    <strong>${(rentalPriceNum + shippingCost).toFixed(2)}</strong> for the
                    rental + shipping. A separate hold of{" "}
                    <strong>${Number(depositAmount).toFixed(2)}</strong> will be
                    placed as a security deposit — this is{" "}
                    <strong>released when you return the item</strong>. A prepaid
                    return label will be included in your package.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Shipping step */}
          {step === "shipping" && sellerAddress && (
            <ShippingAddressForm
              sellerAddress={sellerAddress}
              onRateSelected={handleRateSelected}
              onBack={onClose}
            />
          )}

          {loading && step !== "shipping" && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-900/50 border border-red-500 text-red-300 text-sm mb-4">
              {error}
            </div>
          )}

          {/* Review & acknowledge */}
          {!loading && !error && step === "review" && (
            <div className="space-y-4">
              {depositAmount && depositAmount > 0 && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-600 text-orange-600 focus:ring-orange-500 bg-zinc-800"
                  />
                  <span className="text-sm text-gray-300">
                    I understand that a{" "}
                    <strong>${Number(depositAmount).toFixed(2)} CAD</strong> hold
                    will be placed on my card as a security deposit, in addition
                    to the rental + shipping charge.
                  </span>
                </label>
              )}
              <button
                onClick={() => setStep("rental_payment")}
                disabled={depositAmount && depositAmount > 0 ? !acknowledged : false}
                className="w-full py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition disabled:opacity-50"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {/* Pay rental fee */}
          {step === "rental_payment" && rentalClientSecret && (
            <div>
              <p className="text-sm font-medium text-gray-300 mb-3">
                Step 1: Pay Rental Fee + Shipping ($
                {(rentalAmountCents / 100).toFixed(2)} CAD)
              </p>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: rentalClientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#ea580c",
                      borderRadius: "12px",
                    },
                  },
                }}
              >
                <CheckoutForm
                  onSuccess={handleRentalSuccess}
                  onCancel={onClose}
                  type="rental"
                  listingId={listingId}
                />
              </Elements>
            </div>
          )}

          {/* Authorize security deposit */}
          {step === "deposit_payment" && depositClientSecret && (
            <div>
              <div className="p-3 rounded-lg bg-green-900/50 border border-green-500 text-green-300 text-sm mb-4">
                Rental fee paid successfully!
              </div>
              <p className="text-sm font-medium text-gray-300 mb-3">
                Step 2: Authorize Security Deposit Hold ($
                {(depositAmountCents / 100).toFixed(2)} CAD)
              </p>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: depositClientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#d97706",
                      borderRadius: "12px",
                    },
                  },
                }}
              >
                <CheckoutForm
                  onSuccess={handleDepositSuccess}
                  onCancel={onClose}
                  type="rental"
                  listingId={listingId}
                />
              </Elements>
            </div>
          )}

          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4" />
            Payments secured by Stripe. Your card details are never stored on our
            servers.
          </div>
        </div>
      </div>
    </div>
  );
}
