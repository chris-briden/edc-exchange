"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type StripeStatus = {
  connected: boolean;
  charges_enabled?: boolean;
  payouts_enabled?: boolean;
  details_submitted?: boolean;
};

export default function ConnectStripeButton() {
  const [status, setStatus] = useState<StripeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/stripe/connect");
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus({ connected: false });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to start Stripe onboarding");
        setConnecting(false);
      }
    } catch {
      toast.error("Failed to connect to Stripe");
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          <span className="text-sm text-gray-400">Checking Stripe status...</span>
        </div>
      </div>
    );
  }

  // Fully connected and active
  if (status?.connected && status?.charges_enabled && status?.payouts_enabled) {
    return (
      <div className="p-4 rounded-xl border border-green-500/50 bg-green-500/10">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-sm font-semibold text-green-300">
              Stripe Connected
            </p>
            <p className="text-xs text-green-400 mt-0.5">
              You can receive payments from sales and rentals
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Connected but onboarding incomplete
  if (status?.connected && !status?.charges_enabled) {
    return (
      <div className="p-4 rounded-xl border border-amber-500/50 bg-amber-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-amber-300">
                Stripe Setup Incomplete
              </p>
              <p className="text-xs text-amber-400 mt-0.5">
                Complete onboarding to start receiving payments
              </p>
            </div>
          </div>
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition disabled:opacity-50 flex items-center gap-1.5"
          >
            {connecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
            Complete Setup
          </button>
        </div>
      </div>
    );
  }

  // Not connected
  return (
    <div className="p-4 rounded-xl border border-zinc-800 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Connect Stripe to Sell & Rent
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Set up payouts to list items for sale or rent on The Carry Exchange
          </p>
        </div>
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="px-5 py-2.5 rounded-lg bg-[#635BFF] text-white text-sm font-semibold hover:bg-[#5851DB] transition disabled:opacity-50 flex items-center gap-2 shrink-0"
        >
          {connecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
            </svg>
          )}
          {connecting ? "Connecting..." : "Connect Stripe"}
        </button>
      </div>
    </div>
  );
}
