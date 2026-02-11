-- ============================================================
-- EDC Exchange — Phase 0 Migration
-- Copy this entire block and paste into the Supabase SQL Editor.
-- Run once. All statements use IF NOT EXISTS / IF EXISTS for safety.
-- ============================================================

-- 0A: Fix handle_new_user security — add SET search_path = ''
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'user_name', new.raw_user_meta_data ->> 'preferred_username'),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 0B: Add location column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location text;

-- 0C: Add new columns to items
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS shipping_cost numeric;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS ships_from_country text DEFAULT 'US';
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS accepts_returns boolean DEFAULT false;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS box_and_docs text DEFAULT 'none';
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS views_count int DEFAULT 0;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS favorites_count int DEFAULT 0;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS last_renewed_at timestamptz DEFAULT now();
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS rental_deposit numeric;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS rental_period text;

-- 0D: Add parent_id to comments for nested/threaded replies
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;

-- 0E: Create increment_views RPC function
CREATE OR REPLACE FUNCTION public.increment_views(p_item_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.items
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = p_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 0F: Performance indexes (IF NOT EXISTS not supported for indexes, use DO block)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_items_category_id') THEN
    CREATE INDEX idx_items_category_id ON public.items(category_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_items_user_id') THEN
    CREATE INDEX idx_items_user_id ON public.items(user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_items_status') THEN
    CREATE INDEX idx_items_status ON public.items(status);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_items_created_at') THEN
    CREATE INDEX idx_items_created_at ON public.items(created_at DESC);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_items_listing_type') THEN
    CREATE INDEX idx_items_listing_type ON public.items(listing_type);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_username') THEN
    CREATE INDEX idx_profiles_username ON public.profiles(username);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_comments_parent_id') THEN
    CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_sender_id') THEN
    CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_receiver_id') THEN
    CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
  END IF;
END $$;
