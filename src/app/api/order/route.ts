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
    const listingIdParam = request.nextUrl.searchParams.get("listing_id");

    // Fetch transaction (by payment_intent if available)
    let transaction = null;
    if (paymentIntentId) {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("stripe_payment_intent_id", paymentIntentId)
        .single();
      transaction = data;
    }

    // Determine listing ID from transaction or query param
    const listingId = transaction?.listing_id || listingIdParam;

    // Fetch listing with images, category, and seller profile
    let listing = null;
    if (listingId) {
      const { data } = await supabase
        .from("items")
        .select(
          "id, name, price, listing_type, brand, description, condition, rent_price, rental_period, rental_deposit, box_and_docs, item_images(url, position), categories(name, slug), profiles!items_user_id_fkey(username, full_name)"
        )
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
