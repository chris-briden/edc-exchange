/**
 * Marketplace Configuration
 *
 * Central config for all marketplace business rules.
 * All rates are stored as decimals (e.g., 0.20 = 20%).
 *
 * To update rates, change the env vars or modify defaults here.
 * These values are designed to be easily adjustable as the
 * marketplace evolves and we learn what the market will bear.
 */

// ---------------------------------------------------------------------------
// Commission & Fees
// ---------------------------------------------------------------------------

/** Platform commission on sales (taken from seller proceeds) */
export const PLATFORM_COMMISSION_RATE = Number(
  process.env.PLATFORM_COMMISSION_RATE || "0.05" // 5% default
);

/** Shipping markup applied on top of carrier rates (our revenue) */
export const SHIPPING_MARKUP_RATE = Number(
  process.env.SHIPPING_MARKUP_RATE || "0.20" // 20% default
);

// ---------------------------------------------------------------------------
// Rental Settings
// ---------------------------------------------------------------------------

/** Grace period (in days) after rental end before deposit is captured */
export const RENTAL_RETURN_GRACE_DAYS = Number(
  process.env.RENTAL_RETURN_GRACE_DAYS || "3"
);

/** Maximum rental duration in days */
export const MAX_RENTAL_DURATION_DAYS = Number(
  process.env.MAX_RENTAL_DURATION_DAYS || "30"
);

// ---------------------------------------------------------------------------
// Shipping Defaults
// ---------------------------------------------------------------------------

/** Default package dimensions for EDC items (inches) */
export const DEFAULT_PARCEL = {
  length: Number(process.env.DEFAULT_PARCEL_LENGTH || "10"),
  width: Number(process.env.DEFAULT_PARCEL_WIDTH || "8"),
  height: Number(process.env.DEFAULT_PARCEL_HEIGHT || "4"),
  weight: Number(process.env.DEFAULT_PARCEL_WEIGHT || "1"), // lbs
  distance_unit: "in" as const,
  mass_unit: "lb" as const,
};

/** Platform return address (The Carry Exchange HQ — update with real address) */
export const PLATFORM_RETURN_ADDRESS = {
  name: process.env.PLATFORM_ADDRESS_NAME || "The Carry Exchange",
  street1: process.env.PLATFORM_ADDRESS_STREET || "",
  city: process.env.PLATFORM_ADDRESS_CITY || "",
  state: process.env.PLATFORM_ADDRESS_STATE || "",
  zip: process.env.PLATFORM_ADDRESS_ZIP || "",
  country: process.env.PLATFORM_ADDRESS_COUNTRY || "CA",
  email: process.env.PLATFORM_ADDRESS_EMAIL || "support@jointhecarry.com",
};

// ---------------------------------------------------------------------------
// Currency
// ---------------------------------------------------------------------------

/** Default currency for the marketplace */
export const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY || "CAD";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Apply shipping markup to a carrier rate.
 * Returns the buyer-facing price rounded to 2 decimal places.
 */
export function applyShippingMarkup(carrierRate: number): number {
  return Math.round(carrierRate * (1 + SHIPPING_MARKUP_RATE) * 100) / 100;
}

/**
 * Calculate our shipping revenue from a marked-up rate.
 */
export function getShippingRevenue(carrierRate: number): number {
  return Math.round(carrierRate * SHIPPING_MARKUP_RATE * 100) / 100;
}

/**
 * Calculate platform commission on a sale amount (in dollars).
 */
export function calculateCommission(saleAmount: number): number {
  return Math.round(saleAmount * PLATFORM_COMMISSION_RATE * 100) / 100;
}
