"use client";

import { useState } from "react";
import { Loader2, Truck, MapPin, ChevronRight } from "lucide-react";
import type { ShippingAddress, ShippingRate } from "@/lib/types";

type Props = {
  sellerAddress: ShippingAddress;
  onRateSelected: (rate: ShippingRate, buyerAddress: ShippingAddress) => void;
  onBack?: () => void;
  currency?: string;
};

const PROVINCES_STATES = [
  // Canadian provinces
  { code: "AB", label: "Alberta", country: "CA" },
  { code: "BC", label: "British Columbia", country: "CA" },
  { code: "MB", label: "Manitoba", country: "CA" },
  { code: "NB", label: "New Brunswick", country: "CA" },
  { code: "NL", label: "Newfoundland & Labrador", country: "CA" },
  { code: "NS", label: "Nova Scotia", country: "CA" },
  { code: "NT", label: "Northwest Territories", country: "CA" },
  { code: "NU", label: "Nunavut", country: "CA" },
  { code: "ON", label: "Ontario", country: "CA" },
  { code: "PE", label: "Prince Edward Island", country: "CA" },
  { code: "QC", label: "Quebec", country: "CA" },
  { code: "SK", label: "Saskatchewan", country: "CA" },
  { code: "YT", label: "Yukon", country: "CA" },
  // US states (common ones for cross-border)
  { code: "AL", label: "Alabama", country: "US" },
  { code: "AK", label: "Alaska", country: "US" },
  { code: "AZ", label: "Arizona", country: "US" },
  { code: "AR", label: "Arkansas", country: "US" },
  { code: "CA", label: "California", country: "US" },
  { code: "CO", label: "Colorado", country: "US" },
  { code: "CT", label: "Connecticut", country: "US" },
  { code: "DE", label: "Delaware", country: "US" },
  { code: "FL", label: "Florida", country: "US" },
  { code: "GA", label: "Georgia", country: "US" },
  { code: "HI", label: "Hawaii", country: "US" },
  { code: "ID", label: "Idaho", country: "US" },
  { code: "IL", label: "Illinois", country: "US" },
  { code: "IN", label: "Indiana", country: "US" },
  { code: "IA", label: "Iowa", country: "US" },
  { code: "KS", label: "Kansas", country: "US" },
  { code: "KY", label: "Kentucky", country: "US" },
  { code: "LA", label: "Louisiana", country: "US" },
  { code: "ME", label: "Maine", country: "US" },
  { code: "MD", label: "Maryland", country: "US" },
  { code: "MA", label: "Massachusetts", country: "US" },
  { code: "MI", label: "Michigan", country: "US" },
  { code: "MN", label: "Minnesota", country: "US" },
  { code: "MS", label: "Mississippi", country: "US" },
  { code: "MO", label: "Missouri", country: "US" },
  { code: "MT", label: "Montana", country: "US" },
  { code: "NE", label: "Nebraska", country: "US" },
  { code: "NV", label: "Nevada", country: "US" },
  { code: "NH", label: "New Hampshire", country: "US" },
  { code: "NJ", label: "New Jersey", country: "US" },
  { code: "NM", label: "New Mexico", country: "US" },
  { code: "NY", label: "New York", country: "US" },
  { code: "NC", label: "North Carolina", country: "US" },
  { code: "ND", label: "North Dakota", country: "US" },
  { code: "OH", label: "Ohio", country: "US" },
  { code: "OK", label: "Oklahoma", country: "US" },
  { code: "OR", label: "Oregon", country: "US" },
  { code: "PA", label: "Pennsylvania", country: "US" },
  { code: "RI", label: "Rhode Island", country: "US" },
  { code: "SC", label: "South Carolina", country: "US" },
  { code: "SD", label: "South Dakota", country: "US" },
  { code: "TN", label: "Tennessee", country: "US" },
  { code: "TX", label: "Texas", country: "US" },
  { code: "UT", label: "Utah", country: "US" },
  { code: "VT", label: "Vermont", country: "US" },
  { code: "VA", label: "Virginia", country: "US" },
  { code: "WA", label: "Washington", country: "US" },
  { code: "WV", label: "West Virginia", country: "US" },
  { code: "WI", label: "Wisconsin", country: "US" },
  { code: "WY", label: "Wyoming", country: "US" },
  { code: "DC", label: "District of Columbia", country: "US" },
];

export default function ShippingAddressForm({
  sellerAddress,
  onRateSelected,
  onBack,
  currency = "CAD",
}: Props) {
  const [address, setAddress] = useState<ShippingAddress>({
    name: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    country: "CA",
  });

  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [step, setStep] = useState<"address" | "rates">("address");

  const filteredRegions = PROVINCES_STATES.filter(
    (r) => r.country === address.country
  );

  const handleFetchRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingRates(true);
    setRatesError(null);

    try {
      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressFrom: sellerAddress,
          addressTo: address,
          currency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRatesError(data.error || "Failed to fetch shipping rates");
        setLoadingRates(false);
        return;
      }

      if (!data.rates || data.rates.length === 0) {
        setRatesError(
          "No shipping options available for this address. Please double-check your address and try again."
        );
        setLoadingRates(false);
        return;
      }

      setRates(data.rates);
      setStep("rates");
    } catch {
      setRatesError("Failed to fetch shipping rates. Please try again.");
    } finally {
      setLoadingRates(false);
    }
  };

  const handleConfirmRate = () => {
    if (selectedRate) {
      onRateSelected(selectedRate, address);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition";

  if (step === "rates") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setStep("address")}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            &larr; Change address
          </button>
        </div>

        <div className="p-3 rounded-lg bg-zinc-800/50 text-sm text-gray-300">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-medium">Shipping to:</span>
          </div>
          <p className="text-gray-400 ml-5.5">
            {address.name}, {address.street1}
            {address.street2 ? `, ${address.street2}` : ""},{" "}
            {address.city}, {address.state} {address.zip},{" "}
            {address.country}
          </p>
        </div>

        <h3 className="text-sm font-semibold text-gray-300">
          Select a shipping option:
        </h3>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {rates.map((rate) => (
            <button
              key={rate.rateId}
              onClick={() => setSelectedRate(rate)}
              className={`w-full text-left p-3 rounded-lg border transition ${
                selectedRate?.rateId === rate.rateId
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {rate.carrier} — {rate.serviceName}
                  </p>
                  {rate.estimatedDays && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Est. {rate.estimatedDays} business{" "}
                      {rate.estimatedDays === 1 ? "day" : "days"}
                    </p>
                  )}
                </div>
                <span className="text-sm font-bold text-green-400">
                  ${rate.buyerPrice.toFixed(2)} {currency}
                </span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirmRate}
          disabled={!selectedRate}
          className="w-full py-3 rounded-xl bg-orange-700 text-white font-semibold hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          Continue with {selectedRate ? `$${selectedRate.buyerPrice.toFixed(2)}` : ""} shipping
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleFetchRates} className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
        <MapPin className="w-4 h-4" /> Shipping Address
      </h3>

      <input
        type="text"
        placeholder="Full name"
        value={address.name}
        onChange={(e) => setAddress({ ...address, name: e.target.value })}
        required
        className={inputClass}
      />

      <input
        type="text"
        placeholder="Street address"
        value={address.street1}
        onChange={(e) => setAddress({ ...address, street1: e.target.value })}
        required
        className={inputClass}
      />

      <input
        type="text"
        placeholder="Apt, suite, unit (optional)"
        value={address.street2 || ""}
        onChange={(e) => setAddress({ ...address, street2: e.target.value })}
        className={inputClass}
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          required
          className={inputClass}
        />
        <select
          value={address.country}
          onChange={(e) =>
            setAddress({ ...address, country: e.target.value, state: "" })
          }
          className={inputClass}
        >
          <option value="CA">Canada</option>
          <option value="US">United States</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <select
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
          required
          className={inputClass}
        >
          <option value="">
            {address.country === "CA" ? "Province" : "State"}
          </option>
          {filteredRegions.map((r) => (
            <option key={r.code} value={r.code}>
              {r.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder={address.country === "CA" ? "Postal code" : "ZIP code"}
          value={address.zip}
          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
          required
          className={inputClass}
        />
      </div>

      {ratesError && (
        <div className="p-3 rounded-lg bg-red-900/50 border border-red-500 text-red-300 text-sm">
          {ratesError}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loadingRates}
          className="flex-1 py-3 rounded-xl bg-orange-700 text-white font-semibold hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loadingRates ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          {loadingRates ? "Getting rates..." : "Get Shipping Options"}
        </button>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-3 rounded-xl border border-zinc-700 text-gray-300 hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
