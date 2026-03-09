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
  edc: unsplash('photo-1590794056226-79ef3a8147e1'),      // EDC flat lay on dark surface
  bags: unsplash('photo-1553062407-98eeb64c6a62'),         // Person with backpack outdoors
  travel: unsplash('photo-1436491865332-7a61a109db05'),    // Airport/travel scene
  ruck: unsplash('photo-1476480862126-209bfaa8edc8'),      // Trail running with pack
} as const;

// ═══════════════════════════════════════════════════════════
// PILLAR CARD IMAGES (used on homepage pillar grid)
// ═══════════════════════════════════════════════════════════

export const PILLAR_CARDS = {
  edc: unsplash('photo-1590794056226-79ef3a8147e1', 800, 600),
  bags: unsplash('photo-1622260614153-03223fb72052', 800, 600),
  travel: unsplash('photo-1488646953014-85cb44e25828', 800, 600),
  ruck: unsplash('photo-1476480862126-209bfaa8edc8', 800, 600),
} as const;

// ═══════════════════════════════════════════════════════════
// NAV THUMBNAILS (used in mega-menu dropdown)
// ═══════════════════════════════════════════════════════════

export const NAV_THUMBNAILS = {
  edc: unsplash('photo-1590794056226-79ef3a8147e1', 200, 200),
  bags: unsplash('photo-1622260614153-03223fb72052', 200, 200),
  travel: unsplash('photo-1488646953014-85cb44e25828', 200, 200),
  ruck: unsplash('photo-1476480862126-209bfaa8edc8', 200, 200),
} as const;

// ═══════════════════════════════════════════════════════════
// EDC SUBCATEGORY IMAGES
// ═══════════════════════════════════════════════════════════

export const EDC_IMAGES = {
  heroes: {
    knives: unsplash('photo-1595590424283-b8f17842773f'),     // Folding knife on wood
    flashlights: unsplash('photo-1513506003901-1e6a229e2d15'), // Flashlight beam in forest
    pens: unsplash('photo-1585336261022-680e295ce3fe'),        // Premium pen on notebook
    multitools: unsplash('photo-1567361808960-dec9cb578182'),  // Multi-tool opened
    wallets: unsplash('photo-1627123424574-724758594e93'),     // Leather wallet
    accessories: unsplash('photo-1509941943102-10c232fc1571'), // EDC accessories flat lay
  },
  cards: {
    knives: unsplash('photo-1595590424283-b8f17842773f', 800, 600),
    flashlights: unsplash('photo-1513506003901-1e6a229e2d15', 800, 600),
    pens: unsplash('photo-1585336261022-680e295ce3fe', 800, 600),
    multitools: unsplash('photo-1567361808960-dec9cb578182', 800, 600),
    wallets: unsplash('photo-1627123424574-724758594e93', 800, 600),
    accessories: unsplash('photo-1509941943102-10c232fc1571', 800, 600),
  },
} as const;

// ═══════════════════════════════════════════════════════════
// BAGS SUBCATEGORY IMAGES
// ═══════════════════════════════════════════════════════════

export const BAGS_IMAGES = {
  heroes: {
    backpacks: unsplash('photo-1622260614153-03223fb72052'),   // Backpack on trail
    slings: unsplash('photo-1548036328-c9fa89d128fa'),         // Sling bag urban
    messengers: unsplash('photo-1577733966973-d680bffd2e80'),  // Messenger bag commuter
    duffels: unsplash('photo-1553062407-98eeb64c6a62'),        // Duffel bag travel
    pouches: unsplash('photo-1547949003-9792a18a2601'),        // Organizer pouches
    totes: unsplash('photo-1594223274512-ad4803739b7c'),       // Canvas tote
  },
  cards: {
    backpacks: unsplash('photo-1622260614153-03223fb72052', 800, 600),
    slings: unsplash('photo-1548036328-c9fa89d128fa', 800, 600),
    messengers: unsplash('photo-1577733966973-d680bffd2e80', 800, 600),
    duffels: unsplash('photo-1553062407-98eeb64c6a62', 800, 600),
    pouches: unsplash('photo-1547949003-9792a18a2601', 800, 600),
    totes: unsplash('photo-1594223274512-ad4803739b7c', 800, 600),
  },
} as const;

// ═══════════════════════════════════════════════════════════
// TRAVEL SUBCATEGORY IMAGES
// ═══════════════════════════════════════════════════════════

export const TRAVEL_IMAGES = {
  heroes: {
    carryon: unsplash('photo-1565026057447-bc90a3dceb87'),     // Carry-on at airport gate
    packing: unsplash('photo-1553531384-cc64ac80f931'),        // Packing cubes in suitcase
    techkits: unsplash('photo-1519389950473-47ba0277781c'),    // Tech gear on desk
    airlines: unsplash('photo-1436491865332-7a61a109db05'),    // Airplane window view
    accessories: unsplash('photo-1488646953014-85cb44e25828'),  // Travel accessories
    onebag: unsplash('photo-1501785888041-af3ef285b470'),      // One-bag scenic
  },
  cards: {
    carryon: unsplash('photo-1565026057447-bc90a3dceb87', 800, 600),
    packing: unsplash('photo-1553531384-cc64ac80f931', 800, 600),
    techkits: unsplash('photo-1519389950473-47ba0277781c', 800, 600),
    airlines: unsplash('photo-1436491865332-7a61a109db05', 800, 600),
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
    vests: unsplash('photo-1534438327276-14e5300c3a48'),      // Fitness training
    training: unsplash('photo-1517963879433-6ad2b056d712'),   // Outdoor training
    clubs: unsplash('photo-1529156069898-49953e39b3ac'),      // Group rucking
    footwear: unsplash('photo-1542291026-7eec264c27ff'),      // Trail shoes
    events: unsplash('photo-1452626038306-9aae5e071dd3'),     // Fitness event
  },
  cards: {
    rucksacks: unsplash('photo-1551632811-561732d1e306', 800, 600),
    vests: unsplash('photo-1534438327276-14e5300c3a48', 800, 600),
    training: unsplash('photo-1517963879433-6ad2b056d712', 800, 600),
    clubs: unsplash('photo-1529156069898-49953e39b3ac', 800, 600),
    footwear: unsplash('photo-1542291026-7eec264c27ff', 800, 600),
    events: unsplash('photo-1452626038306-9aae5e071dd3', 800, 600),
  },
} as const;
