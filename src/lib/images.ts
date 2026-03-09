/**
 * Curated Unsplash image URLs for The Carry Collective.
 * All images are free for commercial use (Unsplash license).
 * Next.js Image component handles optimization via Vercel's CDN.
 *
 * URL parameters:
 *   w=WIDTH  — desired width
 *   h=HEIGHT — desired height (optional, maintains aspect if omitted)
 *   fit=crop — crop to exact dimensions
 *   crop=center — center the crop
 *   q=80 — quality (80 is a good balance)
 *   auto=format — serve best format (WebP/AVIF) for browser
 */

// ═══════════════════════════════════════════════════════════
// Unsplash photo base IDs (the part after /photo-)
// ═══════════════════════════════════════════════════════════

const UNSPLASH = 'https://images.unsplash.com';

function unsplash(photoId: string, w = 1920, h = 1080): string {
  return `${UNSPLASH}/${photoId}?w=${w}&h=${h}&fit=crop&crop=center&auto=format&q=80`;
}

// ═══════════════════════════════════════════════════════════
// PILLAR HERO IMAGES (used on pillar landing pages)
// ═══════════════════════════════════════════════════════════

export const PILLAR_HEROES = {
  edc: unsplash('photo-1623998023347-273fc1ddf870'),      // Knife + watch on dark surface
  bags: unsplash('photo-1553062407-98eeb64c6a62'),         // Person with backpack outdoors
  travel: unsplash('photo-1763568321881-eaf01c7d7af4'),    // Airport terminal interior
  ruck: unsplash('photo-1476480862126-209bfaa8edc8'),      // Trail running with pack
} as const;

// ═══════════════════════════════════════════════════════════
// PILLAR CARD IMAGES (used on homepage pillar grid)
// ═══════════════════════════════════════════════════════════

export const PILLAR_CARDS = {
  edc: unsplash('photo-1623998023347-273fc1ddf870', 800, 600),
  bags: unsplash('photo-1622260614153-03223fb72052', 800, 600),
  travel: unsplash('photo-1488646953014-85cb44e25828', 800, 600),
  ruck: unsplash('photo-1476480862126-209bfaa8edc8', 800, 600),
} as const;

// ═══════════════════════════════════════════════════════════
// NAV THUMBNAILS (used in mega-menu dropdown)
// ═══════════════════════════════════════════════════════════

export const NAV_THUMBNAILS = {
  edc: unsplash('photo-1623998023347-273fc1ddf870', 200, 200),
  bags: unsplash('photo-1622260614153-03223fb72052', 200, 200),
  travel: unsplash('photo-1488646953014-85cb44e25828', 200, 200),
  ruck: unsplash('photo-1476480862126-209bfaa8edc8', 200, 200),
} as const;

// ═══════════════════════════════════════════════════════════
// EDC SUBCATEGORY IMAGES
// ═══════════════════════════════════════════════════════════

export const EDC_IMAGES = {
  heroes: {
    knives: unsplash('photo-1648488781133-3488576a5879'),     // Benchmade folding knife on dark desk
    flashlights: unsplash('photo-1604527772322-33c8913fec71'), // Tactical flashlight with beam
    pens: unsplash('photo-1585336261022-680e295ce3fe'),        // Premium pen on notebook
    multitools: unsplash('photo-1567361808960-dec9cb578182'),  // Multi-tool opened
    wallets: unsplash('photo-1627123424574-724758594e93'),     // Leather wallet
    accessories: unsplash('photo-1755719401622-1fbc9538a8dd'), // EDC accessories flat lay
  },
  cards: {
    knives: unsplash('photo-1648488781133-3488576a5879', 800, 600),
    flashlights: unsplash('photo-1604527772322-33c8913fec71', 800, 600),
    pens: unsplash('photo-1585336261022-680e295ce3fe', 800, 600),
    multitools: unsplash('photo-1567361808960-dec9cb578182', 800, 600),
    wallets: unsplash('photo-1627123424574-724758594e93', 800, 600),
    accessories: unsplash('photo-1755719401622-1fbc9538a8dd', 800, 600),
  },
} as const;

// ═══════════════════════════════════════════════════════════
// BAGS SUBCATEGORY IMAGES
// ═══════════════════════════════════════════════════════════

export const BAGS_IMAGES = {
  heroes: {
    backpacks: unsplash('photo-1622260614153-03223fb72052'),   // Backpack on trail
    slings: unsplash('photo-1594769651935-dc92194689f8'),       // Man with sling bag urban street
    messengers: unsplash('photo-1577733966973-d680bffd2e80'),  // Messenger bag commuter
    duffels: unsplash('photo-1692342380430-59c8682c9c55'),     // Blue canvas duffel with leather straps
    pouches: unsplash('photo-1596055746427-d5f61aa5df99'),     // Gear organizer flat lay
    totes: unsplash('photo-1542957057-debadce4ce81'),          // Canvas tote bag on bench
  },
  cards: {
    backpacks: unsplash('photo-1622260614153-03223fb72052', 800, 600),
    slings: unsplash('photo-1594769651935-dc92194689f8', 800, 600),
    messengers: unsplash('photo-1577733966973-d680bffd2e80', 800, 600),
    duffels: unsplash('photo-1692342380430-59c8682c9c55', 800, 600),
    pouches: unsplash('photo-1596055746427-d5f61aa5df99', 800, 600),
    totes: unsplash('photo-1542957057-debadce4ce81', 800, 600),
  },
} as const;

// ═══════════════════════════════════════════════════════════
// TRAVEL SUBCATEGORY IMAGES
// ═══════════════════════════════════════════════════════════

export const TRAVEL_IMAGES = {
  heroes: {
    carryon: unsplash('photo-1565026057447-bc90a3dceb87'),     // Carry-on at airport gate
    packing: unsplash('photo-1732605548227-5679cb62193b'),     // Open suitcase being packed
    techkits: unsplash('photo-1519389950473-47ba0277781c'),    // Tech gear on desk
    airlines: unsplash('photo-1771595235302-b0bc0549e6fc'),    // Sunset from airplane window
    accessories: unsplash('photo-1488646953014-85cb44e25828'),  // Travel accessories
    onebag: unsplash('photo-1501785888041-af3ef285b470'),      // One-bag scenic
  },
  cards: {
    carryon: unsplash('photo-1565026057447-bc90a3dceb87', 800, 600),
    packing: unsplash('photo-1732605548227-5679cb62193b', 800, 600),
    techkits: unsplash('photo-1519389950473-47ba0277781c', 800, 600),
    airlines: unsplash('photo-1771595235302-b0bc0549e6fc', 800, 600),
    accessories: unsplash('photo-1488646953014-85cb44e25828', 800, 600),
    onebag: unsplash('photo-1501785888041-af3ef285b470', 800, 600),
  },
} as const;

// ═══════════════════════════════════════════════════════════
// RUCK SUBCATEGORY IMAGES
// ═══════════════════════════════════════════════════════════

export const RUCK_IMAGES = {
  heroes: {
    rucksacks: unsplash('photo-1551632811-561732d1e306'),     // Rucksack mountain trail
    vests: unsplash('photo-1758521958524-4087a1e6f55d'),      // Man lifting weights outdoor gym
    training: unsplash('photo-1517963879433-6ad2b056d712'),   // Outdoor training
    clubs: unsplash('photo-1758599669009-5a9002c09487'),      // Diverse group hiking in forest
    footwear: unsplash('photo-1604223756111-facff9c6eef6'),   // Hiking boot on mountain trail
    events: unsplash('photo-1452626038306-9aae5e071dd3'),     // Fitness event
  },
  cards: {
    rucksacks: unsplash('photo-1551632811-561732d1e306', 800, 600),
    vests: unsplash('photo-1758521958524-4087a1e6f55d', 800, 600),
    training: unsplash('photo-1517963879433-6ad2b056d712', 800, 600),
    clubs: unsplash('photo-1758599669009-5a9002c09487', 800, 600),
    footwear: unsplash('photo-1604223756111-facff9c6eef6', 800, 600),
    events: unsplash('photo-1452626038306-9aae5e071dd3', 800, 600),
  },
} as const;
