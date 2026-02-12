import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";
import Stripe from "stripe";

// Use service role key for webhook operations (bypasses RLS)
function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const metadata = paymentIntent.metadata;

        // Skip security deposit completions (they are manual capture)
        if (metadata.type === "security_deposit") {
          break;
        }

        if (metadata.type === "sale") {
          // Create transaction record
          await supabase.from("transactions").insert({
            listing_id: metadata.listing_id,
            buyer_id: metadata.buyer_id,
            seller_id: metadata.seller_id,
            amount: paymentIntent.amount,
            platform_fee: paymentIntent.application_fee_amount || 0,
            stripe_payment_intent_id: paymentIntent.id,
            type: "sale",
            status: "completed",
          });

          // Mark listing as sold
          await supabase
            .from("items")
            .update({ status: "sold" })
            .eq("id", metadata.listing_id);

          // Create notification for seller
          await supabase.from("messages").insert({
            sender_id: metadata.buyer_id,
            receiver_id: metadata.seller_id,
            item_id: metadata.listing_id,
            content: `Your item has been sold! Payment of $${(paymentIntent.amount / 100).toFixed(2)} CAD has been processed. Please arrange shipping.`,
            is_read: false,
          });
        }

        if (metadata.type === "rental") {
          // Create/update rental transaction
          await supabase.from("transactions").insert({
            listing_id: metadata.listing_id,
            buyer_id: metadata.buyer_id,
            seller_id: metadata.seller_id,
            amount: paymentIntent.amount,
            platform_fee: paymentIntent.application_fee_amount || 0,
            stripe_payment_intent_id: paymentIntent.id,
            security_deposit_payment_intent_id:
              metadata.security_deposit_pi || null,
            type: "rental",
            status: "completed",
            rental_status: "active",
            rental_start_date: new Date().toISOString(),
          });

          // Notify the seller/lender
          await supabase.from("messages").insert({
            sender_id: metadata.buyer_id,
            receiver_id: metadata.seller_id,
            item_id: metadata.listing_id,
            content: `Your item has been rented! Rental fee of $${(paymentIntent.amount / 100).toFixed(2)} CAD has been paid. A security deposit hold has also been placed. Please arrange handoff.`,
            is_read: false,
          });
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(
          "Payment failed:",
          paymentIntent.id,
          paymentIntent.last_payment_error?.message
        );
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const metadata = paymentIntent.metadata;

        // If a security deposit was canceled (released), update the transaction
        if (metadata.type === "security_deposit") {
          await supabase
            .from("transactions")
            .update({
              rental_status: "deposit_released",
              updated_at: new Date().toISOString(),
            })
            .eq(
              "security_deposit_payment_intent_id",
              paymentIntent.id
            );
        }
        break;
      }

      case "payment_intent.amount_capturable_updated": {
        // Security deposit has been authorized
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
          "Security deposit authorized:",
          paymentIntent.id,
          "Amount:",
          paymentIntent.amount_capturable
        );
        break;
      }

      case "account.updated": {
        // Handle Connect account status changes
        const account = event.data.object as Stripe.Account;
        if (account.metadata?.supabase_user_id) {
          await supabase
            .from("profiles")
            .update({ stripe_account_id: account.id })
            .eq("id", account.metadata.supabase_user_id);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    // Return 200 even on error to prevent Stripe from retrying indefinitely
    // Errors are logged for manual investigation
  }

  return NextResponse.json({ received: true });
}
