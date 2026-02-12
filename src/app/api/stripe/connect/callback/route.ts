import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accountId = searchParams.get("account_id");
  const refresh = searchParams.get("refresh");
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://jointhecarry.com";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(`${baseUrl}/login?redirect=/profile`);
    }

    // If refresh=true, user needs to restart onboarding
    if (refresh) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_account_id")
        .eq("id", user.id)
        .single();

      if (profile?.stripe_account_id) {
        // Generate a new account link
        const accountLink = await stripe.accountLinks.create({
          account: profile.stripe_account_id,
          refresh_url: `${baseUrl}/api/stripe/connect/callback?refresh=true`,
          return_url: `${baseUrl}/api/stripe/connect/callback?account_id=${profile.stripe_account_id}`,
          type: "account_onboarding",
        });

        return NextResponse.redirect(accountLink.url);
      }

      return NextResponse.redirect(`${baseUrl}/profile?stripe=error`);
    }

    // Normal return from onboarding
    if (accountId) {
      // Verify the account belongs to this user
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_account_id")
        .eq("id", user.id)
        .single();

      if (profile?.stripe_account_id === accountId) {
        // Check if onboarding is complete
        const account = await stripe.accounts.retrieve(accountId);

        if (account.details_submitted) {
          return NextResponse.redirect(
            `${baseUrl}/profile?stripe=connected`
          );
        } else {
          return NextResponse.redirect(
            `${baseUrl}/profile?stripe=pending`
          );
        }
      }
    }

    return NextResponse.redirect(`${baseUrl}/profile?stripe=error`);
  } catch (error) {
    console.error("Stripe callback error:", error);
    return NextResponse.redirect(`${baseUrl}/profile?stripe=error`);
  }
}
