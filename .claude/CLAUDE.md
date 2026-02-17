# The Carry Exchange — Project Memory

## Shipping Decision: Shippo
- **Chosen provider:** Shippo (https://goshippo.com)
- **Why:** Node.js SDK fits our Next.js stack, native return label support via `is_return: true` flag, 85+ carriers with pre-negotiated rates, free tier (30 labels/month) includes API access
- **npm package:** `shippo`
- **Key use case — Rental flow:**
  1. Rental initiated → Stripe PaymentIntent with `capture_method: manual` (holds deposit on renter's card)
  2. Shippo generates outbound label + prepaid return label (with `is_return: true`)
  3. Return label included in package for renter
  4. Shippo webhook fires tracking updates to `/api/shipping/webhook`
  5. On `delivered` status for return shipment → Stripe API releases deposit hold (cancel uncaptured PaymentIntent)
  6. If return not received within rental window + grace period → capture the held deposit
- **Webhook security:** HMAC validation via `X-Hmac-Signature` header
- **Return label expiration:** USPS ~60 days, UPS/FedEx ~1 year — generate return label closer to return date for short rentals
- **Canada-first strategy:** Shippo has direct Canada Post partnership with master account rates (no separate CP business account needed). Covers domestic CA + CA→US cross-border. Can add Purolator/UPS Canada credentials later for carrier diversification. Canada Post return labels work with same `is_return: true` flag.
- **Primary corridors:** 1) Within Canada (Canada Post via Shippo), 2) Canada → US (Canada Post cross-border), 3) US → Canada/domestic (USPS via Shippo)
- **Risk note:** Canada Post labor disputes possible — plan to add Purolator as backup carrier in Shippo
- **Status:** Shippo Starter account created. Test API key saved to `.env.local`. Integration not yet started.
- **Env var:** `SHIPPO_API_KEY` in `.env.local` (test mode). Will add to Vercel when shipping API routes are built.

## Design System
- **Buttons (Option D "Bold Dark"):**
  - Primary: `bg-orange-700 text-white font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-900/50`
  - Secondary: `bg-zinc-800/80 text-white border border-zinc-600 font-semibold hover:border-orange-500/50 hover:bg-zinc-700/80 transition`
- **Dark theme:** bg-black / bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900, zinc-900 cards, orange-500 accents
- **Logo:** `/icon-new-white.png` (white version), `/icon-new-dark.png` (dark version)

## Tech Stack
- Next.js + Turbopack on Vercel
- Supabase backend (project: `tkdgkirxdpdtfwlnmbin`)
- Stripe for payments
- Shippo for shipping (pending integration)
- GitHub repo: `chris-briden/edc-exchange`
- Vercel project: `prj_afLdHnvX0c8l4Wg1HIOTYq2jog7x`
- Team: `team_AzWtbcdztRZwmFxLAhgFsRbt`

## Tagline
The Carry Exchange — Buy, Sell, Trade & Rent Everyday Carry
