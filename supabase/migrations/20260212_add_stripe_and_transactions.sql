-- Migration: Add Stripe Connect + Transactions for payment system
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ejuvhhecjckhoorabiiz/sql

-- 1. Add stripe_account_id to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;

-- 2. Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES items(id),
  buyer_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL,
  stripe_payment_intent_id TEXT NOT NULL,
  security_deposit_payment_intent_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('sale', 'rental')),
  status TEXT NOT NULL DEFAULT 'pending',
  rental_start_date TIMESTAMPTZ,
  rental_end_date TIMESTAMPTZ,
  rental_status TEXT CHECK (rental_status IN ('active', 'returned', 'deposit_captured', 'deposit_released')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Authenticated users can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Service role can update transactions"
  ON transactions FOR UPDATE
  USING (true);
