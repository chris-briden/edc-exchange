-- ============================================================
-- EDC Exchange — Test Data Seed Script
-- Run this in the Supabase SQL Editor
--
-- Creates 5 test users (all with password: Password123!)
--   1. BladeRunner_EDC  — bladerunner@test.com
--   2. LumenJunkie      — lumenjunkie@test.com
--   3. TitaniumTom      — titom@test.com
--   4. PenPalDave       — penpal@test.com
--   5. EDCNewbie        — edcnewbie@test.com
-- ============================================================

DO $$
DECLARE
  -- User IDs
  uid1 uuid := gen_random_uuid();
  uid2 uuid := gen_random_uuid();
  uid3 uuid := gen_random_uuid();
  uid4 uuid := gen_random_uuid();
  uid5 uuid := gen_random_uuid();

  -- Category IDs (looked up from existing seed)
  cat_knives     uuid;
  cat_flashlights uuid;
  cat_pens       uuid;
  cat_multitools uuid;
  cat_fidget     uuid;
  cat_wallets    uuid;
  cat_watches    uuid;
  cat_bags       uuid;

  -- Item IDs (so we can reference them for comments, likes, messages, loadouts)
  item1  uuid := gen_random_uuid();
  item2  uuid := gen_random_uuid();
  item3  uuid := gen_random_uuid();
  item4  uuid := gen_random_uuid();
  item5  uuid := gen_random_uuid();
  item6  uuid := gen_random_uuid();
  item7  uuid := gen_random_uuid();
  item8  uuid := gen_random_uuid();
  item9  uuid := gen_random_uuid();
  item10 uuid := gen_random_uuid();
  item11 uuid := gen_random_uuid();
  item12 uuid := gen_random_uuid();
  item13 uuid := gen_random_uuid();
  item14 uuid := gen_random_uuid();
  item15 uuid := gen_random_uuid();
  item16 uuid := gen_random_uuid();

  -- Post IDs
  post1 uuid := gen_random_uuid();
  post2 uuid := gen_random_uuid();
  post3 uuid := gen_random_uuid();
  post4 uuid := gen_random_uuid();
  post5 uuid := gen_random_uuid();

  -- Loadout IDs
  loadout1 uuid := gen_random_uuid();
  loadout2 uuid := gen_random_uuid();
  loadout3 uuid := gen_random_uuid();

  pw_hash text;
BEGIN
  -- ============================================================
  -- Look up category IDs
  -- ============================================================
  SELECT id INTO cat_knives      FROM public.categories WHERE slug = 'knives';
  SELECT id INTO cat_flashlights FROM public.categories WHERE slug = 'flashlights';
  SELECT id INTO cat_pens        FROM public.categories WHERE slug = 'pens';
  SELECT id INTO cat_multitools  FROM public.categories WHERE slug = 'multi-tools';
  SELECT id INTO cat_fidget      FROM public.categories WHERE slug = 'fidget';
  SELECT id INTO cat_wallets     FROM public.categories WHERE slug = 'wallets';
  SELECT id INTO cat_watches     FROM public.categories WHERE slug = 'watches';
  SELECT id INTO cat_bags        FROM public.categories WHERE slug = 'bags';

  -- Shared password hash
  pw_hash := crypt('Password123!', gen_salt('bf'));

  -- ============================================================
  -- 1. CREATE AUTH USERS
  --    The handle_new_user() trigger auto-creates profiles
  -- ============================================================
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, role, aud, created_at, updated_at)
  VALUES
    (uid1, '00000000-0000-0000-0000-000000000000', 'bladerunner@test.com', pw_hash, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     jsonb_build_object('user_name', 'BladeRunner_EDC', 'full_name', 'Jake Morrison'),
     'authenticated', 'authenticated', now() - interval '90 days', now()),

    (uid2, '00000000-0000-0000-0000-000000000000', 'lumenjunkie@test.com', pw_hash, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     jsonb_build_object('user_name', 'LumenJunkie', 'full_name', 'Sarah Chen'),
     'authenticated', 'authenticated', now() - interval '60 days', now()),

    (uid3, '00000000-0000-0000-0000-000000000000', 'titom@test.com', pw_hash, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     jsonb_build_object('user_name', 'TitaniumTom', 'full_name', 'Tom Reeves'),
     'authenticated', 'authenticated', now() - interval '120 days', now()),

    (uid4, '00000000-0000-0000-0000-000000000000', 'penpal@test.com', pw_hash, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     jsonb_build_object('user_name', 'PenPalDave', 'full_name', 'Dave Nguyen'),
     'authenticated', 'authenticated', now() - interval '30 days', now()),

    (uid5, '00000000-0000-0000-0000-000000000000', 'edcnewbie@test.com', pw_hash, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     jsonb_build_object('user_name', 'EDCNewbie', 'full_name', 'Alex Taylor'),
     'authenticated', 'authenticated', now() - interval '7 days', now());

  -- ============================================================
  -- 1b. CREATE AUTH IDENTITIES (required for email login)
  -- ============================================================
  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES
    (gen_random_uuid(), uid1,
     jsonb_build_object('sub', uid1::text, 'email', 'bladerunner@test.com', 'email_verified', true, 'phone_verified', false),
     'email', uid1::text, now(), now() - interval '90 days', now()),
    (gen_random_uuid(), uid2,
     jsonb_build_object('sub', uid2::text, 'email', 'lumenjunkie@test.com', 'email_verified', true, 'phone_verified', false),
     'email', uid2::text, now(), now() - interval '60 days', now()),
    (gen_random_uuid(), uid3,
     jsonb_build_object('sub', uid3::text, 'email', 'titom@test.com', 'email_verified', true, 'phone_verified', false),
     'email', uid3::text, now(), now() - interval '120 days', now()),
    (gen_random_uuid(), uid4,
     jsonb_build_object('sub', uid4::text, 'email', 'penpal@test.com', 'email_verified', true, 'phone_verified', false),
     'email', uid4::text, now(), now() - interval '30 days', now()),
    (gen_random_uuid(), uid5,
     jsonb_build_object('sub', uid5::text, 'email', 'edcnewbie@test.com', 'email_verified', true, 'phone_verified', false),
     'email', uid5::text, now(), now() - interval '7 days', now());

  -- ============================================================
  -- 2. UPDATE PROFILES (trigger created them, now add details)
  -- ============================================================
  UPDATE public.profiles SET
    bio = 'Knife collector and reviewer. 15+ years in the EDC game. Always hunting for the next grail.',
    location = 'Portland, OR',
    website = 'https://bladerunner-edc.com'
  WHERE id = uid1;

  UPDATE public.profiles SET
    bio = 'Flashlight enthusiast. If it emits photons, I want it. Hank light addict.',
    location = 'Austin, TX',
    website = 'https://lumenjunkie.blog'
  WHERE id = uid2;

  UPDATE public.profiles SET
    bio = 'Ti everything. Custom scales, clips, and beads. Machinist by trade, collector by obsession.',
    location = 'Denver, CO'
  WHERE id = uid3;

  UPDATE public.profiles SET
    bio = 'Writing instrument nerd. Bolt-actions are life. Fountain pen curious.',
    location = 'Seattle, WA'
  WHERE id = uid4;

  UPDATE public.profiles SET
    bio = 'Just got into EDC! Learning the ropes and building my first real carry.',
    location = 'Chicago, IL'
  WHERE id = uid5;

  -- ============================================================
  -- 3. CREATE ITEMS (16 listings across all categories & types)
  -- ============================================================
  INSERT INTO public.items (id, user_id, category_id, name, brand, description, condition,
    listing_type, price, rent_price, tags, status, shipping_cost, ships_from_country,
    accepts_returns, box_and_docs, views_count, favorites_count, created_at, updated_at)
  VALUES
    -- KNIVES
    (item1, uid1, cat_knives, 'Benchmade Bugout 535', 'Benchmade',
     'Lightweight EDC folder. AXIS lock, S30V steel, blue Grivory handles. Carried for 3 months, factory edge still sharp. Comes with original box and bag.',
     'Like New', 'sell', 125.00, NULL,
     ARRAY['benchmade','bugout','lightweight','s30v','axis-lock'], 'active',
     8.00, 'US', false, 'box', 234, 47,
     now() - interval '3 days', now() - interval '3 days'),

    (item2, uid3, cat_knives, 'Chris Reeve Large Sebenza 31', 'Chris Reeve Knives',
     'DOB: Jan 2025. Glass blast titanium handles, S45VN steel. Carried sparingly to the office, no snail trails. Includes all CRK goodies — box, cloth, grease, wrench, card.',
     'Like New', 'sell', 425.00, NULL,
     ARRAY['crk','sebenza','grail','s45vn','titanium','framelock'], 'active',
     12.00, 'US', true, 'complete', 891, 156,
     now() - interval '2 days', now() - interval '2 days'),

    (item3, uid5, cat_knives, 'Civivi Elementum', 'Civivi',
     'Great budget knife. D2 steel, green micarta handles. Perfect starter knife. Selling because I upgraded to an S35VN version.',
     'Good', 'sell', 42.00, NULL,
     ARRAY['civivi','elementum','budget','d2','micarta'], 'active',
     6.00, 'US', false, 'box', 78, 12,
     now() - interval '5 days', now() - interval '5 days'),

    -- FLASHLIGHTS
    (item4, uid2, cat_flashlights, 'Emisar D4V2 Titanium', 'Emisar/Hank',
     'Raw titanium D4V2 with SST-20 4000K emitters. Beautiful patina forming. Includes 18650 battery and magnetic tail cap. Aux LEDs set to cyan.',
     'Good', 'trade', NULL, NULL,
     ARRAY['emisar','d4v2','titanium','hank','sst20','18650'], 'active',
     10.00, 'US', false, 'box', 445, 83,
     now() - interval '6 days', now() - interval '6 days'),

    (item5, uid2, cat_flashlights, 'Olight Warrior Mini 2', 'Olight',
     'Desert Tan limited edition. 1750 lumens, magnetic tail cap, MCC charging cable included. Brand new in box, won this in a giveaway.',
     'New', 'sell', 65.00, NULL,
     ARRAY['olight','warrior','tactical','limited-edition','desert-tan'], 'active',
     5.00, 'US', false, 'complete', 156, 29,
     now() - interval '7 days', now() - interval '7 days'),

    (item6, uid1, cat_flashlights, 'Wurkkos FC11', 'Wurkkos',
     'Amazing budget light. LH351D 5000K, USB-C charging, great tint. My go-to recommendation for beginners.',
     'Excellent', 'showcase', NULL, NULL,
     ARRAY['wurkkos','budget','usb-c','high-cri','lh351d'], 'active',
     NULL, 'US', false, 'box', 67, 18,
     now() - interval '10 days', now() - interval '10 days'),

    -- PENS
    (item7, uid4, cat_pens, 'Tactile Turn Bolt Action Short', 'Tactile Turn',
     'Titanium bolt-action pen, short size. Incredibly satisfying action with perfect detent. Takes Pilot G2 refills. Minimal carry marks.',
     'Excellent', 'sell', 89.00, NULL,
     ARRAY['tactile-turn','bolt-action','titanium','pen','short'], 'active',
     6.00, 'US', false, 'box', 312, 62,
     now() - interval '3 days', now() - interval '3 days'),

    (item8, uid4, cat_pens, 'BigiDesign Ti Click EDC', 'BigiDesign',
     'Titanium click pen with deep carry clip. Stonewash finish. Accepts Parker-style refills. Great pen at a fair price.',
     'Like New', 'trade', NULL, NULL,
     ARRAY['bigidesign','titanium','click','parker-refill'], 'active',
     5.00, 'US', false, 'box', 98, 22,
     now() - interval '8 days', now() - interval '8 days'),

    -- MULTI-TOOLS
    (item9, uid3, cat_multitools, 'Leatherman Wave+', 'Leatherman',
     'The classic EDC multi-tool. Replaceable wire cutters, excellent pliers. Comes with genuine leather sheath. Some light scratches from honest use.',
     'Good', 'lend', NULL, NULL,
     ARRAY['leatherman','wave','multi-tool','classic','pliers'], 'active',
     NULL, 'US', false, 'none', 201, 35,
     now() - interval '5 days', now() - interval '5 days'),

    (item10, uid1, cat_multitools, 'Victorinox Compact', 'Victorinox',
     'The best SAK for EDC, period. Scissors, combo blade, pen, pressurized refill. 91mm red Alox scales. My daily carry for years.',
     'Good', 'showcase', NULL, NULL,
     ARRAY['victorinox','sak','compact','alox','swiss-army'], 'active',
     NULL, 'US', false, 'none', 143, 41,
     now() - interval '14 days', now() - interval '14 days'),

    -- FIDGET GEAR
    (item11, uid3, cat_fidget, 'Billetspin Gambit Spinner', 'Billetspin',
     'Zirc and copper Gambit spinner. Incredible spin time, amazing acoustics. Perfect desk fidget for meetings. Try-before-you-buy.',
     'Excellent', 'rent', NULL, '$5/week',
     ARRAY['billetspin','spinner','zirconium','copper','fidget'], 'active',
     8.00, 'US', false, 'box', 187, 44,
     now() - interval '8 days', now() - interval '8 days'),

    -- WALLETS
    (item12, uid1, cat_wallets, 'Ridge Wallet Titanium', 'The Ridge',
     'Titanium Ridge wallet with money clip. Holds 12 cards comfortably. Switched to a different carry system.',
     'Like New', 'trade', NULL, NULL,
     ARRAY['ridge','wallet','titanium','minimalist','money-clip'], 'active',
     6.00, 'US', false, 'complete', 267, 38,
     now() - interval '9 days', now() - interval '9 days'),

    (item13, uid5, cat_wallets, 'Bellroy Note Sleeve', 'Bellroy',
     'Slim leather wallet in charcoal. Has the hidden coin pouch. Great wallet but I went full minimalist with a card holder.',
     'Good', 'sell', 55.00, NULL,
     ARRAY['bellroy','leather','slim','note-sleeve'], 'active',
     5.00, 'US', false, 'none', 54, 8,
     now() - interval '4 days', now() - interval '4 days'),

    -- WATCHES
    (item14, uid3, cat_watches, 'Casio G-Shock DW5600E', 'Casio',
     'The OG square G-Shock. Bombproof, 200m WR, 7-year battery. This is the watch that goes with everything.',
     'Excellent', 'showcase', NULL, NULL,
     ARRAY['casio','g-shock','square','dw5600','classic','digital'], 'active',
     NULL, 'US', false, 'box', 334, 72,
     now() - interval '12 days', now() - interval '12 days'),

    (item15, uid2, cat_watches, 'Seiko SNK809', 'Seiko',
     'Automatic field watch on a NATO strap. 37mm case wears perfectly. Day-date display. Keeping great time at +8s/day.',
     'Good', 'sell', 95.00, NULL,
     ARRAY['seiko','snk809','automatic','field-watch','nato'], 'active',
     8.00, 'US', true, 'box', 198, 45,
     now() - interval '6 days', now() - interval '6 days'),

    -- BAGS
    (item16, uid4, cat_bags, 'Maxpedition Micro Pocket Organizer', 'Maxpedition',
     'Tan Micro organizer. Perfect for keeping your EDC sorted in a bag. Multiple elastic loops and mesh pocket inside.',
     'Like New', 'sell', 22.00, NULL,
     ARRAY['maxpedition','organizer','pouch','molle','tan'], 'active',
     4.00, 'US', false, 'none', 89, 15,
     now() - interval '11 days', now() - interval '11 days');

  -- ============================================================
  -- 4. CREATE COMMUNITY POSTS
  -- ============================================================
  INSERT INTO public.posts (id, user_id, type, title, content, tags, created_at, updated_at)
  VALUES
    (post1, uid3, 'collection',
     'My Titanium Tuesday carry - all Ti everything',
     'Finally completed my all-titanium loadout. CRK Sebenza, Emisar D4V2 Ti, Tactile Turn pen, and a Ti Ridge wallet. Took 2 years to put this together. The weight savings are real but honestly I just love the feel and look of titanium. What do you think?',
     ARRAY['titanium-tuesday','collection','grails','titanium'],
     now() - interval '1 day', now() - interval '1 day'),

    (post2, uid1, 'review',
     'Benchmade Bugout - 6 Month Review (Honest Take)',
     'After carrying the Bugout daily for 6 months, here are my real thoughts. The lightweight design is incredible for pocket carry — you genuinely forget it''s there. The AXIS lock is addictive to fidget with. S30V holds up well for general EDC tasks like breaking down boxes and opening packages. The thin handle scales feel less substantial than I''d like for hard use, but that''s not really what this knife is for. Would I buy it again? Absolutely. It''s earned its spot in my rotation.',
     ARRAY['review','benchmade','bugout','honest-review','6-month'],
     now() - interval '2 days', now() - interval '2 days'),

    (post3, uid4, 'discussion',
     'What''s your unpopular EDC opinion?',
     'I''ll go first: Victorinox SAKs are more practical than 90% of "tactical" knives out there. They''re lighter, legal almost everywhere, and the tool selection is actually useful for real-world tasks. A Compact or Pioneer does more for me daily than any $400 framelock ever has. Fight me.',
     ARRAY['discussion','hot-take','unpopular-opinion','sak'],
     now() - interval '3 days', now() - interval '3 days'),

    (post4, uid2, 'photo',
     'New light day! Emisar D4V2 in copper',
     'Just arrived and this thing is gorgeous. The weight, the machining, the instant turbo ramp. I may have a problem... this is my 4th D4V2 (Ti, aluminum, brass, and now copper). The copper will patina beautifully over time. Anyone else addicted to Hank lights?',
     ARRAY['new-pickup','emisar','flashlight','copper','hank-light'],
     now() - interval '4 days', now() - interval '4 days'),

    (post5, uid5, 'discussion',
     'Just getting into EDC - what should I buy first?',
     'Hey everyone! I just discovered this community and I''m amazed by all the gear people carry. I have a basic Swiss Army knife and that''s about it. What would you recommend as the essential pieces for a solid everyday carry? Budget is around $150-200 total. I work in an office if that matters. Thanks in advance!',
     ARRAY['newbie','help','recommendations','budget','first-edc'],
     now() - interval '5 days', now() - interval '5 days');

  -- ============================================================
  -- 5. CREATE COMMENTS
  -- ============================================================
  -- Comments on items
  INSERT INTO public.comments (user_id, item_id, content, created_at) VALUES
    (uid2, item1, 'Great price for a Bugout! GLWS.', now() - interval '2 days'),
    (uid3, item1, 'PM sent — interested!', now() - interval '2 days'),
    (uid5, item2, 'This is my dream knife. One day...', now() - interval '1 day'),
    (uid1, item2, 'CRKs are worth every penny. The fit and finish is unmatched.', now() - interval '1 day'),
    (uid4, item4, 'What would you want in trade? I have some pens.', now() - interval '5 days'),
    (uid2, item4, 'Looking for other Hank lights or a nice SAK.', now() - interval '5 days'),
    (uid3, item7, 'Tactile Turn makes the best bolt actions, period.', now() - interval '2 days'),
    (uid1, item7, 'Seconds? Any issues with it?', now() - interval '2 days'),
    (uid4, item7, 'No issues, just have too many pens! First owner, purchased direct from TT.', now() - interval '1 day'),
    (uid5, item9, 'Would love to borrow this for a camping trip next month!', now() - interval '4 days'),
    (uid1, item15, 'The SNK809 is one of the best values in watches. Love mine.', now() - interval '5 days'),
    (uid3, item15, 'Solid price. What NATO strap is that?', now() - interval '5 days');

  -- Comments on posts
  INSERT INTO public.comments (user_id, post_id, content, created_at) VALUES
    (uid1, post1, 'That loadout is insane. What''s the total damage on all that Ti?', now() - interval '1 day'),
    (uid2, post1, 'Goals right here. I''m working on an all-copper loadout myself.', now() - interval '12 hours'),
    (uid4, post1, 'The TT short is *chef''s kiss* in titanium. Best pen I own.', now() - interval '6 hours'),
    (uid3, post2, 'Agreed on the handle scales. Have you tried aftermarket G10 or Ti scales?', now() - interval '1 day'),
    (uid4, post2, 'I replaced mine with Flytanium Ti scales and it''s a whole different knife. Highly recommend.', now() - interval '20 hours'),
    (uid1, post3, 'Honestly I agree. My Victorinox Compact sees more pocket time than my Sebenza.', now() - interval '2 days'),
    (uid2, post3, 'Unpopular opinion: most people don''t need a dedicated flashlight. Phone lights are fine.', now() - interval '2 days'),
    (uid3, post3, '*gasp* You take that back! My D4V2 does things no phone light could dream of.', now() - interval '2 days'),
    (uid5, post3, 'As a newbie, SAKs are where I started and I love mine!', now() - interval '1 day'),
    (uid1, post4, 'Copper D4V2 is on my list. How''s the weight compared to Ti?', now() - interval '3 days'),
    (uid3, post4, 'Noticeably heavier but the heft feels premium. Plus the patina will be amazing.', now() - interval '3 days'),
    (uid1, post5, 'Welcome! Start with a good knife (Civivi Elementum), a flashlight (Wurkkos FC11), and a decent pen. You''re set for under $100.', now() - interval '4 days'),
    (uid3, post5, 'Agreed with BladeRunner. Don''t go down the grail rabbit hole immediately. Start practical, then refine.', now() - interval '4 days'),
    (uid4, post5, 'For pens, the Zebra F-701 is $8 and incredibly solid. Great starting point before you go titanium crazy.', now() - interval '4 days'),
    (uid2, post5, 'For a light, Sofirn SP35 or Wurkkos FC11 are unbeatable at the $25-30 range. Welcome to the community!', now() - interval '3 days');

  -- ============================================================
  -- 6. CREATE LIKES (on items and posts)
  -- ============================================================
  -- Likes on items
  INSERT INTO public.likes (user_id, item_id, created_at) VALUES
    (uid2, item1, now() - interval '2 days'),
    (uid3, item1, now() - interval '2 days'),
    (uid4, item1, now() - interval '1 day'),
    (uid5, item2, now() - interval '1 day'),
    (uid1, item2, now() - interval '1 day'),
    (uid4, item2, now() - interval '12 hours'),
    (uid1, item4, now() - interval '5 days'),
    (uid3, item4, now() - interval '4 days'),
    (uid5, item4, now() - interval '3 days'),
    (uid1, item7, now() - interval '2 days'),
    (uid2, item7, now() - interval '2 days'),
    (uid3, item7, now() - interval '1 day'),
    (uid5, item7, now() - interval '1 day'),
    (uid2, item9, now() - interval '4 days'),
    (uid4, item9, now() - interval '3 days'),
    (uid1, item11, now() - interval '7 days'),
    (uid2, item11, now() - interval '6 days'),
    (uid4, item11, now() - interval '5 days'),
    (uid1, item14, now() - interval '11 days'),
    (uid2, item14, now() - interval '10 days'),
    (uid4, item14, now() - interval '9 days'),
    (uid5, item14, now() - interval '8 days'),
    (uid1, item15, now() - interval '5 days'),
    (uid3, item15, now() - interval '4 days'),
    (uid5, item3, now() - interval '4 days');

  -- Likes on posts
  INSERT INTO public.likes (user_id, post_id, created_at) VALUES
    (uid1, post1, now() - interval '1 day'),
    (uid2, post1, now() - interval '1 day'),
    (uid4, post1, now() - interval '12 hours'),
    (uid5, post1, now() - interval '6 hours'),
    (uid3, post2, now() - interval '2 days'),
    (uid4, post2, now() - interval '1 day'),
    (uid5, post2, now() - interval '1 day'),
    (uid1, post3, now() - interval '3 days'),
    (uid2, post3, now() - interval '3 days'),
    (uid3, post3, now() - interval '2 days'),
    (uid5, post3, now() - interval '2 days'),
    (uid1, post4, now() - interval '4 days'),
    (uid3, post4, now() - interval '3 days'),
    (uid5, post4, now() - interval '3 days'),
    (uid1, post5, now() - interval '5 days'),
    (uid2, post5, now() - interval '4 days'),
    (uid3, post5, now() - interval '4 days'),
    (uid4, post5, now() - interval '3 days');

  -- ============================================================
  -- 7. CREATE FOLLOWERS (social graph)
  -- ============================================================
  INSERT INTO public.followers (follower_id, following_id, created_at) VALUES
    -- Everyone follows TitaniumTom (most popular)
    (uid1, uid3, now() - interval '30 days'),
    (uid2, uid3, now() - interval '25 days'),
    (uid4, uid3, now() - interval '20 days'),
    (uid5, uid3, now() - interval '5 days'),
    -- BladeRunner and LumenJunkie follow each other
    (uid1, uid2, now() - interval '28 days'),
    (uid2, uid1, now() - interval '27 days'),
    -- PenPalDave follows BladeRunner and LumenJunkie
    (uid4, uid1, now() - interval '15 days'),
    (uid4, uid2, now() - interval '14 days'),
    -- EDCNewbie follows everyone (eager newbie)
    (uid5, uid1, now() - interval '6 days'),
    (uid5, uid2, now() - interval '6 days'),
    (uid5, uid4, now() - interval '5 days'),
    -- TitaniumTom follows BladeRunner
    (uid3, uid1, now() - interval '60 days'),
    -- LumenJunkie follows PenPalDave
    (uid2, uid4, now() - interval '10 days');

  -- ============================================================
  -- 8. CREATE MESSAGES (conversations between users)
  -- ============================================================
  INSERT INTO public.messages (sender_id, receiver_id, item_id, content, is_read, created_at) VALUES
    -- uid3 inquiring about uid1's Bugout
    (uid3, uid1, item1, 'Hey, is the Bugout still available? Would you consider $110?', true, now() - interval '2 days'),
    (uid1, uid3, item1, 'Hey! Yes it''s still available. I''m pretty firm at $125 — it''s barely been carried.', true, now() - interval '2 days' + interval '1 hour'),
    (uid3, uid1, item1, 'Fair enough. Let me think about it. Do you have more photos of the blade?', true, now() - interval '2 days' + interval '2 hours'),
    (uid1, uid3, item1, 'Sure, I''ll post some close-ups tonight. The edge is still factory sharp.', true, now() - interval '1 day'),

    -- uid4 wanting to trade pens for uid2's D4V2
    (uid4, uid2, item4, 'Hi! Interested in a trade for the D4V2 Ti. I have a BigiDesign Ti Click and a Tactile Turn — interested in either?', true, now() - interval '5 days'),
    (uid2, uid4, item4, 'The Tactile Turn is tempting! Is it the short or standard size?', true, now() - interval '5 days' + interval '3 hours'),
    (uid4, uid2, item4, 'Short size in titanium. It''s in excellent condition, just prefer my other pens.', true, now() - interval '4 days'),
    (uid2, uid4, item4, 'Let me think on it — a TT short would be a nice addition to my carry.', false, now() - interval '4 days' + interval '2 hours'),

    -- uid5 asking uid3 about the Leatherman lend
    (uid5, uid3, item9, 'Hey Tom! I saw you''re lending out the Wave+. I''m going camping in March, would love to borrow it for a week. I''ll take great care of it!', true, now() - interval '3 days'),
    (uid3, uid5, item9, 'Hey Alex! Sure, happy to lend it. Just cover shipping both ways and we''re good. Where are you located?', true, now() - interval '3 days' + interval '1 hour'),
    (uid5, uid3, item9, 'I''m in Chicago! That would be awesome. I''ll DM you my address closer to the date.', false, now() - interval '2 days'),

    -- General chat between uid1 and uid2
    (uid1, uid2, NULL, 'Hey Sarah, have you seen the new Emisar DT8? Thinking about picking one up.', true, now() - interval '1 day'),
    (uid2, uid1, NULL, 'YES. The DT8 is insane — 8 emitters in a compact body. I pre-ordered the Ti version.', true, now() - interval '1 day' + interval '30 minutes'),
    (uid1, uid2, NULL, 'Of course you did haha. Let me know how it is when it arrives!', false, now() - interval '1 day' + interval '1 hour');

  -- ============================================================
  -- 9. CREATE EDC LOADOUTS
  -- ============================================================
  INSERT INTO public.edc_loadouts (id, user_id, name, description, is_primary, created_at, updated_at) VALUES
    (loadout1, uid3, 'Titanium Tuesday', 'All-titanium everyday carry. Maximum flex.', true,
     now() - interval '30 days', now() - interval '1 day'),
    (loadout2, uid1, 'Daily Driver', 'My go-to practical carry. Reliable and proven.', true,
     now() - interval '20 days', now() - interval '3 days'),
    (loadout3, uid2, 'Night Shift Kit', 'Optimized for late-night carry. Extra lumens.', false,
     now() - interval '15 days', now() - interval '6 days');

  -- ============================================================
  -- 10. LOADOUT ITEMS
  -- ============================================================
  INSERT INTO public.edc_loadout_items (loadout_id, item_id, position) VALUES
    -- TitaniumTom's Ti loadout
    (loadout1, item2, 0),   -- CRK Sebenza
    (loadout1, item11, 1),  -- Billetspin spinner
    (loadout1, item14, 2),  -- G-Shock

    -- BladeRunner's daily driver
    (loadout2, item1, 0),   -- Bugout
    (loadout2, item6, 1),   -- Wurkkos FC11
    (loadout2, item10, 2),  -- Victorinox Compact
    (loadout2, item12, 3),  -- Ridge Wallet

    -- LumenJunkie's night shift kit
    (loadout3, item4, 0),   -- Emisar D4V2
    (loadout3, item5, 1),   -- Olight Warrior
    (loadout3, item15, 2);  -- Seiko SNK809

  -- Done!
  RAISE NOTICE 'Seed data created successfully!';
  RAISE NOTICE 'Test accounts (all use password: Password123!):';
  RAISE NOTICE '  bladerunner@test.com  (BladeRunner_EDC)';
  RAISE NOTICE '  lumenjunkie@test.com  (LumenJunkie)';
  RAISE NOTICE '  titom@test.com        (TitaniumTom)';
  RAISE NOTICE '  penpal@test.com       (PenPalDave)';
  RAISE NOTICE '  edcnewbie@test.com    (EDCNewbie)';
END $$;
