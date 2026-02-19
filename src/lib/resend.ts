import { Resend } from "resend";

// Lazy-initialize Resend client (same pattern as stripe.ts and shippo.ts)
let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set in environment variables");
      throw new Error("RESEND_API_KEY is not configured");
    }
    console.log(`Resend initialized (key prefix: ${apiKey.substring(0, 8)}...)`);
    _resend = new Resend(apiKey);
  }
  return _resend;
}

// Default sender — uses verified domain
const FROM_EMAIL = "The Carry Exchange <noreply@jointhecarry.com>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jointhecarry.com";

/**
 * Send waitlist confirmation email
 */
export async function sendWaitlistConfirmation(params: {
  email: string;
  position: number;
  signupType: "general" | "founding_seller";
}) {
  try {
    const resend = getResend();

    const isFoundingSeller = params.signupType === "founding_seller";
    const subject = isFoundingSeller
      ? `You're in as a Founding Seller — #${params.position} on the waitlist`
      : `You're on the list — #${params.position} for The Carry Exchange`;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.email,
      subject,
      html: buildWaitlistEmail(params),
    });

    if (error) {
      console.error("Waitlist email send error:", error);
    }
  } catch (err) {
    console.error("Waitlist email failed:", err);
  }
}

/**
 * Send welcome email after signup
 */
export async function sendWelcomeEmail(params: {
  email: string;
  username: string;
}) {
  try {
    const resend = getResend();

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.email,
      subject: `Welcome to The Carry Exchange, ${params.username}!`,
      html: buildWelcomeEmail(params),
    });

    if (error) {
      console.error("Welcome email send error:", error);
    }
  } catch (err) {
    console.error("Welcome email failed:", err);
  }
}

/**
 * Send order confirmation to buyer
 */
export async function sendOrderConfirmationBuyer(params: {
  email: string;
  buyerName: string;
  itemName: string;
  amount: number; // in cents
  shippingCost?: number; // in cents
  trackingNumber?: string | null;
  orderDate: string;
}) {
  try {
    const resend = getResend();

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.email,
      subject: `Order confirmed — ${params.itemName}`,
      html: buildOrderConfirmationBuyerEmail(params),
    });

    if (error) {
      console.error("Buyer order email send error:", error);
    }
  } catch (err) {
    console.error("Buyer order email failed:", err);
  }
}

/**
 * Send sale notification to seller
 */
export async function sendSaleNotificationSeller(params: {
  email: string;
  sellerName: string;
  itemName: string;
  amount: number; // in cents
  platformFee: number; // in cents
  labelUrl?: string | null;
  trackingNumber?: string | null;
}) {
  try {
    const resend = getResend();

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.email,
      subject: `Your item sold — ${params.itemName}`,
      html: buildSaleNotificationSellerEmail(params),
    });

    if (error) {
      console.error("Seller sale email send error:", error);
    }
  } catch (err) {
    console.error("Seller sale email failed:", err);
  }
}

/**
 * Send rental confirmation to renter
 */
export async function sendRentalConfirmation(params: {
  email: string;
  renterName: string;
  itemName: string;
  rentalFee: number; // in cents
  depositAmount: number; // in cents
  trackingNumber?: string | null;
}) {
  try {
    const resend = getResend();

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.email,
      subject: `Rental confirmed — ${params.itemName}`,
      html: buildRentalConfirmationEmail(params),
    });

    if (error) {
      console.error("Rental confirmation email send error:", error);
    }
  } catch (err) {
    console.error("Rental confirmation email failed:", err);
  }
}

/**
 * Send rental notification to lender/seller
 */
export async function sendRentalNotificationSeller(params: {
  email: string;
  sellerName: string;
  itemName: string;
  rentalFee: number; // in cents
  depositAmount: number; // in cents
  labelUrl?: string | null;
  trackingNumber?: string | null;
}) {
  try {
    const resend = getResend();

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.email,
      subject: `Your item was rented — ${params.itemName}`,
      html: buildRentalNotificationSellerEmail(params),
    });

    if (error) {
      console.error("Rental seller email send error:", error);
    }
  } catch (err) {
    console.error("Rental seller email failed:", err);
  }
}

// ─── HTML Email Templates ────────────────────────────────────────────────────
// Dark premium theme matching the site's branding: black backgrounds,
// orange (#b45309 / #f97316) accents, zinc cards, system sans-serif.

const LOGO_URL = `${SITE_URL}/icon-new-white.png`;

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Carry Exchange</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #18181b; border-radius: 12px; overflow: hidden; border: 1px solid #27272a;">
          <!-- Header with logo -->
          <tr>
            <td style="background-color: #000000; padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #27272a;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">
                    <img src="${LOGO_URL}" alt="The Carry Exchange" width="40" height="40" style="display: block; border-radius: 50%; border: 2px solid #27272a;" />
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: 0.5px;">The Carry Exchange</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #09090b; border-top: 1px solid #27272a; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #71717a; font-size: 12px; line-height: 1.5;">
                Buy, Sell, Rent & Try — The EDC Marketplace
              </p>
              <a href="${SITE_URL}" style="color: #f97316; font-size: 12px; text-decoration: none; font-weight: 600;">jointhecarry.com</a>
            </td>
          </tr>
        </table>
        <!-- Unsubscribe / muted text below card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 16px 32px; text-align: center;">
              <p style="margin: 0; color: #3f3f46; font-size: 11px;">
                You're receiving this because you signed up at The Carry Exchange.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildWaitlistEmail(params: {
  email: string;
  position: number;
  signupType: "general" | "founding_seller";
}): string {
  const isFoundingSeller = params.signupType === "founding_seller";

  const foundingSellerBlock = isFoundingSeller
    ? `
      <div style="background: linear-gradient(135deg, rgba(180,83,9,0.2), rgba(249,115,22,0.1)); border: 1px solid rgba(249,115,22,0.3); border-radius: 8px; padding: 20px; margin: 24px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align: top; padding-right: 12px; font-size: 20px;">&#9733;</td>
          <td>
            <p style="margin: 0 0 10px 0; font-weight: 700; color: #f97316; font-size: 15px; letter-spacing: 0.3px;">FOUNDING SELLER</p>
            <p style="margin: 0 0 4px 0; color: #d4d4d8; font-size: 14px; line-height: 1.7;">&#10003;&nbsp; Permanently locked at the lowest commission rate</p>
            <p style="margin: 0 0 4px 0; color: #d4d4d8; font-size: 14px; line-height: 1.7;">&#10003;&nbsp; Priority listing placement at launch</p>
            <p style="margin: 0; color: #d4d4d8; font-size: 14px; line-height: 1.7;">&#10003;&nbsp; Early access to all new features</p>
          </td>
        </tr></table>
      </div>`
    : "";

  return emailWrapper(`
    <!-- Position badge -->
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background: linear-gradient(135deg, #b45309, #ea580c); color: #ffffff; font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 50px; letter-spacing: 0.5px;">#${params.position} ON THE WAITLIST</span>
    </div>

    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 26px; font-weight: 700; text-align: center;">You're in.</h2>
    <p style="margin: 0 0 24px 0; color: #a1a1aa; font-size: 16px; text-align: center; line-height: 1.6;">
      Welcome to The Carry Exchange — the first marketplace built exclusively for the EDC community.
    </p>

    ${foundingSellerBlock}

    <!-- What we're building -->
    <div style="background-color: #27272a; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #3f3f46;">
      <p style="margin: 0 0 12px 0; color: #f97316; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">What's coming</p>
      <p style="margin: 0; color: #d4d4d8; font-size: 14px; line-height: 1.7;">
        Buy, sell, trade, and <span style="color: #f97316; font-weight: 600;">rent</span> EDC gear — knives, lights, pens, watches, and more. Try before you buy. Ship with built-in protection. All in one place.
      </p>
    </div>

    <p style="margin: 0 0 28px 0; color: #71717a; font-size: 14px; text-align: center; line-height: 1.6;">
      We'll email you as soon as we're ready to open the doors. Spread the word — every signup gets us closer to launch.
    </p>

    <div style="text-align: center; margin: 0 0 8px 0;">
      <a href="${SITE_URL}" style="display: inline-block; background: linear-gradient(135deg, #b45309, #ea580c); color: #ffffff; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 15px;">Visit The Carry Exchange</a>
    </div>
  `);
}

function buildWelcomeEmail(params: {
  email: string;
  username: string;
}): string {
  return emailWrapper(`
    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 26px; font-weight: 700; text-align: center;">Welcome, ${params.username}.</h2>
    <p style="margin: 0 0 28px 0; color: #a1a1aa; font-size: 16px; text-align: center; line-height: 1.6;">
      Your account is live. Here's what you can do on The Carry Exchange.
    </p>

    <!-- Feature grid -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0;">
      <tr>
        <td style="padding: 16px; background-color: #27272a; border-radius: 8px 8px 0 0; border: 1px solid #3f3f46; border-bottom: none;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align: top; padding-right: 14px;">
              <div style="width: 36px; height: 36px; background: linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.1)); border-radius: 8px; text-align: center; line-height: 36px; font-size: 16px;">&#128269;</div>
            </td>
            <td>
              <p style="margin: 0 0 2px 0; color: #ffffff; font-weight: 600; font-size: 15px;">Browse & Buy</p>
              <p style="margin: 0; color: #a1a1aa; font-size: 13px;">Discover EDC gear from the community</p>
            </td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px; background-color: #27272a; border-left: 1px solid #3f3f46; border-right: 1px solid #3f3f46;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align: top; padding-right: 14px;">
              <div style="width: 36px; height: 36px; background: linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.1)); border-radius: 8px; text-align: center; line-height: 36px; font-size: 16px;">&#128176;</div>
            </td>
            <td>
              <p style="margin: 0 0 2px 0; color: #ffffff; font-weight: 600; font-size: 15px;">List & Sell</p>
              <p style="margin: 0; color: #a1a1aa; font-size: 13px;">Turn your gear into cash — or rent it out</p>
            </td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px; background-color: #27272a; border-left: 1px solid #3f3f46; border-right: 1px solid #3f3f46;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align: top; padding-right: 14px;">
              <div style="width: 36px; height: 36px; background: linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.1)); border-radius: 8px; text-align: center; line-height: 36px; font-size: 16px;">&#128295;</div>
            </td>
            <td>
              <p style="margin: 0 0 2px 0; color: #f97316; font-weight: 600; font-size: 15px;">Try Before You Buy</p>
              <p style="margin: 0; color: #a1a1aa; font-size: 13px;">Rent that grail piece before you commit</p>
            </td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px; background-color: #27272a; border-radius: 0 0 8px 8px; border: 1px solid #3f3f46; border-top: none;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align: top; padding-right: 14px;">
              <div style="width: 36px; height: 36px; background: linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.1)); border-radius: 8px; text-align: center; line-height: 36px; font-size: 16px;">&#127942;</div>
            </td>
            <td>
              <p style="margin: 0 0 2px 0; color: #ffffff; font-weight: 600; font-size: 15px;">Share Your EDC</p>
              <p style="margin: 0; color: #a1a1aa; font-size: 13px;">Post your loadout and connect with the community</p>
            </td>
          </tr></table>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin: 0 0 8px 0;">
      <a href="${SITE_URL}/browse" style="display: inline-block; background: linear-gradient(135deg, #b45309, #ea580c); color: #ffffff; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 15px;">Start Exploring</a>
    </div>
  `);
}

function buildOrderConfirmationBuyerEmail(params: {
  buyerName: string;
  itemName: string;
  amount: number;
  shippingCost?: number;
  trackingNumber?: string | null;
  orderDate: string;
}): string {
  const itemPrice = params.shippingCost
    ? (params.amount - params.shippingCost) / 100
    : params.amount / 100;
  const shippingPrice = params.shippingCost
    ? params.shippingCost / 100
    : 0;
  const totalPrice = params.amount / 100;

  const trackingBlock = params.trackingNumber
    ? `<div style="background-color: #27272a; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #3f3f46;">
        <p style="margin: 0 0 4px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Tracking</p>
        <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600;">${params.trackingNumber}</p>
      </div>`
    : `<div style="background-color: #27272a; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #3f3f46;">
        <p style="margin: 0; color: #a1a1aa; font-size: 14px;">Tracking info will be available once the seller ships your item.</p>
      </div>`;

  return emailWrapper(`
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background: linear-gradient(135deg, #b45309, #ea580c); color: #ffffff; font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 50px; letter-spacing: 0.5px;">ORDER CONFIRMED</span>
    </div>

    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 26px; font-weight: 700; text-align: center;">Nice pickup, ${params.buyerName}.</h2>
    <p style="margin: 0 0 28px 0; color: #a1a1aa; font-size: 16px; text-align: center;">Your order is confirmed and the seller has been notified.</p>

    <div style="background-color: #27272a; border-radius: 8px; padding: 20px; margin: 0 0 4px 0; border: 1px solid #3f3f46; border-bottom: none; border-radius: 8px 8px 0 0;">
      <p style="margin: 0 0 4px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Item</p>
      <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${params.itemName}</p>
    </div>
    <div style="background-color: #27272a; border-radius: 0 0 8px 8px; padding: 16px 20px; border: 1px solid #3f3f46; border-top: 1px solid #3f3f46;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa; font-size: 14px;">Item price</td>
          <td style="padding: 6px 0; color: #d4d4d8; font-size: 14px; text-align: right;">$${itemPrice.toFixed(2)} CAD</td>
        </tr>
        ${shippingPrice > 0 ? `
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa; font-size: 14px;">Shipping</td>
          <td style="padding: 6px 0; color: #d4d4d8; font-size: 14px; text-align: right;">$${shippingPrice.toFixed(2)} CAD</td>
        </tr>` : ""}
        <tr>
          <td style="padding: 10px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 700; border-top: 1px solid #3f3f46;">Total</td>
          <td style="padding: 10px 0 0 0; color: #f97316; font-size: 16px; font-weight: 700; text-align: right; border-top: 1px solid #3f3f46;">$${totalPrice.toFixed(2)} CAD</td>
        </tr>
      </table>
    </div>

    ${trackingBlock}

    <p style="margin: 20px 0 0 0; color: #3f3f46; font-size: 12px; text-align: center;">
      Order date: ${params.orderDate}
    </p>
  `);
}

function buildSaleNotificationSellerEmail(params: {
  sellerName: string;
  itemName: string;
  amount: number;
  platformFee: number;
  labelUrl?: string | null;
  trackingNumber?: string | null;
}): string {
  const saleAmount = params.amount / 100;
  const fee = params.platformFee / 100;
  const payout = saleAmount - fee;

  const labelBlock = params.labelUrl
    ? `
    <div style="background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05)); border: 1px solid rgba(16,185,129,0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #10b981; font-size: 14px;">SHIPPING LABEL READY</p>
      <p style="margin: 0 0 14px 0; color: #d4d4d8; font-size: 14px; line-height: 1.6;">
        Your prepaid label is ready. Please ship within 3 business days.
        ${params.trackingNumber ? `<br><span style="color: #71717a;">Tracking:</span> <strong style="color: #ffffff;">${params.trackingNumber}</strong>` : ""}
      </p>
      <a href="${params.labelUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 10px 24px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 13px;">Download Label</a>
    </div>`
    : `<div style="background-color: #27272a; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #3f3f46;">
        <p style="margin: 0; color: #a1a1aa; font-size: 14px;">Please arrange shipping with the buyer through messages.</p>
      </div>`;

  return emailWrapper(`
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background: linear-gradient(135deg, #b45309, #ea580c); color: #ffffff; font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 50px; letter-spacing: 0.5px;">ITEM SOLD</span>
    </div>

    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 26px; font-weight: 700; text-align: center;">Congrats, ${params.sellerName}!</h2>
    <p style="margin: 0 0 28px 0; color: #a1a1aa; font-size: 16px; text-align: center;">Your item has been purchased. Time to ship it out.</p>

    <div style="background-color: #27272a; border-radius: 8px 8px 0 0; padding: 20px; border: 1px solid #3f3f46; border-bottom: none;">
      <p style="margin: 0 0 4px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Item</p>
      <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${params.itemName}</p>
    </div>
    <div style="background-color: #27272a; border-radius: 0 0 8px 8px; padding: 16px 20px; border: 1px solid #3f3f46; border-top: 1px solid #3f3f46;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa; font-size: 14px;">Sale price</td>
          <td style="padding: 6px 0; color: #d4d4d8; font-size: 14px; text-align: right;">$${saleAmount.toFixed(2)} CAD</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa; font-size: 14px;">Platform fee</td>
          <td style="padding: 6px 0; color: #ef4444; font-size: 14px; text-align: right;">-$${fee.toFixed(2)} CAD</td>
        </tr>
        <tr>
          <td style="padding: 10px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 700; border-top: 1px solid #3f3f46;">Your payout</td>
          <td style="padding: 10px 0 0 0; color: #10b981; font-size: 16px; font-weight: 700; text-align: right; border-top: 1px solid #3f3f46;">$${payout.toFixed(2)} CAD</td>
        </tr>
      </table>
    </div>

    ${labelBlock}
  `);
}

function buildRentalConfirmationEmail(params: {
  renterName: string;
  itemName: string;
  rentalFee: number;
  depositAmount: number;
  trackingNumber?: string | null;
}): string {
  const rental = params.rentalFee / 100;
  const deposit = params.depositAmount / 100;

  const trackingBlock = params.trackingNumber
    ? `<div style="background-color: #27272a; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #3f3f46;">
        <p style="margin: 0 0 4px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Tracking</p>
        <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600;">${params.trackingNumber}</p>
      </div>`
    : `<div style="background-color: #27272a; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #3f3f46;">
        <p style="margin: 0; color: #a1a1aa; font-size: 14px;">Tracking info will be available once the item ships.</p>
      </div>`;

  return emailWrapper(`
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background: linear-gradient(135deg, #b45309, #ea580c); color: #ffffff; font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 50px; letter-spacing: 0.5px;">RENTAL CONFIRMED</span>
    </div>

    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 26px; font-weight: 700; text-align: center;">You're all set, ${params.renterName}.</h2>
    <p style="margin: 0 0 28px 0; color: #a1a1aa; font-size: 16px; text-align: center;">Your rental is confirmed. The owner will ship it out shortly.</p>

    <div style="background-color: #27272a; border-radius: 8px 8px 0 0; padding: 20px; border: 1px solid #3f3f46; border-bottom: none;">
      <p style="margin: 0 0 4px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Item</p>
      <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${params.itemName}</p>
    </div>
    <div style="background-color: #27272a; border-radius: 0 0 8px 8px; padding: 16px 20px; border: 1px solid #3f3f46; border-top: 1px solid #3f3f46;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa; font-size: 14px;">Rental fee</td>
          <td style="padding: 6px 0; color: #d4d4d8; font-size: 14px; text-align: right;">$${rental.toFixed(2)} CAD</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa; font-size: 14px;">Security deposit (hold)</td>
          <td style="padding: 6px 0; color: #71717a; font-size: 14px; text-align: right;">$${deposit.toFixed(2)} CAD</td>
        </tr>
      </table>
    </div>

    <!-- Deposit info -->
    <div style="background: linear-gradient(135deg, rgba(249,115,22,0.1), rgba(234,88,12,0.05)); border: 1px solid rgba(249,115,22,0.2); border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; color: #d4d4d8; font-size: 14px; line-height: 1.6;">
        <strong style="color: #f97316;">About your deposit:</strong> This is a hold on your card, not a charge. It releases automatically once the item is returned in good condition. A prepaid return label will be included.
      </p>
    </div>

    ${trackingBlock}
  `);
}

function buildRentalNotificationSellerEmail(params: {
  sellerName: string;
  itemName: string;
  rentalFee: number;
  depositAmount: number;
  labelUrl?: string | null;
  trackingNumber?: string | null;
}): string {
  const rental = params.rentalFee / 100;
  const deposit = params.depositAmount / 100;

  const labelBlock = params.labelUrl
    ? `
    <div style="background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05)); border: 1px solid rgba(16,185,129,0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #10b981; font-size: 14px;">SHIPPING LABELS READY</p>
      <p style="margin: 0 0 14px 0; color: #d4d4d8; font-size: 14px; line-height: 1.6;">
        Your outbound label is ready. A return label has also been generated — include it in the package.
        ${params.trackingNumber ? `<br><span style="color: #71717a;">Tracking:</span> <strong style="color: #ffffff;">${params.trackingNumber}</strong>` : ""}
      </p>
      <a href="${params.labelUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 10px 24px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 13px;">Download Label</a>
    </div>`
    : `<div style="background-color: #27272a; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #3f3f46;">
        <p style="margin: 0; color: #a1a1aa; font-size: 14px;">Please arrange handoff with the renter through messages.</p>
      </div>`;

  return emailWrapper(`
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background: linear-gradient(135deg, #b45309, #ea580c); color: #ffffff; font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 50px; letter-spacing: 0.5px;">ITEM RENTED</span>
    </div>

    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 26px; font-weight: 700; text-align: center;">Great news, ${params.sellerName}!</h2>
    <p style="margin: 0 0 28px 0; color: #a1a1aa; font-size: 16px; text-align: center;">Someone's renting your gear. Time to ship it out.</p>

    <div style="background-color: #27272a; border-radius: 8px 8px 0 0; padding: 20px; border: 1px solid #3f3f46; border-bottom: none;">
      <p style="margin: 0 0 4px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Item</p>
      <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${params.itemName}</p>
    </div>
    <div style="background-color: #27272a; border-radius: 0 0 8px 8px; padding: 16px 20px; border: 1px solid #3f3f46; border-top: 1px solid #3f3f46;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa; font-size: 14px;">Rental fee received</td>
          <td style="padding: 6px 0; color: #d4d4d8; font-size: 14px; text-align: right;">$${rental.toFixed(2)} CAD</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa; font-size: 14px;">Security deposit held</td>
          <td style="padding: 6px 0; color: #71717a; font-size: 14px; text-align: right;">$${deposit.toFixed(2)} CAD</td>
        </tr>
      </table>
    </div>

    ${labelBlock}
  `);
}
