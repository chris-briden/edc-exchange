-- EDC Exchange Database Schema
-- Already deployed to Supabase — kept here for reference.

-- ============================================================
-- PROFILES (auto-created via handle_new_user trigger on auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'user_name', new.raw_user_meta_data ->> 'preferred_username'),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- CATEGORIES (seeded with 8 EDC categories)
-- ============================================================
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  icon text not null default '',
  description text,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

-- Seed categories
insert into public.categories (name, slug, icon, description) values
  ('Knives', 'knives', '🔪', 'Folding knives, fixed blades, multi-blade knives'),
  ('Flashlights', 'flashlights', '🔦', 'EDC lights, keychain lights, tactical lights'),
  ('Pens', 'pens', '🖊️', 'Tactical pens, fountain pens, bolt-action pens'),
  ('Multi-Tools', 'multi-tools', '🔧', 'Swiss army knives, pliers-based, keychain tools'),
  ('Fidget Gear', 'fidget', '🌀', 'Spinners, sliders, worry coins, fidget tools'),
  ('Wallets', 'wallets', '👛', 'Minimalist wallets, card holders, money clips'),
  ('Watches', 'watches', '⌚', 'Field watches, dive watches, digital, smart'),
  ('Bags & Pouches', 'bags', '🎒', 'Organizer pouches, sling bags, tech rolls')
on conflict (slug) do nothing;

-- ============================================================
-- ITEMS
-- ============================================================
create table if not exists public.items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) not null,
  name text not null,
  brand text,
  description text,
  condition text not null default 'Good',
  listing_type text not null default 'showcase' check (listing_type in ('sell','trade','lend','rent','showcase')),
  price numeric,
  rent_price text,
  tags text[] default '{}',
  status text not null default 'active' check (status in ('active','sold','traded','removed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.items enable row level security;

create policy "Items are viewable by everyone"
  on public.items for select using (true);

create policy "Authenticated users can create items"
  on public.items for insert with check (auth.uid() = user_id);

create policy "Users can update own items"
  on public.items for update using (auth.uid() = user_id);

create policy "Users can delete own items"
  on public.items for delete using (auth.uid() = user_id);

-- ============================================================
-- ITEM IMAGES
-- ============================================================
create table if not exists public.item_images (
  id uuid default gen_random_uuid() primary key,
  item_id uuid references public.items(id) on delete cascade not null,
  url text not null,
  position int not null default 0,
  created_at timestamptz default now()
);

alter table public.item_images enable row level security;

create policy "Item images are viewable by everyone"
  on public.item_images for select using (true);

create policy "Authenticated users can insert item images"
  on public.item_images for insert with check (
    auth.uid() = (select user_id from public.items where id = item_id)
  );

create policy "Users can delete own item images"
  on public.item_images for delete using (
    auth.uid() = (select user_id from public.items where id = item_id)
  );

-- ============================================================
-- POSTS
-- ============================================================
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null default 'discussion' check (type in ('collection','review','discussion','photo')),
  title text not null,
  content text not null default '',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.posts enable row level security;

create policy "Posts are viewable by everyone"
  on public.posts for select using (true);

create policy "Authenticated users can create posts"
  on public.posts for insert with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on public.posts for update using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on public.posts for delete using (auth.uid() = user_id);

-- ============================================================
-- POST IMAGES
-- ============================================================
create table if not exists public.post_images (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  url text not null,
  position int not null default 0,
  created_at timestamptz default now()
);

alter table public.post_images enable row level security;

create policy "Post images are viewable by everyone"
  on public.post_images for select using (true);

create policy "Authenticated users can insert post images"
  on public.post_images for insert with check (
    auth.uid() = (select user_id from public.posts where id = post_id)
  );

-- ============================================================
-- LIKES
-- ============================================================
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  item_id uuid references public.items(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  constraint likes_target check (
    (item_id is not null and post_id is null) or
    (item_id is null and post_id is not null)
  ),
  unique (user_id, item_id),
  unique (user_id, post_id)
);

alter table public.likes enable row level security;

create policy "Likes are viewable by everyone"
  on public.likes for select using (true);

create policy "Authenticated users can like"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Users can remove own likes"
  on public.likes for delete using (auth.uid() = user_id);

-- ============================================================
-- COMMENTS
-- ============================================================
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  item_id uuid references public.items(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  content text not null,
  created_at timestamptz default now(),
  constraint comments_target check (
    (item_id is not null and post_id is null) or
    (item_id is null and post_id is not null)
  )
);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone"
  on public.comments for select using (true);

create policy "Authenticated users can comment"
  on public.comments for insert with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete using (auth.uid() = user_id);

-- ============================================================
-- FOLLOWERS
-- ============================================================
create table if not exists public.followers (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (follower_id, following_id),
  constraint no_self_follow check (follower_id != following_id)
);

alter table public.followers enable row level security;

create policy "Followers are viewable by everyone"
  on public.followers for select using (true);

create policy "Authenticated users can follow"
  on public.followers for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.followers for delete using (auth.uid() = follower_id);

-- ============================================================
-- STORAGE BUCKETS (created via Supabase dashboard)
-- ============================================================
-- item-images   (public, upload for authenticated)
-- post-images   (public, upload for authenticated)
-- avatars       (public, upload for authenticated)
