import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { stripe, calculatePlatformFee, dollarsToCents } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listing_id, shipping_rate, buyer_address, seller_address } =
      await request.json();

    if (!listing_id) {
      return NextResponse.json(
        { error: "Missing listing_id" },
        { status: 400 }
      );
    }

    // Fetch the listing with seller profile
    const { data: listing, error: listingError } = await supabase
      .from("items")
      .select("*, profiles!items_user_id_fkey(stripe_account_id)")
      .eq("id", listing_id)
      .eq("status", "active")
      .single();

    if (listingError || !listing) {
      return NextResponse.json(
        { error: "Listing not found or no longer available" },
        { status: 404 }
      );
    }

    if (listing.listing_type !== "sell") {
      return NextResponse.json(
        { error: "This listing is not for sale" },
        { status: 400 }
      );
    }

    if (!listing.price) {
      return NextResponse.json(
        { error: "Listing has no price set" },
        { status: 400 }
      );
    }

    if (listing.user_id === user.id) {
      return NextResponse.json(
        { error: "You cannot buy your own listing" },
        { status: 400 }
      );
    }

    const sellerStripeAccountId = listing.profiles?.stripe_account_id;
    if (!sellerStripeAccountId) {
      return NextResponse.json(
        { error: "Seller has not connected their Stripe account" },
        { status: 400 }
      );
    }

    const itemAmountInCents = dollarsToCents(Number(listing.price));

    // Add shipping cost if a rate was selected
    const shippingAmountInCents = shipping_rate
      ? dollarsToCents(shipping_rate.buyerRate)
      : 0;

    const totalAmountInCents = itemAmountInCents + shippingAmountInCents;

    // Platform fee is on item price only (shipping revenue comes from markup)
    const platformFee = calculatePlatformFee(itemAmountInCents);

    // Build metadata — Stripe metadata values must be strings
    const metadata: Record<string, string> = {
      listing_id: listing.id,
      buyer_id: user.id,
      seller_id: listing.user_id,
      type: "sale",
    };

    // Store shipping info in metadata for the webhook to create labels
    if (shipping_rate) {
      metadata.shipping_rate_id = shipping_rate.rateId;
      metadata.shipping_carrier_rate = String(shipping_rate.carrierRate);
      metadata.shipping_buyer_rate = String(shipping_rate.buyerRate);
      metadata.shipping_shipment_id = shipping_rate.shipmentId;
      metadata.shipping_carrier = shipping_rate.carrier || "";
      metadata.shipping_service = shipping_rate.serviceName || "";
    }
    if (buyer_address) {
      metadata.buyer_address = JSON.stringify(buyer_address);
    }
    if (seller_address) {
      metadata.seller_address = JSON.stringify(seller_address);
    }

    // Create a PaymentIntent with destination charge
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountInCents,
      currency: "cad",
      transfer_data: {
        destination: sellerStripeAccountId,
      },
      application_fee_amount: platformFee,
      metadata,
    });

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: totalAmountInCents,
      platform_fee: platformFee,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
