import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import {
  applyShippingMarkup,
  getShippingRevenue,
  SHIPPING_MARKUP_RATE,
  DEFAULT_CURRENCY,
  DEFAULT_PARCEL,
} from "@/lib/marketplace-config";
import { getShippo } from "@/lib/shippo";
import {
  sendOrderConfirmationBuyer,
  sendSaleNotificationSeller,
  sendRentalConfirmation,
  sendRentalNotificationSeller,
} from "@/lib/resend";

// Use service role key for webhook operations (bypasses RLS)
function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Create a shipping label via our internal shipping labels API logic.
 * Called after a successful payment to auto-generate labels.
 */
async function createShippingLabel(params: {
  transactionType: "sale" | "rental_outbound";
  rateId: string;
  shipmentId: string;
  carrierRate: number;
  sellerId: string;
  buyerId: string;
  listingId: string;
  orderId?: string;
  rentalId?: string;
  addressFrom: Record<string, string>;
  addressTo: Record<string, string>;
  generateReturnLabel: boolean;
}) {
  try {
    const shippo = getShippo();
    const supabase = createServiceClient();

    // Purchase the outbound label from Shippo
    const transaction = await shippo.transactions.create({
      rate: params.rateId,
      async: false,
      labelFileType: "PDF" as "PDF",
    });

    if (transaction.status !== "SUCCESS") {
      console.error("Shippo label creation failed:", transaction.messages);
      return null;
    }

    // Calculate pricing
    const buyerRate = applyShippingMarkup(params.carrierRate);
    const revenue = getShippingRevenue(params.carrierRate);
    const paidBy =
      params.transactionType === "sale" ||
      params.transactionType === "rental_outbound"
        ? "buyer"
        : "seller";

    // Record outbound shipment
    const { data: outboundShipment, error: dbError } = await supabase
      .from("shipments")
      .insert({
        transaction_type: params.transactionType,
        listing_id: params.listingId,
        order_id: params.orderId || null,
        rental_id: params.rentalId || null,
        seller_id: params.sellerId,
        buyer_id: params.buyerId,
        shippo_shipment_id: params.shipmentId,
        shippo_rate_id: params.rateId,
        shippo_transaction_id: transaction.objectId,
        tracking_number: transaction.trackingNumber || null,
        tracking_url: transaction.trackingUrlProvider || null,
        label_url: transaction.labelUrl || null,
        address_from: params.addressFrom,
        address_to: params.addressTo,
        parcel: DEFAULT_PARCEL,
        carrier_rate: params.carrierRate,
        buyer_rate: buyerRate,
        shipping_revenue: revenue,
        markup_rate: SHIPPING_MARKUP_RATE,
        currency: DEFAULT_CURRENCY,
        paid_by: paidBy,
        carrier:
          typeof transaction.rate === "object"
            ? transaction.rate?.provider
            : null,
        service_level:
          typeof transaction.rate === "object"
            ? transaction.rate?.servicelevelToken
            : null,
        estimated_days: null,
        status: "label_created",
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB insert error for outbound shipment:", dbError);
      return null;
    }

    // For rentals: generate return label (seller pays)
    let returnShipment = null;
    if (params.generateReturnLabel) {
      try {
        // Create return shipment (swap from/to)
        const returnShippoShipment = await shippo.shipments.create({
          addressFrom: {
            name: params.addressTo.name,
            street1: params.addressTo.street1,
            street2: params.addressTo.street2 || "",
            city: params.addressTo.city,
            state: params.addressTo.state,
            zip: params.addressTo.zip,
            country: params.addressTo.country || "CA",
            email: params.addressTo.email || "",
            phone: params.addressTo.phone || "",
          },
          addressTo: {
            name: params.addressFrom.name,
            street1: params.addressFrom.street1,
            street2: params.addressFrom.street2 || "",
            city: params.addressFrom.city,
            state: params.addressFrom.state,
            zip: params.addressFrom.zip,
            country: params.addressFrom.country || "CA",
            email: params.addressFrom.email || "",
            phone: params.addressFrom.phone || "",
          },
          parcels: [
            {
              length: String(DEFAULT_PARCEL.length),
              width: String(DEFAULT_PARCEL.width),
              height: String(DEFAULT_PARCEL.height),
              weight: String(DEFAULT_PARCEL.weight),
              distanceUnit: DEFAULT_PARCEL.distance_unit,
              massUnit: DEFAULT_PARCEL.mass_unit,
            },
          ],
          extra: { isReturn: true },
          async: false,
        });

        const returnRates = returnShippoShipment.rates || [];
        if (returnRates.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cheapestReturn = returnRates.reduce((min: any, rate: any) =>
            parseFloat(rate.amount) < parseFloat(min.amount) ? rate : min
          );
          const returnCarrierRate = parseFloat(cheapestReturn.amount);

          const returnTx = await shippo.transactions.create({
            rate: cheapestReturn.objectId!,
            async: false,
            labelFileType: "PDF" as "PDF",
          });

          if (returnTx.status === "SUCCESS") {
            const returnBuyerRate = applyShippingMarkup(returnCarrierRate);
            const returnRevenue = getShippingRevenue(returnCarrierRate);

            const { data: returnData } = await supabase
              .from("shipments")
              .insert({
                transaction_type: "rental_return",
                listing_id: params.listingId,
                order_id: params.orderId || null,
                rental_id: params.rentalId || null,
                seller_id: params.sellerId,
                buyer_id: params.buyerId,
                shippo_shipment_id: returnShippoShipment.objectId,
                shippo_rate_id: cheapestReturn.objectId,
                shippo_transaction_id: returnTx.objectId,
                tracking_number: returnTx.trackingNumber || null,
                tracking_url: returnTx.trackingUrlProvider || null,
                label_url: returnTx.labelUrl || null,
                address_from: params.addressTo,
                address_to: params.addressFrom,
                parcel: DEFAULT_PARCEL,
                carrier_rate: returnCarrierRate,
                buyer_rate: returnBuyerRate,
                shipping_revenue: returnRevenue,
                markup_rate: SHIPPING_MARKUP_RATE,
                currency: DEFAULT_CURRENCY,
                paid_by: "seller",
                carrier:
                  typeof returnTx.rate === "object"
                    ? returnTx.rate?.provider
                    : null,
                service_level:
                  typeof returnTx.rate === "object"
                    ? returnTx.rate?.servicelevelToken
                    : null,
                estimated_days: null,
                status: "label_created",
                return_shipment_id: null,
              })
              .select()
              .single();

            returnShipment = returnData;

            // Link outbound to return
            if (returnData) {
              await supabase
                .from("shipments")
                .update({ return_shipment_id: returnData.id })
                .eq("id", outboundShipment.id);
            }
          }
        }
      } catch (returnError) {
        console.error("Return label creation error:", returnError);
        // Continue — outbound label was still created successfully
      }
    }

    return {
      outbound: outboundShipment,
      return: returnShipment,
      labelUrl: transaction.labelUrl,
      trackingNumber: transaction.trackingNumber,
    };
  } catch (error) {
    console.error("Shipping label creation error:", error);
    return null;
  }
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

        console.log("Webhook payment_intent.succeeded:", paymentIntent.id, "metadata:", JSON.stringify(metadata));

        // Skip security deposit completions (they are manual capture)
        if (metadata.type === "security_deposit") {
          console.log("Skipping security deposit event");
          break;
        }

        // Parse shipping info from metadata
        const hasShipping = !!metadata.shipping_rate_id;
        const buyerAddress = metadata.buyer_address
          ? JSON.parse(metadata.buyer_address)
          : null;
        const sellerAddress = metadata.seller_address
          ? JSON.parse(metadata.seller_address)
          : null;

        if (metadata.type === "sale") {
          // Create transaction record
          const { error: txError } = await supabase
            .from("transactions")
            .insert({
              listing_id: metadata.listing_id,
              buyer_id: metadata.buyer_id,
              seller_id: metadata.seller_id,
              amount: paymentIntent.amount,
              platform_fee: paymentIntent.application_fee_amount || 0,
              stripe_payment_intent_id: paymentIntent.id,
              type: "sale",
              status: "completed",
            });

          if (txError) {
            console.error(
              "Failed to create sale transaction:",
              JSON.stringify(txError),
              "PI:",
              paymentIntent.id,
              "Metadata:",
              JSON.stringify(metadata)
            );
          } else {
            console.log("Sale transaction created successfully for PI:", paymentIntent.id);
          }

          // Mark listing as sold
          const { error: itemError } = await supabase
            .from("items")
            .update({ status: "sold" })
            .eq("id", metadata.listing_id);

          if (itemError) {
            console.error(
              "Failed to mark item as sold:",
              itemError,
              "listing_id:",
              metadata.listing_id
            );
          }

          // Auto-create shipping label if shipping was selected
          let labelInfo = null;
          if (hasShipping && buyerAddress && sellerAddress) {
            labelInfo = await createShippingLabel({
              transactionType: "sale",
              rateId: metadata.shipping_rate_id,
              shipmentId: metadata.shipping_shipment_id,
              carrierRate: parseFloat(metadata.shipping_carrier_rate),
              sellerId: metadata.seller_id,
              buyerId: metadata.buyer_id,
              listingId: metadata.listing_id,
              addressFrom: sellerAddress,
              addressTo: buyerAddress,
              generateReturnLabel: false,
            });
          }

          // Notify seller with shipping label info
          const labelMessage = labelInfo?.labelUrl
            ? ` Your shipping label is ready — check your dashboard to print it. Tracking: ${labelInfo.trackingNumber || "pending"}.`
            : " Please arrange shipping with the buyer.";

          await supabase.from("messages").insert({
            sender_id: metadata.buyer_id,
            receiver_id: metadata.seller_id,
            item_id: metadata.listing_id,
            content: `Your item has been sold! Payment of $${(paymentIntent.amount / 100).toFixed(2)} CAD has been processed.${labelMessage}`,
            is_read: false,
          });

          // Send email notifications (fire-and-forget)
          try {
            const [{ data: buyer }, { data: seller }, { data: item }] = await Promise.all([
              supabase.from("profiles").select("username, full_name").eq("id", metadata.buyer_id).single(),
              supabase.from("profiles").select("username, full_name").eq("id", metadata.seller_id).single(),
              supabase.from("items").select("name").eq("id", metadata.listing_id).single(),
            ]);

            // Get buyer email from auth (profiles may not store email)
            const { data: buyerAuth } = await supabase.auth.admin.getUserById(metadata.buyer_id);
            const { data: sellerAuth } = await supabase.auth.admin.getUserById(metadata.seller_id);

            if (buyerAuth?.user?.email && item) {
              sendOrderConfirmationBuyer({
                email: buyerAuth.user.email,
                buyerName: buyer?.full_name || buyer?.username || "there",
                itemName: item.name,
                amount: paymentIntent.amount,
                shippingCost: metadata.shipping_buyer_rate ? Math.round(parseFloat(metadata.shipping_buyer_rate) * 100) : undefined,
                trackingNumber: labelInfo?.trackingNumber || null,
                orderDate: new Date().toLocaleDateString("en-CA"),
              }).catch(err => console.error("Buyer order email failed:", err));
            }

            if (sellerAuth?.user?.email && item) {
              sendSaleNotificationSeller({
                email: sellerAuth.user.email,
                sellerName: seller?.full_name || seller?.username || "there",
                itemName: item.name,
                amount: paymentIntent.amount,
                platformFee: paymentIntent.application_fee_amount || 0,
                labelUrl: labelInfo?.labelUrl || null,
                trackingNumber: labelInfo?.trackingNumber || null,
              }).catch(err => console.error("Seller sale email failed:", err));
            }
          } catch (emailErr) {
            console.error("Failed to send sale notification emails:", emailErr);
          }
        }

        if (metadata.type === "rental") {
          // Create/update rental transaction
          const { error: rentalTxError } = await supabase
            .from("transactions")
            .insert({
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

          if (rentalTxError) {
            console.error(
              "Failed to create rental transaction:",
              rentalTxError,
              "PI:",
              paymentIntent.id,
              "Metadata:",
              JSON.stringify(metadata)
            );
          }

          // Auto-create shipping labels (outbound + return) for rentals
          let labelInfo = null;
          if (hasShipping && buyerAddress && sellerAddress) {
            labelInfo = await createShippingLabel({
              transactionType: "rental_outbound",
              rateId: metadata.shipping_rate_id,
              shipmentId: metadata.shipping_shipment_id,
              carrierRate: parseFloat(metadata.shipping_carrier_rate),
              sellerId: metadata.seller_id,
              buyerId: metadata.buyer_id,
              listingId: metadata.listing_id,
              addressFrom: sellerAddress,
              addressTo: buyerAddress,
              generateReturnLabel: true, // Always generate return label for rentals
            });
          }

          // Notify the seller/lender
          const labelMessage = labelInfo?.labelUrl
            ? ` Your shipping label is ready — check your dashboard to print it. A prepaid return label has also been created. Tracking: ${labelInfo.trackingNumber || "pending"}.`
            : " Please arrange handoff with the renter.";

          await supabase.from("messages").insert({
            sender_id: metadata.buyer_id,
            receiver_id: metadata.seller_id,
            item_id: metadata.listing_id,
            content: `Your item has been rented! Rental fee of $${(paymentIntent.amount / 100).toFixed(2)} CAD has been paid. A security deposit hold has also been placed.${labelMessage}`,
            is_read: false,
          });

          // Send rental email notifications (fire-and-forget)
          try {
            const [{ data: renter }, { data: lender }, { data: rentalItem }] = await Promise.all([
              supabase.from("profiles").select("username, full_name").eq("id", metadata.buyer_id).single(),
              supabase.from("profiles").select("username, full_name").eq("id", metadata.seller_id).single(),
              supabase.from("items").select("name").eq("id", metadata.listing_id).single(),
            ]);

            const { data: renterAuth } = await supabase.auth.admin.getUserById(metadata.buyer_id);
            const { data: lenderAuth } = await supabase.auth.admin.getUserById(metadata.seller_id);

            const depositAmount = metadata.security_deposit_amount
              ? parseInt(metadata.security_deposit_amount)
              : 0;

            if (renterAuth?.user?.email && rentalItem) {
              sendRentalConfirmation({
                email: renterAuth.user.email,
                renterName: renter?.full_name || renter?.username || "there",
                itemName: rentalItem.name,
                rentalFee: paymentIntent.amount,
                depositAmount,
                trackingNumber: labelInfo?.trackingNumber || null,
              }).catch(err => console.error("Renter email failed:", err));
            }

            if (lenderAuth?.user?.email && rentalItem) {
              sendRentalNotificationSeller({
                email: lenderAuth.user.email,
                sellerName: lender?.full_name || lender?.username || "there",
                itemName: rentalItem.name,
                rentalFee: paymentIntent.amount,
                depositAmount,
                labelUrl: labelInfo?.labelUrl || null,
                trackingNumber: labelInfo?.trackingNumber || null,
              }).catch(err => console.error("Lender email failed:", err));
            }
          } catch (emailErr) {
            console.error("Failed to send rental notification emails:", emailErr);
          }
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
