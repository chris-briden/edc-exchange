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

    // Add outbound shipping cost (buyer pays)
    const shippingAmountInCents = shipping_rate
      ? dollarsToCents(shipping_rate.buyerRate)
      : 0;

    const totalRentalInCents = rentalFeeInCents + shippingAmountInCents;

    // Platform fee on rental fee only (not shipping)
    const platformFee = calculatePlatformFee(rentalFeeInCents);
    const depositAmount = listing.rental_deposit
      ? dollarsToCents(Number(listing.rental_deposit))
      : 0;

    // Build metadata
    const metadata: Record<string, string> = {
      listing_id: listing.id,
      buyer_id: user.id,
      seller_id: listing.user_id,
      type: "rental",
    };

    // Store shipping info for webhook to create labels
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

    // 1. Create PaymentIntent for the rental fee + shipping (captured immediately)
    const rentalPayment = await stripe.paymentIntents.create({
      amount: totalRentalInCents,
      currency: "cad",
      transfer_data: {
        destination: sellerStripeAccountId,
      },
      application_fee_amount: platformFee,
      metadata,
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
      rental_amount: totalRentalInCents,
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
