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

    const { transaction_id, amount_to_capture } = await request.json();

    if (!transaction_id) {
      return NextResponse.json(
        { error: "Missing transaction_id" },
        { status: 400 }
      );
    }

    // Fetch the transaction — only the seller can capture
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
        { error: "Only the lender can capture the security deposit" },
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

    // Capture the pre-authorized amount (full or partial)
    const captureParams: { amount_to_capture?: number } = {};
    if (amount_to_capture && amount_to_capture > 0) {
      captureParams.amount_to_capture = amount_to_capture;
    }

    await stripe.paymentIntents.capture(
      transaction.security_deposit_payment_intent_id,
      captureParams
    );

    // Update the transaction
    await supabase
      .from("transactions")
      .update({
        rental_status: "deposit_captured",
        rental_end_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", transaction_id);

    // Notify the renter
    const capturedAmount = amount_to_capture || "the full";
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: transaction.buyer_id,
      item_id: transaction.listing_id,
      content: `Your security deposit of $${typeof capturedAmount === "number" ? (capturedAmount / 100).toFixed(2) : capturedAmount} has been captured due to non-return or damage. Please contact the lender if you have questions.`,
      is_read: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Deposit capture error:", error);
    return NextResponse.json(
      { error: "Failed to capture security deposit" },
      { status: 500 }
    );
  }
}
