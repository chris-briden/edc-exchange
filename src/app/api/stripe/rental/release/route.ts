import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transaction_id } = await request.json();

    if (!transaction_id) {
      return NextResponse.json(
        { error: "Missing transaction_id" },
        { status: 400 }
      );
    }

    // Fetch the transaction — only the seller can release
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", transaction_id)
      .single();

    if (txError || !transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    if (transaction.seller_id !== user.id) {
      return NextResponse.json(
        { error: "Only the lender can release the security deposit" },
        { status: 403 }
      );
    }

    if (transaction.rental_status !== "active") {
      return NextResponse.json(
        { error: "This rental is not currently active" },
        { status: 400 }
      );
    }

    if (!transaction.security_deposit_payment_intent_id) {
      return NextResponse.json(
        { error: "No security deposit found for this rental" },
        { status: 400 }
      );
    }

    // Cancel the uncaptured PaymentIntent to release the hold
    await stripe.paymentIntents.cancel(
      transaction.security_deposit_payment_intent_id
    );

    // Update the transaction
    await supabase
      .from("transactions")
      .update({
        rental_status: "deposit_released",
        rental_end_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", transaction_id);

    // Notify the renter
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: transaction.buyer_id,
      item_id: transaction.listing_id,
      content:
        "Your security deposit hold has been released! The pending charge on your card will disappear shortly.",
      is_read: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Deposit release error:", error);
    return NextResponse.json(
      { error: "Failed to release security deposit" },
      { status: 500 }
    );
  }
}
