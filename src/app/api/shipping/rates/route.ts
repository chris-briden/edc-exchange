import { NextRequest, NextResponse } from "next/server";
import { getShippo } from "@/lib/shippo";
import {
  applyShippingMarkup,
  getShippingRevenue,
  SHIPPING_MARKUP_RATE,
  DEFAULT_PARCEL,
  DEFAULT_CURRENCY,
} from "@/lib/marketplace-config";

/**
 * POST /api/shipping/rates
 *
 * Fetches shipping rates from Shippo, applies our markup, and returns
 * buyer-facing prices. Used at checkout to show shipping options.
 *
 * Body:
 * {
 *   addressFrom: { name, street1, city, state, zip, country },
 *   addressTo:   { name, street1, city, state, zip, country },
 *   parcel?:     { length, width, height, weight, distance_unit, mass_unit },
 *   currency?:   string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { addressFrom, addressTo, parcel, currency } = body;

    if (!addressFrom || !addressTo) {
      return NextResponse.json(
        { error: "addressFrom and addressTo are required" },
        { status: 400 }
      );
    }

    const shippo = getShippo();

    // Create a shipment to get rates
    const shipment = await shippo.shipments.create({
      addressFrom: {
        name: addressFrom.name,
        street1: addressFrom.street1,
        street2: addressFrom.street2 || "",
        city: addressFrom.city,
        state: addressFrom.state,
        zip: addressFrom.zip,
        country: addressFrom.country || "CA",
        email: addressFrom.email || "",
        phone: addressFrom.phone || "",
      },
      addressTo: {
        name: addressTo.name,
        street1: addressTo.street1,
        street2: addressTo.street2 || "",
        city: addressTo.city,
        state: addressTo.state,
        zip: addressTo.zip,
        country: addressTo.country || "CA",
        email: addressTo.email || "",
        phone: addressTo.phone || "",
      },
      parcels: [
        {
          length: String(parcel?.length || DEFAULT_PARCEL.length),
          width: String(parcel?.width || DEFAULT_PARCEL.width),
          height: String(parcel?.height || DEFAULT_PARCEL.height),
          weight: String(parcel?.weight || DEFAULT_PARCEL.weight),
          distanceUnit: (parcel?.distance_unit || DEFAULT_PARCEL.distance_unit) as "in",
          massUnit: (parcel?.mass_unit || DEFAULT_PARCEL.mass_unit) as "lb",
        },
      ],
      async: false,
    });

    // Transform rates with our markup applied
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rates = (shipment.rates || []).map((rate: any) => {
      const carrierRate = parseFloat(rate.amount);
      const buyerRate = applyShippingMarkup(carrierRate);
      const revenue = getShippingRevenue(carrierRate);

      return {
        // What the buyer sees
        rateId: rate.objectId,
        carrier: rate.provider,
        serviceName: rate.servicelevel?.name || rate.servicelevel?.token || "Standard",
        serviceToken: rate.servicelevel?.token || "",
        buyerPrice: buyerRate,
        currency: rate.currency || currency || DEFAULT_CURRENCY,
        estimatedDays: rate.estimatedDays || null,

        // Internal (don't expose to frontend in production)
        _internal: {
          carrierRate,
          revenue,
          markupRate: SHIPPING_MARKUP_RATE,
          shippoShipmentId: shipment.objectId,
        },
      };
    });

    // Sort by buyer price ascending
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rates.sort((a: any, b: any) => a.buyerPrice - b.buyerPrice);

    return NextResponse.json({
      rates,
      shipmentId: shipment.objectId,
    });
  } catch (error: unknown) {
    console.error("Shipping rates error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch shipping rates";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
