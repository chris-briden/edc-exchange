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
} from "lucide-react";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Inner form that uses Stripe hooks
function CheckoutForm({
  onSuccess,
  onCancel,
  type,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  type: "sale" | "rental";
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

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/profile?payment=${type === "sale" ? "success" : "rental_success"}`,
      },
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message || "Payment failed");
      setProcessing(false);
    } else {
      onSuccess();
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

// Buy Now payment form
export function BuyNowForm({
  listingId,
  itemName,
  price,
  onClose,
}: {
  listingId: string;
  itemName: string;
  price: number;
  onClose: () => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [platformFee, setPlatformFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPayment = async () => {
      try {
        const res = await fetch("/api/stripe/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listing_id: listingId }),
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

    createPayment();
  }, [listingId]);

  const handleSuccess = () => {
    toast.success("Payment successful! The seller has been notified.");
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-zinc-900 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
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
          <div className="p-4 rounded-xl bg-zinc-800 mb-6">
            <h3 className="font-semibold text-sm mb-3 text-white">{itemName}</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Item price</span>
                <span>${price.toFixed(2)} CAD</span>
              </div>
              {platformFee > 0 && (
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Platform fee (included)</span>
                  <span>${(platformFee / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-1.5 border-t border-zinc-700 text-gray-300">
                <span>Total</span>
                <span className="text-green-400">${price.toFixed(2)} CAD</span>
              </div>
            </div>
          </div>

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
              />
            </Elements>
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

// Rental payment form with deposit explanation
export function RentalPaymentForm({
  listingId,
  itemName,
  rentPrice,
  rentalPeriod,
  depositAmount,
  onClose,
}: {
  listingId: string;
  itemName: string;
  rentPrice: string;
  rentalPeriod: string | null;
  depositAmount: number | null;
  onClose: () => void;
}) {
  const [rentalClientSecret, setRentalClientSecret] = useState<string | null>(
    null
  );
  const [depositClientSecret, setDepositClientSecret] = useState<
    string | null
  >(null);
  const [rentalAmountCents, setRentalAmountCents] = useState(0);
  const [depositAmountCents, setDepositAmountCents] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"review" | "rental_payment" | "deposit_payment">("review");
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    const createRental = async () => {
      try {
        const res = await fetch("/api/stripe/rental", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listing_id: listingId }),
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

    createRental();
  }, [listingId]);

  const handleRentalSuccess = () => {
    if (depositClientSecret) {
      setStep("deposit_payment");
    } else {
      toast.success("Rental confirmed! The lender has been notified.");
      onClose();
      window.location.reload();
    }
  };

  const handleDepositSuccess = () => {
    toast.success(
      "Rental confirmed! Rental fee charged and security deposit hold placed."
    );
    onClose();
    window.location.reload();
  };

  const rentalPriceNum = parseFloat(
    String(rentPrice).replace(/[^0-9.]/g, "")
  );
  const periodLabel = rentalPeriod || "period";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Rent Item</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order summary */}
          <div className="p-4 rounded-xl bg-gray-50 mb-4">
            <h3 className="font-semibold text-sm mb-3">{itemName}</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Rental fee ({periodLabel})
                </span>
                <span className="font-medium">
                  ${rentalPriceNum.toFixed(2)} CAD
                </span>
              </div>
              {depositAmount && depositAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Security deposit (hold)</span>
                  <span className="font-medium text-amber-700">
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
              <div className="flex justify-between font-bold pt-1.5 border-t border-gray-200">
                <span>Charged now</span>
                <span className="text-amber-700">
                  ${rentalPriceNum.toFixed(2)} CAD
                </span>
              </div>
            </div>
          </div>

          {/* Security deposit explanation */}
          {depositAmount && depositAmount > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 mb-1">
                    Security Deposit Hold
                  </p>
                  <p className="text-amber-700 text-xs leading-relaxed">
                    Your card will be charged{" "}
                    <strong>${rentalPriceNum.toFixed(2)}</strong> for the rental
                    period. A separate hold of{" "}
                    <strong>${Number(depositAmount).toFixed(2)}</strong> will be
                    placed as a security deposit — this appears as
                    &quot;pending&quot; on your card and is{" "}
                    <strong>released when you return the item</strong>. If the
                    item is not returned or is damaged, the hold may be captured.
                  </p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
              {error}
            </div>
          )}

          {/* Step 1: Review & acknowledge */}
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
                    to the rental charge.
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

          {/* Step 2: Pay rental fee */}
          {step === "rental_payment" && rentalClientSecret && (
            <div>
              <p className="text-sm font-medium text-gray-300 mb-3">
                Step 1: Pay Rental Fee (${(rentalAmountCents / 100).toFixed(2)}{" "}
                CAD)
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
                />
              </Elements>
            </div>
          )}

          {/* Step 3: Authorize security deposit */}
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
