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

    if (listing.listing_type !== "rent") {
      return NextResponse.json(
        { error: "This listing is not for rent" },
        { status: 400 }
      );
    }

    if (!listing.rent_price) {
      return NextResponse.json(
        { error: "Listing has no rental price set" },
        { status: 400 }
      );
    }

    if (listing.user_id === user.id) {
      return NextResponse.json(
        { error: "You cannot rent your own listing" },
        { status: 400 }
      );
    }

    const sellerStripeAccountId = listing.profiles?.stripe_account_id;
    if (!sellerStripeAccountId) {
      return NextResponse.json(
        { error: "Lender has not connected their Stripe account" },
        { status: 400 }
      );
    }

    // Parse rental fee — rent_price is stored as a string like "40" or "$40"
    const rentalFeeNum = parseFloat(
      String(listing.rent_price).replace(/[^0-9.]/g, "")
    );
    if (isNaN(rentalFeeNum) || rentalFeeNum <= 0) {
      return NextResponse.json(
        { error: "Invalid rental price" },
        { status: 400 }
      );
    }

    const rentalFeeInCents = dollarsToCents(rentalFeeNum);
    const platformFee = calculatePlatformFee(rentalFeeInCents);
    const depositAmount = listing.rental_deposit
      ? dollarsToCents(Number(listing.rental_deposit))
      : 0;

    // 1. Create PaymentIntent for the rental fee (captured immediately)
    const rentalPayment = await stripe.paymentIntents.create({
      amount: rentalFeeInCents,
      currency: "cad",
      transfer_data: {
        destination: sellerStripeAccountId,
      },
      application_fee_amount: platformFee,
      metadata: {
        listing_id: listing.id,
        buyer_id: user.id,
        seller_id: listing.user_id,
        type: "rental",
      },
    });

    // 2. Create PaymentIntent for security deposit (manual capture — hold only)
    let securityDeposit = null;
    if (depositAmount > 0) {
      securityDeposit = await stripe.paymentIntents.create({
        amount: depositAmount,
        currency: "cad",
        capture_method: "manual",
        transfer_data: {
          destination: sellerStripeAccountId,
        },
        metadata: {
          type: "security_deposit",
          listing_id: listing.id,
          buyer_id: user.id,
          seller_id: listing.user_id,
          rental_payment_intent_id: rentalPayment.id,
        },
      });

      // Link security deposit to rental payment metadata
      await stripe.paymentIntents.update(rentalPayment.id, {
        metadata: {
          ...rentalPayment.metadata,
          security_deposit_pi: securityDeposit.id,
        },
      });
    }

    return NextResponse.json({
      rental_client_secret: rentalPayment.client_secret,
      rental_payment_intent_id: rentalPayment.id,
      deposit_client_secret: securityDeposit?.client_secret || null,
      deposit_payment_intent_id: securityDeposit?.id || null,
      rental_amount: rentalFeeInCents,
      deposit_amount: depositAmount,
      platform_fee: platformFee,
    });
  } catch (error) {
    console.error("Rental payment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create rental payment" },
      { status: 500 }
    );
  }
}
