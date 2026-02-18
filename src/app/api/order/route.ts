import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paymentIntentId = request.nextUrl.searchParams.get("payment_intent");
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Missing payment_intent parameter" },
        { status: 400 }
      );
    }

    // Fetch transaction
    const { data: transaction } = await supabase
      .from("transactions")
      .select("*")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .single();

    // Fetch the listing info
    let listing = null;
    const listingId =
      transaction?.listing_id ||
      request.nextUrl.searchParams.get("listing_id");

    if (listingId) {
      const { data } = await supabase
        .from("items")
        .select("id, name, price, listing_type, images, brand, rent_price, rental_period")
        .eq("id", listingId)
        .single();
      listing = data;
    }

    // Fetch shipment info
    let shipment = null;
    if (listingId) {
      const { data } = await supabase
        .from("shipments")
        .select("*")
        .eq("listing_id", listingId)
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      shipment = data;
    }

    return NextResponse.json({
      transaction,
      listing,
      shipment,
      buyer_id: user.id,
    });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
