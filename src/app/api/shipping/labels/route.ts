import { NextRequest, NextResponse } from "next/server";
import { getShippo } from "@/lib/shippo";
import { createClient } from "@supabase/supabase-js";
import {
  applyShippingMarkup,
  getShippingRevenue,
  SHIPPING_MARKUP_RATE,
  DEFAULT_CURRENCY,
} from "@/lib/marketplace-config";

// Admin Supabase client for server-side operations
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * POST /api/shipping/labels
 *
 * Purchases a shipping label from Shippo and records it in our DB.
 *
 * Supports three transaction types:
 *
 * 1. "sale" — Standard sale
 *    - Buyer pays for shipping (outbound label only)
 *
 * 2. "rental_outbound" — Rental or Try Before You Buy
 *    - Renter pays for outbound shipping
 *    - A return label is also generated (paid by seller)
 *    - Return label is included in the package
 *    - If renter decides to keep (Try Before You Buy), return label is voided
 *
 * 3. "rental_return" — Standalone return label (if not pre-generated)
 *    - Seller pays for return shipping
 *
 * Body:
 * {
 *   transactionType: "sale" | "rental_outbound" | "rental_return",
 *   rateId: string,             // Shippo rate object ID (from /rates response)
 *   shipmentId: string,         // Shippo shipment object ID
 *   carrierRate: number,        // The raw carrier rate (from _internal)
 *   sellerId: string,
 *   buyerId: string,
 *   listingId?: string,
 *   orderId?: string,
 *   rentalId?: string,
 *   addressFrom: object,        // Seller's address
 *   addressTo: object,          // Buyer's address
 *   parcel: object,
 *   generateReturnLabel?: boolean,  // For rentals: also generate a return label
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      transactionType,
      rateId,
      shipmentId,
      carrierRate,
      sellerId,
      buyerId,
      listingId,
      orderId,
      rentalId,
      addressFrom,
      addressTo,
      parcel,
      generateReturnLabel = false,
    } = body;

    // Validate required fields
    if (!transactionType || !rateId || !carrierRate) {
      return NextResponse.json(
        { error: "transactionType, rateId, and carrierRate are required" },
        { status: 400 }
      );
    }

    const validTypes = ["sale", "rental_outbound", "rental_return"];
    if (!validTypes.includes(transactionType)) {
      return NextResponse.json(
        { error: `transactionType must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const shippo = getShippo();
    const supabase = getSupabaseAdmin();

    // ---------------------------------------------------------------------------
    // 1. Purchase the outbound label from Shippo
    // ---------------------------------------------------------------------------
    const transaction = await shippo.transactions.create({
      rate: rateId,
      async: false,
      labelFileType: "PDF" as "PDF",
    });

    if (transaction.status !== "SUCCESS") {
      return NextResponse.json(
        {
          error: "Failed to create shipping label",
          details: transaction.messages,
        },
        { status: 500 }
      );
    }

    // Calculate pricing
    const buyerRate = applyShippingMarkup(carrierRate);
    const revenue = getShippingRevenue(carrierRate);

    // Determine who pays
    let paidBy: "buyer" | "seller" | "platform";
    if (transactionType === "sale" || transactionType === "rental_outbound") {
      paidBy = "buyer"; // Renter/buyer pays outbound shipping
    } else {
      paidBy = "seller"; // Seller pays return shipping on rentals
    }

    // ---------------------------------------------------------------------------
    // 2. Record outbound shipment in our database
    // ---------------------------------------------------------------------------
    const { data: outboundShipment, error: dbError } = await supabase
      .from("shipments")
      .insert({
        transaction_type: transactionType,
        listing_id: listingId || null,
        order_id: orderId || null,
        rental_id: rentalId || null,
        seller_id: sellerId || null,
        buyer_id: buyerId || null,
        shippo_shipment_id: shipmentId,
        shippo_rate_id: rateId,
        shippo_transaction_id: transaction.objectId,
        tracking_number: transaction.trackingNumber || null,
        tracking_url: transaction.trackingUrlProvider || null,
        label_url: transaction.labelUrl || null,
        address_from: addressFrom,
        address_to: addressTo,
        parcel: parcel,
        carrier_rate: carrierRate,
        buyer_rate: buyerRate,
        shipping_revenue: revenue,
        markup_rate: SHIPPING_MARKUP_RATE,
        currency: DEFAULT_CURRENCY,
        paid_by: paidBy,
        carrier: (typeof transaction.rate === 'object' ? transaction.rate?.provider : null) || null,
        service_level: (typeof transaction.rate === 'object' ? transaction.rate?.servicelevelToken : null) || null,
        estimated_days: null,
        status: "label_created",
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to record shipment" },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------------------------
    // 3. For rentals: generate return label (seller pays)
    // ---------------------------------------------------------------------------
    let returnShipment = null;

    if (
      (transactionType === "rental_outbound" && generateReturnLabel) ||
      transactionType === "rental_return"
    ) {
      // Create return shipment (swap from/to addresses)
      const returnShippoShipment = await shippo.shipments.create({
        addressFrom: {
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
        addressTo: {
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
        parcels: [
          {
            length: String(parcel.length),
            width: String(parcel.width),
            height: String(parcel.height),
            weight: String(parcel.weight),
            distanceUnit: parcel.distance_unit || "in",
            massUnit: parcel.mass_unit || "lb",
          },
        ],
        extra: {
          isReturn: true,
        },
        async: false,
      });

      // Pick the cheapest return rate
      const returnRates = returnShippoShipment.rates || [];
      if (returnRates.length === 0) {
        console.error("No return rates available");
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cheapestReturn = returnRates.reduce((min: any, rate: any) =>
          parseFloat(rate.amount) < parseFloat(min.amount) ? rate : min
        );

        const returnCarrierRate = parseFloat(cheapestReturn.amount);

        // Purchase return label
        const returnTransaction = await shippo.transactions.create({
          rate: cheapestReturn.objectId!,
          async: false,
          labelFileType: "PDF" as "PDF",
        });

        if (returnTransaction.status === "SUCCESS") {
          // Record return shipment — seller pays, but we still take our markup
          const returnBuyerRate = applyShippingMarkup(returnCarrierRate);
          const returnRevenue = getShippingRevenue(returnCarrierRate);

          const { data: returnData } = await supabase
            .from("shipments")
            .insert({
              transaction_type: "rental_return",
              listing_id: listingId || null,
              order_id: orderId || null,
              rental_id: rentalId || null,
              seller_id: sellerId || null,
              buyer_id: buyerId || null,
              shippo_shipment_id: returnShippoShipment.objectId,
              shippo_rate_id: cheapestReturn.objectId,
              shippo_transaction_id: returnTransaction.objectId,
              tracking_number: returnTransaction.trackingNumber || null,
              tracking_url: returnTransaction.trackingUrlProvider || null,
              label_url: returnTransaction.labelUrl || null,
              address_from: addressTo, // Return: buyer → seller
              address_to: addressFrom,
              parcel: parcel,
              carrier_rate: returnCarrierRate,
              buyer_rate: returnBuyerRate,
              shipping_revenue: returnRevenue,
              markup_rate: SHIPPING_MARKUP_RATE,
              currency: DEFAULT_CURRENCY,
              paid_by: "seller", // Seller pays for return label
              carrier: (typeof returnTransaction.rate === 'object' ? returnTransaction.rate?.provider : null) || null,
              service_level: (typeof returnTransaction.rate === 'object' ? returnTransaction.rate?.servicelevelToken : null) || null,
              estimated_days: null,
              status: "label_created",
              return_shipment_id: null,
            })
            .select()
            .single();

          returnShipment = returnData;

          // Link outbound shipment to return shipment
          if (returnData) {
            await supabase
              .from("shipments")
              .update({ return_shipment_id: returnData.id })
              .eq("id", outboundShipment.id);
          }
        }
      }
    }

    // ---------------------------------------------------------------------------
    // 4. Return response
    // ---------------------------------------------------------------------------
    return NextResponse.json({
      success: true,
      outbound: {
        id: outboundShipment.id,
        trackingNumber: transaction.trackingNumber,
        trackingUrl: transaction.trackingUrlProvider,
        labelUrl: transaction.labelUrl,
        carrierRate,
        buyerRate,
        shippingRevenue: revenue,
        paidBy,
        status: "label_created",
      },
      return: returnShipment
        ? {
            id: returnShipment.id,
            trackingNumber: returnShipment.tracking_number,
            trackingUrl: returnShipment.tracking_url,
            labelUrl: returnShipment.label_url,
            carrierRate: returnShipment.carrier_rate,
            sellerCost: returnShipment.buyer_rate,
            shippingRevenue: returnShipment.shipping_revenue,
            paidBy: "seller",
            status: "label_created",
          }
        : null,
    });
  } catch (error: unknown) {
    console.error("Label creation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create label";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/shipping/labels
 *
 * Void a return label (e.g., when a Try Before You Buy renter decides to keep).
 * This cancels the unused return label so the seller isn't charged.
 *
 * Body:
 * {
 *   shipmentId: string  // Our DB shipment ID for the return label
 * }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { shipmentId } = body;

    if (!shipmentId) {
      return NextResponse.json(
        { error: "shipmentId is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Look up the return shipment
    const { data: shipment } = await supabase
      .from("shipments")
      .select("*")
      .eq("id", shipmentId)
      .single();

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 }
      );
    }

    if (shipment.transaction_type !== "rental_return") {
      return NextResponse.json(
        { error: "Can only void return labels" },
        { status: 400 }
      );
    }

    // Void the label with Shippo (refunds the label cost)
    if (shipment.shippo_transaction_id) {
      const shippo = getShippo();
      try {
        await shippo.refunds.create({
          transaction: shipment.shippo_transaction_id,
          async: false,
        });
      } catch (refundError) {
        console.error("Shippo refund error:", refundError);
        // Continue — still mark cancelled in our DB
      }
    }

    // Update our DB
    await supabase
      .from("shipments")
      .update({ status: "cancelled" })
      .eq("id", shipmentId);

    return NextResponse.json({
      success: true,
      message: "Return label voided. Renter is keeping the item.",
    });
  } catch (error: unknown) {
    console.error("Label void error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to void label";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
