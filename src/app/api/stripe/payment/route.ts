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

    const { listing_id } = await request.json();

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

    const amountInCents = dollarsToCents(Number(listing.price));
    const platformFee = calculatePlatformFee(amountInCents);

    // Create a PaymentIntent with destination charge
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "cad",
      transfer_data: {
        destination: sellerStripeAccountId,
      },
      application_fee_amount: platformFee,
      metadata: {
        listing_id: listing.id,
        buyer_id: user.id,
        seller_id: listing.user_id,
        type: "sale",
      },
    });

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: amountInCents,
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
