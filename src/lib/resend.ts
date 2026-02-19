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
// Using inline HTML instead of React Email rendering to keep things simple
// and avoid SSR complexity. These are clean, responsive email templates.

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Carry Exchange</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #18181b; padding: 24px 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">THE CARRY EXCHANGE</h1>
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
            <td style="padding: 24px 32px; background-color: #fafafa; border-top: 1px solid #e4e4e7; text-align: center;">
              <p style="margin: 0; color: #a1a1aa; font-size: 12px; line-height: 1.5;">
                The Carry Exchange — Buy, Sell, Rent & Try EDC Gear<br>
                <a href="${SITE_URL}" style="color: #a1a1aa;">jointhecarry.com</a>
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
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #92400e; font-size: 14px;">Founding Seller Benefits</p>
        <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.6;">
          <li>Permanently locked at the lowest commission rate</li>
          <li>Priority listing placement at launch</li>
          <li>Early access to all new features</li>
        </ul>
      </div>`
    : "";

  return emailWrapper(`
    <h2 style="margin: 0 0 8px 0; color: #18181b; font-size: 24px;">You're in!</h2>
    <p style="margin: 0 0 20px 0; color: #71717a; font-size: 16px;">
      You're <strong style="color: #18181b;">#${params.position}</strong> on the waitlist for The Carry Exchange.
    </p>
    ${foundingSellerBlock}
    <p style="margin: 0 0 12px 0; color: #3f3f46; font-size: 15px; line-height: 1.6;">
      We're building the first marketplace dedicated to the EDC community in Canada and the US. Buy, sell, rent, and try before you buy — all in one place.
    </p>
    <p style="margin: 0 0 24px 0; color: #3f3f46; font-size: 15px; line-height: 1.6;">
      We'll email you as soon as we're ready to open the doors. In the meantime, spread the word — every signup gets us closer to launch.
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${SITE_URL}" style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Visit The Carry Exchange</a>
    </div>
  `);
}

function buildWelcomeEmail(params: {
  email: string;
  username: string;
}): string {
  return emailWrapper(`
    <h2 style="margin: 0 0 8px 0; color: #18181b; font-size: 24px;">Welcome, ${params.username}!</h2>
    <p style="margin: 0 0 20px 0; color: #71717a; font-size: 16px;">
      Your account is ready. Here's what you can do:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5;">
          <strong style="color: #18181b;">Browse & Buy</strong>
          <p style="margin: 4px 0 0 0; color: #71717a; font-size: 14px;">Discover EDC gear from the community</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5;">
          <strong style="color: #18181b;">List & Sell</strong>
          <p style="margin: 4px 0 0 0; color: #71717a; font-size: 14px;">Turn your gear into cash — or rent it out</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5;">
          <strong style="color: #18181b;">Try Before You Buy</strong>
          <p style="margin: 4px 0 0 0; color: #71717a; font-size: 14px;">Rent that grail piece before committing</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0;">
          <strong style="color: #18181b;">Share Your EDC</strong>
          <p style="margin: 4px 0 0 0; color: #71717a; font-size: 14px;">Post your loadout and connect with the community</p>
        </td>
      </tr>
    </table>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${SITE_URL}" style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Start Exploring</a>
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
    ? `<p style="margin: 12px 0 0 0; color: #3f3f46; font-size: 14px;">Tracking number: <strong>${params.trackingNumber}</strong></p>`
    : `<p style="margin: 12px 0 0 0; color: #71717a; font-size: 14px;">Tracking info will be available once the seller ships your item.</p>`;

  return emailWrapper(`
    <h2 style="margin: 0 0 8px 0; color: #18181b; font-size: 24px;">Order Confirmed</h2>
    <p style="margin: 0 0 20px 0; color: #71717a; font-size: 16px;">
      Thanks for your purchase, ${params.buyerName}!
    </p>

    <div style="background-color: #fafafa; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 4px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Item</p>
      <p style="margin: 0 0 16px 0; color: #18181b; font-size: 16px; font-weight: 600;">${params.itemName}</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 6px 0; color: #3f3f46; font-size: 14px;">Item price</td>
          <td style="padding: 6px 0; color: #18181b; font-size: 14px; text-align: right;">$${itemPrice.toFixed(2)} CAD</td>
        </tr>
        ${shippingPrice > 0 ? `
        <tr>
          <td style="padding: 6px 0; color: #3f3f46; font-size: 14px;">Shipping</td>
          <td style="padding: 6px 0; color: #18181b; font-size: 14px; text-align: right;">$${shippingPrice.toFixed(2)} CAD</td>
        </tr>` : ""}
        <tr>
          <td style="padding: 8px 0 0 0; color: #18181b; font-size: 16px; font-weight: 600; border-top: 1px solid #e4e4e7;">Total</td>
          <td style="padding: 8px 0 0 0; color: #18181b; font-size: 16px; font-weight: 600; text-align: right; border-top: 1px solid #e4e4e7;">$${totalPrice.toFixed(2)} CAD</td>
        </tr>
      </table>
    </div>

    ${trackingBlock}

    <p style="margin: 20px 0 0 0; color: #71717a; font-size: 13px;">
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
    <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 6px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0; font-weight: 600; color: #065f46; font-size: 14px;">Shipping Label Ready</p>
      <p style="margin: 0 0 12px 0; color: #065f46; font-size: 14px;">
        Your prepaid shipping label is ready. Please ship within 3 business days.
        ${params.trackingNumber ? `<br>Tracking: <strong>${params.trackingNumber}</strong>` : ""}
      </p>
      <a href="${params.labelUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 8px 20px; border-radius: 4px; text-decoration: none; font-weight: 600; font-size: 13px;">Download Label</a>
    </div>`
    : `<p style="margin: 20px 0; color: #71717a; font-size: 14px;">Please arrange shipping with the buyer through messages.</p>`;

  return emailWrapper(`
    <h2 style="margin: 0 0 8px 0; color: #18181b; font-size: 24px;">Your item sold!</h2>
    <p style="margin: 0 0 20px 0; color: #71717a; font-size: 16px;">
      Congrats, ${params.sellerName}!
    </p>

    <div style="background-color: #fafafa; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 4px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Item</p>
      <p style="margin: 0 0 16px 0; color: #18181b; font-size: 16px; font-weight: 600;">${params.itemName}</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 6px 0; color: #3f3f46; font-size: 14px;">Sale price</td>
          <td style="padding: 6px 0; color: #18181b; font-size: 14px; text-align: right;">$${saleAmount.toFixed(2)} CAD</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #3f3f46; font-size: 14px;">Platform fee</td>
          <td style="padding: 6px 0; color: #ef4444; font-size: 14px; text-align: right;">-$${fee.toFixed(2)} CAD</td>
        </tr>
        <tr>
          <td style="padding: 8px 0 0 0; color: #18181b; font-size: 16px; font-weight: 600; border-top: 1px solid #e4e4e7;">Your payout</td>
          <td style="padding: 8px 0 0 0; color: #10b981; font-size: 16px; font-weight: 600; text-align: right; border-top: 1px solid #e4e4e7;">$${payout.toFixed(2)} CAD</td>
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
    ? `<p style="margin: 12px 0 0 0; color: #3f3f46; font-size: 14px;">Tracking number: <strong>${params.trackingNumber}</strong></p>`
    : `<p style="margin: 12px 0 0 0; color: #71717a; font-size: 14px;">Tracking info will be available once the item ships.</p>`;

  return emailWrapper(`
    <h2 style="margin: 0 0 8px 0; color: #18181b; font-size: 24px;">Rental Confirmed</h2>
    <p style="margin: 0 0 20px 0; color: #71717a; font-size: 16px;">
      You're all set, ${params.renterName}!
    </p>

    <div style="background-color: #fafafa; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 4px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Item</p>
      <p style="margin: 0 0 16px 0; color: #18181b; font-size: 16px; font-weight: 600;">${params.itemName}</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 6px 0; color: #3f3f46; font-size: 14px;">Rental fee</td>
          <td style="padding: 6px 0; color: #18181b; font-size: 14px; text-align: right;">$${rental.toFixed(2)} CAD</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #3f3f46; font-size: 14px;">Security deposit (hold)</td>
          <td style="padding: 6px 0; color: #71717a; font-size: 14px; text-align: right;">$${deposit.toFixed(2)} CAD</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #eff6ff; border: 1px solid #3b82f6; border-radius: 6px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
        <strong>About your deposit:</strong> The security deposit is a hold on your card, not a charge. It will be released automatically once the item is returned in good condition. A prepaid return label will be included with your shipment.
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
    <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 6px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0; font-weight: 600; color: #065f46; font-size: 14px;">Shipping Labels Ready</p>
      <p style="margin: 0 0 12px 0; color: #065f46; font-size: 14px;">
        Your outbound shipping label is ready. A return label has also been generated — include it in the package.
        ${params.trackingNumber ? `<br>Tracking: <strong>${params.trackingNumber}</strong>` : ""}
      </p>
      <a href="${params.labelUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 8px 20px; border-radius: 4px; text-decoration: none; font-weight: 600; font-size: 13px;">Download Label</a>
    </div>`
    : `<p style="margin: 20px 0; color: #71717a; font-size: 14px;">Please arrange handoff with the renter through messages.</p>`;

  return emailWrapper(`
    <h2 style="margin: 0 0 8px 0; color: #18181b; font-size: 24px;">Your item was rented!</h2>
    <p style="margin: 0 0 20px 0; color: #71717a; font-size: 16px;">
      Great news, ${params.sellerName}!
    </p>

    <div style="background-color: #fafafa; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 4px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Item</p>
      <p style="margin: 0 0 16px 0; color: #18181b; font-size: 16px; font-weight: 600;">${params.itemName}</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 6px 0; color: #3f3f46; font-size: 14px;">Rental fee received</td>
          <td style="padding: 6px 0; color: #18181b; font-size: 14px; text-align: right;">$${rental.toFixed(2)} CAD</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #3f3f46; font-size: 14px;">Security deposit held</td>
          <td style="padding: 6px 0; color: #71717a; font-size: 14px; text-align: right;">$${deposit.toFixed(2)} CAD</td>
        </tr>
      </table>
    </div>

    ${labelBlock}
  `);
}
