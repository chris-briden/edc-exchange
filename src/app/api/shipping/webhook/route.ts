import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";
import { RENTAL_RETURN_GRACE_DAYS } from "@/lib/marketplace-config";

// Admin Supabase client
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * POST /api/shipping/webhook
 *
 * Receives tracking updates from Shippo webhooks.
 *
 * Key flows:
 * - Sale delivery: Update status to "delivered"
 * - Rental outbound delivery: Update status, start return window
 * - Rental return delivery: Update status, RELEASE deposit via Stripe
 *
 * Shippo webhook payload (track_updated event):
 * {
 *   event: "track_updated",
 *   data: {
 *     tracking_number: string,
 *     tracking_status: {
 *       status: "TRANSIT" | "DELIVERED" | "FAILURE" | "RETURNED" | "UNKNOWN",
 *       status_details: string,
 *       status_date: string,
 *       location: { city, state, zip, country }
 *     },
 *     tracking_history: [...],
 *     carrier: string,
 *     ...
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate this is a tracking update
    if (body.event !== "track_updated") {
      return NextResponse.json({ received: true });
    }

    const trackingData = body.data;
    const trackingNumber = trackingData?.tracking_number;
    const trackingStatus = trackingData?.tracking_status?.status;

    if (!trackingNumber || !trackingStatus) {
      return NextResponse.json({ received: true });
    }

    const supabase = getSupabaseAdmin();

    // Look up the shipment by tracking number
    const { data: shipment } = await supabase
      .from("shipments")
      .select("*")
      .eq("tracking_number", trackingNumber)
      .single();

    if (!shipment) {
      console.log(`Webhook: No shipment found for tracking ${trackingNumber}`);
      return NextResponse.json({ received: true });
    }

    // Map Shippo status to our status
    let newStatus: string | null = null;

    switch (trackingStatus) {
      case "TRANSIT":
        newStatus = "in_transit";
        break;
      case "DELIVERED":
        newStatus = "delivered";
        break;
      case "RETURNED":
        newStatus = "returned";
        break;
      case "FAILURE":
        newStatus = "failed";
        break;
      default:
        // UNKNOWN or other — no status change
        break;
    }

    if (!newStatus) {
      return NextResponse.json({ received: true });
    }

    // Update shipment status
    const updateFields: Record<string, unknown> = { status: newStatus };

    if (newStatus === "in_transit" && !shipment.shipped_at) {
      updateFields.shipped_at = new Date().toISOString();
    }

    if (newStatus === "delivered" || newStatus === "returned") {
      updateFields.delivered_at = new Date().toISOString();
    }

    await supabase
      .from("shipments")
      .update(updateFields)
      .eq("id", shipment.id);

    // -----------------------------------------------------------------------
    // RENTAL RETURN DELIVERED → Release deposit
    // -----------------------------------------------------------------------
    if (
      newStatus === "delivered" &&
      shipment.transaction_type === "rental_return"
    ) {
      await handleRentalReturnDelivered(shipment, supabase);
    }

    // -----------------------------------------------------------------------
    // SALE / RENTAL OUTBOUND DELIVERED → Notify parties
    // -----------------------------------------------------------------------
    if (
      newStatus === "delivered" &&
      (shipment.transaction_type === "sale" ||
        shipment.transaction_type === "rental_outbound")
    ) {
      // TODO: Send delivery notification email to buyer
      // TODO: For rentals, log the return deadline
      console.log(
        `Shipment ${shipment.id} delivered. Type: ${shipment.transaction_type}`
      );
    }

    return NextResponse.json({ received: true, status: newStatus });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    // Always return 200 to Shippo so they don't retry endlessly
    return NextResponse.json({ received: true, error: "Processing failed" });
  }
}

/**
 * When a rental return is delivered back to the seller,
 * release the deposit hold on the renter's card.
 */
async function handleRentalReturnDelivered(
  shipment: Record<string, unknown>,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  const rentalId = shipment.rental_id as string | null;

  if (!rentalId) {
    console.log("Return delivered but no rental_id — skipping deposit release");
    return;
  }

  // Look up the rental to get the Stripe PaymentIntent ID
  // TODO: This will query the rentals table once it exists
  // For now, log the event for manual processing
  console.log(
    `RENTAL RETURN DELIVERED — rental_id: ${rentalId}. ` +
      `Release deposit hold. Grace period: ${RENTAL_RETURN_GRACE_DAYS} days.`
  );

  // When the rentals table exists, the flow will be:
  //
  // 1. Look up rental record to get stripe_payment_intent_id
  // 2. Cancel the uncaptured PaymentIntent (releases the hold):
  //
  //    const stripe = getStripe();
  //    await stripe.paymentIntents.cancel(paymentIntentId);
  //
  // 3. Update rental status to "completed"
  // 4. Send confirmation email to both parties
}

/**
 * Cron job helper: Capture deposits for overdue rentals.
 * Call this from a scheduled function (e.g., Vercel Cron).
 *
 * Logic:
 * - Find rentals where return deadline + grace period has passed
 * - Check if return shipment status is NOT "delivered"
 * - Capture the Stripe PaymentIntent (takes the deposit)
 */
export async function captureOverdueDeposits() {
  const supabase = getSupabaseAdmin();
  const stripe = getStripe();

  // Find rental_outbound shipments that are past due
  // A rental is overdue if:
  // 1. The outbound was delivered
  // 2. The return shipment status is NOT "delivered"
  // 3. The delivered_at + rental_duration + grace_period < now()

  // TODO: Implement once rentals table exists with:
  // - rental_end_date
  // - stripe_payment_intent_id
  // - deposit_captured boolean

  console.log("captureOverdueDeposits: Not yet implemented — awaiting rentals table");
}
